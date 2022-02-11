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
  Nan__SetAsyncableMethod(target, "_acquireLocks", _acquireLocks);
}

/**
 * @typedef {object} FillOptions
 * @property {RasterBand} src
 * @property {RasterBand} [mask]
 * @property {number} searchDist
 * @property {number} [smoothingIterations]
 */

/**
 * Fill raster regions by interpolation from edges.
 *
 * @throws Error
 * @method fillNodata
 * @static
 * @param {FillOptions} options
 * @param {RasterBand} options.src This band to be updated in-place.
 * @param {RasterBand} [options.mask] Mask band
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
 * @param {FillOptions} options
 * @param {RasterBand} options.src This band to be updated in-place.
 * @param {RasterBand} [options.mask] Mask band
 * @param {number} options.searchDist The maximum distance (in pixels) that the algorithm will search out for values to interpolate.
 * @param {number} [options.smoothingIterations=0] The number of 3x3 average filter smoothing iterations to run after the interpolation to dampen artifacts.
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */

GDAL_ASYNCABLE_DEFINE(Algorithms::fillNodata) {
  Local<Object> obj;
  RasterBand *src;
  RasterBand *mask = NULL;
  double search_dist;
  int smooth_iterations = 0;

  NODE_ARG_OBJECT(0, "options", obj);

  NODE_WRAPPED_FROM_OBJ(obj, "src", RasterBand, src);
  NODE_WRAPPED_FROM_OBJ_OPT(obj, "mask", RasterBand, mask);
  NODE_DOUBLE_FROM_OBJ(obj, "searchDist", search_dist);
  NODE_INT_FROM_OBJ_OPT(obj, "smoothIterations", smooth_iterations);

  GDALRasterBand *gdal_src = src->get();
  GDALRasterBand *gdal_mask = mask ? mask->get() : nullptr;

  std::vector<long> ds_uids = {src->parent_uid};
  if (mask) ds_uids.push_back(mask->parent_uid);

  GDALAsyncableJob<CPLErr> job(ds_uids);
  job.persist(src->handle());
  if (mask) job.persist(mask->handle());
  job.main = [gdal_src, gdal_mask, search_dist, smooth_iterations](const GDALExecutionProgress &) {
    CPLErrorReset();
    CPLErr err = GDALFillNodata(gdal_src, gdal_mask, search_dist, 0, smooth_iterations, NULL, NULL, NULL);
    if (err) { throw CPLGetLastErrorMsg(); }
    return err;
  };
  job.rval = [](CPLErr r, const GetFromPersistentFunc &) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 1);
}

