#ifndef __NODE_GDAL_ASYNC_WORKER_H__
#define __NODE_GDAL_ASYNC_WORKER_H__

#include <functional>
#include "nan-wrapper.h"
#include "gdal_common.hpp"

namespace node_gdal {

// This generates method definitions for 2 methods: sync and async version and a hidden common block
#define GDAL_ASYNCABLE_DEFINE(method)                                                                                  \
  NAN_METHOD(method) {                                                                                                 \
    method##_do(info, false);                                                                                          \
  }                                                                                                                    \
  NAN_METHOD(method##Async) {                                                                                          \
    method##_do(info, true);                                                                                           \
  }                                                                                                                    \
  void method##_do(const Nan::FunctionCallbackInfo<v8::Value> &info, bool async)

// This generates method declarations for 2 methods: sync and async version and a hidden common block
#define GDAL_ASYNCABLE_DECLARE(method)                                                                                 \
  static NAN_METHOD(method);                                                                                           \
  static NAN_METHOD(method##Async);                                                                                    \
  static void method##_do(const Nan::FunctionCallbackInfo<v8::Value> &info, bool async)

#define GDAL_ASYNCABLE_GLOBAL(method)                                                                                  \
  NAN_METHOD(method);                                                                                                  \
  NAN_METHOD(method##Async);                                                                                           \
  void method##_do(const Nan::FunctionCallbackInfo<v8::Value> &info, bool async)

// Local<Object> is essentially a pointer and can be trivially copied
#define GDAL_ASYNCABLE_OBJS std::vector<v8::Local<v8::Object>>

#define GDAL_ISASYNC async

// Handle locking
#define GDAL_TRYLOCK_PARENT(p)                                                                                         \
  uv_mutex_t *async_lock = nullptr;                                                                                    \
  try {                                                                                                                \
    async_lock = ptr_manager.tryLockDataset((p)->parent_uid);                                                          \
  } catch (const char *err) {                                                                                          \
    Nan::ThrowError(err);                                                                                              \
    return;                                                                                                            \
  }
#define GDAL_ASYNCABLE_LOCK(uid) uv_mutex_t *async_lock = ptr_manager.tryLockDataset(uid);
#define GDAL_UNLOCK_PARENT uv_mutex_unlock(async_lock)
#define GDAL_ASYNCABLE_LOCK_MANY(...)                                                                                  \
  std::vector<uv_mutex_t *> async_locks = ptr_manager.tryLockDatasets({__VA_ARGS__});
#define GDAL_UNLOCK_MANY                                                                                               \
  for (uv_mutex_t * async_lock : async_locks) { uv_mutex_unlock(async_lock); }

#define GDAL_ASYNCABLE_1x_UNSUPPORTED                                                                                  \
  if (GDAL_ISASYNC) {                                                                                                  \
    Nan::ThrowError("This asynchronous operation is not supported on GDAL 1.x");                                       \
    return;                                                                                                            \
  }

//
// This class handles async operations
// It is meant to be used by GDALAsyncableJob defined below
//
// It takes the lambdas as input
// gdaltype is the type of the object that will be carried from
// the aux thread to the main thread
//
// JS-visible object creation is possible only in the main thread while
// ths JS world is stopped
//
template <class gdaltype> class GDALAsyncWorker : public Nan::AsyncWorker {
    private:
  const std::function<gdaltype()> doit;
  const std::function<v8::Local<v8::Value>(gdaltype, GDAL_ASYNCABLE_OBJS)> rval;
  std::vector<Nan::Persistent<v8::Object> *> persistent;
  gdaltype raw;
  void Finally();

    public:
  explicit GDALAsyncWorker(
    Nan::Callback *pCallback,
    const std::function<gdaltype()> doit,
    const std::function<v8::Local<v8::Value>(gdaltype, GDAL_ASYNCABLE_OBJS)> rval,
    const std::vector<v8::Local<v8::Object>> &objects);

  void Execute();
  void HandleOKCallback();
  void HandleErrorCallback();
};

template <class gdaltype>
GDALAsyncWorker<gdaltype>::GDALAsyncWorker(
  Nan::Callback *pCallback,
  const std::function<gdaltype()> doit,
  const std::function<v8::Local<v8::Value>(gdaltype, GDAL_ASYNCABLE_OBJS)> rval,
  const std::vector<v8::Local<v8::Object>> &objects)
  : Nan::AsyncWorker(pCallback, "node-gdal:GDALAsyncWorker"), doit(doit), rval(rval), persistent(objects.size()) {
  // Main thread with the JS world stopped
  // Get persistent handles
  for (long unsigned i = 0; i < objects.size(); i++) {
    persistent[i] = new Nan::Persistent<v8::Object>(objects[i]);
    persistent[i]->ClearWeak();
  }
}

template <class gdaltype> void GDALAsyncWorker<gdaltype>::Execute() {
  // Aux thread with the JS world running
  // V8 objects are not acessible here
  try {
    raw = doit();
  } catch (const char *err) { this->SetErrorMessage(err); }
}

template <class gdaltype> void GDALAsyncWorker<gdaltype>::Finally() {
  // Release the persistent handles
  for (long unsigned i = 0; i < persistent.size(); i++) {
    persistent[i]->Reset();
    delete persistent[i];
  }
}

template <class gdaltype> void GDALAsyncWorker<gdaltype>::HandleOKCallback() {
  // Back to the main thread with the JS world stopped
  Nan::HandleScope scope;
  GDAL_ASYNCABLE_OBJS original_obj(persistent.size());

  // Get pointers to the original objects that were persisted
  for (long unsigned i = 0; i < persistent.size(); i++) { original_obj[i] = Nan::New(*persistent[i]); }

  v8::Local<v8::Value> argv[] = {Nan::Undefined(), rval(raw, original_obj)};
  Finally();
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}

template <class gdaltype> void GDALAsyncWorker<gdaltype>::HandleErrorCallback() {
  // Back to the main thread with the JS world stopped
  Nan::HandleScope scope;
  v8::Local<v8::Value> argv[] = {Nan::New(this->ErrorMessage()).ToLocalChecked(), Nan::Undefined()};
  Finally();
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}

// This the basic unit of the GDALAsyncable framework
// GDALAsyncableJob is a GDAL job consisting of a main
// lambda that calls GDAL and rval lambda that transforms
// the return value
// It handles persistence of the referenced objects and
// can be executed both synchronously and asynchronously
//
// gdaltype is the intermediary type that will be carried
// across the context boundaries
//
// The caller must ensure that all the lambdas can be executed in
// another thread:
// * no capturing of automatic variables (C++ memory management)
// * no referencing of JS-visible objects in main() (V8 memory management)
// * protecting all JS-visible objects from the GC by calling persist() (V8 MM)
// * locking all GDALDatasets (GDAL limitation)
//
// If a GDALDataset is locked, but not persisted, the GC could still
// try to free it - in this case it will stop the JS world and then it will wait
// on the Dataset lock in PtrManager::dispose() blocking the event loop - the situation
// is safe but it is still best if it is avoided

template <class gdaltype> class GDALAsyncableJob {
    public:
  typedef std::function<v8::Local<v8::Value>(gdaltype, GDAL_ASYNCABLE_OBJS)> gdal_rval;
  // This is the lambda that produces the <gdaltype> object
  std::function<gdaltype()> main;
  // This is the lambda that produces the JS return object from the <gdaltype> object
  gdal_rval rval;

  GDALAsyncableJob(const Nan::FunctionCallbackInfo<v8::Value> &info) : main(), rval(), info(info), persistent(){};

  void persist(const v8::Local<v8::Object> &obj) {
    persistent.push_back(obj);
  }

  void persist(const v8::Local<v8::Object> &obj1, const v8::Local<v8::Object> &obj2) {
    persistent.push_back(obj1);
    persistent.push_back(obj2);
  }

  void persist(const std::vector<v8::Local<v8::Object>> &objs) {
    persistent.insert(persistent.end(), objs.begin(), objs.end());
  }

  void run(bool async, int cb_arg) {
    if (async) {
      Nan::Callback *callback;
      NODE_ARG_CB(cb_arg, "callback", callback);
      Nan::AsyncQueueWorker(new GDALAsyncWorker<gdaltype>(callback, main, rval, persistent));
      return;
    }
    try {
      gdaltype obj = main();
      info.GetReturnValue().Set(rval(obj, persistent));
    } catch (const char *err) { Nan::ThrowError(err); }
  }

    private:
  const Nan::FunctionCallbackInfo<v8::Value> &info;
  std::vector<v8::Local<v8::Object>> persistent;
};
} // namespace node_gdal
#endif