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

#define GDAL_ISASYNC async

// Handle locking
#define GDAL_TRYLOCK_PARENT(p)                                                                                         \
  uv_sem_t *async_lock = nullptr;                                                                                      \
  try {                                                                                                                \
    async_lock = ptr_manager.tryLockDataset((p)->parent_uid);                                                          \
  } catch (const char *err) {                                                                                          \
    Nan::ThrowError(err);                                                                                              \
    return;                                                                                                            \
  }
#define GDAL_ASYNCABLE_LOCK(uid) uv_sem_t *async_lock = ptr_manager.tryLockDataset(uid);
#define GDAL_UNLOCK_PARENT uv_sem_post(async_lock)
#define GDAL_ASYNCABLE_LOCK_MANY(...) std::vector<uv_sem_t *> async_locks = ptr_manager.tryLockDatasets({__VA_ARGS__});
#define GDAL_UNLOCK_MANY                                                                                               \
  for (uv_sem_t * async_lock : async_locks) { uv_sem_post(async_lock); }

#define GDAL_ASYNCABLE_1x_UNSUPPORTED                                                                                  \
  if (GDAL_ISASYNC) {                                                                                                  \
    Nan::ThrowError("This asynchronous operation is not supported on GDAL 1.x");                                       \
    return;                                                                                                            \
  }

typedef std::function<v8::Local<v8::Value>(const char *)> GetFromPersistentFunc;

//
// This class handles async operations
// It is meant to be used by GDALAsyncableJob defined below
//
// It takes the lambdas as input
// GDALType is the type of the object that will be carried from
// the aux thread to the main thread
//
// JS-visible object creation is possible only in the main thread while
// ths JS world is stopped
//
template <class GDALType> class GDALAsyncWorker : public Nan::AsyncWorker {
    public:
  typedef std::function<v8::Local<v8::Value>(const GDALType, const GetFromPersistentFunc &)> GDALRValFunc;

    private:
  const std::function<GDALType()> doit;
  const GDALRValFunc rval;
  GDALType raw;
  void Finally();

    public:
  explicit GDALAsyncWorker(
    Nan::Callback *pCallback,
    const std::function<GDALType()> doit,
    const GDALRValFunc rval,
    const std::map<std::string, v8::Local<v8::Object>> &objects);

  void Execute();
  void HandleOKCallback();
  void HandleErrorCallback();
};

template <class GDALType>
GDALAsyncWorker<GDALType>::GDALAsyncWorker(
  Nan::Callback *pCallback,
  const std::function<GDALType()> doit,
  const GDALRValFunc rval,
  const std::map<std::string, v8::Local<v8::Object>> &objects)
  : Nan::AsyncWorker(pCallback, "node-gdal:GDALAsyncWorker"), doit(doit), rval(rval) {
  // Main thread with the JS world stopped
  // Get persistent handles
  for (auto i = objects.begin(); i != objects.end(); i++) SaveToPersistent(i->first.c_str(), i->second);
}

template <class GDALType> void GDALAsyncWorker<GDALType>::Execute() {
  // Aux thread with the JS world running
  // V8 objects are not acessible here
  try {
    raw = doit();
  } catch (const char *err) { this->SetErrorMessage(err); }
}

template <class GDALType> void GDALAsyncWorker<GDALType>::HandleOKCallback() {
  // Back to the main thread with the JS world stopped
  Nan::HandleScope scope;

  // rval is the user function that will create the returned value
  // we give it a lambda that can access the persistent storage created for this operation
  v8::Local<v8::Value> argv[] = {
    Nan::Null(), rval(raw, [this](const char *key) { return this->GetFromPersistent(key); })};
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}

template <class GDALType> void GDALAsyncWorker<GDALType>::HandleErrorCallback() {
  // Back to the main thread with the JS world stopped
  Nan::HandleScope scope;
  v8::Local<v8::Value> argv[] = {Nan::Error(this->ErrorMessage())};
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 1, argv);
}

// This the basic unit of the GDALAsyncable framework
// GDALAsyncableJob is a GDAL job consisting of a main
// lambda that calls GDAL and rval lambda that transforms
// the return value
// It handles persistence of the referenced objects and
// can be executed both synchronously and asynchronously
//
// GDALType is the intermediary type that will be carried
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

template <class GDALType> class GDALAsyncableJob {
    public:
  typedef std::function<v8::Local<v8::Value>(const GDALType, const GetFromPersistentFunc &)> GDALRValFunc;
  // This is the lambda that produces the <GDALType> object
  std::function<GDALType()> main;
  // This is the lambda that produces the JS return object from the <GDALType> object
  GDALRValFunc rval;

  GDALAsyncableJob() : main(), rval(), persistent(), autoIndex(0){};

  void persist(const std::string key, const v8::Local<v8::Object> &obj) {
    persistent[key] = obj;
  }

  void persist(const v8::Local<v8::Object> &obj) {
    persistent[std::to_string(autoIndex++)] = obj;
  }

  void persist(const v8::Local<v8::Object> &obj1, const v8::Local<v8::Object> &obj2) {
    persist(obj1);
    persist(obj2);
  }

  void persist(const std::vector<v8::Local<v8::Object>> &objs) {
    for (auto const i : objs) persist(i);
  }

  void run(const Nan::FunctionCallbackInfo<v8::Value> &info, bool async, int cb_arg) {
    if (async) {
      Nan::Callback *callback;
      NODE_ARG_CB(cb_arg, "callback", callback);
      Nan::AsyncQueueWorker(new GDALAsyncWorker<GDALType>(callback, main, rval, persistent));
      return;
    }
    try {
      GDALType obj = main();
      // rval is the user function that will create the returned value
      // we give it a lambda that can access the persistent storage created for this operation
      info.GetReturnValue().Set(rval(obj, [this](const char *key) { return this->persistent[key]; }));
    } catch (const char *err) { Nan::ThrowError(err); }
  }

    private:
  std::map<std::string, v8::Local<v8::Object>> persistent;
  unsigned autoIndex;
};
} // namespace node_gdal
#endif