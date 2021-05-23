#ifndef __NODE_OGR_COORDINATETRANSFORMATION_H__
#define __NODE_OGR_COORDINATETRANSFORMATION_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// ogr
#include <ogrsf_frmts.h>

// gdal
#include <gdalwarper.h>

using namespace v8;
using namespace node;

namespace node_gdal {

class GeoTransformTransformer;

class CoordinateTransformation : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(OGRCoordinateTransformation *transform);
  static NAN_METHOD(toString);
  static NAN_METHOD(transformPoint);

  CoordinateTransformation();
  CoordinateTransformation(OGRCoordinateTransformation *srs);
  CoordinateTransformation(GeoTransformTransformer *srs, bool geoTransform);
  inline OGRCoordinateTransformation *get() {
    return this_;
  }
  inline bool isAlive() {
    return this_;
  }

    private:
  ~CoordinateTransformation();
  OGRCoordinateTransformation *this_;
  bool geoTransform;
};

// adapted from gdalwarp source

class GeoTransformTransformer : public OGRCoordinateTransformation {
    public:
  void *hSrcImageTransformer = nullptr;

  virtual OGRSpatialReference *GetSourceCS() override {
    return nullptr;
  }
  virtual OGRSpatialReference *GetTargetCS() override {
    return nullptr;
  }

  // only used on GDAL 2.X
  virtual int TransformEx(int nCount, double *x, double *y, double *z = NULL, int *pabSuccess = NULL) {
    return GDALGenImgProjTransform(hSrcImageTransformer, TRUE, nCount, x, y, z, pabSuccess);
  }

  virtual int Transform(int nCount, double *x, double *y, double *z = NULL) {
    int nResult;

    int *pabSuccess = (int *)CPLCalloc(sizeof(int), nCount);
    nResult = Transform(nCount, x, y, z, pabSuccess);
    CPLFree(pabSuccess);

    return nResult;
  }

  // GDAL 3.x+
  virtual int Transform(int nCount, double *x, double *y, double *z, int *pabSuccess) {
    return GDALGenImgProjTransform(hSrcImageTransformer, TRUE, nCount, x, y, z, pabSuccess);
  }

  // Latest GDAL
  virtual int Transform(int nCount, double *x, double *y, double *z, double * /* t */, int *pabSuccess) {
    return GDALGenImgProjTransform(hSrcImageTransformer, TRUE, nCount, x, y, z, pabSuccess);
  }

#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 3)
  // FIXME
  // This happens because we are not supposed to be using OGRCoordinateTransformation
  // This is a temporary hack that works because node-gdal-async doesn't use GetInverse()
  virtual OGRCoordinateTransformation *GetInverse() const override {
    return nullptr;
  }
#endif

  virtual OGRCoordinateTransformation *Clone() const {
    return new GeoTransformTransformer(*this);
  }

  ~GeoTransformTransformer() {
    if (hSrcImageTransformer) {
      GDALDestroyGenImgProjTransformer(hSrcImageTransformer);
      hSrcImageTransformer = nullptr;
    }
  }
};
} // namespace node_gdal
#endif
