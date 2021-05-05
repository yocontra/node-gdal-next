#ifndef __NODE_OGR_POLY_H__
#define __NODE_OGR_POLY_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

#include "gdal_curvebase.hpp"
#include "../collections/polygon_rings.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class Polygon : public CurveBase<Polygon, OGRPolygon, PolygonRings> {
  friend CurveBase;

    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using CurveBase<Polygon, OGRPolygon, PolygonRings>::CurveBase;

  static void Initialize(Local<Object> target);
  using CurveBase<Polygon, OGRPolygon, PolygonRings>::New;
  static NAN_METHOD(toString);
  static NAN_METHOD(getArea);

  static NAN_GETTER(ringsGetter);

    protected:
  static void SetPrivate(Nan::ADDON_REGISTER_FUNCTION_ARGS_TYPE, v8::Local<v8::Value>);
};

} // namespace node_gdal
#endif
