#include "gdal_common.hpp"

#include "gdal_coordinate_transformation.hpp"
#include "gdal_geometry.hpp"
#include "gdal_geometrycollection.hpp"
#include "gdal_linearring.hpp"
#include "gdal_linestring.hpp"
#include "gdal_multilinestring.hpp"
#include "gdal_multipoint.hpp"
#include "gdal_multipolygon.hpp"
#include "gdal_point.hpp"
#include "gdal_polygon.hpp"
#include "gdal_spatial_reference.hpp"

#include <node_buffer.h>
#include <ogr_core.h>
#include <memory>
#include <sstream>
#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> Geometry::constructor;

void Geometry::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(Geometry::New);
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("Geometry").ToLocalChecked());

  // Nan::SetMethod(constructor, "fromWKBType", Geometry::create);
  Nan::SetMethod(lcons, "fromWKT", Geometry::createFromWkt);
  Nan::SetMethod(lcons, "fromWKTAsync", Geometry::createFromWktAsync);
  Nan::SetMethod(lcons, "fromWKB", Geometry::createFromWkb);
  Nan::SetMethod(lcons, "fromWKBAsync", Geometry::createFromWkbAsync);
  Nan::SetMethod(lcons, "fromGeoJson", Geometry::createFromGeoJson);
  Nan::SetMethod(lcons, "fromGeoJsonAsync", Geometry::createFromGeoJsonAsync);
  Nan::SetMethod(lcons, "getName", Geometry::getName);
  Nan::SetMethod(lcons, "getConstructor", Geometry::getConstructor);

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "toKML", exportToKML);
  Nan::SetPrototypeMethod(lcons, "toKMLAsync", exportToKMLAsync);
  Nan::SetPrototypeMethod(lcons, "toGML", exportToGML);
  Nan::SetPrototypeMethod(lcons, "toGMLAsync", exportToGMLAsync);
  Nan::SetPrototypeMethod(lcons, "toJSON", exportToJSON);
  Nan::SetPrototypeMethod(lcons, "toJSONAsync", exportToJSONAsync);
  Nan::SetPrototypeMethod(lcons, "toWKT", exportToWKT);
  Nan::SetPrototypeMethod(lcons, "toWKTAsync", exportToWKTAsync);
  Nan::SetPrototypeMethod(lcons, "toWKB", exportToWKB);
  Nan::SetPrototypeMethod(lcons, "toWKBAsync", exportToWKBAsync);
  Nan::SetPrototypeMethod(lcons, "isEmpty", isEmpty);
  Nan::SetPrototypeMethod(lcons, "isEmptyAsync", isEmptyAsync);
  Nan::SetPrototypeMethod(lcons, "isValid", isValid);
  Nan::SetPrototypeMethod(lcons, "isValidAsync", isValidAsync);
  Nan::SetPrototypeMethod(lcons, "isSimple", isSimple);
  Nan::SetPrototypeMethod(lcons, "isSimpleAsync", isSimpleAsync);
  Nan::SetPrototypeMethod(lcons, "isRing", isRing);
  Nan::SetPrototypeMethod(lcons, "isRingAsync", isRingAsync);
  Nan::SetPrototypeMethod(lcons, "clone", clone);
  Nan::SetPrototypeMethod(lcons, "empty", empty);
  Nan::SetPrototypeMethod(lcons, "emptyAsync", emptyAsync);
  Nan::SetPrototypeMethod(lcons, "closeRings", closeRings);
  Nan::SetPrototypeMethod(lcons, "closeRingsAsync", closeRingsAsync);
  Nan::SetPrototypeMethod(lcons, "intersects", intersects);
  Nan::SetPrototypeMethod(lcons, "intersectsAsync", intersectsAsync);
  Nan::SetPrototypeMethod(lcons, "equals", equals);
  Nan::SetPrototypeMethod(lcons, "equalsAsync", equalsAsync);
  Nan::SetPrototypeMethod(lcons, "disjoint", disjoint);
  Nan::SetPrototypeMethod(lcons, "disjointAsync", disjointAsync);
  Nan::SetPrototypeMethod(lcons, "touches", touches);
  Nan::SetPrototypeMethod(lcons, "touchesAsync", touchesAsync);
  Nan::SetPrototypeMethod(lcons, "crosses", crosses);
  Nan::SetPrototypeMethod(lcons, "crossesAsync", crossesAsync);
  Nan::SetPrototypeMethod(lcons, "within", within);
  Nan::SetPrototypeMethod(lcons, "withinAsync", withinAsync);
  Nan::SetPrototypeMethod(lcons, "contains", contains);
  Nan::SetPrototypeMethod(lcons, "containsAsync", containsAsync);
  Nan::SetPrototypeMethod(lcons, "overlaps", overlaps);
  Nan::SetPrototypeMethod(lcons, "overlapsAsync", overlapsAsync);
  Nan::SetPrototypeMethod(lcons, "boundary", boundary);
  Nan::SetPrototypeMethod(lcons, "boundaryAsync", boundaryAsync);
  Nan::SetPrototypeMethod(lcons, "distance", distance);
  Nan::SetPrototypeMethod(lcons, "distanceAsync", distanceAsync);
  Nan::SetPrototypeMethod(lcons, "convexHull", convexHull);
  Nan::SetPrototypeMethod(lcons, "convexHullAsync", convexHullAsync);
  Nan::SetPrototypeMethod(lcons, "buffer", buffer);
  Nan::SetPrototypeMethod(lcons, "bufferAsync", bufferAsync);
  Nan::SetPrototypeMethod(lcons, "intersection", intersection);
  Nan::SetPrototypeMethod(lcons, "intersectionAsync", intersectionAsync);
  Nan::SetPrototypeMethod(lcons, "union", unionGeometry);
  Nan::SetPrototypeMethod(lcons, "unionAsync", unionGeometryAsync);
  Nan::SetPrototypeMethod(lcons, "difference", difference);
  Nan::SetPrototypeMethod(lcons, "differenceAsync", differenceAsync);
  Nan::SetPrototypeMethod(lcons, "symDifference", symDifference);
  Nan::SetPrototypeMethod(lcons, "symDifferenceAsync", symDifferenceAsync);
  Nan::SetPrototypeMethod(lcons, "centroid", centroid);
  Nan::SetPrototypeMethod(lcons, "centroidAsync", centroidAsync);
  Nan::SetPrototypeMethod(lcons, "simplify", simplify);
  Nan::SetPrototypeMethod(lcons, "simplifyAsync", simplifyAsync);
  Nan::SetPrototypeMethod(lcons, "simplifyPreserveTopology", simplifyPreserveTopology);
  Nan::SetPrototypeMethod(lcons, "simplifyPreserveTopologyAsync", simplifyPreserveTopologyAsync);
  Nan::SetPrototypeMethod(lcons, "segmentize", segmentize);
  Nan::SetPrototypeMethod(lcons, "swapXY", swapXY);
  Nan::SetPrototypeMethod(lcons, "swapXYAsync", swapXYAsync);
  Nan::SetPrototypeMethod(lcons, "getEnvelope", getEnvelope);
  Nan::SetPrototypeMethod(lcons, "getEnvelopeAsync", getEnvelopeAsync);
  Nan::SetPrototypeMethod(lcons, "getEnvelope3D", getEnvelope3D);
  Nan::SetPrototypeMethod(lcons, "getEnvelope3DAsync", getEnvelope3DAsync);
  Nan::SetPrototypeMethod(lcons, "transform", transform);
  Nan::SetPrototypeMethod(lcons, "transformAsync", transformAsync);
  Nan::SetPrototypeMethod(lcons, "transformTo", transformTo);
  Nan::SetPrototypeMethod(lcons, "transformToAsync", transformToAsync);

  ATTR(lcons, "srs", srsGetter, srsSetter);
  ATTR(lcons, "wkbSize", wkbSizeGetter, READ_ONLY_SETTER);
  ATTR(lcons, "dimension", dimensionGetter, READ_ONLY_SETTER);
  ATTR(lcons, "coordinateDimension", coordinateDimensionGetter, coordinateDimensionSetter);
  ATTR(lcons, "wkbType", typeGetter, READ_ONLY_SETTER);
  ATTR(lcons, "name", nameGetter, READ_ONLY_SETTER);

  Nan::Set(target, Nan::New("Geometry").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

Geometry::Geometry(OGRGeometry *geom) : Nan::ObjectWrap(), this_(geom), owned_(true), size_(0) {
  LOG("Created Geometry [%p]", geom);
  // The async locks must live outside the V8 memory management,
  // otherwise they won't be accessible from the async threads
  async_lock = new uv_mutex_t;
  uv_mutex_init(async_lock);
}

Geometry::Geometry() : Nan::ObjectWrap(), this_(NULL), owned_(true), size_(0) {
  async_lock = new uv_mutex_t;
  uv_mutex_init(async_lock);
}

Geometry::~Geometry() {
  if (this_) {
    LOG("Disposing Geometry [%p] (%s)", this_, owned_ ? "owned" : "unowned");
    if (owned_) {
      OGRGeometryFactory::destroyGeometry(this_);
      Nan::AdjustExternalMemory(-size_);
    }
    LOG("Disposed Geometry [%p]", this_)
    this_ = NULL;
  }
  uv_mutex_destroy(async_lock);
  delete async_lock;
}

/**
 * Abstract base class for all geometry classes.
 *
 * @class gdal.Geometry
 */
NAN_METHOD(Geometry::New) {
  Nan::HandleScope scope;
  Geometry *f;

  if (!info.IsConstructCall()) {
    Nan::ThrowError("Cannot call constructor as function, you need to use 'new' keyword");
    return;
  }

  if (info[0]->IsExternal()) {
    Local<External> ext = info[0].As<External>();
    void *ptr = ext->Value();
    f = static_cast<Geometry *>(ptr);

  } else {
    Nan::ThrowError(
      "Geometry doesnt have a constructor, use Geometry.fromWKT(), Geometry.fromWKB() or type-specific constructor. ie. new ogr.Point()");
    return;
    // OGRwkbGeometryType geometry_type;
    // NODE_ARG_ENUM(0, "geometry type", OGRwkbGeometryType, geometry_type);
    // OGRGeometry *geom = OGRGeometryFactory::createGeometry(geometry_type);
    // f = new Geometry(geom);
  }

  f->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

Local<Value> Geometry::New(OGRGeometry *geom) {
  Nan::EscapableHandleScope scope;
  return scope.Escape(Geometry::New(geom, true));
}

Local<Value> Geometry::New(OGRGeometry *geom, bool owned) {
  Nan::EscapableHandleScope scope;

  if (!geom) { return scope.Escape(Nan::Null()); }

  OGRwkbGeometryType type = getGeometryType_fixed(geom);
  type = wkbFlatten(type);

  switch (type) {
    case wkbPoint: return scope.Escape(Point::New(static_cast<OGRPoint *>(geom), owned));
    case wkbLineString: return scope.Escape(LineString::New(static_cast<OGRLineString *>(geom), owned));
    case wkbLinearRing: return scope.Escape(LinearRing::New(static_cast<OGRLinearRing *>(geom), owned));
    case wkbPolygon: return scope.Escape(Polygon::New(static_cast<OGRPolygon *>(geom), owned));
    case wkbGeometryCollection:
      return scope.Escape(GeometryCollection::New(static_cast<OGRGeometryCollection *>(geom), owned));
    case wkbMultiPoint: return scope.Escape(MultiPoint::New(static_cast<OGRMultiPoint *>(geom), owned));
    case wkbMultiLineString: return scope.Escape(MultiLineString::New(static_cast<OGRMultiLineString *>(geom), owned));
    case wkbMultiPolygon: return scope.Escape(MultiPolygon::New(static_cast<OGRMultiPolygon *>(geom), owned));
    default: Nan::ThrowError("Tried to create unsupported geometry type"); return scope.Escape(Nan::Undefined());
  }
}

OGRwkbGeometryType Geometry::getGeometryType_fixed(OGRGeometry *geom) {
  // For some reason OGRLinearRing::getGeometryType uses OGRLineString's
  // method... meaning OGRLinearRing::getGeometryType returns wkbLineString

  // http://trac.osgeo.org/gdal/ticket/1755

  OGRwkbGeometryType type = geom->getGeometryType();

  if (std::string(geom->getGeometryName()) == "LINEARRING") {
    type = (OGRwkbGeometryType)(wkbLinearRing | (type & wkb25DBit));
  }

  return type;
}

NAN_METHOD(Geometry::toString) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  std::ostringstream ss;
  ss << "Geometry (" << geom->this_->getGeometryName() << ")";
  info.GetReturnValue().Set(Nan::New(ss.str().c_str()).ToLocalChecked());
}

/**
 * Closes any un-closed rings.
 *
 * @method closeRings
 */

/**
 * Closes any un-closed rings.
 * {{{async}}}
 *
 * @param {requestCallback} [callback] {{cb}}
 * @method closeRingsAsync
 */

NODE_WRAPPED_ASYNC_METHOD(Geometry, closeRings, closeRings);

/**
 * Clears the geometry.
 *
 * @method empty
 */

/**
 * Clears the geometry.
 * {{{async}}}
 *
 * @param {requestCallback} [callback] {{cb}}
 * @method emptyAsync
 */

NODE_WRAPPED_ASYNC_METHOD(Geometry, empty, empty);

/**
 * Swaps x, y coordinates.
 *
 * @method swapXY
 */

/**
 * Swaps x, y coordinates.
 * {{{async}}}
 *
 * @param {requestCallback} [callback] {{cb}}
 * @method swapXYAsync
 */

NODE_WRAPPED_ASYNC_METHOD(Geometry, swapXY, swapXY);

/**
 * Determines if the geometry is empty.
 *
 * @method isEmpty
 * @return Boolean
 */

/**
 * Determines if the geometry is empty.
 * {{{async}}}
 *
 * @method isEmptyAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT(Geometry, OGRBoolean, isEmpty, Boolean, IsEmpty);

/**
 * Determines if the geometry is valid.
 *
 * @method isValid
 * @return Boolean
 */

/**
 * Determines if the geometry is valid.
 * {{{async}}}
 *
 * @method isValidAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT(Geometry, OGRBoolean, isValid, Boolean, IsValid);

/**
 * Determines if the geometry is simple.
 *
 * @method isSimple
 * @return Boolean
 */

/**
 * Determines if the geometry is simple.
 * {{{async}}}
 *
 * @method isSimpleAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT(Geometry, OGRBoolean, isSimple, Boolean, IsSimple);

/**
 * Determines if the geometry is a ring.
 *
 * @method isRing
 * @return Boolean
 */

/**
 * Determines if the geometry is a ring.
 * {{{async}}}
 *
 * @method isRingAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT(Geometry, OGRBoolean, isRing, Boolean, IsRing);

/**
 * Determines if the two geometries intersect.
 *
 * @method intersects
 * @param {gdal.Geometry} geometry
 * @return Boolean
 */

/**
 * Determines if the two geometries intersect.
 * {{{async}}}
 *
 * @method intersectsAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT_1_WRAPPED_PARAM(
  Geometry, OGRBoolean, intersects, Boolean, Intersects, Geometry, "geometry to compare");

/**
 * Determines if the two geometries equal each other.
 *
 * @method equals
 * @param {gdal.Geometry} geometry
 * @return Boolean
 */

/**
 * Determines if the two geometries equal each other.
 * {{{async}}}
 *
 * @method equalsAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT_1_WRAPPED_PARAM(
  Geometry, OGRBoolean, equals, Boolean, Equals, Geometry, "geometry to compare");

/**
 * Determines if the two geometries are disjoint.
 *
 * @method disjoint
 * @param {gdal.Geometry} geometry
 * @return Boolean
 */

/**
 * Determines if the two geometries are disjoint.
 * {{{async}}}
 *
 * @method disjointAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT_1_WRAPPED_PARAM(
  Geometry, OGRBoolean, disjoint, Boolean, Disjoint, Geometry, "geometry to compare");

/**
 * Determines if the two geometries touch.
 *
 * @method touches
 * @param {gdal.Geometry} geometry
 * @return Boolean
 */

/**
 * Determines if the two geometries touch.
 * {{{async}}}
 *
 * @method touchesAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT_1_WRAPPED_PARAM(
  Geometry, OGRBoolean, touches, Boolean, Touches, Geometry, "geometry to compare");

/**
 * Determines if the two geometries cross.
 *
 * @method crosses
 * @param {gdal.Geometry} geometry
 * @return Boolean
 */

/**
 * Determines if the two geometries cross.
 * {{{async}}}
 *
 * @method crossesAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT_1_WRAPPED_PARAM(
  Geometry, OGRBoolean, crosses, Boolean, Crosses, Geometry, "geometry to compare");

/**
 * Determines if the current geometry is within the provided geometry.
 *
 * @method within
 * @param {gdal.Geometry} geometry
 * @return Boolean
 */

/**
 * Determines if the current geometry is within the provided geometry.
 * {{{async}}}
 *
 * @method withinAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT_1_WRAPPED_PARAM(
  Geometry, OGRBoolean, within, Boolean, Within, Geometry, "geometry to compare");

/**
 * Determines if the current geometry contains the provided geometry.
 *
 * @method contains
 * @param {gdal.Geometry} geometry
 * @return Boolean
 */

/**
 * Determines if the current geometry contains the provided geometry.
 * {{{async}}}
 *
 * @method containsAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT_1_WRAPPED_PARAM(
  Geometry, OGRBoolean, contains, Boolean, Contains, Geometry, "geometry to compare");

/**
 * Determines if the current geometry overlaps the provided geometry.
 *
 * @method overlaps
 * @param {gdal.Geometry} geometry
 * @return Boolean
 */

/**
 * Determines if the current geometry overlaps the provided geometry.
 * {{{async}}}
 *
 * @method overlapsAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return Boolean
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT_1_WRAPPED_PARAM(
  Geometry, OGRBoolean, overlaps, Boolean, Overlaps, Geometry, "geometry to compare");

/**
 * Computes the distance between the two geometries.
 *
 * @method distance
 * @param {gdal.Geometry} geometry
 * @return Number
 */

/**
 * Computes the distance between the two geometries.
 * {{{async}}}
 *
 * @method distanceAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return Number
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_RESULT_1_WRAPPED_PARAM(
  Geometry, double, distance, Number, Distance, Geometry, "geometry to use for distance calculation");

/**
 * Modify the geometry such it has no segment longer then the given distance.
 *
 * @method segmentize
 * @param {Number} segment_length
 * @return Number
 */
NODE_WRAPPED_METHOD_WITH_1_DOUBLE_PARAM(Geometry, segmentize, segmentize, "segment length");

/**
 * Apply arbitrary coordinate transformation to the geometry.
 *
 * This method will transform the coordinates of a geometry from their current
 * spatial reference system to a new target spatial reference system. Normally
 * this means reprojecting the vectors, but it could include datum shifts,
 * and changes of units.
 *
 * Note that this method does not require that the geometry already have a
 * spatial reference system. It will be assumed that they can be treated as
 * having the source spatial reference system of the {{#crossLink
 * "gdal.CoordinateTransformation"}}CoordinateTransformation{{/crossLink}}
 * object, and the actual SRS of the geometry will be ignored.
 *
 * @throws Error
 * @method transform
 * @param {gdal.CoordinateTransformation} transformation
 */

/**
 * Apply arbitrary coordinate transformation to the geometry.
 * {{{async}}}
 *
 * @throws Error
 * @method transformAsync
 * @param {requestCallback} [callback] {{cb}}
 * @param {gdal.CoordinateTransformation} transformation
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_OGRERR_RESULT_1_WRAPPED_PARAM(
  Geometry, int, transform, transform, CoordinateTransformation, "transform");

/**
 * Transforms the geometry to match the provided {{#crossLink
 * "gdal.SpatialReference"}}SpatialReference{{/crossLink}}.
 *
 * @throws Error
 * @method transformTo
 * @param {gdal.SpatialReference} srs
 */

/**
 * Transforms the geometry to match the provided {{#crossLink
 * "gdal.SpatialReference"}}SpatialReference{{/crossLink}}.
 * {{{async}}}
 *
 * @throws Error
 * @method transformToAsync
 * @param {requestCallback} [callback] {{cb}}
 * @param {gdal.SpatialReference} srs
 */

NODE_WRAPPED_ASYNC_METHOD_WITH_OGRERR_RESULT_1_WRAPPED_PARAM(
  Geometry, int, transformTo, transformTo, SpatialReference, "spatial reference");

/**
 * Clones the instance.
 *
 * @method clone
 * @return gdal.Geometry
 */
NAN_METHOD(Geometry::clone) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  info.GetReturnValue().Set(Geometry::New(geom->this_->clone()));
}

