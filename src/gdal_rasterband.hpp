#ifndef __NODE_GDAL_RASTERBAND_H__
#define __NODE_GDAL_RASTERBAND_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// gdal
#include <gdal_priv.h>

#include "gdal_dataset.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class RasterBand : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;
  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(GDALRasterBand *band, GDALDataset *parent);
  static NAN_METHOD(toString);
  GDAL_ASYNCABLE_DECLARE(flush);
  GDAL_ASYNCABLE_DECLARE(fill);
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
  static NAN_METHOD(asMDArray);
#endif
  static NAN_METHOD(getStatistics);
  GDAL_ASYNCABLE_DECLARE(computeStatistics);
  static NAN_METHOD(setStatistics);
  static NAN_METHOD(getMaskBand);
  static NAN_METHOD(getMaskFlags);
  static NAN_METHOD(createMaskBand);
  GDAL_ASYNCABLE_DECLARE(getMetadata);
  GDAL_ASYNCABLE_DECLARE(setMetadata);
  static NAN_GETTER(dsGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(sizeGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(idGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(descriptionGetter);
  static NAN_GETTER(overviewsGetter);
  static NAN_GETTER(pixelsGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(blockSizeGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(minimumGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(maximumGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(readOnlyGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(dataTypeGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(hasArbitraryOverviewsGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(unitTypeGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(scaleGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(offsetGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(noDataValueGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(categoryNamesGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(colorInterpretationGetter);
  GDAL_ASYNCABLE_GETTER_DECLARE(colorTableGetter);
  static NAN_GETTER(uidGetter);

  static NAN_SETTER(unitTypeSetter);
  static NAN_SETTER(scaleSetter);
  static NAN_SETTER(offsetSetter);
  static NAN_SETTER(noDataValueSetter);
  static NAN_SETTER(categoryNamesSetter);
  static NAN_SETTER(colorInterpretationSetter);
  static NAN_SETTER(colorTableSetter);

  RasterBand();
  RasterBand(GDALRasterBand *band);
  inline bool isAlive() {
    return this_ && object_store.isAlive(uid);
  }
  inline GDALRasterBand *get() {
    return this_;
  }
  inline GDALDataset *getParent() {
    return parent_ds;
  }
  void dispose();
  long uid;
  // Dataset that will be locked
  long parent_uid;

    private:
  ~RasterBand();
  GDALRasterBand *this_;
  GDALDataset *parent_ds;
};

} // namespace node_gdal
#endif
