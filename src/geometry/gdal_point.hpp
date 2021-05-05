#ifndef __NODE_OGR_POINT_H__
#define __NODE_OGR_POINT_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

#include "gdal_geometrybase.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class Point : public GeometryBase<Point, OGRPoint> {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using GeometryBase<Point, OGRPoint>::GeometryBase;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  using GeometryBase<Point, OGRPoint>::New;
  static NAN_METHOD(toString);

  static NAN_GETTER(xGetter);
  static NAN_GETTER(yGetter);
  static NAN_GETTER(zGetter);
  static NAN_SETTER(xSetter);
  static NAN_SETTER(ySetter);
  static NAN_SETTER(zSetter);
};

} // namespace node_gdal
#endif
