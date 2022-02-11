
#include "gdal_multipoint.hpp"
#include "../collections/geometry_collection_children.hpp"
#include "../gdal_common.hpp"
#include "gdal_geometry.hpp"
#include "gdal_geometrycollection.hpp"
#include "gdal_point.hpp"

#include <stdlib.h>

namespace node_gdal {

Nan::Persistent<FunctionTemplate> MultiPoint::constructor;

void MultiPoint::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(MultiPoint::New);
  lcons->Inherit(Nan::New(GeometryCollection::constructor));
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("MultiPoint").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);

  Nan::Set(target, Nan::New("MultiPoint").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

/**
 * @constructor
 * @class MultiPoint
 * @extends GeometryCollection
 */

NAN_METHOD(MultiPoint::toString) {
  info.GetReturnValue().Set(Nan::New("MultiPoint").ToLocalChecked());
}

} // namespace node_gdal
