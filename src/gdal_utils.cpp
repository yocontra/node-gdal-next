#include "gdal_utils.hpp"
#include "gdal_common.hpp"
#include "gdal_dataset.hpp"
#include "gdal_spatial_reference.hpp"

#if GDAL_VERSION_MAJOR > 2 || (GDAL_VERSION_MAJOR == 2 && GDAL_VERSION_MINOR >= 3)
#define GDALDatasetToHandle(x) GDALDataset::ToHandle(x)
#define GDALDatasetFromHandle(x) GDALDataset::FromHandle(x)
#else
#define GDALDatasetToHandle(x) static_cast<GDALDatasetH>(x)
#define GDALDatasetFromHandle(x) static_cast<GDALDataset *>(x)
#endif

namespace node_gdal {

void Utils::Initialize(Local<Object> target) {
  Nan__SetAsyncableMethod(target, "info", info);
  Nan__SetAsyncableMethod(target, "translate", translate);
  Nan__SetAsyncableMethod(target, "vectorTranslate", vectorTranslate);
  Nan__SetAsyncableMethod(target, "warp", warp);
}

/**
 * @typedef {object} UtilOptions
 * @property {ProgressCb} [progress_cb]
 */

/**
 * Library version of gdal_translate.
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const out = gdal.translate('/vsimem/temp.tif', ds, [ '-b', '1' ])
 *
 * @throws Error
 * @method translate
 * @instance
 * @static
 * @param {string} destination destination filename
 * @param {Dataset} source source dataset
 * @param {string[]} [args] array of CLI options for gdal_translate
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @return {Dataset}
 */

/**
 * Library version of gdal_translate.
 * {{{async}}}
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const out = gdal.translate('/vsimem/temp.tif', ds, [ '-b', '1' ])
 * @throws Error
 *
 * @method translateAsync
 * @instance
 * @static
 * @param {string} destination destination filename
 * @param {Dataset} source source dataset
 * @param {string[]} [args] array of CLI options for gdal_translate
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 */
GDAL_ASYNCABLE_DEFINE(Utils::translate) {
  auto aosOptions = std::make_shared<CPLStringList>();

  std::string dst;
  NODE_ARG_STR(0, "dst", dst);

  Local<Object> src;
  NODE_ARG_OBJECT(1, "src", src);
  NODE_UNWRAP_CHECK(Dataset, src, ds);
  GDAL_RAW_CHECK(GDALDataset *, ds, raw);

  Local<Array> args;
  NODE_ARG_ARRAY_OPT(2, "args", args);
  if (!args.IsEmpty())
    for (unsigned i = 0; i < args->Length(); ++i) {
      aosOptions->AddString(*Nan::Utf8String(Nan::Get(args, i).ToLocalChecked()));
    }

  Local<Object> options;
  Nan::Callback *progress_cb = nullptr;
  NODE_ARG_OBJECT_OPT(3, "options", options);
  if (!options.IsEmpty()) NODE_CB_FROM_OBJ_OPT(options, "progress_cb", progress_cb);

  GDALAsyncableJob<GDALDataset *> job(ds->uid);
  job.progress = progress_cb;
  job.main = [raw, dst, aosOptions, progress_cb](const GDALExecutionProgress &progress) {
    CPLErrorReset();
    auto b = aosOptions;
    auto psOptions = GDALTranslateOptionsNew(aosOptions->List(), nullptr);
    if (psOptions == nullptr) throw CPLGetLastErrorMsg();
    if (progress_cb) GDALTranslateOptionsSetProgress(psOptions, ProgressTrampoline, (void *)&progress);
    GDALDataset *r = GDALDatasetFromHandle(GDALTranslate(dst.c_str(), GDALDatasetToHandle(raw), psOptions, nullptr));
    GDALTranslateOptionsFree(psOptions);
    if (r == nullptr) throw CPLGetLastErrorMsg();
    return r;
  };
  job.rval = [](GDALDataset *ds, const GetFromPersistentFunc &) { return Dataset::New(ds); };

  job.run(info, async, 4);
}

/**
 * Library version of ogr2ogr.
 *
 * @example
 * const ds = gdal.open('input.geojson')
 * const out = gdal.vectorTranslate('/vsimem/temp.gpkg', [ '-of', 'GPKG' ], ds)
 *
 * @throws Error
 * @method vectorTranslate
 * @instance
 * @static
 * @param {string|Dataset} destination destination
 * @param {Dataset} source source dataset
 * @param {string[]} [args] array of CLI options for ogr2ogr
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @return {Dataset}
 */

/**
 * Library version of ogr2ogr.
 * {{{async}}}
 *
 * @example
 * const ds = gdal.open('input.geojson')
 * const out = gdal.vectorTranslate('/vsimem/temp.gpkg', [ '-of', 'GPKG' ], ds)
 * @throws Error
 *
 * @method vectorTranslateAsync
 * @instance
 * @static
 * @param {string|Dataset} destination destination
 * @param {Dataset} source source dataset
 * @param {string[]} [args] array of CLI options for ogr2ogr
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 */
GDAL_ASYNCABLE_DEFINE(Utils::vectorTranslate) {
  auto aosOptions = std::make_shared<CPLStringList>();

  std::string dst_filename("");
  Dataset *dst_ds = nullptr;
  if (info.Length() < 1) {
    Nan::ThrowError("\"dst\" must be given");
    return;
  }

  GDALDataset *dst_raw = nullptr;
  if (info[0]->IsString()) {
    NODE_ARG_STR(0, "dst", dst_filename);
  } else if (info[0]->IsObject()) {
    NODE_ARG_WRAPPED(0, "dst", Dataset, dst_ds);
    GDAL_RAW_CHECK(GDALDataset *, dst_ds, _dst_raw);
    dst_raw = _dst_raw;
  } else {
    Nan::ThrowError("\"dst\" must be an object or a gdal.Dataset");
    return;
  }

  Local<Object> src;
  NODE_ARG_OBJECT(1, "src", src);
  NODE_UNWRAP_CHECK(Dataset, src, ds);
  GDAL_RAW_CHECK(GDALDataset *, ds, src_raw);

  Local<Array> args;
  NODE_ARG_ARRAY_OPT(2, "args", args);
  if (!args.IsEmpty())
    for (unsigned i = 0; i < args->Length(); ++i) {
      aosOptions->AddString(*Nan::Utf8String(Nan::Get(args, i).ToLocalChecked()));
    }

  Local<Object> options;
  Nan::Callback *progress_cb = nullptr;
  NODE_ARG_OBJECT_OPT(3, "options", options);
  if (!options.IsEmpty()) NODE_CB_FROM_OBJ_OPT(options, "progress_cb", progress_cb);

  std::vector<long> uids = {ds->uid};
  if (dst_ds != nullptr) uids.push_back(dst_ds->uid);
  GDALAsyncableJob<GDALDataset *> job(uids);
  job.progress = progress_cb;

  job.main = [src_raw, dst_filename, dst_raw, aosOptions, progress_cb](const GDALExecutionProgress &progress) {
    CPLErrorReset();
    if (progress_cb) aosOptions->AddString("-progress");
    auto psOptions = GDALVectorTranslateOptionsNew(aosOptions->List(), nullptr);
    if (psOptions == nullptr) throw CPLGetLastErrorMsg();

    if (progress_cb) GDALVectorTranslateOptionsSetProgress(psOptions, ProgressTrampoline, (void *)&progress);

    auto srcH = GDALDatasetToHandle(src_raw);
    GDALDataset *r = GDALDatasetFromHandle(
      GDALVectorTranslate(dst_filename.c_str(), GDALDatasetToHandle(dst_raw), 1, &srcH, psOptions, nullptr));

    GDALVectorTranslateOptionsFree(psOptions);
    if (r == nullptr) throw CPLGetLastErrorMsg();
    return r;
  };
  job.rval = [](GDALDataset *ds, const GetFromPersistentFunc &) { return Dataset::New(ds); };

  job.run(info, async, 4);
}

/**
 * Library version of gdalinfo.
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const output = gdal.info('/vsimem/temp.tif')
 *
 * @throws Error
 * @method info
 * @instance
 * @static
 * @param {Dataset} dataset
 * @param {string[]} [args] array of CLI options for gdalinfo
 * @return {string}
 */

/**
 * Library version of gdalinfo.
 * {{{async}}}
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const output = gdal.info('/vsimem/temp.tif')
 * @throws Error
 *
 * @method infoAsync
 * @instance
 * @static
 * @param {Dataset} dataset
 * @param {string[]} [args] array of CLI options for gdalinfo
 * @param {callback<string>} [callback=undefined] {{{cb}}}
 * @return {Promise<string>}
 */
GDAL_ASYNCABLE_DEFINE(Utils::info) {
  auto aosOptions = std::make_shared<CPLStringList>();

  Local<Object> src;
  NODE_ARG_OBJECT(0, "src", src);
  NODE_UNWRAP_CHECK(Dataset, src, ds);
  GDAL_RAW_CHECK(GDALDataset *, ds, raw);

  Local<Array> args;
  NODE_ARG_ARRAY_OPT(1, "args", args);
  if (!args.IsEmpty())
    for (unsigned i = 0; i < args->Length(); ++i) {
      aosOptions->AddString(*Nan::Utf8String(Nan::Get(args, i).ToLocalChecked()));
    }

  GDALAsyncableJob<std::string> job(ds->uid);
  job.main = [raw, aosOptions](const GDALExecutionProgress &) {
    CPLErrorReset();
    auto psOptions = GDALInfoOptionsNew(aosOptions->List(), nullptr);
    if (psOptions == nullptr) throw CPLGetLastErrorMsg();
    char *r = GDALInfo(GDALDatasetToHandle(raw), psOptions);
    GDALInfoOptionsFree(psOptions);
    if (r == nullptr) throw CPLGetLastErrorMsg();
    std::string s(r);
    CPLFree(r);
    return s;
  };
  job.rval = [](std::string s, const GetFromPersistentFunc &) { return SafeString::New(s.c_str()); };

  job.run(info, async, 2);
}

/**
 * Library version of gdalwarp.
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const output = gdal.warp('/vsimem/temp.tif')
 *
 * @throws Error
 * @method warp
 * @instance
 * @static
 * @param {string|null} dst_path destination path, null for an in-memory operation
 * @param {Dataset|null} dst_ds destination dataset, null for a new dataset
 * @param {Dataset[]} src_ds array of source datasets
 * @param {string[]} [args] array of CLI options for gdalwarp
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @return {Dataset}
 */

/**
 * Library version of gdalinfo.
 * {{{async}}}
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const output = gdal.warp('/vsimem/temp.tif')
 * @throws Error
 *
 * @method warpAsync
 * @instance
 * @static
 * @param {string|null} dst_path destination path, null for an in-memory operation
 * @param {Dataset|null} dst_ds destination dataset, null for a new dataset
 * @param {Dataset[]} src_ds array of source datasets
 * @param {string[]} [args] array of CLI options for gdalwarp
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 */
GDAL_ASYNCABLE_DEFINE(Utils::warp) {
  auto aosOptions = std::make_shared<CPLStringList>();
  std::vector<long> uids;

  std::string dst_path("");
  Local<Object> dst_ds;

  NODE_ARG_OPT_STR(0, "dst_path", dst_path);

  NODE_ARG_OBJECT_OPT(1, "dst_ds", dst_ds);
  GDALDatasetH gdal_dst_ds = nullptr;
  if (!dst_ds.IsEmpty()) {
    NODE_UNWRAP_CHECK(Dataset, dst_ds, ds);
    GDAL_RAW_CHECK(GDALDataset *, ds, raw);
    gdal_dst_ds = GDALDatasetToHandle(raw);
    uids.push_back(ds->uid);
  }

  if (dst_path.length() == 0 && gdal_dst_ds == nullptr) {
    Nan::ThrowError("Either \"dst_path\" or \"dst_ds\" must be given");
    return;
  }

  Local<Array> src_ds;
  NODE_ARG_ARRAY(2, "src_ds", src_ds);
  if (src_ds->Length() < 1) {
    Nan::ThrowError("\"src_ds\" must contain at least one element");
    return;
  }
  auto gdal_src_ds = std::shared_ptr<GDALDatasetH>(new GDALDatasetH[src_ds->Length()], array_deleter<GDALDatasetH>());
  for (unsigned i = 0; i < src_ds->Length(); ++i) {
    NODE_UNWRAP_CHECK(Dataset, Nan::Get(src_ds, i).ToLocalChecked().As<Object>(), ds);
    GDAL_RAW_CHECK(GDALDataset *, ds, raw);
    gdal_src_ds.get()[i] = GDALDatasetToHandle(raw);
    uids.push_back(ds->uid);
  }

  Local<Array> args;
  NODE_ARG_ARRAY_OPT(3, "args", args);
  if (!args.IsEmpty())
    for (unsigned i = 0; i < args->Length(); ++i) {
      aosOptions->AddString(*Nan::Utf8String(Nan::Get(args, i).ToLocalChecked()));
    }

  Local<Object> options;
  Nan::Callback *progress_cb = nullptr;
  NODE_ARG_OBJECT_OPT(4, "options", options);
  if (!options.IsEmpty()) NODE_CB_FROM_OBJ_OPT(options, "progress_cb", progress_cb);

  GDALAsyncableJob<GDALDataset *> job(uids);
  int src_count = src_ds->Length();
  job.progress = progress_cb;
  job.main =
    [dst_path, gdal_dst_ds, src_count, gdal_src_ds, aosOptions, progress_cb](const GDALExecutionProgress &progress) {
      CPLErrorReset();
      auto psOptions = GDALWarpAppOptionsNew(aosOptions->List(), nullptr);
      if (psOptions == nullptr) throw CPLGetLastErrorMsg();
      if (progress_cb) GDALWarpAppOptionsSetProgress(psOptions, ProgressTrampoline, (void *)&progress);
      GDALDatasetH r = GDALWarp(
        dst_path.length() > 0 ? dst_path.c_str() : nullptr,
        gdal_dst_ds,
        src_count,
        gdal_src_ds.get(),
        psOptions,
        nullptr);
      GDALWarpAppOptionsFree(psOptions);
      if (r == nullptr) throw CPLGetLastErrorMsg();
      return GDALDatasetFromHandle(r);
    };
  job.rval = [](GDALDataset *ds, const GetFromPersistentFunc &) { return Dataset::New(ds); };

  job.run(info, async, 5);
}

} // namespace node_gdal
