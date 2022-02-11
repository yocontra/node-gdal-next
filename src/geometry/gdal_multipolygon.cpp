#include "gdal_multipolygon.hpp"
#include "../collections/geometry_collection_children.hpp"
#include "../gdal_common.hpp"
#include "gdal_geometry.hpp"
#include "gdal_geometrycollection.hpp"
#include "gdal_polygon.hpp"

#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> MultiPolygon::constructor;

void MultiPolygon::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(MultiPolygon::New);
  lcons->Inherit(Nan::New(GeometryCollection::constructor));
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("MultiPolygon").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "unionCascaded", unionCascaded);
  Nan::SetPrototypeMethod(lcons, "getArea", getArea);

  Nan::Set(target, Nan::New("MultiPolygon").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

/**
 * @constructor
 * @class MultiPolygon
 * @extends GeometryCollection
 */

NAN_METHOD(MultiPolygon::toString) {
  info.GetReturnValue().Set(Nan::New("MultiPolygon").ToLocalChecked());
}

/**
 * Unions all the geometries and returns the result.
 *
 * @method unionCascaded
 * @instance
 * @memberof MultiPolygon
 * @return {Geometry}
 */
NAN_METHOD(MultiPolygon::unionCascaded) {

  MultiPolygon *geom = Nan::ObjectWrap::Unwrap<MultiPolygon>(info.This());
  auto r = geom->this_->UnionCascaded();
  if (r == nullptr) {
    NODE_THROW_LAST_CPLERR;
    return;
  }

  info.GetReturnValue().Set(Geometry::New(r));
}

/**
 * Computes the combined area of the collection.
 *
 * @method getArea
 * @instance
 * @memberof MultiPolygon
 * @return {number}
 */
NODE_WRAPPED_METHOD_WITH_RESULT(MultiPolygon, getArea, Number, get_Area);

} // namespace node_gdal
