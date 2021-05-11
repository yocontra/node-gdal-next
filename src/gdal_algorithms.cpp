#include "gdal_algorithms.hpp"
#include "gdal_common.hpp"
#include "gdal_dataset.hpp"
#include "gdal_layer.hpp"
#include "gdal_rasterband.hpp"
#include "utils/number_list.hpp"

namespace node_gdal {

void Algorithms::Initialize(Local<Object> target) {
  Nan__SetAsyncableMethod(target, "fillNodata", fillNodata);
  Nan__SetAsyncableMethod(target, "contourGenerate", contourGenerate);
  Nan__SetAsyncableMethod(target, "sieveFilter", sieveFilter);
  Nan__SetAsyncableMethod(target, "checksumImage", checksumImage);
  Nan__SetAsyncableMethod(target, "polygonize", polygonize);
}

/**
 * @interface _fillOptions { src: gdal.RasterBand, mask?: gdal.RasterBand, searchDist: number, smoothingIterations?: number }
 */

/**
 * Fill raster regions by interpolation from edges.
 *
 * @throws Error
 * @method fillNodata
 * @static
 * @for gdal
 * @param {_fillOptions} options
 * @param {gdal.RasterBand} options.src This band to be updated in-place.
 * @param {gdal.RasterBand} [options.mask] Mask band
 * @param {number} options.searchDist The maximum distance (in pixels) that the algorithm will search out for values to interpolate.
 * @param {number} [options.smoothingIterations=0] The number of 3x3 average filter smoothing iterations to run after the interpolation to dampen artifacts.
 */

/**
 * Fill raster regions by interpolation from edges.
 * {{{async}}}
 *
 * @throws Error
 * @method fillNodataAsync
 * @static
 * @for gdal
 * @param {_fillOptions} options
 * @param {gdal.RasterBand} options.src This band to be updated in-place.
 * @param {gdal.RasterBand} [options.mask] Mask band
 * @param {number} options.searchDist The maximum distance (in pixels) that the algorithm will search out for values to interpolate.
 * @param {number} [options.smoothingIterations=0] The number of 3x3 average filter smoothing iterations to run after the interpolation to dampen artifacts.
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */

GDAL_ASYNCABLE_DEFINE(Algorithms::fillNodata) {
  Nan::HandleScope scope;

  Local<Object> obj;
  RasterBand *src;
  RasterBand *mask = NULL;
  double search_dist;
  int smooth_iterations = 0;
  GDALAsyncableJob<CPLErr> job;

  NODE_ARG_OBJECT(0, "options", obj);

  NODE_WRAPPED_FROM_OBJ(obj, "src", RasterBand, src);
  NODE_WRAPPED_FROM_OBJ_OPT(obj, "mask", RasterBand, mask);
  NODE_DOUBLE_FROM_OBJ(obj, "searchDist", search_dist);
  NODE_INT_FROM_OBJ_OPT(obj, "smoothIterations", smooth_iterations);

  GDALRasterBand *gdal_src = src->get();
  GDALRasterBand *gdal_mask = mask ? mask->get() : nullptr;

  long src_uid = src->parent_uid;
  long mask_uid = mask ? mask->parent_uid : 0;

  job.main = [src_uid, mask_uid, gdal_src, gdal_mask, search_dist, smooth_iterations]() {
    GDAL_ASYNCABLE_LOCK_MANY(src_uid, mask_uid);
    CPLErr err = GDALFillNodata(gdal_src, gdal_mask, search_dist, 0, smooth_iterations, NULL, NULL, NULL);
    GDAL_UNLOCK_MANY;
    if (err) { throw CPLGetLastErrorMsg(); }
    return err;
  };
  job.rval = [](CPLErr r, GDAL_ASYNCABLE_OBJS) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 1);
}

/**
 * @interface _contourOptions { src: gdal.RasterBand, dst: gdal.Layer, offset?: number, interval?: number, fixedLevels?: number, nodata?: number, idField?: number, elevField?: number }
 */