/**
 * Compute convex hull.
 *
 * @method convexHull
 * @return gdal.Geometry
 */

/**
 * Compute convex hull.
 * {{{async}}}
 *
 * @method convexHullAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::convexHull) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  GDAL_ASYNCABLE_PERSIST(info.This());
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [gdal_geom]() { return gdal_geom->ConvexHull(); };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *r, GDAL_ASYNCABLE_OBJS) { return Geometry::New(r); };
  GDAL_ASYNCABLE_EXECUTE(0, OGRGeometry *);
}

/**
 * Compute boundary.
 *
 * @method boundary
 * @return gdal.Geometry
 */

/**
 * Compute boundary.
 * {{{async}}}
 *
 * @method boundaryAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::boundary) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  GDAL_ASYNCABLE_PERSIST(info.This());
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [gdal_geom]() { return gdal_geom->Boundary(); };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *r, GDAL_ASYNCABLE_OBJS) { return Geometry::New(r); };
  GDAL_ASYNCABLE_EXECUTE(0, OGRGeometry *);
}

/**
 * Compute intersection with another geometry.
 *
 * @method intersection
 * @param {gdal.Geometry} geometry
 * @return gdal.Geometry
 */

/**
 * Compute intersection with another geometry.
 * {{{async}}}
 *
 * @method intersectionAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::intersection) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  Geometry *x = NULL;

  NODE_ARG_WRAPPED(0, "geometry to use for intersection", Geometry, x);

  OGRGeometry *gdal_geom = geom->this_;
  OGRGeometry *gdal_x = x->this_;
  GDAL_ASYNCABLE_PERSIST(info.This());
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [gdal_geom, gdal_x]() { return gdal_geom->Intersection(gdal_x); };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *r, GDAL_ASYNCABLE_OBJS) { return Geometry::New(r); };
  GDAL_ASYNCABLE_EXECUTE(1, OGRGeometry *);
}

/**
 * Compute the union of this geometry with another.
 *
 * @method union
 * @param {gdal.Geometry} geometry
 * @return gdal.Geometry
 */

