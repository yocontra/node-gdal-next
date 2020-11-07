#ifndef __NODE_GDAL_ASYNC_RASTERIO_H__
#define __NODE_GDAL_ASYNC_RASTERIO_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-parameter"
#include <nan.h>
#pragma GCC diagnostic pop

// gdal
#include <gdal_priv.h>

namespace node_gdal {

/**
 * This class handles async RasterIO
 *
 * It keeps strong references on the JS objects
 * data and the parent band
 * in hDataPersistentHandle and hBandPersistentHandle
 * to protect them from the garbage collector
 */
class AsyncRasterIO : public Nan::AsyncWorker {
    private:
  uv_mutex_t *async_lock;
  Nan::Persistent<v8::Object> hDataPersistentHandle;
  Nan::Persistent<v8::Object> hBandPersistentHandle;
  RasterBand *pBand;
  GDALRWFlag eRWFlag;
  int nXOff;
  int nYOff;
  int nXSize;
  int nYSize;
  void *pData;
  int nBufXSize;
  int nBufYSize;
  GDALDataType eBufType;
  int nPixelSpace;
  int nLineSpace;
#if GDAL_VERSION_MAJOR >= 2
  GDALRasterIOExtraArg *psExtraArg;
#endif
  CPLErr eErr;

    public:
  explicit AsyncRasterIO(
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
    int nPixelSpace,
    int nLineSpace
#if GDAL_VERSION_MAJOR >= 2
    ,
    GDALRasterIOExtraArg *psExtraArg = (GDALRasterIOExtraArg *)nullptr
#endif
  );

  void Execute();
  void HandleOKCallback();
  void HandleErrorCallback();
};
} // namespace node_gdal
#endif