#ifndef __NODE_GDAL_GROUP_H__
#define __NODE_GDAL_GROUP_H__

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

class Group : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(std::shared_ptr<GDALGroup> group, Local<Object> parent_ds);
  static Local<Value> New(std::shared_ptr<GDALGroup> group, GDALDataset *parent_ds);
  static NAN_METHOD(toString);
  static NAN_GETTER(descriptionGetter);
  static NAN_GETTER(groupsGetter);
  static NAN_GETTER(arraysGetter);
  static NAN_GETTER(dimensionsGetter);
  static NAN_GETTER(attributesGetter);
  static NAN_GETTER(uidGetter);

  Group();
  Group(std::shared_ptr<GDALGroup> group);
  inline std::shared_ptr<GDALGroup> get() {
    return this_;
  }

  void dispose();
  long uid;
  long parent_uid;

  inline bool isAlive() {
    return this_ && object_store.isAlive(uid);
  }

    private:
  ~Group();
  std::shared_ptr<GDALGroup> this_;
  GDALDataset *parent_ds;
};

} // namespace node_gdal
#endif
#endif