/**
 * Compute the union of this geometry with another.
 * {{{async}}}
 *
 * @method unionAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::unionGeometry) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  Geometry *x = NULL;

  NODE_ARG_WRAPPED(0, "geometry to use for union", Geometry, x);

  OGRGeometry *gdal_geom = geom->this_;
  OGRGeometry *gdal_x = x->this_;
  GDAL_ASYNCABLE_PERSIST(info.This());
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [gdal_geom, gdal_x]() { return gdal_geom->Union(gdal_x); };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *r, GDAL_ASYNCABLE_OBJS) { return Geometry::New(r); };
  GDAL_ASYNCABLE_EXECUTE(1, OGRGeometry *);
}

/**
 * Compute the difference of this geometry with another.
 *
 * @method difference
 * @param {gdal.Geometry} geometry
 * @return gdal.Geometry
 */

/**
 * Compute the difference of this geometry with another.
 * {{{async}}}
 *
 * @method differenceAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::difference) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  Geometry *x = NULL;

  NODE_ARG_WRAPPED(0, "geometry to use for difference", Geometry, x);

  OGRGeometry *gdal_geom = geom->this_;
  OGRGeometry *gdal_x = x->this_;
  GDAL_ASYNCABLE_PERSIST(info.This());
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [gdal_geom, gdal_x]() { return gdal_geom->Difference(gdal_x); };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *r, GDAL_ASYNCABLE_OBJS) { return Geometry::New(r); };
  GDAL_ASYNCABLE_EXECUTE(1, OGRGeometry *);
}

/**
 * Computes the symmetric difference of this geometry and the second geometry.
 *
 * @method symDifference
 * @param {gdal.Geometry} geometry
 * @return gdal.Geometry
 */

