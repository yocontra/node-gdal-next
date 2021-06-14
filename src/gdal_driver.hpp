#ifndef __NODE_GDAL_DRIVER_H__
#define __NODE_GDAL_DRIVER_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// gdal
#include <gdal_priv.h>

// ogr
#include <ogrsf_frmts.h>

#include "async.hpp"

using namespace v8;
using namespace node;

// > GDAL 2.0 : a wrapper for GDALDriver
// < GDAL 2.0 : a wrapper for either a GDALDriver or OGRSFDriver that behaves
// like a 2.0 Driver
//
namespace node_gdal {

class Driver : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(GDALDriver *driver);
  static NAN_METHOD(toString);
  GDAL_ASYNCABLE_DECLARE(open);
  GDAL_ASYNCABLE_DECLARE(create);
  GDAL_ASYNCABLE_DECLARE(createCopy);
  static NAN_METHOD(deleteDataset);
  static NAN_METHOD(rename);
  GDAL_ASYNCABLE_DECLARE(copyFiles);
  static NAN_METHOD(getMetadata);

  static NAN_GETTER(descriptionGetter);

  Driver();
  Driver(GDALDriver *driver);
  inline GDALDriver *getGDALDriver() {
    return this_gdaldriver;
  }
  void dispose();
  long uid;

  inline bool isAlive() {
    return this_gdaldriver;
  }

    private:
  ~Driver();
  GDALDriver *this_gdaldriver;
};

} // namespace node_gdal
#endif
