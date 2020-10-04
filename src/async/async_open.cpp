#include "../gdal_common.hpp"
#include "../gdal_dataset.hpp"
#include "async_open.hpp"

namespace node_gdal {

AsyncOpen::AsyncOpen(Nan::Callback *pCallback, std::string path, unsigned flags)
  : Nan::AsyncWorker(pCallback), path(path), flags(flags), raw(nullptr) {
}

void AsyncOpen::Execute() {
  raw = (GDALDataset *)GDALOpenEx(path.c_str(), flags, NULL, NULL, NULL);

  if (!raw) { this->SetErrorMessage("Error opening dataset"); }
}

void AsyncOpen::HandleOKCallback() {
  Nan::HandleScope scope;

  Local<v8::Value> argv[] = {Nan::Null(), Dataset::New(raw)};
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}

void AsyncOpen::HandleErrorCallback() {
  v8::Local<v8::Value> argv[] = {Nan::New(this->ErrorMessage()).ToLocalChecked(), Nan::Null()};
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}

} // namespace node_gdal