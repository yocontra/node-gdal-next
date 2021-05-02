
#include "gdal_polygon.hpp"
#include "collections/polygon_rings.hpp"
#include "gdal_common.hpp"
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

/**
 * Concrete class representing polygons.
 *
 * @constructor
 * @class gdal.Polygon
 * @extends gdal.Geometry
 */
NAN_METHOD(Polygon::New) {
  Nan::HandleScope scope;
  Polygon *f;

  if (!info.IsConstructCall()) {
    Nan::ThrowError("Cannot call constructor as function, you need to use 'new' keyword");
    return;
  }

  if (info[0]->IsExternal()) {
    Local<External> ext = info[0].As<External>();
    void *ptr = ext->Value();
    f = static_cast<Polygon *>(ptr);

  } else {
    if (info.Length() != 0) {
      Nan::ThrowError("Polygon constructor doesn't take any arguments");
      return;
    }
    f = new Polygon(new OGRPolygon());
  }

  Local<Value> rings = PolygonRings::New(info.This());
  Nan::SetPrivate(info.This(), Nan::New("rings_").ToLocalChecked(), rings);

  f->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Polygon::toString) {
  Nan::HandleScope scope;
  info.GetReturnValue().Set(Nan::New("Polygon").ToLocalChecked());
}

/**
 * Computes the area of the polygon.
 *
 * @method getArea
 * @return Number
 */
NODE_WRAPPED_METHOD_WITH_RESULT(Polygon, getArea, Number, get_Area);

/**
 * The rings that make up the polygon geometry.
 *
 * @attribute rings
 * @type {gdal.PolygonRings}
 */
NAN_GETTER(Polygon::ringsGetter) {
  Nan::HandleScope scope;
  info.GetReturnValue().Set(Nan::GetPrivate(info.This(), Nan::New("rings_").ToLocalChecked()).ToLocalChecked());
}

} // namespace node_gdal
