#include "dataset_bands.hpp"
#include "../gdal_common.hpp"
#include "../gdal_dataset.hpp"
#include "../gdal_rasterband.hpp"
#include "../utils/string_list.hpp"

namespace node_gdal {

Nan::Persistent<FunctionTemplate> DatasetBands::constructor;

void DatasetBands::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(DatasetBands::New);
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("DatasetBands").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "count", count);
  Nan::SetPrototypeMethod(lcons, "countAsync", count);
  Nan::SetPrototypeMethod(lcons, "create", create);
  Nan::SetPrototypeMethod(lcons, "createAsync", create);
  Nan::SetPrototypeMethod(lcons, "get", get);
  Nan::SetPrototypeMethod(lcons, "getAsync", get);

  ATTR_DONT_ENUM(lcons, "ds", dsGetter, READ_ONLY_SETTER);

  Nan::Set(target, Nan::New("DatasetBands").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

DatasetBands::DatasetBands() : Nan::ObjectWrap() {
}

DatasetBands::~DatasetBands() {
}

/**
 * An encapsulation of a {{#crossLink "gdal.Dataset"}}Dataset{{/crossLink}}'s
 * raster bands.
 *
 * ```
 * var bands = dataset.bands;```
 *
 * @class gdal.DatasetBands
 */
NAN_METHOD(DatasetBands::New) {
  Nan::HandleScope scope;

  if (!info.IsConstructCall()) {
    Nan::ThrowError("Cannot call constructor as function, you need to use 'new' keyword");
    return;
  }
  if (info[0]->IsExternal()) {
    Local<External> ext = info[0].As<External>();
    void *ptr = ext->Value();
    DatasetBands *f = static_cast<DatasetBands *>(ptr);
    f->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
    return;
  } else {
    Nan::ThrowError("Cannot create DatasetBands directly");
    return;
  }
}

Local<Value> DatasetBands::New(Local<Value> ds_obj) {
  Nan::EscapableHandleScope scope;

  DatasetBands *wrapped = new DatasetBands();

  v8::Local<v8::Value> ext = Nan::New<External>(wrapped);
  v8::Local<v8::Object> obj =
    Nan::NewInstance(Nan::GetFunction(Nan::New(DatasetBands::constructor)).ToLocalChecked(), 1, &ext).ToLocalChecked();
  Nan::SetPrivate(obj, Nan::New("parent_").ToLocalChecked(), ds_obj);

  return scope.Escape(obj);
}

NAN_METHOD(DatasetBands::toString) {
  Nan::HandleScope scope;
  info.GetReturnValue().Set(Nan::New("DatasetBands").ToLocalChecked());
}

/**
 * Returns the band with the given ID.
 *
 * @method get
 * @param {Integer} id
 * @return {gdal.RasterBand}
 */

/**
 * Returns the band with the given ID.
 * {{{async}}}
 *
 * @method getAsync
 *
 * @param {Integer} id
 * @param {requestCallback} [callback] {{cb}}
 * @return {gdal.RasterBand}
 */
GDAL_ASYNCABLE_DEFINE(DatasetBands::get) {
  Nan::HandleScope scope;

  Local<Object> parent =
    Nan::GetPrivate(info.This(), Nan::New("parent_").ToLocalChecked()).ToLocalChecked().As<Object>();
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(parent);

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

#if GDAL_VERSION_MAJOR < 2
  GDAL_ASYNCABLE_1x_UNSUPPORTED;
  if (ds->uses_ogr) {
    info.GetReturnValue().Set(Nan::Null());
    return;
  } else {
#else
  {
#endif
    GDALDataset *raw = ds->getDataset();
    long ds_uid = ds->uid;
    int band_id;
    NODE_ARG_INT(0, "band id", band_id);

    GDAL_ASYNCABLE_PERSIST(parent);
    GDAL_ASYNCABLE_MAIN(GDALRasterBand *) = [ds_uid, raw, band_id]() {
      GDAL_ASYNCABLE_LOCK(ds_uid);
      GDALRasterBand *band = raw->GetRasterBand(band_id);
      GDAL_UNLOCK_PARENT;
      return band;
    };
    GDAL_ASYNCABLE_RVAL(GDALRasterBand *) = [raw](GDALRasterBand *band, GDAL_ASYNCABLE_OBJS) {
      return RasterBand::New(band, raw);
    };
    GDAL_ASYNCABLE_EXECUTE(1, GDALRasterBand *);
  }
}

/**
 * Adds a new band.
 *
 * @method create
 * @throws Error
 * @param {Integer} dataType Type of band ({{#crossLink "Constants (GDT)"}}see
 * GDT constants{{/crossLink}}).
 * @param {object} [options] Creation options
 * @return {gdal.RasterBand}
 */

/**
 * Adds a new band.
 * {{{async}}}
 *
 * @method createAsync
 * @throws Error
 * @param {Integer} dataType Type of band ({{#crossLink "Constants (GDT)"}}see
 * GDT constants{{/crossLink}}).
 * @param {object} [options] Creation options
 * @param {requestCallback} [callback] {{cb}}
 * @return {gdal.RasterBand}
 */

GDAL_ASYNCABLE_DEFINE(DatasetBands::create) {
  Nan::HandleScope scope;

  Local<Object> parent =
    Nan::GetPrivate(info.This(), Nan::New("parent_").ToLocalChecked()).ToLocalChecked().As<Object>();
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(parent);

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

#if GDAL_VERSION_MAJOR < 2
  GDAL_ASYNCABLE_1x_UNSUPPORTED;
  if (ds->uses_ogr) {
    Nan::ThrowError("Dataset does not support getting creating bands");
    return;
  }
#endif

  GDALDataset *raw = ds->getDataset();
  GDALDataType type;
  StringList *options = new StringList;

  // NODE_ARG_ENUM(0, "data type", GDALDataType, type);
  if (info.Length() < 1) {
    Nan::ThrowError("data type argument needed");
    return;
  }
  if (info[0]->IsString()) {
    std::string type_name = *Nan::Utf8String(info[0]);
    type = GDALGetDataTypeByName(type_name.c_str());
  } else if (info[0]->IsNull() || info[0]->IsUndefined()) {
    type = GDT_Unknown;
  } else {
    Nan::ThrowError("data type must be string or undefined");
    return;
  }

  if (info.Length() > 1 && options->parse(info[1])) {
    return; // error parsing creation options
  }

  long ds_uid = ds->uid;

  GDAL_ASYNCABLE_PERSIST(parent);
  GDAL_ASYNCABLE_MAIN(GDALRasterBand *) = [ds_uid, raw, type, options]() {
    GDAL_ASYNCABLE_LOCK(ds_uid);
    CPLErr err = raw->AddBand(type, options->get());
    GDAL_UNLOCK_PARENT;
    delete options;
    // This is not thread-safe, but mis-reporting the error message
    // 0.01% of the time is probably acceptable
    if (err != CE_None) { throw CPLGetLastErrorMsg(); }
    return raw->GetRasterBand(raw->GetRasterCount());
  };
  GDAL_ASYNCABLE_RVAL(GDALRasterBand *) = [raw](GDALRasterBand *r, GDAL_ASYNCABLE_OBJS) {
    return RasterBand::New(r, raw);
  };
  GDAL_ASYNCABLE_EXECUTE(2, GDALRasterBand *);
}

/**
 * Returns the number of bands.
 *
 * @method count
 * @return {Integer}
 */
GDAL_ASYNCABLE_DEFINE(DatasetBands::count) {
  Nan::HandleScope scope;

  Local<Object> parent =
    Nan::GetPrivate(info.This(), Nan::New("parent_").ToLocalChecked()).ToLocalChecked().As<Object>();
  Dataset *ds = Nan::ObjectWrap::Unwrap<Dataset>(parent);

  if (!ds->isAlive()) {
    Nan::ThrowError("Dataset object has already been destroyed");
    return;
  }

#if GDAL_VERSION_MAJOR < 2
  GDAL_ASYNCABLE_1x_UNSUPPORTED;
  if (ds->uses_ogr) {
    info.GetReturnValue().Set(Nan::New<Integer>(0));
    return;
  }
#endif

  long ds_uid = ds->uid;
  GDAL_ASYNCABLE_PERSIST(parent);
  GDALDataset *raw = ds->getDataset();
  GDAL_ASYNCABLE_MAIN(int) = [ds_uid, raw]() {
    GDAL_ASYNCABLE_LOCK(ds_uid);
    int count = raw->GetRasterCount();
    GDAL_UNLOCK_PARENT;
    return count;
  };
  GDAL_ASYNCABLE_RVAL(int) = [raw](int count, GDAL_ASYNCABLE_OBJS) { return Nan::New<Integer>(count); };
  GDAL_ASYNCABLE_EXECUTE(0, int);
}

/**
 * Parent dataset
 *
 * @readOnly
 * @attribute ds
 * @type {gdal.Dataset}
 */
NAN_GETTER(DatasetBands::dsGetter) {
  Nan::HandleScope scope;
  info.GetReturnValue().Set(Nan::GetPrivate(info.This(), Nan::New("parent_").ToLocalChecked()).ToLocalChecked());
}

} // namespace node_gdal
