#ifndef __NODE_OGR_LINEARRING_H__
#define __NODE_OGR_LINEARRING_H__

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

class LinearRing : public Curve<LinearRing, OGRLinearRing, LineStringPoints> {

    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using Curve<LinearRing, OGRLinearRing, LineStringPoints>::Curve;

  static void Initialize(Local<Object> target);
  using Curve<LinearRing, OGRLinearRing, LineStringPoints>::New;
  static NAN_METHOD(toString);
  static NAN_METHOD(getArea);
};

} // namespace node_gdal
#endif