/**
 * Computes the symmetric difference of this geometry and the second geometry.
 * {{{async}}}
 *
 * @method symDifferenceAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::symDifference) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  Geometry *x = NULL;

  NODE_ARG_WRAPPED(0, "geometry to use for symDifference", Geometry, x);

  OGRGeometry *gdal_geom = geom->this_;
  OGRGeometry *gdal_x = x->this_;
  GDAL_ASYNCABLE_PERSIST(info.This());
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [gdal_geom, gdal_x]() { return gdal_geom->SymDifference(gdal_x); };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *r, GDAL_ASYNCABLE_OBJS) { return Geometry::New(r); };
  GDAL_ASYNCABLE_EXECUTE(1, OGRGeometry *);
}

/**
 * Reduces the geometry complexity.
 *
 * @method simplify
 * @param {Number} tolerance
 * @return gdal.Geometry
 */

/**
 * Reduces the geometry complexity.
 * {{{async}}}
 *
 * @method simplifyAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::simplify) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  double tolerance;

  NODE_ARG_DOUBLE(0, "tolerance", tolerance);
  OGRGeometry *gdal_geom = geom->this_;

  GDAL_ASYNCABLE_PERSIST(info.This());
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [gdal_geom, tolerance]() { return gdal_geom->Simplify(tolerance); };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *r, GDAL_ASYNCABLE_OBJS) { return Geometry::New(r); };
  GDAL_ASYNCABLE_EXECUTE(1, OGRGeometry *);
}

/**
 * Reduces the geometry complexity while preserving the topology.
 *
 * @method simplifyPreserveTopology
 * @param {Number} tolerance
 * @return gdal.Geometry
 */