/**
 * Create vector contours from raster DEM.
 *
 * This algorithm will generate contour vectors for the input raster band on the
 * requested set of contour levels. The vector contours are written to the
 * passed in vector layer. Also, a NODATA value may be specified to identify
 * pixels that should not be considered in contour line generation.
 *
 * @throws Error
 * @method contourGenerate
 * @static
 * @for gdal
 * @param {_contourOptions} options
 * @param {gdal.RasterBand} options.src
 * @param {gdal.Layer} options.dst
 * @param {number} [options.offset=0] The "offset" relative to which contour intervals are applied. This is normally zero, but could be different. To generate 10m contours at 5, 15, 25, ... the offset would be 5.
 * @param {number} [options.interval=100] The elevation interval between contours generated.
 * @param {number[]} [options.fixedLevels] A list of fixed contour levels at which contours should be generated. Overrides interval/base options if set.
 * @param {number} [options.nodata] The value to use as a "nodata" value. That is, a pixel value which should be ignored in generating contours as if the value of the pixel were not known.
 * @param {number} [options.idField] A field index to indicate where a unique id should be written for each feature (contour) written.
 * @param {number} [options.elevField] A field index to indicate where the elevation value of the contour should be written.
 */

/**
 * Create vector contours from raster DEM.
 * {{{async}}}
 *
 * This algorithm will generate contour vectors for the input raster band on the
 * requested set of contour levels. The vector contours are written to the
 * passed in vector layer. Also, a NODATA value may be specified to identify
 * pixels that should not be considered in contour line generation.
 *
 * @throws Error
 * @method contourGenerateAsync
 * @static
 * @for gdal
 * @param {_contourOptions} options
 * @param {gdal.RasterBand} options.src
 * @param {gdal.Layer} options.dst
 * @param {number} [options.offset=0] The "offset" relative to which contour intervals are applied. This is normally zero, but could be different. To generate 10m contours at 5, 15, 25, ... the offset would be 5.
 * @param {number} [options.interval=100] The elevation interval between contours generated.
 * @param {number[]} [options.fixedLevels] A list of fixed contour levels at which contours should be generated. Overrides interval/base options if set.
 * @param {number} [options.nodata] The value to use as a "nodata" value. That is, a pixel value which should be ignored in generating contours as if the value of the pixel were not known.
 * @param {number} [options.idField] A field index to indicate where a unique id should be written for each feature (contour) written.
 * @param {number} [options.elevField] A field index to indicate where the elevation value of the contour should be written.
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(Algorithms::contourGenerate) {
  Nan::HandleScope scope;

  Local<Object> obj;
  Local<Value> prop;
  RasterBand *src;
  Layer *dst;
  double interval = 100, base = 0;
  double *fixed_levels = NULL;
  DoubleList fixed_level_array;
  int n_fixed_levels = 0;
  int use_nodata = 0;
  double nodata = 0;
  int id_field = -1, elev_field = -1;

  NODE_ARG_OBJECT(0, "options", obj);

  NODE_WRAPPED_FROM_OBJ(obj, "src", RasterBand, src);
  NODE_WRAPPED_FROM_OBJ(obj, "dst", Layer, dst);
  NODE_INT_FROM_OBJ_OPT(obj, "idField", id_field);
  NODE_INT_FROM_OBJ_OPT(obj, "elevField", elev_field);
  NODE_DOUBLE_FROM_OBJ_OPT(obj, "interval", interval);
  NODE_DOUBLE_FROM_OBJ_OPT(obj, "offset", base);
  if (Nan::HasOwnProperty(obj, Nan::New("fixedLevels").ToLocalChecked()).FromMaybe(false)) {
    if (fixed_level_array.parse(Nan::Get(obj, Nan::New("fixedLevels").ToLocalChecked()).ToLocalChecked())) {
      return; // error parsing double list
    } else {
      fixed_levels = fixed_level_array.get();
      n_fixed_levels = fixed_level_array.length();
    }
  }
  if (Nan::HasOwnProperty(obj, Nan::New("nodata").ToLocalChecked()).FromMaybe(false)) {
    prop = Nan::Get(obj, Nan::New("nodata").ToLocalChecked()).ToLocalChecked();
    if (prop->IsNumber()) {
      use_nodata = 1;
      nodata = Nan::To<double>(prop).ToChecked();
    } else if (!prop->IsNull() && !prop->IsUndefined()) {
      Nan::ThrowTypeError("nodata property must be a number");
    }
  }

  GDALRasterBand *gdal_src = src->get();
  OGRLayer *gdal_dst = dst->get();

  long src_uid = src->parent_uid;
  long dst_uid = dst->parent_uid;

  GDALAsyncableJob<CPLErr> job;
  job.main = [src_uid,
              dst_uid,
              gdal_src,
              interval,
              base,
              n_fixed_levels,
              fixed_levels,
              use_nodata,
              nodata,
              gdal_dst,
              id_field,
              elev_field]() {
    GDAL_ASYNCABLE_LOCK_MANY(src_uid, dst_uid);
    CPLErr err = GDALContourGenerate(
      gdal_src,
      interval,
      base,
      n_fixed_levels,
      fixed_levels,
      use_nodata,
      nodata,
      gdal_dst,
      id_field,
      elev_field,
      NULL,
      NULL);
    GDAL_UNLOCK_MANY;
    if (err) { throw CPLGetLastErrorMsg(); }
    return err;
  };
  job.rval = [](CPLErr r, GDAL_ASYNCABLE_OBJS) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 1);
}

/**
 * @interface _sieveOptions { src: gdal.RasterBand, dst: gdal.RasterBand, mask?: gdal.RasterBand, threshold: number, connectedness?: number }
 */

