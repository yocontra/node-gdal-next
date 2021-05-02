#ifndef __NODE_OGR_GEOMETRYCOLLECTION_H__
#define __NODE_OGR_GEOMETRYCOLLECTION_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

using namespace v8;
using namespace node;

#include "gdal_geometry.hpp"
#include "collections/geometry_collection_children.hpp"

namespace node_gdal {

template <class T, class OGRT> class GeometryCollectionBase : public GeometryBase<T, OGRT> {
    public:
  using GeometryBase<T, OGRT>::GeometryBase;
  static NAN_METHOD(New);
  using GeometryBase<T, OGRT>::New;
};

template <class T, class OGRT> NAN_METHOD((GeometryCollectionBase<T, OGRT>::New)) {
  Nan::HandleScope scope;
  T *f;

  if (!info.IsConstructCall()) {
    Nan::ThrowError("Cannot call constructor as function, you need to use 'new' keyword");
    return;
  }

  if (info[0]->IsExternal()) {
    Local<External> ext = info[0].As<External>();
    void *ptr = ext->Value();
    f = static_cast<T *>(ptr);

  } else {
    if (info.Length() != 0) {
      Nan::ThrowError("GeometryCollection constructor doesn't take any arguments");
      return;
    }
    f = new T(new OGRT());
  }

  Local<Value> children = GeometryCollectionChildren::New(info.This());
  Nan::SetPrivate(info.This(), Nan::New("children_").ToLocalChecked(), children);

  f->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

class GeometryCollection : public GeometryCollectionBase<GeometryCollection, OGRGeometryCollection> {

    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using GeometryCollectionBase<GeometryCollection, OGRGeometryCollection>::GeometryCollectionBase;

  static void Initialize(Local<Object> target);
  using GeometryCollectionBase<GeometryCollection, OGRGeometryCollection>::New;
  static NAN_METHOD(toString);
  static NAN_METHOD(getArea);
  static NAN_METHOD(getLength);

  static NAN_GETTER(childrenGetter);
};

} // namespace node_gdal
#endif
