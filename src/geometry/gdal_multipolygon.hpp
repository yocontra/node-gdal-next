#ifndef __NODE_OGR_MULTIPOLYGON_H__
#define __NODE_OGR_MULTIPOLYGON_H__

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

class MultiPolygon : public GeometryCollectionBase<MultiPolygon, OGRMultiPolygon> {

    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using GeometryCollectionBase<MultiPolygon, OGRMultiPolygon>::GeometryCollectionBase;

  static void Initialize(Local<Object> target);
  using GeometryCollectionBase<MultiPolygon, OGRMultiPolygon>::New;
  static NAN_METHOD(toString);
  static NAN_METHOD(unionCascaded);
  static NAN_METHOD(getArea);
};

} // namespace node_gdal
#endif