/**
 * Removes small raster polygons.
 *
 * @throws Error
 * @method sieveFilter
 * @static
 * @for gdal
 * @param {_sieveOptions} options
 * @param {gdal.RasterBand} options.src
 * @param {gdal.RasterBand} options.dst Output raster band. It may be the same as src band to update the source in place.
 * @param {gdal.RasterBand} [options.mask] All pixels in the mask band with a value other than zero will be considered suitable for inclusion in polygons.
 * @param {number} options.threshold Raster polygons with sizes smaller than this will be merged into their largest neighbour.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 */

/**
 * Removes small raster polygons.
 * {{{async}}}
 *
 * @throws Error
 * @method sieveFilterAsync
 * @static
 * @for gdal
 * @param {_sieveOptions} options
 * @param {gdal.RasterBand} options.src
 * @param {gdal.RasterBand} options.dst Output raster band. It may be the same as src band to update the source in place.
 * @param {gdal.RasterBand} [options.mask] All pixels in the mask band with a value other than zero will be considered suitable for inclusion in polygons.
 * @param {number} options.threshold Raster polygons with sizes smaller than this will be merged into their largest neighbour.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(Algorithms::sieveFilter) {
  Nan::HandleScope scope;

  Local<Object> obj;
  RasterBand *src;
  RasterBand *dst;
  RasterBand *mask = NULL;
  int threshold;
  int connectedness = 4;

  NODE_ARG_OBJECT(0, "options", obj);

  NODE_WRAPPED_FROM_OBJ(obj, "src", RasterBand, src);
  NODE_WRAPPED_FROM_OBJ(obj, "dst", RasterBand, dst);
  NODE_WRAPPED_FROM_OBJ_OPT(obj, "mask", RasterBand, mask);
  NODE_INT_FROM_OBJ(obj, "threshold", threshold);
  NODE_INT_FROM_OBJ_OPT(obj, "connectedness", connectedness);

  if (connectedness != 4 && connectedness != 8) {
    Nan::ThrowError("connectedness option must be 4 or 8");
    return;
  }

  GDALRasterBand *gdal_src = src->get();
  GDALRasterBand *gdal_dst = dst->get();
  GDALRasterBand *gdal_mask = mask ? mask->get() : nullptr;

  long src_uid = src->parent_uid;
  long dst_uid = dst->parent_uid;
  long mask_uid = mask ? mask->parent_uid : 0;

  GDALAsyncableJob<CPLErr> job;
  job.main = [src_uid, dst_uid, mask_uid, gdal_src, gdal_dst, gdal_mask, threshold, connectedness]() {
    GDAL_ASYNCABLE_LOCK_MANY(src_uid, dst_uid, mask_uid);
    CPLErr err = GDALSieveFilter(gdal_src, gdal_mask, gdal_dst, threshold, connectedness, NULL, NULL, NULL);
    GDAL_UNLOCK_MANY;
    if (err) { throw CPLGetLastErrorMsg(); }
    return err;
  };
  job.rval = [](CPLErr r, GDAL_ASYNCABLE_OBJS) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 1);
}

/**
 * Compute checksum for image region.
 *
 * @throws Error
 * @method checksumImage
 * @static
 * @for gdal
 * @param {gdal.RasterBand} src
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [w=src.width]
 * @param {number} [h=src.height]
 * @return {number}
 */

