#ifndef __NODE_GDAL_BAND_PIXELS_H__
#define __NODE_GDAL_BAND_PIXELS_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// gdal
#include <gdal_priv.h>

#include "../gdal_rasterband.hpp"
#include "../async.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class RasterBandPixels : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(Local<Value> band_obj);
  static NAN_METHOD(toString);

  GDAL_ASYNCABLE_DECLARE(get);
  GDAL_ASYNCABLE_DECLARE(set);
  GDAL_ASYNCABLE_DECLARE(read);
  GDAL_ASYNCABLE_DECLARE(write);
  GDAL_ASYNCABLE_DECLARE(readBlock);
  GDAL_ASYNCABLE_DECLARE(writeBlock);
  GDAL_ASYNCABLE_DECLARE(clampBlock);

  static NAN_GETTER(bandGetter);

  static RasterBand *parent(const Nan::FunctionCallbackInfo<v8::Value> &info);

  RasterBandPixels();

    private:
  ~RasterBandPixels();
};

} // namespace node_gdal
#endif
