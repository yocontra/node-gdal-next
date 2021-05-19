#include "rasterband_pixels.hpp"
#include "../gdal_common.hpp"
#include "../gdal_rasterband.hpp"
#include "../async.hpp"
#include "../utils/typed_array.hpp"

#include <sstream>

namespace node_gdal {

/**
 * @typedef TypedArray Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array
 */

Nan::Persistent<FunctionTemplate> RasterBandPixels::constructor;

void RasterBandPixels::Initialize(Local<Object> target) {
  Nan::HandleScope scope;

  Local<FunctionTemplate> lcons = Nan::New<FunctionTemplate>(RasterBandPixels::New);
  lcons->InstanceTemplate()->SetInternalFieldCount(1);
  lcons->SetClassName(Nan::New("RasterBandPixels").ToLocalChecked());

  Nan::SetPrototypeMethod(lcons, "toString", toString);
  Nan::SetPrototypeMethod(lcons, "get", get);
  Nan::SetPrototypeMethod(lcons, "set", set);
  Nan__SetPrototypeAsyncableMethod(lcons, "read", read);
  Nan__SetPrototypeAsyncableMethod(lcons, "write", write);
  Nan__SetPrototypeAsyncableMethod(lcons, "readBlock", readBlock);
  Nan__SetPrototypeAsyncableMethod(lcons, "writeBlock", writeBlock);

  Nan::Set(target, Nan::New("RasterBandPixels").ToLocalChecked(), Nan::GetFunction(lcons).ToLocalChecked());

  constructor.Reset(lcons);
}

RasterBandPixels::RasterBandPixels() : Nan::ObjectWrap() {
}

RasterBandPixels::~RasterBandPixels() {
}

RasterBand *RasterBandPixels::parent(const Nan::FunctionCallbackInfo<v8::Value> &info) {
  Local<Object> parent =
    Nan::GetPrivate(info.This(), Nan::New("parent_").ToLocalChecked()).ToLocalChecked().As<Object>();
  RasterBand *band = Nan::ObjectWrap::Unwrap<RasterBand>(parent);
  if (!band->isAlive()) {
    Nan::ThrowError("RasterBand object has already been destroyed");
    return nullptr;
  }
  return band;
}

/**
 * A representation of a {{#crossLink
 * "gdal.RasterBand"}}RasterBand{{/crossLink}}'s pixels.
 *
 *
 * Note: Typed arrays should be created with an external ArrayBuffer for
 * versions of node >= 0.11
 * ```
 * var n = 16*16;
 * var data = new Float32Array(new ArrayBuffer(n*4));
 * //read data into the existing array
 * band.pixels.read(0,0,16,16,data);```
 *
 * @class gdal.RasterBandPixels
 */
NAN_METHOD(RasterBandPixels::New) {
  Nan::HandleScope scope;

  if (!info.IsConstructCall()) {
    Nan::ThrowError("Cannot call constructor as function, you need to use 'new' keyword");
    return;
  }
  if (info[0]->IsExternal()) {
    Local<External> ext = info[0].As<External>();
    void *ptr = ext->Value();
    RasterBandPixels *f = static_cast<RasterBandPixels *>(ptr);
    f->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
    return;
  } else {
    Nan::ThrowError("Cannot create RasterBandPixels directly");
    return;
  }
}

Local<Value> RasterBandPixels::New(Local<Value> band_obj) {
  Nan::EscapableHandleScope scope;

  RasterBandPixels *wrapped = new RasterBandPixels();

  v8::Local<v8::Value> ext = Nan::New<External>(wrapped);
  v8::Local<v8::Object> obj =
    Nan::NewInstance(Nan::GetFunction(Nan::New(RasterBandPixels::constructor)).ToLocalChecked(), 1, &ext)
      .ToLocalChecked();
  Nan::SetPrivate(obj, Nan::New("parent_").ToLocalChecked(), band_obj);

  return scope.Escape(obj);
}

NAN_METHOD(RasterBandPixels::toString) {
  Nan::HandleScope scope;
  info.GetReturnValue().Set(Nan::New("RasterBandPixels").ToLocalChecked());
}

/**
 * Returns the value at the x, y coordinate.
 *
 * @method get
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
NAN_METHOD(RasterBandPixels::get) {
  Nan::HandleScope scope;

  RasterBand *band;
  if ((band = parent(info)) == nullptr) return;

  int x, y;
  double val;

  NODE_ARG_INT(0, "x", x);
  NODE_ARG_INT(1, "y", y);

  GDAL_TRYLOCK_PARENT(band);
  CPLErr err = band->get()->RasterIO(GF_Read, x, y, 1, 1, &val, 1, 1, GDT_Float64, 0, 0);
  GDAL_UNLOCK_PARENT;
  if (err) {
    NODE_THROW_LAST_CPLERR;
    return;
  }

  info.GetReturnValue().Set(Nan::New<Number>(val));
}

/**
 * Sets the value at the x, y coordinate.
 *
 * @method set
 * @param {number} x
 * @param {number} y
 * @param {number} value
 */
NAN_METHOD(RasterBandPixels::set) {
  Nan::HandleScope scope;

  RasterBand *band;
  if ((band = parent(info)) == nullptr) return;

  int x, y;
  double val;

  NODE_ARG_INT(0, "x", x);
  NODE_ARG_INT(1, "y", y);
  NODE_ARG_DOUBLE(2, "val", val);

  GDAL_TRYLOCK_PARENT(band);
  CPLErr err = band->get()->RasterIO(GF_Write, x, y, 1, 1, &val, 1, 1, GDT_Float64, 0, 0);
  GDAL_UNLOCK_PARENT;
  if (err) {
    NODE_THROW_LAST_CPLERR;
    return;
  }

  return;
}

#if GDAL_VERSION_MAJOR >= 2
inline GDALRIOResampleAlg parseResamplingAlg(Local<Value> value) {
  if (value->IsUndefined() || value->IsNull()) { return GRIORA_NearestNeighbour; }
  if (!value->IsString()) { throw "resampling property must be a string"; }
  std::string name = *Nan::Utf8String(value);

  if (name == "NearestNeighbor") { return GRIORA_NearestNeighbour; }
  if (name == "NearestNeighbour") { return GRIORA_NearestNeighbour; }
  if (name == "Bilinear") { return GRIORA_Bilinear; }
  if (name == "Cubic") { return GRIORA_Cubic; }
  if (name == "CubicSpline") { return GRIORA_CubicSpline; }
  if (name == "Lanczos") { return GRIORA_Lanczos; }
  if (name == "Average") { return GRIORA_Average; }
  if (name == "Mode") { return GRIORA_Mode; }
  if (name == "Gauss") { return GRIORA_Gauss; }

  throw "Invalid resampling algorithm";
}
#endif

/**
 * @typedef ReadOptions { buffer_width?: number, buffer_height?: number, type?: string, pixel_space?: number, line_space?: number, resampling?: string }
 */

/**
 * Reads a region of pixels.
 *
 * @method read
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {TypedArray} [data] The [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @param {ReadOptions} [options]
 * @param {number} [options.buffer_width=x_size]
 * @param {number} [options.buffer_height=y_size]
 * @param {string} [options.data_type] See {{#crossLink "Constants (GDT)"}}GDT
 * constants{{/crossLink}}.
 * @param {number} [options.pixel_space]
 * @param {number} [options.line_space]
 * @param {string} [options.resampling] Resampling algorithm ({{#crossLink "Constants (GRA)"}}available options{{/crossLink}})
 * @return {TypedArray} A [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values.
 */

/**
 * Asynchronously reads a region of pixels.
 * If the last parameter is a callback, then this callback is called on completion and undefined is returned.
 * All optional parameters before the callback can be omitted so the callback parameter can be at any position as long
 * as it is the last parameter. Otherwise the function returns a Promise resolved with the result.
 *
 * @method readAsync
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {TypedArray} [data] The [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @param {ReadOptions} [options]
 * @param {number} [options.buffer_width=x_size]
 * @param {number} [options.buffer_height=y_size]
 * @param {string} [options.data_type] See {{#crossLink "Constants (GDT)"}}GDT
 * constants{{/crossLink}}.
 * @param {number} [options.pixel_space]
 * @param {number} [options.line_space]
 * @param {string} [options.resampling] Resampling algorithm ({{#crossLink "Constants (GRA)"}}available options{{/crossLink}})
 * @param {callback<TypedArray>} [callback=undefined] {{{cb}}}
 * @return {Promise<TypedArray>} A [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values.
 */
GDAL_ASYNCABLE_DEFINE(RasterBandPixels::read) {
  Nan::HandleScope scope;

  RasterBand *band;
  if ((band = parent(info)) == nullptr) return;

  int x, y, w, h;
  int buffer_w, buffer_h;
  int bytes_per_pixel;
  int pixel_space, line_space;
  int size, length, min_size, min_length;
  void *data;
  Local<Value> array;
  Local<Object> obj;
  GDALDataType type;

  NODE_ARG_INT(0, "x_offset", x);
  NODE_ARG_INT(1, "y_offset", y);
  NODE_ARG_INT(2, "x_size", w);
  NODE_ARG_INT(3, "y_size", h);

  std::string type_name = "";

  buffer_w = w;
  buffer_h = h;
  type = band->get()->GetRasterDataType();
  NODE_ARG_INT_OPT(5, "buffer_width", buffer_w);
  NODE_ARG_INT_OPT(6, "buffer_height", buffer_h);
  NODE_ARG_OPT_STR(7, "data_type", type_name);
  if (!type_name.empty()) { type = GDALGetDataTypeByName(type_name.c_str()); }

  if (!info[4]->IsUndefined() && !info[4]->IsNull()) {
    NODE_ARG_OBJECT(4, "data", obj);
    type = TypedArray::Identify(obj);
    if (type == GDT_Unknown) {
      Nan::ThrowError("Invalid array");
      return;
    }
  }

  bytes_per_pixel = GDALGetDataTypeSize(type) / 8;
  pixel_space = bytes_per_pixel;
  NODE_ARG_INT_OPT(8, "pixel_space", pixel_space);
  line_space = pixel_space * buffer_w;
  NODE_ARG_INT_OPT(9, "line_space", line_space);
#if GDAL_VERSION_MAJOR >= 2
  GDALRIOResampleAlg resampling;
  try {
    resampling = parseResamplingAlg(info[10]);
  } catch (const char *e) {
    Nan::ThrowError(e);
    return;
  }
#else
  std::string resampling;
  NODE_ARG_OPT_STR(10, "resampling", resampling);
  if (resampling.length() > 0) {
    Nan::ThrowError("Specifying resampling algorithm not supported on GDAL 1.x");
    return;
  }
#endif

  if (pixel_space < bytes_per_pixel) {
    Nan::ThrowError("pixel_space must be greater than or equal to size of data_type");
    return;
  }
  if (line_space < pixel_space * buffer_w) {
    Nan::ThrowError("line_space must be greater than or equal to pixel_space * buffer_w");
    return;
  }

  size = line_space * buffer_h;                      // bytes
  min_size = size - (pixel_space - bytes_per_pixel); // subtract away padding on last
                                                     // pixel that wont be written
  length = (size + bytes_per_pixel - 1) / bytes_per_pixel;
  min_length = (min_size + bytes_per_pixel - 1) / bytes_per_pixel;

  // create array if no array was passed
  if (obj.IsEmpty()) {
    array = TypedArray::New(type, length);
    if (array.IsEmpty() || !array->IsObject()) {
      return; // TypedArray::New threw an error
    }
    obj = array.As<Object>();
  }

  data = TypedArray::Validate(obj, type, min_length);
  if (!data) {
    return; // TypedArray::Validate threw an error
  }

  long ds_uid = band->parent_uid;
  GDALRasterBand *gdal_band = band->get();
  GDALAsyncableJob<CPLErr> job;
  job.persist("array", obj);
  job.persist(band->handle());
  job.main = [gdal_band, ds_uid, x, y, w, h, data, buffer_w, buffer_h, type, pixel_space, line_space, resampling]() {
#if GDAL_VERSION_MAJOR >= 2
    std::shared_ptr<GDALRasterIOExtraArg> extra(new GDALRasterIOExtraArg);
    INIT_RASTERIO_EXTRA_ARG(*extra);
    extra->eResampleAlg = resampling;
    extra->nVersion = RASTERIO_EXTRA_ARG_CURRENT_VERSION;
#endif

    GDAL_ASYNCABLE_LOCK(ds_uid);

#if GDAL_VERSION_MAJOR >= 2
    CPLErr err =
      gdal_band->RasterIO(GF_Read, x, y, w, h, data, buffer_w, buffer_h, type, pixel_space, line_space, extra.get());
#else
    CPLErr err = gdal_band->RasterIO(GF_Read, x, y, w, h, data, buffer_w, buffer_h, type, pixel_space, line_space);
#endif

    GDAL_UNLOCK_PARENT;
    if (err != CE_None) throw CPLGetLastErrorMsg();
    return err;
  };

  job.rval = [](CPLErr err, GetFromPersistentFunc getter) { return getter("array"); };
  job.run(info, async, 11);
}

/**
 * @typedef WriteOptions { buffer_width?: number, buffer_height?: number, pixel_space?: number, line_space?: number }
 */

/**
 * Writes a region of pixels.
 *
 * @method write
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {TypedArray} data The [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to write to the band.
 * @param {WriteOptions} [options]
 * @param {number} [options.buffer_width=x_size]
 * @param {number} [options.buffer_height=y_size]
 * @param {number} [options.pixel_space]
 * @param {number} [options.line_space]
 */

/**
 * Asynchronously writes a region of pixels.
 * If the last parameter is a callback, then this callback is called on completion and undefined is returned.
 * All optional parameters before the callback can be omitted so the callback parameter can be at any position as long
 as it is the last parameter.
 * Otherwise the function returns a Promise resolved with the result.
 * certain optional parameters are omitted
 *
 * @method writeAsync
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {TypedArray} data The [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to write to the band.
 * @param {WriteOptions} [options]
 * @param {number} [options.buffer_width=x_size]
 * @param {number} [options.buffer_height=y_size]
 * @param {number} [options.pixel_space]
 * @param {number} [options.line_space]
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(RasterBandPixels::write) {
  Nan::HandleScope scope;

  RasterBand *band;
  if ((band = parent(info)) == nullptr) return;

  int x, y, w, h;
  int buffer_w, buffer_h;
  int bytes_per_pixel;
  int pixel_space, line_space;
  int size, min_size, min_length;
  void *data;
  Local<Object> passed_array;
  GDALDataType type;

  NODE_ARG_INT(0, "x_offset", x);
  NODE_ARG_INT(1, "y_offset", y);
  NODE_ARG_INT(2, "x_size", w);
  NODE_ARG_INT(3, "y_size", h);
  NODE_ARG_OBJECT(4, "data", passed_array);

  buffer_w = w;
  buffer_h = h;
  NODE_ARG_INT_OPT(5, "buffer_width", buffer_w);
  NODE_ARG_INT_OPT(6, "buffer_height", buffer_h);

  type = TypedArray::Identify(passed_array);
  if (type == GDT_Unknown) {
    Nan::ThrowError("Invalid array");
    return;
  }

  bytes_per_pixel = GDALGetDataTypeSize(type) / 8;
  pixel_space = bytes_per_pixel;
  NODE_ARG_INT_OPT(7, "pixel_space", pixel_space);
  line_space = pixel_space * buffer_w;
  NODE_ARG_INT_OPT(8, "line_space", line_space);

  size = line_space * buffer_h;                      // bytes
  min_size = size - (pixel_space - bytes_per_pixel); // subtract away padding on last pixel that wont be read
  min_length = (min_size + bytes_per_pixel - 1) / bytes_per_pixel;

  if (pixel_space < bytes_per_pixel) {
    Nan::ThrowError("pixel_space must be greater than or equal to size of data_type");
    return;
  }
  if (line_space < pixel_space * buffer_w) {
    Nan::ThrowError("line_space must be greater than or equal to pixel_space * buffer_w");
    return;
  }

  data = TypedArray::Validate(passed_array, type, min_length);
  if (!data) {
    return; // TypedArray::Validate threw an error
  }

  long ds_uid = band->parent_uid;
  GDALRasterBand *gdal_band = band->get();
  GDALAsyncableJob<CPLErr> job;
  job.persist("array", passed_array);
  job.persist(band->handle());
  job.main = [gdal_band, ds_uid, x, y, w, h, data, buffer_w, buffer_h, type, pixel_space, line_space]() {
    GDAL_ASYNCABLE_LOCK(ds_uid);
    CPLErr err = gdal_band->RasterIO(GF_Write, x, y, w, h, data, buffer_w, buffer_h, type, pixel_space, line_space);
    GDAL_UNLOCK_PARENT;
    if (err != CE_None) throw CPLGetLastErrorMsg();
    return err;
  };
  job.rval = [](CPLErr, GetFromPersistentFunc getter) { return getter("array"); };

  job.run(info, async, 9);
}

/**
 * Reads a block of pixels.
 *
 * @method readBlock
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {TypedArray} [data] The [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @return {TypedArray} A [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values.
 */

/**
 * Reads a block of pixels.
 * {{{async}}}
 *
 * @method readBlockAsync
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {TypedArray} [data] The [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @param {callback<TypedArray>} [callback=undefined] {{{cb}}}
 * @return {Promise<TypedArray>} A [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values.
 */

GDAL_ASYNCABLE_DEFINE(RasterBandPixels::readBlock) {
  Nan::HandleScope scope;

  RasterBand *band;
  if ((band = parent(info)) == nullptr) return;

  int x, y, w = 0, h = 0;
  NODE_ARG_INT(0, "block_x_offset", x);
  NODE_ARG_INT(1, "block_y_offset", y);

  band->get()->GetBlockSize(&w, &h);

  GDALDataType type = band->get()->GetRasterDataType();

  Local<Value> array;
  Local<Object> obj;

  if (info.Length() > 2 && !info[2]->IsUndefined() && !info[2]->IsNull()) {
    NODE_ARG_OBJECT(2, "data", obj);
    array = obj;
  } else {
    array = TypedArray::New(type, w * h);
    if (array.IsEmpty() || !array->IsObject()) {
      return; // TypedArray::New threw an error
    }
    obj = array.As<Object>();
  }

  void *data = TypedArray::Validate(obj, type, w * h);
  if (!data) {
    return; // TypedArray::Validate threw an error
  }

  GDALRasterBand *gdal_band = band->get();
  long parent_uid = band->parent_uid;

  GDALAsyncableJob<CPLErr> job;
  job.persist("array", obj);
  job.persist(band->handle());
  job.main = [gdal_band, parent_uid, x, y, data]() {
    GDAL_ASYNCABLE_LOCK(parent_uid);
    CPLErr err = gdal_band->ReadBlock(x, y, data);
    GDAL_UNLOCK_PARENT;
    if (err) { throw CPLGetLastErrorMsg(); }
    return err;
  };
  job.rval = [](CPLErr r, GetFromPersistentFunc getter) { return getter("array"); };
  job.run(info, async, 3);
}

/**
 * Writes a block of pixels.
 *
 * @method writeBlock
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {TypedArray} data The [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values to write to the band.
 */

/**
 * Writes a block of pixels.
 * {{{async}}}
 *
 * @method writeBlockAsync
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {TypedArray} data The [TypedArray](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values to write to the band.
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
GDAL_ASYNCABLE_DEFINE(RasterBandPixels::writeBlock) {
  Nan::HandleScope scope;

  RasterBand *band;
  if ((band = parent(info)) == nullptr) return;

  int x, y, w = 0, h = 0;

  band->get()->GetBlockSize(&w, &h);

  NODE_ARG_INT(0, "block_x_offset", x);
  NODE_ARG_INT(1, "block_y_offset", y);

  Local<Object> obj;
  NODE_ARG_OBJECT(2, "data", obj);

  // validate array
  void *data = TypedArray::Validate(obj, band->get()->GetRasterDataType(), w * h);
  if (!data) {
    return; // TypedArray::Validate threw an error
  }

  GDALRasterBand *gdal_band = band->get();
  long parent_uid = band->parent_uid;

  GDALAsyncableJob<CPLErr> job;
  job.persist(obj, band->handle());
  job.main = [gdal_band, parent_uid, x, y, data]() {
    GDAL_ASYNCABLE_LOCK(parent_uid);
    CPLErr err = gdal_band->WriteBlock(x, y, data);
    GDAL_UNLOCK_PARENT;
    if (err) { throw CPLGetLastErrorMsg(); }
    return err;
  };
  job.rval = [](CPLErr r, GetFromPersistentFunc) { return Nan::Undefined(); };
  job.run(info, async, 3);
}

} // namespace node_gdal
