#include "gdal_dataset.hpp"
#include "gdal_group.hpp"
#include "collections/dataset_bands.hpp"
#include "collections/dataset_layers.hpp"
#include "gdal_common.hpp"
#include "gdal_driver.hpp"
#include "geometry/gdal_geometry.hpp"
#include "gdal_layer.hpp"
#include "gdal_majorobject.hpp"
#include "gdal_rasterband.hpp"
#include "gdal_spatial_reference.hpp"

namespace node_gdal {

Nan::Persistent<FunctionTemplate> Dataset::constructor;

void Dataset::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(Dataset::New);
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("Dataset").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "setGCPs", setGCPs);
  Nan::SetPrototypeMethod(lcons, "getGCPs", getGCPs);
  Nan::SetPrototypeMethod(lcons, "getGCPProjection", getGCPProjection);
  Nan::SetPrototypeMethod(lcons, "getFileList", getFileList);
  Nan__SetPrototypeAsyncableMethod(lcons, "flush", flush);
  Nan::SetPrototypeMethod(lcons, "close", close);
  Nan::SetPrototypeMethod(lcons, "getMetadata", getMetadata);
  Nan::SetPrototypeMethod(lcons, "testCapability", testCapability);
  Nan__SetPrototypeAsyncableMethod(lcons, "executeSQL", executeSQL);
  Nan__SetPrototypeAsyncableMethod(lcons, "buildOverviews", buildOverviews);

  ATTR_DONT_ENUM(lcons, "_uid", uidGetter, READ_ONLY_SETTER);
  ATTR(lcons, "description", descriptionGetter, READ_ONLY_SETTER);
  ATTR(lcons, "bands", bandsGetter, READ_ONLY_SETTER);
  ATTR(lcons, "layers", layersGetter, READ_ONLY_SETTER);
  ATTR(lcons, "rasterSize", rasterSizeGetter, READ_ONLY_SETTER);
  ATTR(lcons, "driver", driverGetter, READ_ONLY_SETTER);
  ATTR(lcons, "root", rootGetter, READ_ONLY_SETTER);
  ATTR(lcons, "srs", srsGetter, srsSetter);
  ATTR(lcons, "geoTransform", geoTransformGetter, geoTransformSetter);

  Nan::Set(target, Nan::New("Dataset").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

Dataset::Dataset(GDALDataset *ds) : Nan::ObjectWrap(), uid(0), parent_uid(0), this_dataset(ds), parent_ds(nullptr) {
  LOG("Created Dataset [%p]", ds);
}

Dataset::~Dataset() {
  // Destroy at garbage collection time if not already explicitly destroyed
  dispose();
}

void Dataset::dispose() {
  if (this_dataset) {
    LOG("Disposing Dataset [%p]", this_dataset);

    object_store.dispose(uid);

    LOG("Disposed Dataset [%p]", this_dataset);

    this_dataset = NULL;
  }
}

/**
 * A set of associated raster bands and/or vector layers, usually from one file.
 *
 * ```
 * // raster dataset:
 * dataset = gdal.open('file.tif');
 * bands = dataset.bands;
 *
 * // vector dataset:
 * dataset = gdal.open('file.shp');
 * layers = dataset.layers;```
 *
 * @class gdal.Dataset
 */
NAN_METHOD(Dataset::New) {
  Nan::HandleScope scope;

  if (!info.IsConstructCall()) {
    Nan::ThrowError("Cannot call constructor as function, you need to use 'new' keyword");
    return;
  }
  if (info[0]->IsExternal()) {
    Local<External> ext = info[0].As<External>();
    void *ptr = ext->Value();
    Dataset *f = static_cast<Dataset *>(ptr);
    f->Wrap(info.This());

    Local<Value> layers = DatasetLayers::New(info.This());
    Nan::SetPrivate(info.This(), Nan::New("layers_").ToLocalChecked(), layers);

    Local<Value> rootObj, bandsObj;
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
    GDALDataset *gdal_ds = f->get();
    std::shared_ptr<GDALGroup> root = gdal_ds->GetRootGroup();
    if (root == nullptr) {
#endif
      bandsObj = DatasetBands::New(info.This());
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
    } else {
      bandsObj = Nan::Null();
    }
#endif
    Nan::SetPrivate(info.This(), Nan::New("bands_").ToLocalChecked(), bandsObj);
    if (f->parent_ds)
      // For dependent Datasets, keep a reference on the parent to protect it from the GC
      Nan::SetPrivate(info.This(), Nan::New("parent_").ToLocalChecked(), object_store.get(f->parent_ds));

    info.GetReturnValue().Set(info.This());
    return;
  } else {
    Nan::ThrowError("Cannot create dataset directly");
    return;
  }
}

Local<Value> Dataset::New(GDALDataset *raw, GDALDataset *parent) {
  Nan::EscapableHandleScope scope;

  if (!raw) { return scope.Escape(Nan::Null()); }
  if (object_store.has(raw)) { return scope.Escape(object_store.get(raw)); }

  Dataset *wrapped = new Dataset(raw);

  long parent_uid = 0;
  if (parent != nullptr) {
    /* A dependent Dataset shares the lock of its parent
     */
    Dataset *parent_ds = Nan::ObjectWrap::Unwrap<Dataset>(object_store.get(parent));
    parent_uid = parent_ds->uid;
  }

  Local<Value> ext = Nan::New<External>(wrapped);
  Local<Object> obj =
    Nan::NewInstance(Nan::GetFunction(Nan::New(Dataset::constructor)).ToLocalChecked(), 1, &ext).ToLocalChecked();

  wrapped->uid = object_store.add(raw, obj, parent_uid);

  return scope.Escape(obj);
}

NAN_METHOD(Dataset::toString) {
  Nan::HandleScope scope;
  info.GetReturnValue().Set(Nan::New("Dataset").ToLocalChecked());
}

/**
 * Fetch metadata.
 *
 * @method getMetadata
 * @param {string} [domain]
 * @return {any}
 */
NAN_METHOD(Dataset::getMetadata) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  std::string domain("");
  NODE_ARG_OPT_STR(0, "domain", domain);
  AsyncLock lock = object_store.lockDataset(ds->uid);
  info.GetReturnValue().Set(MajorObject::getMetadata(raw, domain.empty() ? NULL : domain.c_str()));
  object_store.unlockDataset(lock);
}