/**
 * @typedef {object} ContourOptions
 * @property {RasterBand} src
 * @property {Layer} dst
 * @property {number} [offset]
 * @property {number} [interval]
 * @property {number[]} [fixedLevels]
 * @property {number} [nodata]
 * @property {number} [idField]
 * @property {number} [elevField]
 * @property {ProgressCb} [progress_cb]
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
 * @param {ContourOptions} options
 * @param {RasterBand} options.src
 * @param {Layer} options.dst
 * @param {number} [options.offset=0] The "offset" relative to which contour intervals are applied. This is normally zero, but could be different. To generate 10m contours at 5, 15, 25, ... the offset would be 5.
 * @param {number} [options.interval=100] The elevation interval between contours generated.
 * @param {number[]} [options.fixedLevels] A list of fixed contour levels at which contours should be generated. Overrides interval/base options if set.
 * @param {number} [options.nodata] The value to use as a "nodata" value. That is, a pixel value which should be ignored in generating contours as if the value of the pixel were not known.
 * @param {number} [options.idField] A field index to indicate where a unique id should be written for each feature (contour) written.
 * @param {number} [options.elevField] A field index to indicate where the elevation value of the contour should be written.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
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
 * @param {ContourOptions} options
 * @param {RasterBand} options.src
 * @param {Layer} options.dst
 * @param {number} [options.offset=0] The "offset" relative to which contour intervals are applied. This is normally zero, but could be different. To generate 10m contours at 5, 15, 25, ... the offset would be 5.
 * @param {number} [options.interval=100] The elevation interval between contours generated.
 * @param {number[]} [options.fixedLevels] A list of fixed contour levels at which contours should be generated. Overrides interval/base options if set.
 * @param {number} [options.nodata] The value to use as a "nodata" value. That is, a pixel value which should be ignored in generating contours as if the value of the pixel were not known.
 * @param {number} [options.idField] A field index to indicate where a unique id should be written for each feature (contour) written.
 * @param {number} [options.elevField] A field index to indicate where the elevation value of the contour should be written.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(Algorithms::contourGenerate) {
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
  Nan::Callback *progress_cb = nullptr;

  NODE_ARG_OBJECT(0, "options", obj);

  NODE_WRAPPED_FROM_OBJ(obj, "src", RasterBand, src);
  NODE_WRAPPED_FROM_OBJ(obj, "dst", Layer, dst);
  NODE_INT_FROM_OBJ_OPT(obj, "idField", id_field);
  NODE_INT_FROM_OBJ_OPT(obj, "elevField", elev_field);
  NODE_DOUBLE_FROM_OBJ_OPT(obj, "interval", interval);
  NODE_DOUBLE_FROM_OBJ_OPT(obj, "offset", base);
  NODE_CB_FROM_OBJ_OPT(obj, "progress_cb", progress_cb);
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

  GDALAsyncableJob<CPLErr> job({src_uid, dst_uid});
  job.progress = progress_cb;
  job.main = [gdal_src,
              interval,
              base,
              n_fixed_levels,
              fixed_levels,
              use_nodata,
              nodata,
              gdal_dst,
              id_field,
              elev_field,
              progress_cb](const GDALExecutionProgress &progress) {
    CPLErrorReset();
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
      progress_cb ? ProgressTrampoline : nullptr,
      progress_cb ? (void *)&progress : nullptr);
    if (err) { throw CPLGetLastErrorMsg(); }
    return err;
  };
  job.rval = [](CPLErr r, const GetFromPersistentFunc &) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 1);
}

/**
 * @typedef {object} SieveOptions
 * @property {RasterBand} src
 * @property {RasterBand} dst
 * @property {RasterBand} [mask]
 * @property {number} threshold
 * @property {number} [connectedness]
 * @property {ProgressCb} [progress_cb]
 */

/**
 * Removes small raster polygons.
 *
 * @throws Error
 * @method sieveFilter
 * @static
 * @param {SieveOptions} options
 * @param {RasterBand} options.src
 * @param {RasterBand} options.dst Output raster band. It may be the same as src band to update the source in place.
 * @param {RasterBand} [options.mask] All pixels in the mask band with a value other than zero will be considered suitable for inclusion in polygons.
 * @param {number} options.threshold Raster polygons with sizes smaller than this will be merged into their largest neighbour.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 */

