
#include "gdal_linearring.hpp"
#include "../collections/linestring_points.hpp"
#include "../gdal_common.hpp"
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
  Nan::SetPrototypeMethod(lcons, "addSubLineString", addSubLineString);

  Nan::Set(target, Nan::New("LinearRing").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

Local<Value> LinearRing::New(OGRLinearRing *geom, bool owned) {
  Nan::EscapableHandleScope scope;

  if (!geom) { return scope.Escape(Nan::Null()); }

  // make a copy of geometry owned by a feature
  // + no need to track when a feature is destroyed
  // + no need to throw errors when a method trys to modify an owned read-only
  // geometry
  // - is slower

  if (!owned) { geom = static_cast<OGRLinearRing *>(geom->clone()); }

  LinearRing *wrapped = new LinearRing(geom);
  wrapped->owned_ = true;

  Local<Value> ext = Nan::New<External>(wrapped);
  Local<Object> obj =
    Nan::NewInstance(Nan::GetFunction(Nan::New(LinearRing::constructor)).ToLocalChecked(), 1, &ext).ToLocalChecked();

  return scope.Escape(obj);
}

/**
 * Concrete representation of a closed ring.
 *
 * @constructor
 * @class LinearRing
 * @extends LineString
 */

NAN_METHOD(LinearRing::toString) {
  info.GetReturnValue().Set(Nan::New("LinearRing").ToLocalChecked());
}

/**
 * Computes the area enclosed by the ring.
 *
 * @method getArea
 * @instance
 * @memberof LinearRing
 * @return {number}
 */
NODE_WRAPPED_METHOD_WITH_RESULT(LinearRing, getArea, Number, get_Area);

NAN_METHOD(LinearRing::addSubLineString) {

  LinearRing *geom = Nan::ObjectWrap::Unwrap<LinearRing>(info.This());
  LineString *other;
  int start = 0;
  int end = -1;

  NODE_ARG_WRAPPED(0, "line", LineString, other);
  NODE_ARG_INT_OPT(1, "start", start);
  NODE_ARG_INT_OPT(2, "end", end);

  int n = other->get()->getNumPoints();

  if (start < 0 || end < -1 || start >= n || end >= n) {
    Nan::ThrowRangeError("Invalid start or end index for LineString");
    return;
  }

  geom->this_->addSubLineString(other->get(), start, end);

  return;
}

} // namespace node_gdal
