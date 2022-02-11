
#include "gdal_circularstring.hpp"
#include "gdal_linestring.hpp"
#include "../collections/linestring_points.hpp"
#include "../gdal_common.hpp"
#include "gdal_geometry.hpp"
#include "gdal_simplecurve.hpp"
#include "gdal_point.hpp"

#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> CircularString::constructor;

void CircularString::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(CircularString::New);
  lcons->Inherit(Nan::New(SimpleCurve::constructor));
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("CircularString").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);

  Nan::Set(target, Nan::New("CircularString").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

/**
 * Concrete representation of an arc.
 *
 * @example
 *
 * var CircularString = new gdal.CircularString();
 * CircularString.points.add(new gdal.Point(0,0));
 * CircularString.points.add(new gdal.Point(0,10));
 *
 * @constructor
 * @class CircularString
 * @extends SimpleCurve
 */

NAN_METHOD(CircularString::toString) {
  info.GetReturnValue().Set(Nan::New("CircularString").ToLocalChecked());
}

} // namespace node_gdal
