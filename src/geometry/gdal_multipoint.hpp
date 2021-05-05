#ifndef __NODE_OGR_MULTIPOINT_H__
#define __NODE_OGR_MULTIPOINT_H__

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

class MultiPoint : public GeometryCollectionBase<MultiPoint, OGRMultiPoint> {

    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using GeometryCollectionBase<MultiPoint, OGRMultiPoint>::GeometryCollectionBase;

  static void Initialize(Local<Object> target);
  using GeometryCollectionBase<MultiPoint, OGRMultiPoint>::New;
  static NAN_METHOD(toString);
};

} // namespace node_gdal
#endif