/**
 * Compute checksum for image region.
 *
 * @throws Error
 * @method checksumImageAsync
 * @static
 * @for gdal
 * @param {gdal.RasterBand} src
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [w=src.width]
 * @param {number} [h=src.height]
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {number}
 * @return {Promise<number>}
 */

GDAL_ASYNCABLE_DEFINE(Algorithms::checksumImage) {
  Nan::HandleScope scope;

  RasterBand *src;
  int x = 0, y = 0, w, h, bandw, bandh;

  NODE_ARG_WRAPPED(0, "src", RasterBand, src);

  w = bandw = src->get()->GetXSize();
  h = bandh = src->get()->GetYSize();

  NODE_ARG_INT_OPT(1, "x", x);
  NODE_ARG_INT_OPT(2, "y", y);
  NODE_ARG_INT_OPT(3, "xSize", w);
  NODE_ARG_INT_OPT(4, "ySize", h);

  if (x < 0 || y < 0 || x >= bandw || y >= bandh) {
    Nan::ThrowRangeError("offset invalid for given band");
    return;
  }
  if (w < 0 || h < 0 || w > bandw || h > bandh) {
    Nan::ThrowRangeError("x and y size must be smaller than band dimensions and greater than 0");
    return;
  }
  if (x + w - 1 >= bandw || y + h - 1 >= bandh) {
    Nan::ThrowRangeError("given range is outside bounds of given band");
    return;
  }

  GDALRasterBand *gdal_src = src->get();
  long src_uid = src->parent_uid;

  GDALAsyncableJob<int> job;

  job.main = [src_uid, gdal_src, x, y, w, h]() {
    GDAL_ASYNCABLE_LOCK(src_uid);
    int r = GDALChecksumImage(gdal_src, x, y, w, h);
    GDAL_UNLOCK_PARENT;
    return r;
  };
  job.rval = [](int r, GDAL_ASYNCABLE_OBJS) { return Nan::New<Integer>(r); };
  job.run(info, async, 5);
}

/**
 * @interface _polygonizeOptions { src: gdal.RasterBand, dst: gdal.Layer, mask?: gdal.RasterBand, pixValField: number, connectedness?: number, useFloats?:boolean }
 */

/**
 * Creates vector polygons for all connected regions of pixels in the raster
 * sharing a common pixel value. Each polygon is created with an attribute
 * indicating the pixel value of that polygon. A raster mask may also be
 * provided to determine which pixels are eligible for processing.
 *
 * @throws Error
 * @method polygonize
 * @static
 * @for gdal
 * @param {_polygonizeOptions} options
 * @param {gdal.RasterBand} options.src
 * @param {gdal.Layer} options.dst
 * @param {gdal.RasterBand} [options.mask]
 * @param {number} options.pixValField The attribute field index indicating the feature attribute into which the pixel value of the polygon should be written.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {boolean} [options.useFloats=false] Use floating point buffers instead of int buffers.
 */

