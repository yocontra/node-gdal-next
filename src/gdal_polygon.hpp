#ifndef __NODE_OGR_POLY_H__
#define __NODE_OGR_POLY_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

#include "gdal_geometry.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class Polygon : public Geometry {

    public:
  static Nan::Persistent<FunctionTemplate> constructor;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(OGRPolygon *geom);
  static Local<Value> New(OGRPolygon *geom, bool owned);
  static NAN_METHOD(toString);
  static NAN_METHOD(getArea);

  static NAN_GETTER(ringsGetter);

  Polygon();
  Polygon(OGRPolygon *geom);
  inline OGRPolygon *get() {
    return this_;
  }
  inline bool isAlive() {
    return this_;
  }

    protected:
  ~Polygon();
    private:
  OGRPolygon *this_;
};

} // namespace node_gdal
#endif
