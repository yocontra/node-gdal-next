
#include "gdal_geometrycollection.hpp"
#include "../collections/geometry_collection_children.hpp"
#include "../gdal_common.hpp"
#include "gdal_geometry.hpp"

#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> GeometryCollection::constructor;

/**
 * A collection of 1 or more geometry objects.
 *
 * @constructor
 * @class GeometryCollection
 * @extends Geometry
 */
void GeometryCollection::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(GeometryCollection::New);
  lcons->Inherit(Nan::New(Geometry::constructor));
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("GeometryCollection").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "getArea", getArea);
  Nan::SetPrototypeMethod(lcons, "getLength", getLength);

  ATTR(lcons, "children", childrenGetter, READ_ONLY_SETTER);

  Nan::Set(target, Nan::New("GeometryCollection").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

NAN_METHOD(GeometryCollection::toString) {
  info.GetReturnValue().Set(Nan::New("GeometryCollection").ToLocalChecked());
}

/**
 * Computes the combined area of the geometries.
 *
 * @method getArea
 * @instance
 * @memberof GeometryCollection
 * @return {number}
 */
NODE_WRAPPED_METHOD_WITH_RESULT(GeometryCollection, getArea, Number, get_Area);

/**
 * Compute the length of a multicurve.
 *
 * @method getLength
 * @instance
 * @memberof GeometryCollection
 * @return {number}
 */
NODE_WRAPPED_METHOD_WITH_RESULT(GeometryCollection, getLength, Number, get_Length);

/**
 * All geometries represented by this collection.
 *
 * @kind member
 * @name children
 * @instance
 * @memberof GeometryCollection
 * @type {GeometryCollectionChildren}
 */
NAN_GETTER(GeometryCollection::childrenGetter) {
  info.GetReturnValue().Set(Nan::GetPrivate(info.This(), Nan::New("children_").ToLocalChecked()).ToLocalChecked());
}

} // namespace node_gdal
