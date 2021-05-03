#ifndef __NODE_OGR_LINESTRING_H__
#define __NODE_OGR_LINESTRING_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

#include "gdal_curve.hpp"
#include "../collections/linestring_points.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class LineString : public Curve<LineString, OGRLineString, LineStringPoints> {

    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using Curve<LineString, OGRLineString, LineStringPoints>::Curve;

  static void Initialize(Local<Object> target);
  using Curve<LineString, OGRLineString, LineStringPoints>::New;
  static NAN_METHOD(toString);
  static NAN_METHOD(getLength);
  static NAN_METHOD(value);
  static NAN_METHOD(addSubLineString);

  static NAN_GETTER(pointsGetter);
};

} // namespace node_gdal
#endif
