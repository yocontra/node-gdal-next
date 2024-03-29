#ifndef __NODE_OGR_MULTIPOLYGON_H__
#define __NODE_OGR_MULTIPOLYGON_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

using namespace v8;
using namespace node;

namespace node_gdal {

class MultiPolygon : public Nan::ObjectWrap {

    public:
  static Nan::Persistent<FunctionTemplate> constructor;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(OGRMultiPolygon *geom);
  static Local<Value> New(OGRMultiPolygon *geom, bool owned);
  static NAN_METHOD(toString);
  static NAN_METHOD(unionCascaded);
  static NAN_METHOD(getArea);

  MultiPolygon();
  MultiPolygon(OGRMultiPolygon *geom);
  inline OGRMultiPolygon *get() {
    return this_;
  }
  inline bool isAlive() {
    return this_;
  }

    private:
  ~MultiPolygon();
  OGRMultiPolygon *this_;
  bool owned_;
  int size_;
};

} // namespace node_gdal
#endif