/**
 * Determines if the dataset supports the indicated operation.
 *
 * @method testCapability
 * @param {string} capability (see {{#crossLink "Constants (ODsC)"}}capability
 * list{{/crossLink}})
 * @return {boolean}
 */
NAN_METHOD(Dataset::testCapability) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();

  std::string capability("");
  NODE_ARG_STR(0, "capability", capability);

  AsyncLock lock = object_store.lockDataset(ds->uid);
  info.GetReturnValue().Set(Nan::New<Boolean>(raw->TestCapability(capability.c_str())));
  object_store.unlockDataset(lock);
}

/**
 * Get output projection for GCPs.
 *
 * @method getGCPProjection
 * @return {string}
 */
NAN_METHOD(Dataset::getGCPProjection) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  AsyncLock lock = object_store.lockDataset(ds->uid);
  info.GetReturnValue().Set(SafeString::New(raw->GetGCPProjection()));
  object_store.unlockDataset(lock);
}

/**
 * Closes the dataset to further operations. It releases all memory and ressources held
 * by the dataset.
 * This is normally an instantenous atomic operation that won't block the event loop
 * except if there is an operation running on this dataset in asynchronous context - in this case
 * this call will block until that operation finishes.
 *
 * If this could potentially be the case and blocking the event loop is not possible (server code),
 * then the best option is to simply dereference it (ds = null) and leave
 * the garbage collector to expire it.
 * 
 * Implementing an asynchronous delete is difficult since all V8 object creation/deletion
 * must take place on the main thread.
 * 
 * flush[Async]() ensures that, when writing, all data has been written.
 *
 * @method close
 */
NAN_METHOD(Dataset::close) {
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  ds->dispose();

  return;
}

/**
 * Flushes all changes to disk.
 *
 * @throws Error
 * @method flush
 */