/**
 * Reduces the geometry complexity while preserving the topology.
 * {{{async}}}
 *
 * @method simplifyPreserveTopologyAsync
 * @param {gdal.Geometry} geometry
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::simplifyPreserveTopology) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  double tolerance;

  NODE_ARG_DOUBLE(0, "tolerance", tolerance);
  OGRGeometry *gdal_geom = geom->this_;

  GDAL_ASYNCABLE_PERSIST(info.This());
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [gdal_geom, tolerance]() {
    return gdal_geom->SimplifyPreserveTopology(tolerance);
  };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *r, GDAL_ASYNCABLE_OBJS) { return Geometry::New(r); };
  GDAL_ASYNCABLE_EXECUTE(1, OGRGeometry *);
}

/**
 * Buffers the geometry by the given distance.
 *
 * @method buffer
 * @param {Number} distance
 * @param {integer} segments
 * @return gdal.Geometry
 */

/**
 * Buffers the geometry by the given distance.
 * {{{async}}}
 *
 * @method bufferAsync
 * @param {Number} distance
 * @param {integer} segments
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::buffer) {
  Nan::HandleScope scope;

  double distance;
  int number_of_segments = 30;

  NODE_ARG_DOUBLE(0, "distance", distance);
  NODE_ARG_INT_OPT(1, "number of segments", number_of_segments);

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  OGRGeometry *gdal_geom = geom->this_;

  GDAL_ASYNCABLE_PERSIST(info.This());
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [gdal_geom, distance, number_of_segments]() {
    return gdal_geom->Buffer(distance, number_of_segments);
  };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *r, GDAL_ASYNCABLE_OBJS) { return Geometry::New(r); };
  GDAL_ASYNCABLE_EXECUTE(2, OGRGeometry *);
}

/**
 * Convert a geometry into well known text format.
 *
 * @method toWKT
 * @return gdal.Geometry
 */

/**
 * Convert a geometry into well known text format.
 * {{{async}}}
 *
 * @method toWKTAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::exportToWKT) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  GDAL_ASYNCABLE_PERSIST(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  uv_mutex_t *async_lock = geom->async_lock;
  GDAL_ASYNCABLE_MAIN(char *) = [async_lock, gdal_geom]() {
    char *text = NULL;
    uv_mutex_lock(async_lock);
    OGRErr err = gdal_geom->exportToWkt(&text);
    uv_mutex_unlock(async_lock);
    if (err) { throw getOGRErrMsg(err); }
    return text;
  };

  GDAL_ASYNCABLE_RVAL(char *) = [](char *text, GDAL_ASYNCABLE_OBJS) {
    if (text) { return SafeString::New(text); }
    return Nan::Undefined().As<Value>();
  };

  GDAL_ASYNCABLE_EXECUTE(0, char *);
}

/**
 * Convert a geometry into well known binary format.
 *
 * @method toWKB
 * @param {string} [byte_order="MSB"] ({{#crossLink "Constants
 * (wkbByteOrder)"}}see options{{/crossLink}})
 * @param {string} [variant="OGC"] ({{#crossLink "Constants (wkbVariant)"}}see
 * options{{/crossLink}})
 * @return gdal.Geometry
 */

/**
 * Convert a geometry into well known binary format.
 * {{{async}}}
 *
 * @method toWKBAsync
 * @param {string} [byte_order="MSB"] ({{#crossLink "Constants
 * (wkbByteOrder)"}}see options{{/crossLink}})
 * @param {string} [variant="OGC"] ({{#crossLink "Constants (wkbVariant)"}}see
 * options{{/crossLink}})
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::exportToWKB) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  int size = geom->this_->WkbSize();
  unsigned char *data = (unsigned char *)malloc(size);

  // byte order
  OGRwkbByteOrder byte_order;
  std::string order = "MSB";
  NODE_ARG_OPT_STR(0, "byte order", order);
  if (order == "MSB") {
    byte_order = wkbXDR;
  } else if (order == "LSB") {
    byte_order = wkbNDR;
  } else {
    Nan::ThrowError("byte order must be 'MSB' or 'LSB'");
    return;
  }

#if GDAL_VERSION_MAJOR > 1 || (GDAL_VERSION_MINOR > 10)
  // wkb variant
  OGRwkbVariant wkb_variant;
  std::string variant = "OGC";
  NODE_ARG_OPT_STR(1, "wkb variant", variant);
  if (variant == "OGC") {
#if GDAL_VERSION_MAJOR > 1
    wkb_variant = wkbVariantOldOgc;
#else
    wkb_variant = wkbVariantOgc;
#endif
  } else if (variant == "ISO") {
    wkb_variant = wkbVariantIso;
  } else {
    Nan::ThrowError("variant must be 'OGC' or 'ISO'");
    return;
  }
  GDAL_ASYNCABLE_PERSIST(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  uv_mutex_t *async_lock = geom->async_lock;
  GDAL_ASYNCABLE_MAIN(unsigned char *) = [async_lock, gdal_geom, data, byte_order, wkb_variant]() {
    uv_mutex_lock(async_lock);
    OGRErr err = gdal_geom->exportToWkb(byte_order, data, wkb_variant);
    uv_mutex_unlock(async_lock);
    if (err) {
      free(data);
      throw getOGRErrMsg(err);
    }
    return data;
  };
  //^^ export to wkb and fill buffer ^^
  GDAL_ASYNCABLE_RVAL(unsigned char *) = [size](unsigned char *data, GDAL_ASYNCABLE_OBJS) {
    Local<Value> result = Nan::NewBuffer((char *)data, size).ToLocalChecked();
    return result;
  };
  GDAL_ASYNCABLE_EXECUTE(2, unsigned char *);
#else
  GDAL_ASYNCABLE_1x_UNSUPPORTED;
  OGRErr err = geom->this_->exportToWkb(byte_order, data);
  if (err) {
    free(data);
    NODE_THROW_OGRERR(err);
    return;
  }
  //^^ export to wkb and fill buffer ^^
  Local<Value> result = Nan::NewBuffer((char *)data, size).ToLocalChecked();
  info.GetReturnValue().Set(result);
#endif
}

/**
 * Convert a geometry into KML format.
 *
 * @method toKML
 * @return gdal.Geometry
 */

