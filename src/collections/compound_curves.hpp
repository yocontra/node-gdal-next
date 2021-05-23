#ifndef __NODE_GDAL_COMPOUND_CURVES_H__
#define __NODE_GDAL_COMPOUND_CURVES_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// gdal
#include <gdal_priv.h>

using namespace v8;
using namespace node;

// CompoundCurve.curves

namespace node_gdal {

class CompoundCurveCurves : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(Local<Value> geom);
  static NAN_METHOD(toString);

  static NAN_METHOD(get);
  static NAN_METHOD(count);
  static NAN_METHOD(add);

  CompoundCurveCurves();

    private:
  ~CompoundCurveCurves();
};

} // namespace node_gdal
#endif
