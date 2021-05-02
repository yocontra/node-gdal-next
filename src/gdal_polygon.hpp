#ifndef __NODE_OGR_POLY_H__
#define __NODE_OGR_POLY_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

#include "gdal_geometry.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class Polygon : public GeometryBase<Polygon, OGRPolygon> {

    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using GeometryBase<Polygon, OGRPolygon>::GeometryBase;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  using GeometryBase<Polygon, OGRPolygon>::New;
  static NAN_METHOD(toString);
  static NAN_METHOD(getArea);

  static NAN_GETTER(ringsGetter);
};

} // namespace node_gdal
#endif
