#include "../gdal_common.hpp"
#include "../gdal_dataset.hpp"
#include "async_open.hpp"

namespace node_gdal {

const char AsyncOpenLabel[] = "node-gdal:OpenDataset";

AsyncOpen::AsyncOpen(Nan::Callback *pCallback, const std::function<GDALDataset *()> doit)
  : Nan::AsyncWorker(pCallback, AsyncOpenLabel), doit(doit) {
}

void AsyncOpen::Execute() {
  /* V8 objects are not acessible here */
  raw = doit();
  if (!raw) { this->SetErrorMessage("Error opening dataset"); }
}

void AsyncOpen::HandleOKCallback() {
  Nan::HandleScope scope;

  Local<v8::Value> argv[] = {Nan::Undefined(), Dataset::New(raw)};
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}

void AsyncOpen::HandleErrorCallback() {
  v8::Local<v8::Value> argv[] = {Nan::New(this->ErrorMessage()).ToLocalChecked(), Nan::Undefined()};
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}

} // namespace node_gdal