/**
 * Removes small raster polygons.
 * {{{async}}}
 *
 * @throws Error
 * @method sieveFilterAsync
 * @static
 * @param {SieveOptions} options
 * @param {RasterBand} options.src
 * @param {RasterBand} options.dst Output raster band. It may be the same as src band to update the source in place.
 * @param {RasterBand} [options.mask] All pixels in the mask band with a value other than zero will be considered suitable for inclusion in polygons.
 * @param {number} options.threshold Raster polygons with sizes smaller than this will be merged into their largest neighbour.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(Algorithms::sieveFilter) {
  Local<Object> obj;
  RasterBand *src;
  RasterBand *dst;
  RasterBand *mask = NULL;
  int threshold;
  int connectedness = 4;
  Nan::Callback *progress_cb = nullptr;

  NODE_ARG_OBJECT(0, "options", obj);

  NODE_WRAPPED_FROM_OBJ(obj, "src", RasterBand, src);
  NODE_WRAPPED_FROM_OBJ(obj, "dst", RasterBand, dst);
  NODE_WRAPPED_FROM_OBJ_OPT(obj, "mask", RasterBand, mask);
  NODE_INT_FROM_OBJ(obj, "threshold", threshold);
  NODE_INT_FROM_OBJ_OPT(obj, "connectedness", connectedness);
  NODE_CB_FROM_OBJ_OPT(obj, "progress_cb", progress_cb);

  if (connectedness != 4 && connectedness != 8) {
    Nan::ThrowError("connectedness option must be 4 or 8");
    return;
  }

  GDALRasterBand *gdal_src = src->get();
  GDALRasterBand *gdal_dst = dst->get();
  GDALRasterBand *gdal_mask = mask ? mask->get() : nullptr;

  std::vector<long> ds_uids = {src->parent_uid, dst->parent_uid};
  if (mask) ds_uids.push_back(mask->parent_uid);

  GDALAsyncableJob<CPLErr> job(ds_uids);
  job.progress = progress_cb;
  job.main =
    [gdal_src, gdal_dst, gdal_mask, threshold, connectedness, progress_cb](const GDALExecutionProgress &progress) {
      CPLErrorReset();
      CPLErr err = GDALSieveFilter(
        gdal_src,
        gdal_mask,
        gdal_dst,
        threshold,
        connectedness,
        NULL,
        progress_cb ? ProgressTrampoline : nullptr,
        progress_cb ? (void *)&progress : nullptr);
      if (err) { throw CPLGetLastErrorMsg(); }
      return err;
    };
  job.rval = [](CPLErr r, const GetFromPersistentFunc &) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 1);
}

/**
 * Compute checksum for image region.
 *
 * @throws Error
 * @method checksumImage
 * @static
 * @param {RasterBand} src
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
 * @param {RasterBand} src
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [w=src.width]
 * @param {number} [h=src.height]
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {number}
 * @return {Promise<number>}
 */

GDAL_ASYNCABLE_DEFINE(Algorithms::checksumImage) {
  RasterBand *src;
  int x = 0, y = 0, w, h, bandw, bandh;

  NODE_ARG_WRAPPED(0, "src", RasterBand, src);
  GDAL_RAW_CHECK(GDALRasterBand *, src, gdal_src);

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

  long src_uid = src->parent_uid;

  GDALAsyncableJob<int> job(src_uid);
  job.persist(src->handle());
  job.main = [gdal_src, x, y, w, h](const GDALExecutionProgress &) {
    CPLErrorReset();
    int r = GDALChecksumImage(gdal_src, x, y, w, h);
    if (CPLGetLastErrorType() != CE_None) throw CPLGetLastErrorMsg();
    return r;
  };
  job.rval = [](int r, const GetFromPersistentFunc &) { return Nan::New<Integer>(r); };
  job.run(info, async, 5);
}

/**
 * @typedef {object} PolygonizeOptions
 * @property {RasterBand} src
 * @property {Layer} dst
 * @property {RasterBand} [mask]
 * @property {number} pixValField The attribute field index indicating the feature attribute into which the pixel value of the polygon should be written.
 * @property {number} [connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @property {boolean} [useFloats=false] Use floating point buffers instead of int buffers.
 * @property {ProgressCb} [progress_cb] {{{progress_cb}}}
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
 * @param {PolygonizeOptions} options
 * @param {RasterBand} options.src
 * @param {Layer} options.dst
 * @param {RasterBand} [options.mask]
 * @param {number} options.pixValField The attribute field index indicating the feature attribute into which the pixel value of the polygon should be written.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {boolean} [options.useFloats=false] Use floating point buffers instead of int buffers.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 */