/**
 * Convert a geometry into KML format.
 * {{{async}}}
 *
 * @method toKMLAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::exportToKML) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  GDAL_ASYNCABLE_PERSIST(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  uv_mutex_t *async_lock = geom->async_lock;
  GDAL_ASYNCABLE_MAIN(char *) = [async_lock, gdal_geom]() {
    uv_mutex_lock(async_lock);
    char *text = gdal_geom->exportToKML();
    uv_mutex_unlock(async_lock);
    return text;
  };
  GDAL_ASYNCABLE_RVAL(char *) = [](char *text, GDAL_ASYNCABLE_OBJS) {
    if (text) {
      Local<Value> result = Nan::New(text).ToLocalChecked();
      CPLFree(text);
      return result;
    }
    return Nan::Undefined().As<Value>();
  };
  GDAL_ASYNCABLE_EXECUTE(0, char *);
}

/**
 * Convert a geometry into GML format.
 *
 * @method toGML
 * @return gdal.Geometry
 */

/**
 * Convert a geometry into GML format.
 * {{{async}}}
 *
 * @method toGMLAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::exportToGML) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  GDAL_ASYNCABLE_PERSIST(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  uv_mutex_t *async_lock = geom->async_lock;
  GDAL_ASYNCABLE_MAIN(char *) = [async_lock, gdal_geom]() {
    uv_mutex_lock(async_lock);
    char *text = gdal_geom->exportToGML();
    uv_mutex_unlock(async_lock);
    return text;
  };
  GDAL_ASYNCABLE_RVAL(char *) = [](char *text, GDAL_ASYNCABLE_OBJS) {
    if (text) {
      Local<Value> result = Nan::New(text).ToLocalChecked();
      CPLFree(text);
      return result;
    }
    return Nan::Undefined().As<Value>();
  };
  GDAL_ASYNCABLE_EXECUTE(0, char *);
}

/**
 * Convert a geometry into JSON format.
 *
 * @method toJSON
 * @return gdal.Geometry
 */

/**
 * Convert a geometry into JSON format.
 * {{{async}}}
 *
 * @method toJSONAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::exportToJSON) {
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  GDAL_ASYNCABLE_PERSIST(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  uv_mutex_t *async_lock = geom->async_lock;
  GDAL_ASYNCABLE_MAIN(char *) = [async_lock, gdal_geom]() {
    uv_mutex_lock(async_lock);
    char *text = gdal_geom->exportToJson();
    uv_mutex_unlock(async_lock);
    return text;
  };
  GDAL_ASYNCABLE_RVAL(char *) = [](char *text, GDAL_ASYNCABLE_OBJS) {
    if (text) {
      Local<Value> result = Nan::New(text).ToLocalChecked();
      CPLFree(text);
      return result;
    }
    return Nan::Undefined().As<Value>();
  };
  GDAL_ASYNCABLE_EXECUTE(0, char *);
}

/**
 * Compute the centroid of the geometry.
 *
 * @method centroid
 * @return gdal.Point
 */

/**
 * Compute the centroid of the geometry.
 * {{{async}}}
 *
 * @method centroidAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Point
 */

