#ifndef __NODE_GDAL_ASYNC_WORKER_H__
#define __NODE_GDAL_ASYNC_WORKER_H__

#include <functional>
#include "nan-wrapper.h"

namespace node_gdal {

// This generates method definitions for 2 methods: sync and async version and a hidden common block
#define GDAL_ASYNCABLE_DEFINE(method)                                                                                  \
  NAN_METHOD(method) {                                                                                                 \
    method##_do(info, false);                                                                                          \
  }                                                                                                                    \
  NAN_METHOD(method##Async) {                                                                                          \
    method##_do(info, true);                                                                                           \
  }                                                                                                                    \
  void method##_do(const Nan::FunctionCallbackInfo<v8::Value> &info, bool _gdal_async)

// This generates method declarations for 2 methods: sync and async version and a hidden common block
#define GDAL_ASYNCABLE_DECLARE(method)                                                                                 \
  static NAN_METHOD(method);                                                                                           \
  static NAN_METHOD(method##Async);                                                                                    \
  static void method##_do(const Nan::FunctionCallbackInfo<v8::Value> &info, bool _gdal_async)

/**
 * An asyncable method has to define the following lambdas
 */

// Main execution block
#define GDAL_ASYNCABLE_MAIN(gdaltype) std::function<gdaltype()> _gdal_doit

// Generate JS object to be returned to the userland
// Local<Object> is essentially a pointer and can be trivially copied
#define GDAL_ASYNCABLE_OBJS std::vector<v8::Local<v8::Object>>
#define GDAL_ASYNCABLE_RVAL(gdaltype) std::function<v8::Local<v8::Value>(gdaltype, GDAL_ASYNCABLE_OBJS)> _gdal_rval

// List of objects to be protected from the GC
#define GDAL_ASYNCABLE_PERSIST(...) std::vector<v8::Local<v8::Object>> _gdal_persist = {__VA_ARGS__};

// Execute the lambdas, either synchronously or asynchronously
#define GDAL_ASYNCABLE_EXECUTE(arg, gdaltype)                                                                          \
  if (_gdal_async) {                                                                                                   \
    Nan::Callback *callback;                                                                                           \
    NODE_ARG_CB(arg, "callback", callback);                                                                            \
    Nan::AsyncQueueWorker(new GDALAsyncWorker<gdaltype>(callback, _gdal_doit, _gdal_rval, _gdal_persist));             \
    return;                                                                                                            \
  }                                                                                                                    \
  try {                                                                                                                \
    gdaltype _gdal_obj = _gdal_doit();                                                                                 \
    info.GetReturnValue().Set(_gdal_rval(_gdal_obj, _gdal_persist));                                                   \
  } catch (const char *err) { Nan::ThrowError(err); }                                                                  \
  return

#define GDAL_ISASYNC _gdal_async

/**
 * This class handles async operations
 * 
 * It takes the lambdas as input
 * gdaltype is the type of the object that will be carred from
 * the aux thread to the main thread
 * 
 * JS-visible object creation is possible only in the main thread while
 * ths JS world is stopped
 *
 * The caller must ensure that all the lambdas can be executed in
 * another thread (no automatic variables)
 */
template <class gdaltype> class GDALAsyncWorker : public Nan::AsyncWorker {
    private:
  const std::function<gdaltype()> doit;
  const std::function<v8::Local<v8::Value>(gdaltype, GDAL_ASYNCABLE_OBJS)> rval;
  std::vector<Nan::Persistent<v8::Object> *> persistent;
  gdaltype raw;

    public:
  explicit GDALAsyncWorker(
    Nan::Callback *pCallback,
    const std::function<gdaltype()> doit,
    const std::function<v8::Local<v8::Value>(gdaltype, GDAL_ASYNCABLE_OBJS)> rval,
    std::vector<v8::Local<v8::Object>> objects);

  void Finally();
  void Execute();
  void HandleOKCallback();
  void HandleErrorCallback();
};

template <class gdaltype>
GDALAsyncWorker<gdaltype>::GDALAsyncWorker(
  Nan::Callback *pCallback,
  const std::function<gdaltype()> doit,
  std::function<v8::Local<v8::Value>(gdaltype, GDAL_ASYNCABLE_OBJS)> rval,
  std::vector<v8::Local<v8::Object>> objects)
  : Nan::AsyncWorker(pCallback, "node-gdal:GDALAsyncWorker"), doit(doit), rval(rval), persistent(objects.size()) {
  // Main thread with the JS world stopped
  // Get persistent handles
  for (long unsigned i = 0; i < objects.size(); i++) persistent[i] = new Nan::Persistent<v8::Object>(objects[i]);
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
  v8::Local<v8::Value> argv[] = {Nan::New(this->ErrorMessage()).ToLocalChecked(), Nan::Undefined()};
  Finally();
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}

} // namespace node_gdal
#endif