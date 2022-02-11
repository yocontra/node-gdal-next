
#include "gdal_simplecurve.hpp"
#include "../collections/linestring_points.hpp"
#include "../gdal_common.hpp"
#include "gdal_geometry.hpp"
#include "gdal_point.hpp"
#include "gdal_linestring.hpp"

#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> SimpleCurve::constructor;

void SimpleCurve::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(SimpleCurve::New);
  lcons->Inherit(Nan::New(Geometry::constructor));
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("SimpleCurve").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "getLength", getLength);
  Nan::SetPrototypeMethod(lcons, "value", value);
  Nan::SetPrototypeMethod(lcons, "addSubLineString", addSubLineString);

  ATTR(lcons, "points", pointsGetter, READ_ONLY_SETTER);

  Nan::Set(target, Nan::New("SimpleCurve").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

/**
 * Abstract class representing all SimpleCurves.
 *
 * @constructor
 * @class SimpleCurve
 * @extends Geometry
 */
NAN_METHOD(SimpleCurve::New) {
  Nan::ThrowError("SimpleCurve is an abstract class and cannot be instantiated");
}

NAN_METHOD(SimpleCurve::toString) {
  info.GetReturnValue().Set(Nan::New("SimpleCurve").ToLocalChecked());
}

/**
 * Returns the point at the specified distance along the SimpleCurve.
 *
 * @method value
 * @instance
 * @memberof SimpleCurve
 * @param {number} distance
 * @return {Point}
 */
NAN_METHOD(SimpleCurve::value) {

  SimpleCurve *geom = Nan::ObjectWrap::Unwrap<SimpleCurve>(info.This());

  OGRPoint *pt = new OGRPoint();
  double dist;

  NODE_ARG_DOUBLE(0, "distance", dist);

  geom->this_->Value(dist, pt);

  info.GetReturnValue().Set(Point::New(pt));
}

/**
 * Compute the length of a multiSimpleCurve.
 *
 * @method getLength
 * @instance
 * @memberof SimpleCurve
 * @return {number}
 */
NODE_WRAPPED_METHOD_WITH_RESULT(SimpleCurve, getLength, Number, get_Length);

/**
 * The points that make up the SimpleCurve geometry.
 *
 * @kind member
 * @name points
 * @instance
 * @memberof Geometry
 * @type {LineStringPoints}
 */
NAN_GETTER(SimpleCurve::pointsGetter) {
  info.GetReturnValue().Set(Nan::GetPrivate(info.This(), Nan::New("points_").ToLocalChecked()).ToLocalChecked());
}

/**
 * Add a segment of another LineString to this SimpleCurve subtype.
 *
 * Adds the request range of vertices to the end of this compound curve in an
 * efficient manner. If the start index is larger than the end index then the
 * vertices will be reversed as they are copied.
 *
 * @method addSubLineString
 * @instance
 * @memberof SimpleCurve
 * @param {LineString} LineString to be added
 * @param {number} [start=0] the first vertex to copy, defaults to 0 to start with
 * the first vertex in the other LineString
 * @param {number} [end=-1] the last vertex to copy, defaults to -1 indicating the
 * last vertex of the other LineString
 * @return {void}
 */
NAN_METHOD(SimpleCurve::addSubLineString) {

  SimpleCurve *geom = Nan::ObjectWrap::Unwrap<SimpleCurve>(info.This());
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

  UPDATE_AMOUNT_OF_GEOMETRY_MEMORY(geom);

  return;
}

} // namespace node_gdal