/**
 * Flushes all changes to disk.
 * {{{async}}}
 *
 * @method flushAsync
 * @throws Error
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(Dataset::flush) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  if (!raw) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }
  GDALAsyncableJob<int> job;
  long ds_uid = ds->uid;
  job.persist(info.This());
  job.main = [raw, ds_uid](const GDALExecutionProgress &) {
    AsyncGuard lock(ds_uid);
    raw->FlushCache();
    return 0;
  };
  job.rval = [](int, GetFromPersistentFunc) { return Nan::Undefined().As<Value>(); };
  job.run(info, async, 0);

  return;
}

/**
 * Execute an SQL statement against the data store.
 *
 * @throws Error
 * @method executeSQL
 * @param {string} statement SQL statement to execute.
 * @param {gdal.Geometry} [spatial_filter=null] Geometry which represents a
 * spatial filter.
 * @param {string} [dialect=null] Allows control of the statement dialect. If
 * set to `null`, the OGR SQL engine will be used, except for RDBMS drivers that
 * will use their dedicated SQL engine, unless `"OGRSQL"` is explicitely passed
 * as the dialect. Starting with OGR 1.10, the `"SQLITE"` dialect can also be
 * used.
 * @return {gdal.Layer}
 */

/**
 * Execute an SQL statement against the data store.
 * {{{async}}}
 *
 * @throws Error
 * @method executeSQLAsync
 * @param {string} statement SQL statement to execute.
 * @param {gdal.Geometry} [spatial_filter=null] Geometry which represents a
 * spatial filter.
 * @param {string} [dialect=null] Allows control of the statement dialect. If
 * set to `null`, the OGR SQL engine will be used, except for RDBMS drivers that
 * will use their dedicated SQL engine, unless `"OGRSQL"` is explicitely passed
 * as the dialect. Starting with OGR 1.10, the `"SQLITE"` dialect can also be
 * used.
 * @param {callback<gdal.Layer>} [callback=undefined] {{{cb}}}
 * @return {Promise<gdal.Layer>}
 */
GDAL_ASYNCABLE_DEFINE(Dataset::executeSQL) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();

  std::string sql;
  std::string sql_dialect;
  Geometry *spatial_filter = NULL;

  NODE_ARG_STR(0, "sql text", sql);
  NODE_ARG_WRAPPED_OPT(1, "spatial filter geometry", Geometry, spatial_filter);
  NODE_ARG_OPT_STR(2, "sql dialect", sql_dialect);

  GDALAsyncableJob<OGRLayer *> job;
  OGRGeometry *geom_filter = spatial_filter ? spatial_filter->get() : NULL;
  long ds_uid = ds->uid;
  job.persist(info.This());
  job.main = [raw, ds_uid, sql, sql_dialect, geom_filter](const GDALExecutionProgress &) {
    AsyncGuard lock(ds_uid);
    OGRLayer *layer = raw->ExecuteSQL(sql.c_str(), geom_filter, sql_dialect.empty() ? NULL : sql_dialect.c_str());
    if (layer == nullptr) throw CPLGetLastErrorMsg();
    return layer;
  };
  job.rval = [raw](OGRLayer *layer, GetFromPersistentFunc) { return Layer::New(layer, raw, true); };

  job.run(info, async, 3);
}

/**
 * Fetch files forming dataset.
 *
 * Returns a list of files believed to be part of this dataset. If it returns an
 * empty list of files it means there is believed to be no local file system
 * files associated with the dataset (for instance a virtual dataset).
 *
 * Returns an empty array for vector datasets if GDAL version is below 2.0
 *
 * @method getFileList
 * @return {string[]}
 */
NAN_METHOD(Dataset::getFileList) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  Local<Array> results = Nan::New<Array>(0);

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  if (!raw) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  AsyncLock lock = object_store.lockDataset(ds->uid);
  char **list = raw->GetFileList();
  if (!list) {
    info.GetReturnValue().Set(results);
    object_store.unlockDataset(lock);
    return;
  }

  int i = 0;
  while (list[i]) {
    Nan::Set(results, i, SafeString::New(list[i]));
    i++;
  }
  object_store.unlockDataset(lock);

  CSLDestroy(list);

  info.GetReturnValue().Set(results);
}