/**
 * Creates vector polygons for all connected regions of pixels in the raster
 * sharing a common pixel value. Each polygon is created with an attribute
 * indicating the pixel value of that polygon. A raster mask may also be
 * provided to determine which pixels are eligible for processing.
 * {{{async}}}
 *
 * @throws Error
 * @method polygonizeAsync
 * @static
 * @param {PolygonizeOptions} options
 * @param {RasterBand} options.src
 * @param {Layer} options.dst
 * @param {RasterBand} [options.mask]
 * @param {number} options.pixValField The attribute field index indicating the feature attribute into which the pixel value of the polygon should be written.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {boolean} [options.useFloats=false] Use floating point buffers instead of int buffers.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(Algorithms::polygonize) {
  Local<Object> obj;
  RasterBand *src;
  RasterBand *mask = NULL;
  Layer *dst;
  int connectedness = 4;
  int pix_val_field = 0;
  char **papszOptions = NULL;
  Nan::Callback *progress_cb = nullptr;

  NODE_ARG_OBJECT(0, "options", obj);

  NODE_WRAPPED_FROM_OBJ(obj, "src", RasterBand, src);
  NODE_WRAPPED_FROM_OBJ(obj, "dst", Layer, dst);
  NODE_WRAPPED_FROM_OBJ_OPT(obj, "mask", RasterBand, mask);
  NODE_INT_FROM_OBJ_OPT(obj, "connectedness", connectedness)
  NODE_INT_FROM_OBJ(obj, "pixValField", pix_val_field);
  NODE_CB_FROM_OBJ_OPT(obj, "progress_cb", progress_cb);

  if (connectedness == 8) {
    papszOptions = CSLSetNameValue(papszOptions, "8CONNECTED", "8");
  } else if (connectedness != 4) {
    Nan::ThrowError("connectedness must be 4 or 8");
    return;
  }

  GDALRasterBand *gdal_src = src->get();
  OGRLayer *gdal_dst = dst->get();
  GDALRasterBand *gdal_mask = mask ? mask->get() : nullptr;

  std::vector<long> ds_uids = {src->parent_uid, dst->parent_uid};
  if (mask) ds_uids.push_back(mask->parent_uid);

  GDALAsyncableJob<CPLErr> job(ds_uids);
  job.progress = progress_cb;

  if (
    Nan::HasOwnProperty(obj, Nan::New("useFloats").ToLocalChecked()).FromMaybe(false) &&
    Nan::To<bool>(Nan::Get(obj, Nan::New("useFloats").ToLocalChecked()).ToLocalChecked()).ToChecked()) {
    job.main =
      [gdal_src, gdal_mask, gdal_dst, pix_val_field, papszOptions, progress_cb](const GDALExecutionProgress &progress) {
        CPLErrorReset();
        CPLErr err = GDALFPolygonize(
          gdal_src,
          gdal_mask,
          reinterpret_cast<OGRLayerH>(gdal_dst),
          pix_val_field,
          papszOptions,
          progress_cb ? ProgressTrampoline : nullptr,
          progress_cb ? (void *)&progress : nullptr);
        if (papszOptions) CSLDestroy(papszOptions);
        if (err) throw CPLGetLastErrorMsg();
        return err;
      };
  } else {
    job.main =
      [gdal_src, gdal_mask, gdal_dst, pix_val_field, papszOptions, progress_cb](const GDALExecutionProgress &progress) {
        CPLErrorReset();
        CPLErr err = GDALPolygonize(
          gdal_src,
          gdal_mask,
          reinterpret_cast<OGRLayerH>(gdal_dst),
          pix_val_field,
          papszOptions,
          progress_cb ? ProgressTrampoline : nullptr,
          progress_cb ? (void *)&progress : nullptr);
        if (papszOptions) CSLDestroy(papszOptions);
        if (err) throw CPLGetLastErrorMsg();
        return err;
      };
  }
  job.rval = [](CPLErr r, const GetFromPersistentFunc &) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 1);
}

// This is used for stress-testing the locking mechanism
// it doesn't do anything but sollicit locks
GDAL_ASYNCABLE_DEFINE(Algorithms::_acquireLocks) {
  Dataset *ds1, *ds2, *ds3;

  NODE_ARG_WRAPPED(0, "ds1", Dataset, ds1);
  NODE_ARG_WRAPPED(1, "ds2", Dataset, ds2);
  NODE_ARG_WRAPPED(2, "ds3", Dataset, ds3);

  GDALAsyncableJob<int> job({ds1->uid, ds2->uid, ds3->uid});
  job.main = [](const GDALExecutionProgress &) {
    int i, sum = 0;
    // make sure the optimizer won't surprise us
    for (i = 0; i < 1e4; i++) sum += i;
    return sum;
  };
  job.rval = [](int, const GetFromPersistentFunc &) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 3);
}

} // namespace node_gdal
