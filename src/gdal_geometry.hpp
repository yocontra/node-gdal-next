#ifndef __NODE_OGR_GEOMETRY_H__
#define __NODE_OGR_GEOMETRY_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

#include "async.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

#define UPDATE_AMOUNT_OF_GEOMETRY_MEMORY(geom)                                                                       \
{                                                                                                                    \
  int new_size = geom->this_->WkbSize();                                                                             \
  if (geom->owned_) Nan::AdjustExternalMemory(new_size - geom->size_);                                               \
  geom->size_ = new_size;                                                                                            \
}

template <class T, class OGRT> class GeometryBase : public Nan::ObjectWrap {
    public:
  static Local<Value> New(OGRT *geom);
  static Local<Value> New(OGRT *geom, bool owned);

  GeometryBase();
  GeometryBase(OGRT *geom);
  inline OGRT *get() {
    return this_;
  }
  inline bool isAlive() {
    return this_;
  }

    protected:
  ~GeometryBase();
  OGRT *this_;
  bool owned_;
  int size_;
  uv_sem_t *async_lock;
};

template <class T, class OGRT> Local<Value> GeometryBase<T, OGRT>::New(OGRT *geom) {
  Nan::EscapableHandleScope scope;
  return scope.Escape(T::New(geom, true));
}

template <class T, class OGRT> Local<Value> GeometryBase<T, OGRT>::New(OGRT *geom, bool owned) {
  Nan::EscapableHandleScope scope;

  if (!geom) { return scope.Escape(Nan::Null()); }

  // make a copy of geometry owned by a feature
  // + no need to track when a feature is destroyed
  // + no need to throw errors when a method trys to modify an owned read-only
  // geometry
  // - is slower

  if (!owned) { geom = static_cast<OGRT *>(geom->clone()); }

  T *wrapped = new T(geom);
  wrapped->owned_ = true;

  UPDATE_AMOUNT_OF_GEOMETRY_MEMORY(wrapped);

  Local<Value> ext = Nan::New<External>(wrapped);
  Local<Object> obj =
    Nan::NewInstance(Nan::GetFunction(Nan::New(T::constructor)).ToLocalChecked(), 1, &ext).ToLocalChecked();

  return scope.Escape(obj);
}

template <class T, class OGRT> GeometryBase<T, OGRT>::GeometryBase(OGRT *geom) : Nan::ObjectWrap(), this_(geom), owned_(true), size_(0) {
  LOG("Created Geometry %s [%p]", typeid(T).name(), geom);
  // The async locks must live outside the V8 memory management,
  // otherwise they won't be accessible from the async threads
  async_lock = new uv_sem_t;
  uv_sem_init(async_lock, 1);
}

template <class T, class OGRT> GeometryBase<T, OGRT>::GeometryBase() : Nan::ObjectWrap(), this_(NULL), owned_(true), size_(0) {
  async_lock = new uv_sem_t;
  uv_sem_init(async_lock, 1);
}

template <class T, class OGRT> GeometryBase<T, OGRT>::~GeometryBase() {
  if (this_) {
    LOG("Disposing Geometry %s [%p] (%s)", typeid(T).name(), this_, owned_ ? "owned" : "unowned");
    if (owned_) {
      OGRGeometryFactory::destroyGeometry(this_);
      Nan::AdjustExternalMemory(-size_);
    }
    LOG("Disposed Geometry [%p]", this_)
    this_ = NULL;
  }
  uv_sem_destroy(async_lock);
  delete async_lock;
}

class Geometry : public GeometryBase<Geometry, OGRGeometry> {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  using GeometryBase<Geometry, OGRGeometry>::GeometryBase;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  using GeometryBase<Geometry, OGRGeometry>::New;
  static Local<Value> New(OGRGeometry *geom, bool owned);
  static NAN_METHOD(toString);
  GDAL_ASYNCABLE_DECLARE(isEmpty);
  GDAL_ASYNCABLE_DECLARE(isValid);
  GDAL_ASYNCABLE_DECLARE(isSimple);
  GDAL_ASYNCABLE_DECLARE(isRing);
  static NAN_METHOD(clone);
  GDAL_ASYNCABLE_DECLARE(empty);
  GDAL_ASYNCABLE_DECLARE(exportToKML);
  GDAL_ASYNCABLE_DECLARE(exportToGML);
  GDAL_ASYNCABLE_DECLARE(exportToJSON);
  GDAL_ASYNCABLE_DECLARE(exportToWKT);
  GDAL_ASYNCABLE_DECLARE(exportToWKB);
  GDAL_ASYNCABLE_DECLARE(closeRings);
  GDAL_ASYNCABLE_DECLARE(segmentize);
  GDAL_ASYNCABLE_DECLARE(intersects);
  GDAL_ASYNCABLE_DECLARE(equals);
  GDAL_ASYNCABLE_DECLARE(disjoint);
  GDAL_ASYNCABLE_DECLARE(touches);
  GDAL_ASYNCABLE_DECLARE(crosses);
  GDAL_ASYNCABLE_DECLARE(within);
  GDAL_ASYNCABLE_DECLARE(contains);
  GDAL_ASYNCABLE_DECLARE(overlaps);
  GDAL_ASYNCABLE_DECLARE(boundary);
  GDAL_ASYNCABLE_DECLARE(distance);
  GDAL_ASYNCABLE_DECLARE(convexHull);
  GDAL_ASYNCABLE_DECLARE(buffer);
  GDAL_ASYNCABLE_DECLARE(intersection);
  GDAL_ASYNCABLE_DECLARE(unionGeometry);
  GDAL_ASYNCABLE_DECLARE(difference);
  GDAL_ASYNCABLE_DECLARE(symDifference);
  GDAL_ASYNCABLE_DECLARE(centroid);
  GDAL_ASYNCABLE_DECLARE(simplify);
  GDAL_ASYNCABLE_DECLARE(simplifyPreserveTopology);
  GDAL_ASYNCABLE_DECLARE(polygonize);
  GDAL_ASYNCABLE_DECLARE(swapXY);
  static NAN_METHOD(getNumGeometries);
  GDAL_ASYNCABLE_DECLARE(getEnvelope);
  GDAL_ASYNCABLE_DECLARE(getEnvelope3D);
  GDAL_ASYNCABLE_DECLARE(flattenTo2D);
  GDAL_ASYNCABLE_DECLARE(transform);
  GDAL_ASYNCABLE_DECLARE(transformTo);

  // static constructor methods
  GDAL_ASYNCABLE_DECLARE(create);
  GDAL_ASYNCABLE_DECLARE(createFromWkt);
  GDAL_ASYNCABLE_DECLARE(createFromWkb);
  GDAL_ASYNCABLE_DECLARE(createFromGeoJson);
  static NAN_METHOD(getName);
  static NAN_METHOD(getConstructor);

  static NAN_GETTER(srsGetter);
  static NAN_GETTER(typeGetter);
  static NAN_GETTER(nameGetter);
  static NAN_GETTER(wkbSizeGetter);
  static NAN_GETTER(dimensionGetter);
  static NAN_GETTER(coordinateDimensionGetter);

  static NAN_SETTER(srsSetter);
  static NAN_SETTER(coordinateDimensionSetter);

  static OGRwkbGeometryType getGeometryType_fixed(OGRGeometry *geom);
  static Local<Value> getConstructor(OGRwkbGeometryType type);
};

} // namespace node_gdal
#endif
