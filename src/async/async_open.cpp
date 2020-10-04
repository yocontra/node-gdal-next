#include "../gdal_common.hpp"
#include "../gdal_dataset.hpp"
#include "async_open.hpp"

namespace node_gdal {

AsyncOpen::AsyncOpen(Nan::Callback *pCallback, std::string path, unsigned flags)
  : Nan::AsyncWorker(pCallback), path(path), flags(flags), raw(nullptr), driver(nullptr), access(GA_ReadOnly) {
}

AsyncOpen::AsyncOpen(Nan::Callback *pCallback, GDALDriver *driver, std::string path, GDALAccess access)
  : Nan::AsyncWorker(pCallback), path(path), flags(0), raw(nullptr), driver(driver), access(access) {
}

void AsyncOpen::Execute() {
  /* V8 objects are not acessible here */

  if (driver != nullptr) {
    GDALOpenInfo *open_info = new GDALOpenInfo(path.c_str(), access);
    raw = driver->pfnOpen(open_info);
    delete open_info;
  } else {
    raw = (GDALDataset *)GDALOpenEx(path.c_str(), flags, NULL, NULL, NULL);
  }

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