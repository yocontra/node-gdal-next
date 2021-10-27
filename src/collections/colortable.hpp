#ifndef __NODE_GDAL_COLORTABLE_H__
#define __NODE_GDAL_COLORTABLE_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// gdal
#include <gdal_priv.h>

#include "../async.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class ColorTable : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(GDALColorTable *raw, Local<Value> band);
  static Local<Value> New(GDALColorTable *raw);
  static NAN_METHOD(toString);

  static NAN_METHOD(isSame);
  static NAN_METHOD(clone);
  static NAN_METHOD(get);
  static NAN_METHOD(count);
  static NAN_METHOD(set);
  static NAN_METHOD(ramp);

  static NAN_GETTER(interpretationGetter);
  static NAN_GETTER(bandGetter);

  ColorTable(GDALColorTable *, long);
  inline GDALColorTable *get() {
    return this_;
  }

  void dispose();
  long uid;
  long parent_uid;

  inline bool isAlive() {
    return this_ && object_store.isAlive(uid) && (parent_uid == 0 || object_store.isAlive(parent_uid));
  }

    private:
  ~ColorTable();
  GDALColorTable *this_;
};

} // namespace node_gdal
#endif