GDAL_ASYNCABLE_DEFINE(Geometry::centroid) {
  // The Centroid method wants the caller to create the point to fill in.
  // Instead of requiring the caller to create the point geometry to fill in, we
  // new up an OGRPoint and put the result into it and return that.
  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  GDAL_ASYNCABLE_PERSIST(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  uv_mutex_t *async_lock = geom->async_lock;
  GDAL_ASYNCABLE_MAIN(OGRPoint *) = [async_lock, gdal_geom]() {
    OGRPoint *point = new OGRPoint();
    uv_mutex_lock(async_lock);
    OGRErr err = gdal_geom->Centroid(point);
    uv_mutex_unlock(async_lock);
    if (err) {
      delete point;
      throw getOGRErrMsg(err);
    }
    return point;
  };
  GDAL_ASYNCABLE_RVAL(OGRPoint *) = [](OGRPoint *point, GDAL_ASYNCABLE_OBJS) { return Point::New(point); };
  GDAL_ASYNCABLE_EXECUTE(0, OGRPoint *);
}

/**
 * Computes the bounding box (envelope).
 *
 * @method getEnvelope
 * @return {gdal.Envelope} Bounding envelope
 */

/**
 * Computes the bounding box (envelope).
 * {{{async}}}
 *
 * @method getEnvelopeAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return {gdal.Envelope} Bounding envelope
 */
GDAL_ASYNCABLE_DEFINE(Geometry::getEnvelope) {
  // returns object containing boundaries until complete OGREnvelope binding is
  // built

  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  GDAL_ASYNCABLE_PERSIST(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  uv_mutex_t *async_lock = geom->async_lock;

  GDAL_ASYNCABLE_MAIN(OGREnvelope *) = [async_lock, gdal_geom]() {
    OGREnvelope *envelope = new OGREnvelope();
    uv_mutex_lock(async_lock);
    gdal_geom->getEnvelope(envelope);
    uv_mutex_unlock(async_lock);
    return envelope;
  };

  GDAL_ASYNCABLE_RVAL(OGREnvelope *) = [](OGREnvelope *envelope, GDAL_ASYNCABLE_OBJS) {
    Local<Object> obj = Nan::New<Object>();
    Nan::Set(obj, Nan::New("minX").ToLocalChecked(), Nan::New<Number>(envelope->MinX));
    Nan::Set(obj, Nan::New("maxX").ToLocalChecked(), Nan::New<Number>(envelope->MaxX));
    Nan::Set(obj, Nan::New("minY").ToLocalChecked(), Nan::New<Number>(envelope->MinY));
    Nan::Set(obj, Nan::New("maxY").ToLocalChecked(), Nan::New<Number>(envelope->MaxY));
    delete envelope;
    return obj;
  };
  GDAL_ASYNCABLE_EXECUTE(0, OGREnvelope *);
}

/**
 * Computes the 3D bounding box (envelope).
 *
 * @method getEnvelope3D
 * @return {gdal.Envelope3D} Bounding envelope
 */

/**
 * Computes the 3D bounding box (envelope).
 * {{{async}}}
 *
 * @method getEnvelope3DAsync
 * @param {requestCallback} [callback] {{cb}}
 * @return {gdal.Envelope3D} Bounding envelope
 */

GDAL_ASYNCABLE_DEFINE(Geometry::getEnvelope3D) {
  // returns object containing boundaries until complete OGREnvelope binding is
  // built

  Nan::HandleScope scope;

  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  GDAL_ASYNCABLE_PERSIST(info.This());
  OGRGeometry *gdal_geom = geom->this_;
  uv_mutex_t *async_lock = geom->async_lock;

  GDAL_ASYNCABLE_MAIN(OGREnvelope3D *) = [async_lock, gdal_geom]() {
    OGREnvelope3D *envelope = new OGREnvelope3D();
    uv_mutex_lock(async_lock);
    gdal_geom->getEnvelope(envelope);
    uv_mutex_unlock(async_lock);
    return envelope;
  };

  GDAL_ASYNCABLE_RVAL(OGREnvelope3D *) = [](OGREnvelope3D *envelope, GDAL_ASYNCABLE_OBJS) {
    Local<Object> obj = Nan::New<Object>();
    Nan::Set(obj, Nan::New("minX").ToLocalChecked(), Nan::New<Number>(envelope->MinX));
    Nan::Set(obj, Nan::New("maxX").ToLocalChecked(), Nan::New<Number>(envelope->MaxX));
    Nan::Set(obj, Nan::New("minY").ToLocalChecked(), Nan::New<Number>(envelope->MinY));
    Nan::Set(obj, Nan::New("maxY").ToLocalChecked(), Nan::New<Number>(envelope->MaxY));
    Nan::Set(obj, Nan::New("minZ").ToLocalChecked(), Nan::New<Number>(envelope->MinZ));
    Nan::Set(obj, Nan::New("maxZ").ToLocalChecked(), Nan::New<Number>(envelope->MaxZ));
    delete envelope;
    return obj;
  };
  GDAL_ASYNCABLE_EXECUTE(0, OGREnvelope3D *);
}

// --- JS static methods (OGRGeometryFactory) ---

/**
 * Creates a Geometry from a WKT string.
 *
 * @static
 * @method fromWKT
 * @param {String} wkt
 * @param {gdal.SpatialReference} [srs]
 * @return gdal.Geometry
 */

/**
 * Creates a Geometry from a WKT string.
 * {{{async}}}
 *
 * @static
 * @method fromWKTAsync
 * @param {String} wkt
 * @param {gdal.SpatialReference} [srs]
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::createFromWkt) {
  Nan::HandleScope scope;

  std::string *wkt_string = new std::string;
  SpatialReference *srs = NULL;

  NODE_ARG_STR(0, "wkt", *wkt_string);
  NODE_ARG_WRAPPED_OPT(1, "srs", SpatialReference, srs);

  OGRSpatialReference *ogr_srs = NULL;
  if (srs) { ogr_srs = srs->get(); }

  GDAL_ASYNCABLE_PERSIST();
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [wkt_string, ogr_srs]() {
    std::unique_ptr<std::string> wkt_string_ptr(wkt_string);
    OGRGeometry *geom = NULL;
    OGRChar *wkt = (OGRChar *)wkt_string->c_str();
    OGRErr err = OGRGeometryFactory::createFromWkt(wkt, ogr_srs, &geom);
    if (err) throw getOGRErrMsg(err);
    return geom;
  };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *geom, GDAL_ASYNCABLE_OBJS) { return Geometry::New(geom, true); };
  GDAL_ASYNCABLE_EXECUTE(2, OGRGeometry *);
}

/**
 * Creates a Geometry from a WKB buffer.
 *
 * @static
 * @method fromWKB
 * @param {Buffer} wkb
 * @param {gdal.SpatialReference} [srs]
 * @return gdal.Geometry
 */

/**
 * Creates a Geometry from a WKB buffer.
 * {{{async}}}
 *
 * @static
 * @method fromWKBAsync
 * @param {Buffer} wkb
 * @param {gdal.SpatialReference} [srs]
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */

GDAL_ASYNCABLE_DEFINE(Geometry::createFromWkb) {
  Nan::HandleScope scope;

  std::string wkb_string;
  SpatialReference *srs = NULL;

  Local<Object> wkb_obj;
  NODE_ARG_OBJECT(0, "wkb", wkb_obj);
  NODE_ARG_WRAPPED_OPT(1, "srs", SpatialReference, srs);

  std::string obj_type = *Nan::Utf8String(wkb_obj->GetConstructorName());

  if (obj_type != "Buffer" && obj_type != "Uint8Array") {
    Nan::ThrowError("Argument must be a buffer object");
    return;
  }

  unsigned char *data = (unsigned char *)Buffer::Data(wkb_obj);
  size_t length = Buffer::Length(wkb_obj);

  OGRSpatialReference *ogr_srs = NULL;
  if (srs) { ogr_srs = srs->get(); }

  GDAL_ASYNCABLE_PERSIST();
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [data, length, ogr_srs]() {
    OGRGeometry *geom = NULL;
    OGRErr err = OGRGeometryFactory::createFromWkb(data, ogr_srs, &geom, length);
    if (err) throw getOGRErrMsg(err);
    return geom;
  };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *geom, GDAL_ASYNCABLE_OBJS) { return Geometry::New(geom, true); };
  GDAL_ASYNCABLE_EXECUTE(2, OGRGeometry *);
}

/**
 * Creates a Geometry from a GeoJSON string.
 *
 * @static
 * @method fromGeoJson
 * @param {Object} geojson
 * @return gdal.Geometry
 */

/**
 * Creates a Geometry from a GeoJSON string.
 * {{{async}}}
 *
 * Alas, the current implementation uses V8's JSON.Stringify
 * and then converts the string to UTF-8 (from JS internal UTF-16)
 * This part is neither async-compatible, neither parallelizable
 * The GDAL part is async
 * Pay attention to the event loop if you use this and need
 * to remain low-latency
 *
 * @static
 * @method fromGeoJsonAsync
 * @param {Object} geojson
 * @param {requestCallback} [callback] {{cb}}
 * @return gdal.Geometry
 */
GDAL_ASYNCABLE_DEFINE(Geometry::createFromGeoJson) {
  Nan::HandleScope scope;
#if GDAL_VERSION_MAJOR < 2 || (GDAL_VERSION_MAJOR <= 2 && GDAL_VERSION_MINOR < 3)
  Nan::ThrowError("GDAL < 2.3 does not support parsing GeoJSON directly");
  return;
#else

  Local<Object> geo_obj;
  NODE_ARG_OBJECT(0, "geojson", geo_obj);

  // goes to text to pass it in, there isn't a performant way to
  // go from v8 JSON -> CPLJSON anyways
  Nan::JSON NanJSON;
  Nan::MaybeLocal<String> result = NanJSON.Stringify(geo_obj);
  if (result.IsEmpty()) {
    Nan::ThrowError("Invalid GeoJSON");
    return;
  }
  Local<String> stringified = result.ToLocalChecked();
  std::string *val = new std::string(*Nan::Utf8String(stringified));
  OGRGeometry *geom = NULL;
  OGRSpatialReference *ogr_srs = NULL;

  GDAL_ASYNCABLE_PERSIST();
  GDAL_ASYNCABLE_MAIN(OGRGeometry *) = [val, geom, ogr_srs]() {
    std::unique_ptr<std::string> val_ptr(val);
    OGRGeometry *geom = OGRGeometryFactory::createFromGeoJson(val->c_str());
    return geom;
  };
  GDAL_ASYNCABLE_RVAL(OGRGeometry *) = [](OGRGeometry *geom, GDAL_ASYNCABLE_OBJS) { return Geometry::New(geom, true); };
  GDAL_ASYNCABLE_EXECUTE(1, OGRGeometry *);
#endif
}

/**
 * Creates an empty Geometry from a WKB type.
 *
 * @static
 * @method create
 * @param {Integer} type WKB geometry type ({{#crossLink "Constants
 * (wkbGeometryType)"}}available options{{/crossLink}})
 * @return gdal.Geometry
 */
NAN_METHOD(Geometry::create) {
  Nan::HandleScope scope;

  OGRwkbGeometryType type = wkbUnknown;
  NODE_ARG_ENUM(0, "type", OGRwkbGeometryType, type);

  info.GetReturnValue().Set(Geometry::New(OGRGeometryFactory::createGeometry(type), true));
}

/**
 * @attribute srs
 * @type gdal.SpatialReference
 */
NAN_GETTER(Geometry::srsGetter) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  info.GetReturnValue().Set(SpatialReference::New(geom->this_->getSpatialReference(), false));
}

