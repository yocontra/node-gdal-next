
#include "gdal_linestring.hpp"
#include "../collections/linestring_points.hpp"
#include "../gdal_common.hpp"
#include "gdal_geometry.hpp"
#include "gdal_simplecurve.hpp"
#include "gdal_point.hpp"

#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> LineString::constructor;

void LineString::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(LineString::New);
  lcons->Inherit(Nan::New(SimpleCurve::constructor));
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("LineString").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);

  Nan::Set(target, Nan::New("LineString").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

/**
 * Concrete representation of a multi-vertex line.
 *
 * @example
 *
 * var lineString = new gdal.LineString();
 * lineString.points.add(new gdal.Point(0,0));
 * lineString.points.add(new gdal.Point(0,10));
 *
 * @constructor
 * @class LineString
 * @extends SimpleCurve
 */

NAN_METHOD(LineString::toString) {
  info.GetReturnValue().Set(Nan::New("LineString").ToLocalChecked());
}

} // namespace node_gdal
