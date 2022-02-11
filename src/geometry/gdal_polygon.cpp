
#include "gdal_polygon.hpp"
#include "../collections/polygon_rings.hpp"
#include "../gdal_common.hpp"
#include "gdal_geometry.hpp"

#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> Polygon::constructor;

void Polygon::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(Polygon::New);
  lcons->Inherit(Nan::New(Geometry::constructor));
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("Polygon").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "getArea", getArea);

  ATTR(lcons, "rings", ringsGetter, READ_ONLY_SETTER);

  Nan::Set(target, Nan::New("Polygon").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

void Polygon::SetPrivate(Nan::ADDON_REGISTER_FUNCTION_ARGS_TYPE _this, v8::Local<v8::Value> value) {
  Nan::SetPrivate(_this, Nan::New("rings_").ToLocalChecked(), value);
};

/**
 * Concrete class representing polygons.
 *
 * @constructor
 * @class Polygon
 * @extends Geometry
 */

NAN_METHOD(Polygon::toString) {
  info.GetReturnValue().Set(Nan::New("Polygon").ToLocalChecked());
}

/**
 * Computes the area of the polygon.
 *
 * @method getArea
 * @instance
 * @memberof Polygon
 * @return {number}
 */
NODE_WRAPPED_METHOD_WITH_RESULT(Polygon, getArea, Number, get_Area);

/**
 * The rings that make up the polygon geometry.
 *
 * @kind member
 * @name rings
 * @instance
 * @memberof Polygon
 * @type {PolygonRings}
 */
NAN_GETTER(Polygon::ringsGetter) {
  info.GetReturnValue().Set(Nan::GetPrivate(info.This(), Nan::New("rings_").ToLocalChecked()).ToLocalChecked());
}

} // namespace node_gdal