NAN_SETTER(Geometry::srsSetter) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  OGRSpatialReference *srs = NULL;
  if (IS_WRAPPED(value, SpatialReference)) {
    SpatialReference *srs_obj = Nan::ObjectWrap::Unwrap<SpatialReference>(value.As<Object>());
    srs = srs_obj->get();
  } else if (!value->IsNull() && !value->IsUndefined()) {
    Nan::ThrowError("srs must be SpatialReference object");
    return;
  }

  geom->this_->assignSpatialReference(srs);
}

/**
 * @readOnly
 * @attribute name
 * @type String
 */
NAN_GETTER(Geometry::nameGetter) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  info.GetReturnValue().Set(SafeString::New(geom->this_->getGeometryName()));
}

/**
 * See {{#crossLink "Constants
 * (wkbGeometryType)"}}wkbGeometryTypes{{/crossLink}}.
 * @readOnly
 * @attribute wkbType
 * @type integer
 */
NAN_GETTER(Geometry::typeGetter) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  info.GetReturnValue().Set(Nan::New<Integer>(getGeometryType_fixed(geom->this_)));
}

/**
 * @readOnly
 * @attribute wkbSize
 * @type Integer
 */
NAN_GETTER(Geometry::wkbSizeGetter) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  info.GetReturnValue().Set(Nan::New<Integer>(geom->this_->WkbSize()));
}

/**
 * @readOnly
 * @attribute dimension
 * @type Integer
 */
NAN_GETTER(Geometry::dimensionGetter) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  info.GetReturnValue().Set(Nan::New<Integer>(geom->this_->getDimension()));
}

/**
 * @attribute coordinateDimension
 * @type Integer
 */
NAN_GETTER(Geometry::coordinateDimensionGetter) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());
  info.GetReturnValue().Set(Nan::New<Integer>(geom->this_->getCoordinateDimension()));
}

NAN_SETTER(Geometry::coordinateDimensionSetter) {
  Nan::HandleScope scope;
  Geometry *geom = Nan::ObjectWrap::Unwrap<Geometry>(info.This());

  if (!value->IsInt32()) {
    Nan::ThrowError("coordinateDimension must be an integer");
    return;
  }
  int dim = Nan::To<int64_t>(value).ToChecked();
  if (dim != 2 && dim != 3) {
    Nan::ThrowError("coordinateDimension must be 2 or 3");
    return;
  }

  geom->this_->setCoordinateDimension(dim);
}

Local<Value> Geometry::getConstructor(OGRwkbGeometryType type) {
  Nan::EscapableHandleScope scope;

  type = wkbFlatten(type);
  switch (type) {
    case wkbPoint: return scope.Escape(Nan::GetFunction(Nan::New(Point::constructor)).ToLocalChecked());
    case wkbLineString: return scope.Escape(Nan::GetFunction(Nan::New(LineString::constructor)).ToLocalChecked());
    case wkbLinearRing: return scope.Escape(Nan::GetFunction(Nan::New(LinearRing::constructor)).ToLocalChecked());
    case wkbPolygon: return scope.Escape(Nan::GetFunction(Nan::New(Polygon::constructor)).ToLocalChecked());
    case wkbGeometryCollection:
      return scope.Escape(Nan::GetFunction(Nan::New(GeometryCollection::constructor)).ToLocalChecked());
    case wkbMultiPoint: return scope.Escape(Nan::GetFunction(Nan::New(MultiPoint::constructor)).ToLocalChecked());
    case wkbMultiLineString:
      return scope.Escape(Nan::GetFunction(Nan::New(MultiLineString::constructor)).ToLocalChecked());
    case wkbMultiPolygon: return scope.Escape(Nan::GetFunction(Nan::New(MultiPolygon::constructor)).ToLocalChecked());
    default: return scope.Escape(Nan::Null());
  }
}

/**
 * Returns the Geometry subclass that matches the
 * given WKB geometry type.
 *
 * @static
 * @method getConstructor
 * @param {Integer} type WKB geometry type ({{#crossLink "Constants
 * (wkbGeometryType)"}}available options{{/crossLink}})
 * @return Function
 */
NAN_METHOD(Geometry::getConstructor) {
  Nan::HandleScope scope;
  OGRwkbGeometryType type;
  NODE_ARG_ENUM(0, "wkbType", OGRwkbGeometryType, type);
  info.GetReturnValue().Set(getConstructor(type));
}

/**
 * Returns the Geometry subclass name that matches the
 * given WKB geometry type.
 *
 * @static
 * @method getName
 * @param {Integer} type WKB geometry type ({{#crossLink "Constants
 * (wkbGeometryType)"}}available options{{/crossLink}})
 * @return String
 */
NAN_METHOD(Geometry::getName) {
  Nan::HandleScope scope;
  OGRwkbGeometryType type;
  NODE_ARG_ENUM(0, "wkbType", OGRwkbGeometryType, type);
  info.GetReturnValue().Set(SafeString::New(OGRGeometryTypeToName(type)));
}

} // namespace node_gdal
