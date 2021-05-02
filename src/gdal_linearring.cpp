
#include "gdal_linearring.hpp"
#include "collections/linestring_points.hpp"
#include "gdal_common.hpp"
#include "gdal_geometry.hpp"
#include "gdal_linestring.hpp"

#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> LinearRing::constructor;

void LinearRing::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(LinearRing::New);
  lcons->Inherit(Nan::New(LineString::constructor));
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("LinearRing").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "getArea", getArea);

  Nan::Set(target, Nan::New("LinearRing").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

/**
 * Concrete representation of a closed ring.
 *
 * @constructor
 * @class gdal.LinearRing
 * @extends gdal.LineString
 */
NAN_METHOD(LinearRing::New) {
  Nan::HandleScope scope;
  LinearRing *f;

  if (!info.IsConstructCall()) {
    Nan::ThrowError("Cannot call constructor as function, you need to use 'new' keyword");
    return;
  }

  if (info[0]->IsExternal()) {
    Local<External> ext = info[0].As<External>();
    void *ptr = ext->Value();
    f = static_cast<LinearRing *>(ptr);

  } else {
    if (info.Length() != 0) {
      Nan::ThrowError("LinearRing constructor doesn't take any arguments");
      return;
    }
    f = new LinearRing(new OGRLinearRing());
  }

  Local<Value> points = LineStringPoints::New(info.This());
  Nan::SetPrivate(info.This(), Nan::New("points_").ToLocalChecked(), points);

  f->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(LinearRing::toString) {
  Nan::HandleScope scope;
  info.GetReturnValue().Set(Nan::New("LinearRing").ToLocalChecked());
}

/**
 * Computes the area enclosed by the ring.
 *
 * @method getArea
 * @return Number
 */
NODE_WRAPPED_METHOD_WITH_RESULT(LinearRing, getArea, Number, get_Area);

} // namespace node_gdal
