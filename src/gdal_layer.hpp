#ifndef __NODE_OGR_LAYER_H__
#define __NODE_OGR_LAYER_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

#include "gdal_dataset.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class Layer : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(OGRLayer *raw, GDALDataset *raw_parent);
  static Local<Value> New(OGRLayer *raw, GDALDataset *raw_parent, bool result_set);
  static NAN_METHOD(toString);
  static NAN_METHOD(getExtent);
  static NAN_METHOD(setAttributeFilter);
  static NAN_METHOD(setSpatialFilter);
  static NAN_METHOD(getSpatialFilter);
  static NAN_METHOD(testCapability);
  GDAL_ASYNCABLE_DECLARE(syncToDisk);

  static NAN_SETTER(dsSetter);
  static NAN_GETTER(dsGetter);
  static NAN_GETTER(srsGetter);
  static NAN_GETTER(featuresGetter);
  static NAN_GETTER(fieldsGetter);
  static NAN_GETTER(nameGetter);
  static NAN_GETTER(fidColumnGetter);
  static NAN_GETTER(geomColumnGetter);
  static NAN_GETTER(geomTypeGetter);
  static NAN_GETTER(uidGetter);

  Layer();
  Layer(OGRLayer *ds);
  inline OGRLayer *get() {
    return this_;
  }
  inline bool isAlive() {
    return this_ && object_store.isAlive(uid);
  }
  inline GDALDataset *getParent() {
    return parent_ds;
  }
  void dispose();
  long uid;
  long parent_uid;

    private:
  ~Layer();
  OGRLayer *this_;
  GDALDataset *parent_ds;
};

} // namespace node_gdal
#endif
