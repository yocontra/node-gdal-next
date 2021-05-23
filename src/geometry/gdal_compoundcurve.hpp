#ifndef __NODE_OGR_COMPOUNDCURVE_H__
#define __NODE_OGR_COMPOUNDCURVE_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

#include "gdal_curvebase.hpp"
#include "../collections/compound_curves.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class CompoundCurve : public CurveBase<CompoundCurve, OGRCompoundCurve, CompoundCurveCurves> {
  friend CurveBase;

    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using CurveBase<CompoundCurve, OGRCompoundCurve, CompoundCurveCurves>::CurveBase;

  static void Initialize(Local<Object> target);
  using CurveBase<CompoundCurve, OGRCompoundCurve, CompoundCurveCurves>::New;
  static NAN_METHOD(toString);

  static NAN_GETTER(curvesGetter);

    protected:
  static void SetPrivate(Nan::ADDON_REGISTER_FUNCTION_ARGS_TYPE, v8::Local<v8::Value>);
};

} // namespace node_gdal
#endif
