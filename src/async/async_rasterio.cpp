#include "../gdal_common.hpp"
#include "../gdal_rasterband.hpp"
#include "../utils/typed_array.hpp"

#include "async_rasterio.hpp"

#include <string>

namespace node_gdal {

/**
 * This class handles async RasterIO
 *
 * It keeps strong references on the JS objects
 * data and the parent band
 * in hDataPersistentHandle and hBandPersistentHandle
 * to protect them from the garbage collector
 *
 * @class gdal.AsyncRasterIO
 */
AsyncRasterIO::AsyncRasterIO(
  Nan::Callback *pCallback,
  RasterBand *pBand,
  GDALRWFlag eRWFlag,
  int nXOff,
  int nYOff,
  int nXSize,
  int nYSize,
  Local<Object> *pObjectData,
  void *pData,
  int nBufXSize,
  int nBufYSize,
  GDALDataType eBufType,
  GSpacing nPixelSpace,
  GSpacing nLineSpace,
  GDALRasterIOExtraArg *psExtraArg)
  : Nan::AsyncWorker(pCallback),
    async_lock(pBand->async_lock),
    hDataPersistentHandle(*pObjectData),
    hBandPersistentHandle(pBand->handle()),
    pBand(pBand),
    eRWFlag(eRWFlag),
    nXOff(nXOff),
    nYOff(nYOff),
    nXSize(nXSize),
    nYSize(nYSize),
    pData(pData),
    nBufXSize(nBufXSize),
    nBufYSize(nBufYSize),
    eBufType(eBufType),
    nPixelSpace(nPixelSpace),
    nLineSpace(nLineSpace),
    psExtraArg(psExtraArg),
    eErr(CE_None) {
}

void AsyncRasterIO::Execute() {
  uv_mutex_lock(async_lock);
  eErr = this->pBand->get()->RasterIO(
    eRWFlag, nXOff, nYOff, nXSize, nYSize, pData, nBufXSize, nBufYSize, eBufType, nPixelSpace, nLineSpace, psExtraArg);
    
  if (eErr != CE_None) { this->SetErrorMessage(std::to_string((int)eErr).c_str()); }
  uv_mutex_unlock(async_lock);
}

void AsyncRasterIO::HandleOKCallback() {
  Nan::HandleScope scope;
  Local<v8::Value> argv[] = {Nan::Undefined(), Nan::New(hDataPersistentHandle)};

  hDataPersistentHandle.Reset();
  hBandPersistentHandle.Reset();
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}

void AsyncRasterIO::HandleErrorCallback() {
  Nan::HandleScope scope;
  hDataPersistentHandle.Reset();
  hBandPersistentHandle.Reset();
  v8::Local<v8::Value> argv[] = {Nan::New(this->ErrorMessage()).ToLocalChecked(), Nan::Undefined()};
  Nan::Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, argv);
}
} // namespace node_gdal