/**
 * Fetches GCPs.
 *
 * @method getGCPs
 * @return {any[]}
 */
NAN_METHOD(Dataset::getGCPs) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  Local<Array> results = Nan::New<Array>(0);

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  if (!raw) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  AsyncLock lock = object_store.lockDataset(ds->uid);
  int n = raw->GetGCPCount();
  const GDAL_GCP *gcps = raw->GetGCPs();

  if (!gcps) {
    info.GetReturnValue().Set(results);
    object_store.unlockDataset(lock);
    return;
  }

  for (int i = 0; i < n; i++) {
    GDAL_GCP gcp = gcps[i];
    Local<Object> obj = Nan::New<Object>();
    Nan::Set(obj, Nan::New("pszId").ToLocalChecked(), Nan::New(gcp.pszId).ToLocalChecked());
    Nan::Set(obj, Nan::New("pszInfo").ToLocalChecked(), Nan::New(gcp.pszInfo).ToLocalChecked());
    Nan::Set(obj, Nan::New("dfGCPPixel").ToLocalChecked(), Nan::New<Number>(gcp.dfGCPPixel));
    Nan::Set(obj, Nan::New("dfGCPLine").ToLocalChecked(), Nan::New<Number>(gcp.dfGCPLine));
    Nan::Set(obj, Nan::New("dfGCPX").ToLocalChecked(), Nan::New<Number>(gcp.dfGCPX));
    Nan::Set(obj, Nan::New("dfGCPY").ToLocalChecked(), Nan::New<Number>(gcp.dfGCPY));
    Nan::Set(obj, Nan::New("dfGCPZ").ToLocalChecked(), Nan::New<Number>(gcp.dfGCPZ));
    Nan::Set(results, i, obj);
  }

  info.GetReturnValue().Set(results);
  object_store.unlockDataset(lock);
}

/**
 * Sets GCPs.
 *
 * @throws Error
 * @method setGCPs
 * @param {object[]} gcps
 * @param {string} [projection]
 */
NAN_METHOD(Dataset::setGCPs) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  if (!raw) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  Local<Array> gcps;
  std::string projection("");
  NODE_ARG_ARRAY(0, "gcps", gcps);
  NODE_ARG_OPT_STR(1, "projection", projection);

  std::shared_ptr<GDAL_GCP> list(new GDAL_GCP[gcps->Length()], array_deleter<GDAL_GCP>());
  std::shared_ptr<std::string> pszId_list(new std::string[gcps->Length()], array_deleter<std::string>());
  std::shared_ptr<std::string> pszInfo_list(new std::string[gcps->Length()], array_deleter<std::string>());
  GDAL_GCP *gcp = list.get();
  for (unsigned int i = 0; i < gcps->Length(); ++i) {
    Local<Value> val = Nan::Get(gcps, i).ToLocalChecked();
    if (!val->IsObject()) {
      Nan::ThrowError("GCP array must only include objects");
      return;
    }
    Local<Object> obj = val.As<Object>();

    NODE_DOUBLE_FROM_OBJ(obj, "dfGCPPixel", gcp->dfGCPPixel);
    NODE_DOUBLE_FROM_OBJ(obj, "dfGCPLine", gcp->dfGCPLine);
    NODE_DOUBLE_FROM_OBJ(obj, "dfGCPX", gcp->dfGCPX);
    NODE_DOUBLE_FROM_OBJ(obj, "dfGCPY", gcp->dfGCPY);
    NODE_DOUBLE_FROM_OBJ_OPT(obj, "dfGCPZ", gcp->dfGCPZ);
    NODE_STR_FROM_OBJ_OPT(obj, "pszId", pszId_list.get()[i]);
    NODE_STR_FROM_OBJ_OPT(obj, "pszInfo", pszInfo_list.get()[i]);

    gcp->pszId = (char *)pszId_list.get()[i].c_str();
    gcp->pszInfo = (char *)pszInfo_list.get()[i].c_str();

    gcp++;
  }

  AsyncLock lock = object_store.lockDataset(ds->uid);
  CPLErr err = raw->SetGCPs(gcps->Length(), list.get(), projection.c_str());
  object_store.unlockDataset(lock);

  if (err) {
    NODE_THROW_LAST_CPLERR;
    return;
  }

  return;
}

