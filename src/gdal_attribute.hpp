#ifndef __NODE_GDAL_ATTRIBUTE_H__
#define __NODE_GDAL_ATTRIBUTE_H__

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

#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)

using namespace v8;
using namespace node;

namespace node_gdal {

class Attribute : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(std::shared_ptr<GDALAttribute> group, GDALDataset *parent_ds);
  static NAN_METHOD(toString);
  static NAN_GETTER(typeGetter);
  static NAN_GETTER(valueGetter);
  static NAN_GETTER(uidGetter);

  Attribute();
  Attribute(std::shared_ptr<GDALAttribute> group);
  inline std::shared_ptr<GDALAttribute> get() {
    return this_;
  }

  void dispose();
  long uid;
  long parent_uid;

  inline bool isAlive() {
    return this_ && object_store.isAlive(uid);
  }

    private:
  ~Attribute();
  std::shared_ptr<GDALAttribute> this_;
  GDALDataset *parent_ds;
};

} // namespace node_gdal
#endif
#endif