/**
 * Creates vector polygons for all connected regions of pixels in the raster
 * sharing a common pixel value. Each polygon is created with an attribute
 * indicating the pixel value of that polygon. A raster mask may also be
 * provided to determine which pixels are eligible for processing.
 *
 * @throws Error
 * @method polygonizeAsync
 * @static
 * @for gdal
 * @param {_polygonizeOptions} options
 * @param {gdal.RasterBand} options.src
 * @param {gdal.Layer} options.dst
 * @param {gdal.RasterBand} [options.mask]
 * @param {number} options.pixValField The attribute field index indicating the feature attribute into which the pixel value of the polygon should be written.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {boolean} [options.useFloats=false] Use floating point buffers instead of int buffers.
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(Algorithms::polygonize) {
  Nan::HandleScope scope;

  Local<Object> obj;
  RasterBand *src;
  RasterBand *mask = NULL;
  Layer *dst;
  int connectedness = 4;
  int pix_val_field = 0;
  char **papszOptions = NULL;

  NODE_ARG_OBJECT(0, "options", obj);

  NODE_WRAPPED_FROM_OBJ(obj, "src", RasterBand, src);
  NODE_WRAPPED_FROM_OBJ(obj, "dst", Layer, dst);
  NODE_WRAPPED_FROM_OBJ_OPT(obj, "mask", RasterBand, mask);
  NODE_INT_FROM_OBJ_OPT(obj, "connectedness", connectedness)
  NODE_INT_FROM_OBJ(obj, "pixValField", pix_val_field);

  if (connectedness == 8) {
    papszOptions = CSLSetNameValue(papszOptions, "8CONNECTED", "8");
  } else if (connectedness != 4) {
    Nan::ThrowError("connectedness must be 4 or 8");
    return;
  }

  GDALRasterBand *gdal_src = src->get();
  OGRLayer *gdal_dst = dst->get();
  GDALRasterBand *gdal_mask = mask ? mask->get() : nullptr;

  long src_uid = src->parent_uid;
  long dst_uid = dst->parent_uid;
  long mask_uid = mask ? mask->parent_uid : 0;

  GDALAsyncableJob<CPLErr> job;

  if (
    Nan::HasOwnProperty(obj, Nan::New("useFloats").ToLocalChecked()).FromMaybe(false) &&
    Nan::To<bool>(Nan::Get(obj, Nan::New("useFloats").ToLocalChecked()).ToLocalChecked()).ToChecked()) {
    job.main = [src_uid, dst_uid, mask_uid, gdal_src, gdal_mask, gdal_dst, pix_val_field, papszOptions]() {
      GDAL_ASYNCABLE_LOCK_MANY(src_uid, dst_uid, mask_uid);
      CPLErr err = GDALFPolygonize(
        gdal_src, gdal_mask, reinterpret_cast<OGRLayerH>(gdal_dst), pix_val_field, papszOptions, NULL, NULL);
      GDAL_UNLOCK_MANY;
      if (papszOptions) CSLDestroy(papszOptions);
      if (err) throw CPLGetLastErrorMsg();
      return err;
    };
  } else {
    job.main = [src_uid, dst_uid, mask_uid, gdal_src, gdal_mask, gdal_dst, pix_val_field, papszOptions]() {
      GDAL_ASYNCABLE_LOCK_MANY(src_uid, dst_uid, mask_uid);
      CPLErr err = GDALPolygonize(
        gdal_src, gdal_mask, reinterpret_cast<OGRLayerH>(gdal_dst), pix_val_field, papszOptions, NULL, NULL);
      GDAL_UNLOCK_MANY;
      if (papszOptions) CSLDestroy(papszOptions);
      if (err) throw CPLGetLastErrorMsg();
      return err;
    };
  }
  job.rval = [](CPLErr r, GDAL_ASYNCABLE_OBJS) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 1);
}
} // namespace node_gdal
