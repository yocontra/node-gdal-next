#ifndef __NODE_GDAL_BAND_OVERVIEWS_H__
#define __NODE_GDAL_BAND_OVERVIEWS_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// gdal
#include <gdal_priv.h>

using namespace v8;
using namespace node;

namespace node_gdal {

class RasterBandOverviews : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(Local<Value> band_obj);
  static NAN_METHOD(toString);

  static NAN_METHOD(get);
  static NAN_METHOD(getBySampleCount);
  static NAN_METHOD(count);

  RasterBandOverviews();

    private:
  ~RasterBandOverviews();
};

} // namespace node_gdal
#endif