/**
 * Builds dataset overviews.
 *
 * @throws Error
 * @method buildOverviews
 * @param {string} resampling `"NEAREST"`, `"GAUSS"`, `"CUBIC"`, `"AVERAGE"`,
 * `"MODE"`, `"AVERAGE_MAGPHASE"` or `"NONE"`
 * @param {number[]} overviews
 * @param {number[]} [bands] Note: Generation of overviews in external TIFF currently only supported when operating on all bands.
 * @param {ProgressOptions} [options] options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 */

/**
 * Builds dataset overviews.
 * {{{async}}}
 *
 * @throws Error
 * @method buildOverviewsAsync
 * @param {string} resampling `"NEAREST"`, `"GAUSS"`, `"CUBIC"`, `"AVERAGE"`,
 * `"MODE"`, `"AVERAGE_MAGPHASE"` or `"NONE"`
 * @param {number[]} overviews
 * @param {number[]} [bands] Note: Generation of overviews in external TIFF currently only supported when operating on all bands.
 * @param {ProgressOptions} [options] options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(Dataset::buildOverviews) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  std::string resampling = "";
  Local<Array> overviews;
  Local<Array> bands;

  NODE_ARG_STR(0, "resampling", resampling);
  NODE_ARG_ARRAY(1, "overviews", overviews);
  NODE_ARG_ARRAY_OPT(2, "bands", bands);

  int n_overviews = overviews->Length();
  int i, n_bands = 0;

  // shared_ptr to array is C++17 :(
  std::shared_ptr<int> o(new int[n_overviews], array_deleter<int>());
  std::shared_ptr<int> b;
  for (i = 0; i < n_overviews; i++) {
    Local<Value> val = Nan::Get(overviews, i).ToLocalChecked();
    if (!val->IsNumber()) {
      Nan::ThrowError("overviews array must only contain numbers");
      return;
    }
    o.get()[i] = Nan::To<int32_t>(val).ToChecked();
  }

  AsyncLock lock = object_store.lockDataset(ds->uid);
  if (!bands.IsEmpty()) {
    n_bands = bands->Length();
    b = std::shared_ptr<int>(new int[n_bands], array_deleter<int>());
    for (i = 0; i < n_bands; i++) {
      Local<Value> val = Nan::Get(bands, i).ToLocalChecked();
      if (!val->IsNumber()) {
        object_store.unlockDataset(lock);
        Nan::ThrowError("band array must only contain numbers");
        return;
      }
      b.get()[i] = Nan::To<int32_t>(val).ToChecked();
      if (b.get()[i] > raw->GetRasterCount() || b.get()[i] < 1) {
        // BuildOverviews prints an error but segfaults before returning
        object_store.unlockDataset(lock);
        Nan::ThrowError("invalid band id");
        return;
      }
    }
  }
  object_store.unlockDataset(lock);

  GDALAsyncableJob<CPLErr> job;
  long ds_uid = ds->uid;
  job.persist(info.This());

  Nan::Callback *progress_cb;
  NODE_PROGRESS_CB_OPT(3, progress_cb, job);
  // Alas one cannot capture-move a unique_ptr and assign the lambda to a variable
  // because the lambda becomes non-copyable
  // But we can use a shared_ptr because the lifetime of the lambda is limited by the lifetime
  // of the async worker
  job.main = [raw, ds_uid, resampling, n_overviews, o, n_bands, b, progress_cb](const GDALExecutionProgress &progress) {
    AsyncGuard lock(ds_uid);
    CPLErr err = raw->BuildOverviews(
      resampling.c_str(),
      n_overviews,
      o.get(),
      n_bands,
      b.get(),
      progress_cb ? ProgressTrampoline : nullptr,
      progress_cb ? (void *)&progress : nullptr);
    if (err != CE_None) { throw CPLGetLastErrorMsg(); }
    return err;
  };
  job.rval = [](CPLErr, GetFromPersistentFunc) { return Nan::Undefined().As<Value>(); };

  job.run(info, async, 4);
}

/**
 * @readOnly
 * @attribute description
 * @type {string}
 */
