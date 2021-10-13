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
}

/**
 * Library version of gdal_translate.
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const out = gdal.translate('/vsimem/temp.tif', ds, [ '-b', '1' ])
 *
 * @throws Error
 * @method translate
 * @for gdal
 * @static
 * @param {string} destination destination filename
 * @param {gdal.Dataset} source source dataset
 * @param {string[]} array of CLI options for gdal_translate
 * @return {gdal.Dataset}
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
 * @for gdal
 * @static
 * @param {string} destination destination filename
 * @param {gdal.Dataset} source source dataset
 * @param {string[]} array of CLI options for gdal_translate
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<gdal.Dataset>}
 */
GDAL_ASYNCABLE_DEFINE(Utils::translate) {
  auto aosOptions = std::make_shared<CPLStringList>();

  std::string dst;
  NODE_ARG_STR(0, "dst", dst);

  Local<Object> src;
  NODE_ARG_OBJECT(1, "src", src);
  NODE_UNWRAP_CHECK(Dataset, src, ds);
  GDAL_RAW_CHECK(GDALDataset *, ds, raw);

  Local<Array> options;
  NODE_ARG_ARRAY(2, "options", options);

  for (unsigned i = 0; i < options->Length(); ++i) {
    aosOptions->AddString(*Nan::Utf8String(Nan::Get(options, i).ToLocalChecked()));
  }

  GDALAsyncableJob<GDALDataset *> job(ds->uid);
  job.main = [raw, dst, aosOptions](const GDALExecutionProgress &) {
    CPLErrorReset();
    auto b = aosOptions;
    auto psOptions = GDALTranslateOptionsNew(aosOptions->List(), nullptr);
    GDALDataset *r = GDALDatasetFromHandle(GDALTranslate(dst.c_str(), GDALDatasetToHandle(raw), psOptions, nullptr));
    GDALTranslateOptionsFree(psOptions);
    if (r == nullptr) throw CPLGetLastErrorMsg();
    return r;
  };
  job.rval = [](GDALDataset *ds, GetFromPersistentFunc) { return Dataset::New(ds); };

  job.run(info, async, 3);
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
 * @for gdal
 * @static
 * @param {string|gdal.Dataset} destination destination
 * @param {gdal.Dataset} source source dataset
 * @param {string[]} array of CLI options for ogr2ogr
 * @return {gdal.Dataset}
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
 * @for gdal
 * @static
 * @param {string|gdal.Dataset} destination destination
 * @param {gdal.Dataset} source source dataset
 * @param {string[]} array of CLI options for ogr2ogr
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<gdal.Dataset>}
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

  Local<Array> options;
  NODE_ARG_ARRAY(2, "options", options);

  for (unsigned i = 0; i < options->Length(); ++i) {
    aosOptions->AddString(*Nan::Utf8String(Nan::Get(options, i).ToLocalChecked()));
  }

  std::vector<long> uids = {ds->uid};
  if (dst_ds != nullptr) uids.push_back(dst_ds->uid);
  GDALAsyncableJob<GDALDataset *> job(uids);

  job.main = [src_raw, dst_filename, dst_raw, aosOptions](const GDALExecutionProgress &) {
    CPLErrorReset();
    auto b = aosOptions;
    auto psOptions = GDALVectorTranslateOptionsNew(aosOptions->List(), nullptr);

    auto srcH = GDALDatasetToHandle(src_raw);
    GDALDataset *r = GDALDatasetFromHandle(
      GDALVectorTranslate(dst_filename.c_str(), GDALDatasetToHandle(dst_raw), 1, &srcH, psOptions, nullptr));

    GDALVectorTranslateOptionsFree(psOptions);
    if (r == nullptr) throw CPLGetLastErrorMsg();
    return r;
  };
  job.rval = [](GDALDataset *ds, GetFromPersistentFunc) { return Dataset::New(ds); };

  job.run(info, async, 3);
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
 * @for gdal
 * @static
 * @param {gdal.Dataset} dataset
 * @param {string[]} array of CLI options for gdalinfo
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
 * @for gdal
 * @static
 * @param {gdal.Dataset} dataset
 * @param {string[]} array of CLI options for gdalinfo
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<string>}
 */
GDAL_ASYNCABLE_DEFINE(Utils::info) {
  auto aosOptions = std::make_shared<CPLStringList>();

  Local<Object> src;
  NODE_ARG_OBJECT(0, "src", src);
  NODE_UNWRAP_CHECK(Dataset, src, ds);
  GDAL_RAW_CHECK(GDALDataset *, ds, raw);

  Local<Array> options;
  NODE_ARG_ARRAY(1, "options", options);

  for (unsigned i = 0; i < options->Length(); ++i) {
    aosOptions->AddString(*Nan::Utf8String(Nan::Get(options, i).ToLocalChecked()));
  }

  GDALAsyncableJob<std::string> job(ds->uid);
  job.main = [raw, aosOptions](const GDALExecutionProgress &) {
    CPLErrorReset();
    auto b = aosOptions;
    auto psOptions = GDALInfoOptionsNew(aosOptions->List(), nullptr);
    char *r = GDALInfo(GDALDatasetToHandle(raw), psOptions);
    GDALInfoOptionsFree(psOptions);
    if (r == nullptr) throw CPLGetLastErrorMsg();
    std::string s(r);
    CPLFree(r);
    return s;
  };
  job.rval = [](std::string s, GetFromPersistentFunc) { return SafeString::New(s.c_str()); };

  job.run(info, async, 2);
}

} // namespace node_gdal
