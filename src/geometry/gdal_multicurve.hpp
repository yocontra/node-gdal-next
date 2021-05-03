#ifndef __NODE_OGR_MULTICURVE_H__
#define __NODE_OGR_MULTICURVE_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

#include "gdal_geometrycollectionbase.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class MultiCurve : public GeometryCollectionBase<MultiCurve, OGRMultiCurve> {

    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using GeometryCollectionBase<MultiCurve, OGRMultiCurve>::GeometryCollectionBase;

  static void Initialize(Local<Object> target);
  using GeometryCollectionBase<MultiCurve, OGRMultiCurve>::New;
  static NAN_METHOD(toString);
  static NAN_METHOD(polygonize);
};

} // namespace node_gdal
#endif