NAN_GETTER(Dataset::descriptionGetter) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  if (!raw) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }
  AsyncLock lock = object_store.lockDataset(ds->uid);
  info.GetReturnValue().Set(SafeString::New(raw->GetDescription()));
  object_store.unlockDataset(lock);
}

/**
 * Raster dimensions. An object containing `x` and `y` properties.
 *
 * @readOnly
 * @attribute rasterSize
 * @type {xyz}
 */
NAN_GETTER(Dataset::rasterSizeGetter) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();

  // GDAL 2.x will return 512x512 for vector datasets... which doesn't really make
  // sense in JS where we can return null instead of a number
  // https://github.com/OSGeo/gdal/blob/beef45c130cc2778dcc56d85aed1104a9b31f7e6/gdal/gcore/gdaldataset.cpp#L173-L174
  AsyncLock lock = object_store.lockDataset(ds->uid);
  if (raw->GetDriver() == nullptr || !raw->GetDriver()->GetMetadataItem(GDAL_DCAP_RASTER)) {
    info.GetReturnValue().Set(Nan::Null());
    object_store.unlockDataset(lock);
    return;
  }

  Local<Object> result = Nan::New<Object>();
  Nan::Set(result, Nan::New("x").ToLocalChecked(), Nan::New<Integer>(raw->GetRasterXSize()));
  Nan::Set(result, Nan::New("y").ToLocalChecked(), Nan::New<Integer>(raw->GetRasterYSize()));
  object_store.unlockDataset(lock);
  info.GetReturnValue().Set(result);
}

/**
 * Spatial reference associated with raster dataset
 *
 * @throws Error
 * @attribute srs
 * @type {gdal.SpatialReference}
 */
NAN_GETTER(Dataset::srsGetter) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  AsyncLock lock = object_store.lockDataset(ds->uid);
  // get projection wkt and return null if not set
  OGRChar *wkt = (OGRChar *)raw->GetProjectionRef();
  if (*wkt == '\0') {
    object_store.unlockDataset(lock);
    // getProjectionRef returns string of length 0 if no srs set
    info.GetReturnValue().Set(Nan::Null());
    return;
  }
  // otherwise construct and return SpatialReference from wkt
  OGRSpatialReference *srs = new OGRSpatialReference();
  int err = srs->importFromWkt(&wkt);
  object_store.unlockDataset(lock);

  if (err) {
    NODE_THROW_OGRERR(err);
    return;
  }

  info.GetReturnValue().Set(SpatialReference::New(srs, true));
}

/**
 * An affine transform which maps pixel/line coordinates into georeferenced
 * space using the following relationship:
 *
 * @example
 * ```
 * var GT = dataset.geoTransform;
 * var Xgeo = GT[0] + Xpixel*GT[1] + Yline*GT[2];
 * var Ygeo = GT[3] + Xpixel*GT[4] + Yline*GT[5];```
 *
 * @attribute geoTransform
 * @type {number[]}
 */
NAN_GETTER(Dataset::geoTransformGetter) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  double transform[6];
  AsyncLock lock = object_store.lockDataset(ds->uid);
  CPLErr err = raw->GetGeoTransform(transform);
  object_store.unlockDataset(lock);
  if (err) {
    // This is mostly (always?) a sign that it has not been set
    info.GetReturnValue().Set(Nan::Null());
    return;
    // NODE_THROW_LAST_CPLERR;
  }

  Local<Array> result = Nan::New<Array>(6);
  Nan::Set(result, 0, Nan::New<Number>(transform[0]));
  Nan::Set(result, 1, Nan::New<Number>(transform[1]));
  Nan::Set(result, 2, Nan::New<Number>(transform[2]));
  Nan::Set(result, 3, Nan::New<Number>(transform[3]));
  Nan::Set(result, 4, Nan::New<Number>(transform[4]));
  Nan::Set(result, 5, Nan::New<Number>(transform[5]));

  info.GetReturnValue().Set(result);
}

/**
 * @readOnly
 * @attribute driver
 * @type {gdal.Driver}
 */
