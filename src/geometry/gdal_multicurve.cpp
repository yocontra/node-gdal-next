
#include "gdal_multicurve.hpp"
#include "../collections/geometry_collection_children.hpp"
#include "../gdal_common.hpp"
#include "gdal_geometry.hpp"
#include "gdal_geometrycollection.hpp"

#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> MultiCurve::constructor;

void MultiCurve::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(MultiCurve::New);
  lcons->Inherit(Nan::New(GeometryCollection::constructor));
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("MultiCurve").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "polygonize", polygonize);

  Nan::Set(target, Nan::New("MultiCurve").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

/**
 * @constructor
 * @class MultiCurve
 * @extends GeometryCollection
 */

NAN_METHOD(MultiCurve::toString) {
  info.GetReturnValue().Set(Nan::New("MultiCurve").ToLocalChecked());
}

/**
 * Converts it to a polygon.
 *
 * @method polygonize
 * @instance
 * @memberof MultiCurve
 * @return {Polygon}
 */
NAN_METHOD(MultiCurve::polygonize) {

  MultiCurve *geom = Nan::ObjectWrap::Unwrap<MultiCurve>(info.This());

  info.GetReturnValue().Set(Geometry::New(geom->this_->Polygonize()));
}

} // namespace node_gdal