NAN_GETTER(Dataset::driverGetter) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  if (raw->GetDriver() != nullptr) { info.GetReturnValue().Set(Driver::New(raw->GetDriver())); }
}

NAN_SETTER(Dataset::srsSetter) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();
  std::string wkt("");
  if (IS_WRAPPED(value, SpatialReference)) {

    SpatialReference *srs_obj = Nan::ObjectWrap::Unwrap<SpatialReference>(value.As<Object>());
    OGRSpatialReference *srs = srs_obj->get();
    // Get wkt from OGRSpatialReference
    char *str;
    if (srs->exportToWkt(&str)) {
      Nan::ThrowError("Error exporting srs to wkt");
      return;
    }
    wkt = str; // copy string
    CPLFree(str);

  } else if (!value->IsNull() && !value->IsUndefined()) {
    Nan::ThrowError("srs must be SpatialReference object");
    return;
  }

  AsyncLock lock = object_store.lockDataset(ds->uid);
  CPLErr err = raw->SetProjection(wkt.c_str());
  object_store.unlockDataset(lock);

  if (err) { NODE_THROW_LAST_CPLERR; }
}

NAN_SETTER(Dataset::geoTransformSetter) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

  GDALDataset *raw = ds->get();

  if (!value->IsArray()) {
    Nan::ThrowError("Transform must be an array");
    return;
  }
  Local<Array> transform = value.As<Array>();

  if (transform->Length() != 6) {
    Nan::ThrowError("Transform array must have 6 elements");
    return;
  }

  double buffer[6];
  for (int i = 0; i < 6; i++) {
    Local<Value> val = Nan::Get(transform, i).ToLocalChecked();
    if (!val->IsNumber()) {
      Nan::ThrowError("Transform array must only contain numbers");
      return;
    }
    buffer[i] = Nan::To<double>(val).ToChecked();
  }

  AsyncLock lock = object_store.lockDataset(ds->uid);
  CPLErr err = raw->SetGeoTransform(buffer);
  object_store.unlockDataset(lock);

  if (err) { NODE_THROW_LAST_CPLERR; }
}

/**
 * @readOnly
 * @attribute bands
 * @type {gdal.DatasetBands}
 */
NAN_GETTER(Dataset::bandsGetter) {
  Nan::HandleScope scope;
  info.GetReturnValue().Set(Nan::GetPrivate(info.This(), Nan::New("bands_").ToLocalChecked()).ToLocalChecked());
}

/**
 * @readOnly
 * @attribute layers
 * @type {gdal.DatasetLayers}
 */
NAN_GETTER(Dataset::layersGetter) {
  Nan::HandleScope scope;
  info.GetReturnValue().Set(Nan::GetPrivate(info.This(), Nan::New("layers_").ToLocalChecked()).ToLocalChecked());
}

/**
 * @readOnly
 * @attribute root
 * @type {gdal.Group}
 */
NAN_GETTER(Dataset::rootGetter) {
  Nan::HandleScope scope;
  MaybeLocal<Value> maybeRootObj = Nan::GetPrivate(info.This(), Nan::New("root_").ToLocalChecked());
  Local<Value> rootObj;
  if (rootObj.IsEmpty()) {
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
    NODE_UNWRAP_CHECK(Dataset, info.This(), ds);
    GDAL_RAW_CHECK(GDALDataset *, ds, gdal_ds);
    AsyncLock lock = object_store.lockDataset(ds->uid);
    std::shared_ptr<GDALGroup> root = gdal_ds->GetRootGroup();
    object_store.unlockDataset(lock);
    if (root == nullptr) {
#endif
      rootObj = Nan::Null();
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
    } else {
      rootObj = Group::New(root, info.This());
    }
#endif
    Nan::SetPrivate(info.This(), Nan::New("root_").ToLocalChecked(), rootObj);
  } else {
    rootObj = maybeRootObj.ToLocalChecked();
  }
  info.GetReturnValue().Set(rootObj);
}

NAN_GETTER(Dataset::uidGetter) {
  Nan::HandleScope scope;
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(info.This());
  info.GetReturnValue().Set(Nan::New((int)ds->uid));
}

} // namespace node_gdal
