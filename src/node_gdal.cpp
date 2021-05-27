/**
 * This [node-gdal-async](https://github.com/mmomtchev/node-gdal-async) binding for
 * Node.js provides a feature-complete way of reading, writing, and manipulating
 * geospatial data, raster and vector, synchronously and asynchronously using [GDAL](http://www.gdal.org/).
 * ```
 * // sample: open a shapefile and display all features as geojson
 * const dataset = gdal.open("states.shp");
 *
 * dataset.layers.get(0).features.forEach(function(feature) {
 *     console.log(feature.getGeometry().toJSON());
 * });
 * ```
 *
 * ```
 * // same thing, but asynchronously, allowing integration in server-side multi-user code
 * const dataset = await gdal.openAsync("states.shp");
 * const features = (await dataset.layers.getAsync(0)).features;
 * const len = await features.countAsync();
 *
 * for (let i = t; i < len; i++) {
 *   features.getAsync(i, (error, feature) => {
 *     console.log(feature.getGeometry().toJSON());
 *   });
 * }
 * ```
 *
 * see <https://gist.github.com/mmomtchev/14c3428255fd9c88ed20517572d8efdc>
 * for some performance considerations when designing code that will run
 * multiple parallel operations on the same dataset
 *
 * <iframe
 * src="http://ghbtns.com/github-btn.html?user=mmomtchev&repo=node-gdal-async&type=watch&count=true"
 * allowtransparency="true" frameborder="0" scrolling="0" width="90" height="20"
 * style="margin-top:20px"></iframe> <iframe
 * src="http://ghbtns.com/github-btn.html?user=mmomtchev&repo=node-gdal-async&type=fork&count=true"
 * allowtransparency="true" frameborder="0" scrolling="0" width="200"
 * height="20"></iframe>
 *
 * @class gdal
 */

// node
#include <node.h>
#include <node_buffer.h>
#include <node_version.h>

// nan
#include "nan-wrapper.h"

// gdal
#include <gdal.h>

// node-gdal
#include "gdal_algorithms.hpp"
#include "gdal_common.hpp"
#include "gdal_dataset.hpp"
#include "gdal_driver.hpp"
#include "gdal_rasterband.hpp"
#include "gdal_warper.hpp"

#include "gdal_coordinate_transformation.hpp"
#include "gdal_feature.hpp"
#include "gdal_feature_defn.hpp"
#include "gdal_field_defn.hpp"
#include "geometry/gdal_geometry.hpp"
#include "geometry/gdal_geometrycollection.hpp"
#include "gdal_layer.hpp"
#include "geometry/gdal_simplecurve.hpp"
#include "geometry/gdal_linearring.hpp"
#include "geometry/gdal_linestring.hpp"
#include "geometry/gdal_circularstring.hpp"
#include "geometry/gdal_compoundcurve.hpp"
#include "geometry/gdal_multilinestring.hpp"
#include "geometry/gdal_multicurve.hpp"
#include "geometry/gdal_multipoint.hpp"
#include "geometry/gdal_multipolygon.hpp"
#include "geometry/gdal_point.hpp"
#include "geometry/gdal_polygon.hpp"
#include "gdal_spatial_reference.hpp"
#include "gdal_memfile.hpp"

#include "utils/field_types.hpp"

// collections
#include "collections/dataset_bands.hpp"
#include "collections/dataset_layers.hpp"
#include "collections/feature_defn_fields.hpp"
#include "collections/feature_fields.hpp"
#include "collections/gdal_drivers.hpp"
#include "collections/geometry_collection_children.hpp"
#include "collections/layer_features.hpp"
#include "collections/layer_fields.hpp"
#include "collections/linestring_points.hpp"
#include "collections/polygon_rings.hpp"
#include "collections/compound_curves.hpp"
#include "collections/rasterband_overviews.hpp"
#include "collections/rasterband_pixels.hpp"

// std
#include <sstream>
#include <string>
#include <vector>

namespace node_gdal {

using namespace node;
using namespace v8;

FILE *log_file = NULL;
PtrManager ptr_manager;

/**
 * @attribute lastError
 * @type {object}
 */
static NAN_GETTER(LastErrorGetter) {
  Nan::HandleScope scope;

  int errtype = CPLGetLastErrorType();
  if (errtype == CE_None) {
    info.GetReturnValue().Set(Nan::Null());
    return;
  }

  Local<Object> result = Nan::New<Object>();
  Nan::Set(result, Nan::New("code").ToLocalChecked(), Nan::New(CPLGetLastErrorNo()));
  Nan::Set(result, Nan::New("message").ToLocalChecked(), Nan::New(CPLGetLastErrorMsg()).ToLocalChecked());
  Nan::Set(result, Nan::New("level").ToLocalChecked(), Nan::New(errtype));
  info.GetReturnValue().Set(result);
}

static NAN_SETTER(LastErrorSetter) {
  Nan::HandleScope scope;

  if (value->IsNull()) {
    CPLErrorReset();
  } else {
    Nan::ThrowError("'lastError' only supports being set to null");
    return;
  }
}

extern "C" {

static NAN_METHOD(QuietOutput) {
  CPLSetErrorHandler(CPLQuietErrorHandler);
  return;
}

static NAN_METHOD(VerboseOutput) {
  CPLSetErrorHandler(CPLDefaultErrorHandler);
  return;
}

#ifdef ENABLE_LOGGING
static NAN_GC_CALLBACK(beforeGC) {
  LOG("%s", "Starting garbage collection");
}

static NAN_GC_CALLBACK(afterGC) {
  LOG("%s", "Finished garbage collection");
}
#endif

static NAN_METHOD(StartLogging) {
  Nan::HandleScope scope;

#ifdef ENABLE_LOGGING
  std::string filename = "";
  NODE_ARG_STR(0, "filename", filename);
  if (filename.empty()) {
    Nan::ThrowError("Invalid filename");
    return;
  }
  if (log_file) fclose(log_file);
  log_file = fopen(filename.c_str(), "w");
  if (!log_file) {
    Nan::ThrowError("Error creating log file");
    return;
  }

  Nan::AddGCPrologueCallback(beforeGC);
  Nan::AddGCEpilogueCallback(afterGC);

#else
  Nan::ThrowError("Logging requires node-gdal be compiled with --enable_logging=true");
#endif

  return;
}

static NAN_METHOD(StopLogging) {
#ifdef ENABLE_LOGGING
  if (log_file) {
    fclose(log_file);
    log_file = NULL;
  }
#endif

  return;
}

static NAN_METHOD(Log) {
  Nan::HandleScope scope;
  std::string msg;
  NODE_ARG_STR(0, "message", msg);
  msg = msg + "\n";

#ifdef ENABLE_LOGGING
  if (log_file) {
    fputs(msg.c_str(), log_file);
    fflush(log_file);
  }
#endif

  return;
}

/*
 * Common code for sync and async opening
 */
GDAL_ASYNCABLE_GLOBAL(gdal_open);
GDAL_ASYNCABLE_DEFINE(gdal_open) {
  Nan::HandleScope scope;

  std::string path;
  std::string mode = "r";

  NODE_ARG_STR(0, "path", path);
  NODE_ARG_OPT_STR(1, "mode", mode);

  unsigned int flags = 0;
  if (mode == "r+") {
    flags |= GDAL_OF_UPDATE;
  } else if (mode == "r") {
    flags |= GDAL_OF_READONLY;
  } else {
    Nan::ThrowError("Invalid open mode. Must be \"r\" or \"r+\"");
    return;
  }
  flags |= GDAL_OF_VERBOSE_ERROR;

  GDALAsyncableJob<GDALDataset *> job;
  job.rval = [](GDALDataset *ds, GetFromPersistentFunc) { return Dataset::New(ds); };
  job.main = [path, flags](const GDALExecutionProgress &) {
    GDALDataset *ds = (GDALDataset *)GDALOpenEx(path.c_str(), flags, NULL, NULL, NULL);
    if (!ds) throw CPLGetLastErrorMsg();
    return ds;
  };
  job.run(info, async, 2);
}

static NAN_METHOD(setConfigOption) {
  Nan::HandleScope scope;

  std::string name;

  NODE_ARG_STR(0, "name", name);

  if (info.Length() < 2) {
    Nan::ThrowError("string or null value must be provided");
    return;
  }
  if (info[1]->IsString()) {
    std::string val = *Nan::Utf8String(info[1]);
    CPLSetConfigOption(name.c_str(), val.c_str());
  } else if (info[1]->IsNull() || info[1]->IsUndefined()) {
    CPLSetConfigOption(name.c_str(), NULL);
  } else {
    Nan::ThrowError("value must be a string or null");
    return;
  }

  return;
}

static NAN_METHOD(getConfigOption) {
  Nan::HandleScope scope;

  std::string name;
  NODE_ARG_STR(0, "name", name);

  info.GetReturnValue().Set(SafeString::New(CPLGetConfigOption(name.c_str(), NULL)));
}

/**
 * Convert decimal degrees to degrees, minutes, and seconds string
 *
 * @for gdal
 * @static
 * @method decToDMS
 * @param {number} angle
 * @param {string} axis `"lat"` or `"long"`
 * @param {number} [precision=2]
 * @return {string} A string nndnn'nn.nn'"L where n is a number and L is either
 * N or E
 */
static NAN_METHOD(decToDMS) {
  Nan::HandleScope scope;

  double angle;
  std::string axis;
  int precision = 2;
  NODE_ARG_DOUBLE(0, "angle", angle);
  NODE_ARG_STR(1, "axis", axis);
  NODE_ARG_INT_OPT(2, "precision", precision);

  if (axis.length() > 0) { axis[0] = toupper(axis[0]); }
  if (axis != "Lat" && axis != "Long") {
    Nan::ThrowError("Axis must be 'lat' or 'long'");
    return;
  }

  info.GetReturnValue().Set(SafeString::New(GDALDecToDMS(angle, axis.c_str(), precision)));
}

/**
 * Set paths where proj will search it data.
 *
 * @for gdal
 * @static
 * @method setPROJSearchPaths
 * @param {string} Path `c:\ProjData`
 */
static NAN_METHOD(setPROJSearchPath) {
  Nan::HandleScope scope;
  std::string path;

  NODE_ARG_STR(0, "path", path);

#if GDAL_VERSION_MAJOR >= 3
  const char *const paths[] = {path.c_str(), nullptr};
  OSRSetPROJSearchPaths(paths);
#endif
}

static NAN_METHOD(ThrowDummyCPLError) {
  CPLError(CE_Failure, CPLE_AppDefined, "Mock error");
  return;
}

static NAN_METHOD(isAlive) {
  Nan::HandleScope scope;

  long uid;
  NODE_ARG_INT(0, "uid", uid);

  info.GetReturnValue().Set(Nan::New(ptr_manager.isAlive(uid)));
}

static NAN_METHOD(getMemfileName) {
  Nan::HandleScope scope;
  Local<Object> buffer;

  NODE_ARG_OBJECT(0, "buffer", buffer);

  Memfile *memfile = Memfile::get(buffer);
  if (memfile == nullptr)
    Nan::ThrowError("Failed creating in-memory file");
  else
    info.GetReturnValue().Set(Nan::New<String>(memfile->filename).ToLocalChecked());
}

static void Init(Local<Object> target, Local<v8::Value>, void *) {

  Nan__SetAsyncableMethod(target, "open", gdal_open);
  Nan::SetMethod(target, "setConfigOption", setConfigOption);
  Nan::SetMethod(target, "getConfigOption", getConfigOption);
  Nan::SetMethod(target, "decToDMS", decToDMS);
  Nan::SetMethod(target, "setPROJSearchPath", setPROJSearchPath);
  Nan::SetMethod(target, "_triggerCPLError", ThrowDummyCPLError); // for tests
  Nan::SetMethod(target, "_isAlive", isAlive);                    // for tests
  Nan::SetMethod(target, "_getMemFileName", getMemfileName);      // not a public API

  Warper::Initialize(target);
  Algorithms::Initialize(target);

  Driver::Initialize(target);
  Dataset::Initialize(target);
  RasterBand::Initialize(target);

  Layer::Initialize(target);
  Feature::Initialize(target);
  FeatureDefn::Initialize(target);
  FieldDefn::Initialize(target);
  Geometry::Initialize(target);
  Point::Initialize(target);
  SimpleCurve::Initialize(target);
  LineString::Initialize(target);
  LinearRing::Initialize(target);
  Polygon::Initialize(target);
  GeometryCollection::Initialize(target);
  MultiPoint::Initialize(target);
  MultiLineString::Initialize(target);
  MultiPolygon::Initialize(target);
  CircularString::Initialize(target);
  CompoundCurve::Initialize(target);
  MultiCurve::Initialize(target);

  SpatialReference::Initialize(target);
  CoordinateTransformation::Initialize(target);

  DatasetBands::Initialize(target);
  DatasetLayers::Initialize(target);
  LayerFeatures::Initialize(target);
  FeatureFields::Initialize(target);
  LayerFields::Initialize(target);
  FeatureDefnFields::Initialize(target);
  GeometryCollectionChildren::Initialize(target);
  PolygonRings::Initialize(target);
  LineStringPoints::Initialize(target);
  CompoundCurveCurves::Initialize(target);
  RasterBandOverviews::Initialize(target);
  RasterBandPixels::Initialize(target);

  /**
   * The collection of all drivers registered with GDAL
   *
   * @final
   * @for gdal
   * @property gdal.drivers
   * @type {gdal.GDALDrivers}
   */
  GDALDrivers::Initialize(target); // calls GDALRegisterAll()
  Nan::Set(target, Nan::New("drivers").ToLocalChecked(), GDALDrivers::New());

  /**
   * @class gdal
   */

  /**
   * @class Constants (DMD)
   */

  /**
   * @final
   * @property gdal.DMD_LONGNAME
   * @type {string}
   */
  Nan::Set(target, Nan::New("DMD_LONGNAME").ToLocalChecked(), Nan::New(GDAL_DMD_LONGNAME).ToLocalChecked());
  /**
   * @final
   * @property gdal.DMD_MIMETYPE
   * @type {string}
   */
  Nan::Set(target, Nan::New("DMD_MIMETYPE").ToLocalChecked(), Nan::New(GDAL_DMD_MIMETYPE).ToLocalChecked());
  /**
   * @final
   * @property gdal.DMD_HELPTOPIC
   * @type {string}
   */
  Nan::Set(target, Nan::New("DMD_HELPTOPIC").ToLocalChecked(), Nan::New(GDAL_DMD_HELPTOPIC).ToLocalChecked());
  /**
   * @final
   * @property gdal.DMD_EXTENSION
   * @type {string}
   */
  Nan::Set(target, Nan::New("DMD_EXTENSION").ToLocalChecked(), Nan::New(GDAL_DMD_EXTENSION).ToLocalChecked());
  /**
   * @final
   * @property gdal.DMD_CREATIONOPTIONLIST
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("DMD_CREATIONOPTIONLIST").ToLocalChecked(),
    Nan::New(GDAL_DMD_CREATIONOPTIONLIST).ToLocalChecked());
  /**
   * @final
   * @property gdal.DMD_CREATIONDATATYPES
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("DMD_CREATIONDATATYPES").ToLocalChecked(), Nan::New(GDAL_DMD_CREATIONDATATYPES).ToLocalChecked());

  /**
   * @class Constants (CPL Error Levels)
   */

  /**
   * Error level: (no error)
   *
   * @final
   * @property gdal.CE_None
   * @type {number}
   */
  Nan::Set(target, Nan::New("CE_None").ToLocalChecked(), Nan::New(CE_None));
  /**
   * Error level: Debug
   *
   * @final
   * @property gdal.CE_Debug
   * @type {number}
   */
  Nan::Set(target, Nan::New("CE_Debug").ToLocalChecked(), Nan::New(CE_Debug));
  /**
   * Error level: Warning
   *
   * @final
   * @property gdal.CE_Warning
   * @type {number}
   */
  Nan::Set(target, Nan::New("CE_Warning").ToLocalChecked(), Nan::New(CE_Warning));
  /**
   * Error level: Failure
   *
   * @final
   * @property gdal.CE_Failure
   * @type {number}
   */
  Nan::Set(target, Nan::New("CE_Failure").ToLocalChecked(), Nan::New(CE_Failure));
  /**
   * Error level: Fatal
   *
   * @final
   * @property gdal.CE_Fatal
   * @type {number}
   */
  Nan::Set(target, Nan::New("CE_Fatal").ToLocalChecked(), Nan::New(CE_Fatal));

  /**
   * @class Constants (CPL Error Codes)
   */

  /**
   * @final
   * @property gdal.CPLE_None
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_None").ToLocalChecked(), Nan::New(CPLE_None));
  /**
   * @final
   * @property gdal.CPLE_AppDefined
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_AppDefined").ToLocalChecked(), Nan::New(CPLE_AppDefined));
  /**
   * @final
   * @property gdal.CPLE_OutOfMemory
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_OutOfMemory").ToLocalChecked(), Nan::New(CPLE_OutOfMemory));
  /**
   * @final
   * @property gdal.CPLE_FileIO
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_FileIO").ToLocalChecked(), Nan::New(CPLE_FileIO));
  /**
   * @final
   * @property gdal.CPLE_OpenFailed
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_OpenFailed").ToLocalChecked(), Nan::New(CPLE_OpenFailed));
  /**
   * @final
   * @property gdal.CPLE_IllegalArg
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_IllegalArg").ToLocalChecked(), Nan::New(CPLE_IllegalArg));
  /**
   * @final
   * @property gdal.CPLE_NotSupported
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_NotSupported").ToLocalChecked(), Nan::New(CPLE_NotSupported));
  /**
   * @final
   * @property gdal.CPLE_AssertionFailed
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_AssertionFailed").ToLocalChecked(), Nan::New(CPLE_AssertionFailed));
  /**
   * @final
   * @property gdal.CPLE_NoWriteAccess
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_NoWriteAccess").ToLocalChecked(), Nan::New(CPLE_NoWriteAccess));
  /**
   * @final
   * @property gdal.CPLE_UserInterrupt
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_UserInterrupt").ToLocalChecked(), Nan::New(CPLE_UserInterrupt));
  /**
   * @final
   * @property gdal.CPLE_objectNull
   * @type {number}
   */
  Nan::Set(target, Nan::New("CPLE_ObjectNull").ToLocalChecked(), Nan::New(CPLE_ObjectNull));

  /**
   * @class Constants (DCAP)
   */

  /**
   * @final
   * @property gdal.DCAP_CREATE
   * @type {string}
   */
  Nan::Set(target, Nan::New("DCAP_CREATE").ToLocalChecked(), Nan::New(GDAL_DCAP_CREATE).ToLocalChecked());
  /**
   * @final
   * @property gdal.DCAP_CREATECOPY
   * @type {string}
   */
  Nan::Set(target, Nan::New("DCAP_CREATECOPY").ToLocalChecked(), Nan::New(GDAL_DCAP_CREATECOPY).ToLocalChecked());
  /**
   * @final
   * @property gdal.DCAP_VIRTUALIO
   * @type {string}
   */
  Nan::Set(target, Nan::New("DCAP_VIRTUALIO").ToLocalChecked(), Nan::New(GDAL_DCAP_VIRTUALIO).ToLocalChecked());

  /**
   * @class Constants (OLC)
   */

  /**
   * @final
   * @property gdal.OLCRandomRead
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCRandomRead").ToLocalChecked(), Nan::New(OLCRandomRead).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCSequentialWrite
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCSequentialWrite").ToLocalChecked(), Nan::New(OLCSequentialWrite).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCRandomWrite
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCRandomWrite").ToLocalChecked(), Nan::New(OLCRandomWrite).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCFastSpatialFilter
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCFastSpatialFilter").ToLocalChecked(), Nan::New(OLCFastSpatialFilter).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCFastFeatureCount
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCFastFeatureCount").ToLocalChecked(), Nan::New(OLCFastFeatureCount).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCFastGetExtent
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCFastGetExtent").ToLocalChecked(), Nan::New(OLCFastGetExtent).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCCreateField
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCCreateField").ToLocalChecked(), Nan::New(OLCCreateField).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCDeleteField
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCDeleteField").ToLocalChecked(), Nan::New(OLCDeleteField).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCReorderFields
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCReorderFields").ToLocalChecked(), Nan::New(OLCReorderFields).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCAlterFieldDefn
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCAlterFieldDefn").ToLocalChecked(), Nan::New(OLCAlterFieldDefn).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCTransactions
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCTransactions").ToLocalChecked(), Nan::New(OLCTransactions).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCDeleteFeature
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCDeleteFeature").ToLocalChecked(), Nan::New(OLCDeleteFeature).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCFastSetNextByIndex
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("OLCFastSetNextByIndex").ToLocalChecked(), Nan::New(OLCFastSetNextByIndex).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCStringsAsUTF8
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCStringsAsUTF8").ToLocalChecked(), Nan::New(OLCStringsAsUTF8).ToLocalChecked());
  /**
   * @final
   * @property gdal.OLCIgnoreFields
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCIgnoreFields").ToLocalChecked(), Nan::New(OLCIgnoreFields).ToLocalChecked());

#ifdef OLCCreateGeomField
  /**
   * @final
   * @property gdal.OLCCreateGeomField
   * @type {string}
   */
  Nan::Set(target, Nan::New("OLCCreateGeomField").ToLocalChecked(), Nan::New(OLCCreateGeomField).ToLocalChecked());
#endif
#ifdef ODsCCreateGeomFieldAfterCreateLayer

  /**
   * @class Constants (ODsC)
   */

  /**
   * @final
   * @property gdal.ODsCCreateLayer
   * @type {string}
   */
  Nan::Set(target, Nan::New("ODsCCreateLayer").ToLocalChecked(), Nan::New(ODsCCreateLayer).ToLocalChecked());
  /**
   * @final
   * @property gdal.ODsCDeleteLayer
   * @type {string}
   */
  Nan::Set(target, Nan::New("ODsCDeleteLayer").ToLocalChecked(), Nan::New(ODsCDeleteLayer).ToLocalChecked());
  /**
   * @final
   * @property gdal.ODsCCreateGeomFieldAfterCreateLayer
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("ODsCCreateGeomFieldAfterCreateLayer").ToLocalChecked(),
    Nan::New(ODsCCreateGeomFieldAfterCreateLayer).ToLocalChecked());
#endif
  /**
   * @final
   * @property gdal.ODrCCreateDataSource
   * @type {string}
   */
  Nan::Set(target, Nan::New("ODrCCreateDataSource").ToLocalChecked(), Nan::New(ODrCCreateDataSource).ToLocalChecked());
  /**
   * @final
   * @property gdal.ODrCDeleteDataSource
   * @type {string}
   */
  Nan::Set(target, Nan::New("ODrCDeleteDataSource").ToLocalChecked(), Nan::New(ODrCDeleteDataSource).ToLocalChecked());

  NODE_DEFINE_CONSTANT(target, GA_ReadOnly);
  NODE_DEFINE_CONSTANT(target, GA_Update);
  NODE_DEFINE_CONSTANT(target, GF_Read);
  NODE_DEFINE_CONSTANT(target, GF_Write);

  /**
   * Pixel data types.
   *
   * @class Constants (GDT)
   */

  /**
   * Unknown or unspecified type
   * @final
   * @property gdal.GDT_Unknown
   * @type {string}
   */
  Nan::Set(target, Nan::New("GDT_Unknown").ToLocalChecked(), Nan::Undefined());
  /**
   * Eight bit unsigned integer
   * @final
   * @property gdal.GDT_Byte
   * @type {string}
   */
  Nan::Set(target, Nan::New("GDT_Byte").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_Byte)).ToLocalChecked());
  /**
   * Sixteen bit unsigned integer
   * @final
   * @property gdal.GDT_UInt16
   * @type {string}
   */
  Nan::Set(target, Nan::New("GDT_UInt16").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_UInt16)).ToLocalChecked());
  /**
   * Sixteen bit signed integer
   * @final
   * @property gdal.GDT_Int16
   * @type {string}
   */
  Nan::Set(target, Nan::New("GDT_Int16").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_Int16)).ToLocalChecked());
  /**
   * Thirty two bit unsigned integer
   * @final
   * @property gdal.GDT_UInt32
   * @type {string}
   */
  Nan::Set(target, Nan::New("GDT_UInt32").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_UInt32)).ToLocalChecked());
  /**
   * Thirty two bit signed integer
   * @final
   * @property gdal.GDT_Int32
   * @type {string}
   */
  Nan::Set(target, Nan::New("GDT_Int32").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_Int32)).ToLocalChecked());
  /**
   * Thirty two bit floating point
   * @final
   * @property gdal.GDT_Float32
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("GDT_Float32").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_Float32)).ToLocalChecked());
  /**
   * Sixty four bit floating point
   * @final
   * @property gdal.GDT_Float64
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("GDT_Float64").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_Float64)).ToLocalChecked());
  /**
   * Complex Int16
   * @final
   * @property gdal.GDT_CInt16
   * @type {string}
   */
  Nan::Set(target, Nan::New("GDT_CInt16").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_CInt16)).ToLocalChecked());
  /**
   * Complex Int32
   * @final
   * @property gdal.GDT_CInt32
   * @type {string}
   */
  Nan::Set(target, Nan::New("GDT_CInt32").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_CInt32)).ToLocalChecked());
  /**
   * Complex Float32
   * @final
   * @property gdal.GDT_CFloat32
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("GDT_CFloat32").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_CFloat32)).ToLocalChecked());
  /**
   * Complex Float64
   * @final
   * @property gdal.GDT_CFloat64
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("GDT_CFloat64").ToLocalChecked(), Nan::New(GDALGetDataTypeName(GDT_CFloat64)).ToLocalChecked());

  /**
   * @class Constants (OJ)
   */

  /**
   * @final
   * @property gdal.OJUndefined
   * @type {string}
   */
  Nan::Set(target, Nan::New("OJUndefined").ToLocalChecked(), Nan::Undefined());
  /**
   * @final
   * @property gdal.OJLeft
   * @type {string}
   */
  Nan::Set(target, Nan::New("OJLeft").ToLocalChecked(), Nan::New("Left").ToLocalChecked());
  /**
   * @final
   * @property gdal.OJRight
   * @type {string}
   */
  Nan::Set(target, Nan::New("OJRight").ToLocalChecked(), Nan::New("Right").ToLocalChecked());

  /**
   * @class Constants (GCI)
   */

  /**
   * @final
   * @property gdal.GCI_Undefined
   * @type {string}
   */
  Nan::Set(target, Nan::New("GCI_Undefined").ToLocalChecked(), Nan::Undefined());
  /**
   * @final
   * @property gdal.GCI_GrayIndex
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_GrayIndex").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_GrayIndex)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_PaletteIndex
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_PaletteIndex").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_PaletteIndex)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_RedBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_RedBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_RedBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_GreenBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_GreenBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_GreenBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_BlueBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_BlueBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_BlueBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_AlphaBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_AlphaBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_AlphaBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_HueBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_HueBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_HueBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_SaturationBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_SaturationBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_SaturationBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_LightnessBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_LightnessBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_LightnessBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_CyanBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_CyanBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_CyanBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_MagentaBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_MagentaBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_MagentaBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_YellowBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_YellowBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_YellowBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_BlackBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_BlackBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_BlackBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_YCbCr_YBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_YCbCr_YBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_YCbCr_YBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_YCbCr_CbBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_YCbCr_CbBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_YCbCr_CbBand)).ToLocalChecked());
  /**
   * @final
   * @property gdal.GCI_YCbCr_CrBand
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("GCI_YCbCr_CrBand").ToLocalChecked(),
    Nan::New(GDALGetColorInterpretationName(GCI_YCbCr_CrBand)).ToLocalChecked());

  /**
   * @class Constants (wkbVariant)
   */

  /**
   * Old-style 99-402 extended dimension (Z) WKB types.
   * Synonymous with 'wkbVariantOldOgc' (gdal >= 2.0)
   *
   * @final
   * @property gdal.wkbVariantOgc
   * @type {string}
   */
  Nan::Set(target, Nan::New("wkbVariantOgc").ToLocalChecked(), Nan::New("OGC").ToLocalChecked());

  /**
   * Old-style 99-402 extended dimension (Z) WKB types.
   * Synonymous with 'wkbVariantOgc' (gdal < 2.0)
   *
   * @final
   * @property gdal.wkbVariantOldOgc
   * @type {string}
   */
  Nan::Set(target, Nan::New("wkbVariantOldOgc").ToLocalChecked(), Nan::New("OGC").ToLocalChecked());

  /**
   * SFSQL 1.2 and ISO SQL/MM Part 3 extended dimension (Z&M) WKB types.
   *
   * @final
   * @property gdal.wkbVariantIso
   * @type {string}
   */
  Nan::Set(target, Nan::New("wkbVariantIso").ToLocalChecked(), Nan::New("ISO").ToLocalChecked());

  /**
   * @class Constants (wkbByteOrder)
   */

  /**
   * @final
   * @property gdal.wkbXDR
   * @type {string}
   */
  Nan::Set(target, Nan::New("wkbXDR").ToLocalChecked(), Nan::New("MSB").ToLocalChecked());
  /**
   * @final
   * @property gdal.wkbNDR
   * @type {string}
   */
  Nan::Set(target, Nan::New("wkbNDR").ToLocalChecked(), Nan::New("LSB").ToLocalChecked());

  /**
   * @class Constants (wkbGeometryType)
   */

  /**
   * @final
   *
   * The `wkb25DBit` constant can be used to convert between 2D types to 2.5D
   * types
   *
   * @example
   * ```
   * // 2 -> 2.5D
   * wkbPoint25D = gdal.wkbPoint | gdal.wkb25DBit
   *
   * // 2.5D -> 2D (same as wkbFlatten())
   * wkbPoint = gdal.wkbPoint25D & (~gdal.wkb25DBit)```
   *
   * @property gdal.wkb25DBit
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkb25DBit").ToLocalChecked(), Nan::New<Integer>(wkb25DBit));

  int wkbLinearRing25D = wkbLinearRing | wkb25DBit;

  /**
   * @final
   * @property gdal.wkbUnknown
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbUnknown").ToLocalChecked(), Nan::New<Integer>(wkbUnknown));
  /**
   * @final
   * @property gdal.wkbPoint
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbPoint").ToLocalChecked(), Nan::New<Integer>(wkbPoint));
  /**
   * @final
   * @property gdal.wkbLineString
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbLineString").ToLocalChecked(), Nan::New<Integer>(wkbLineString));
  /**
   * @final
   * @property gdal.wkbCircularString
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbCircularString").ToLocalChecked(), Nan::New<Integer>(wkbCircularString));
  /**
   * @final
   * @property gdal.wkbCompoundCurve
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbCompoundCurve").ToLocalChecked(), Nan::New<Integer>(wkbCompoundCurve));
  /**
   * @final
   * @property gdal.wkbMultiCurve
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbMultiCurve").ToLocalChecked(), Nan::New<Integer>(wkbMultiCurve));
  /**
   * @final
   * @property gdal.wkbPolygon
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbPolygon").ToLocalChecked(), Nan::New<Integer>(wkbPolygon));
  /**
   * @final
   * @property gdal.wkbMultiPoint
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbMultiPoint").ToLocalChecked(), Nan::New<Integer>(wkbMultiPoint));
  /**
   * @final
   * @property gdal.wkbMultiLineString
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbMultiLineString").ToLocalChecked(), Nan::New<Integer>(wkbMultiLineString));
  /**
   * @final
   * @property gdal.wkbMultiPolygon
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbMultiPolygon").ToLocalChecked(), Nan::New<Integer>(wkbMultiPolygon));
  /**
   * @final
   * @property gdal.wkbGeometryCollection
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbGeometryCollection").ToLocalChecked(), Nan::New<Integer>(wkbGeometryCollection));
  /**
   * @final
   * @property gdal.wkbNone
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbNone").ToLocalChecked(), Nan::New<Integer>(wkbNone));
  /**
   * @final
   * @property gdal.wkbLinearRing
   * @type {string}
   */
  Nan::Set(target, Nan::New("wkbLinearRing").ToLocalChecked(), Nan::New<Integer>(wkbLinearRing));
  /**
   * @final
   * @property gdal.wkbPoint25D
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbPoint25D").ToLocalChecked(), Nan::New<Integer>(wkbPoint25D));
  /**
   * @final
   * @property gdal.wkbLineString25D
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbLineString25D").ToLocalChecked(), Nan::New<Integer>(wkbLineString25D));
  /**
   * @final
   * @property gdal.wkbPolygon25D
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbPolygon25D").ToLocalChecked(), Nan::New<Integer>(wkbPolygon25D));
  /**
   * @final
   * @property gdal.wkbMultiPoint25D
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbMultiPoint25D").ToLocalChecked(), Nan::New<Integer>(wkbMultiPoint25D));
  /**
   * @final
   * @property gdal.wkbMultiLineString25D
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbMultiLineString25D").ToLocalChecked(), Nan::New<Integer>(wkbMultiLineString25D));
  /**
   * @final
   * @property gdal.wkbMultiPolygon25D
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbMultiPolygon25D").ToLocalChecked(), Nan::New<Integer>(wkbMultiPolygon25D));
  /**
   * @final
   * @property gdal.wkbGeometryCollection25D
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbGeometryCollection25D").ToLocalChecked(), Nan::New<Integer>(wkbGeometryCollection25D));
  /**
   * @final
   * @property gdal.wkbLinearRing25D
   * @type {number}
   */
  Nan::Set(target, Nan::New("wkbLinearRing25D").ToLocalChecked(), Nan::New<Integer>(wkbLinearRing25D));

  /**
   * @class Constants (OFT)
   */

  /**
   * @final
   * @property gdal.OFTInteger
   * @type {string}
   */
  Nan::Set(target, Nan::New("OFTInteger").ToLocalChecked(), Nan::New(getFieldTypeName(OFTInteger)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTIntegerList
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("OFTIntegerList").ToLocalChecked(), Nan::New(getFieldTypeName(OFTIntegerList)).ToLocalChecked());

  /**
   * @final
   * @property gdal.OFTInteger64
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("OFTInteger64").ToLocalChecked(), Nan::New(getFieldTypeName(OFTInteger64)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTInteger64List
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("OFTInteger64List").ToLocalChecked(),
    Nan::New(getFieldTypeName(OFTInteger64List)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTReal
   * @type {string}
   */
  Nan::Set(target, Nan::New("OFTReal").ToLocalChecked(), Nan::New(getFieldTypeName(OFTReal)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTRealList
   * @type {string}
   */
  Nan::Set(target, Nan::New("OFTRealList").ToLocalChecked(), Nan::New(getFieldTypeName(OFTRealList)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTString
   * @type {string}
   */
  Nan::Set(target, Nan::New("OFTString").ToLocalChecked(), Nan::New(getFieldTypeName(OFTString)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTStringList
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("OFTStringList").ToLocalChecked(), Nan::New(getFieldTypeName(OFTStringList)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTWideString
   * @type {string}
   */
  Nan::Set(
    target, Nan::New("OFTWideString").ToLocalChecked(), Nan::New(getFieldTypeName(OFTWideString)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTWideStringList
   * @type {string}
   */
  Nan::Set(
    target,
    Nan::New("OFTWideStringList").ToLocalChecked(),
    Nan::New(getFieldTypeName(OFTWideStringList)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTBinary
   * @type {string}
   */
  Nan::Set(target, Nan::New("OFTBinary").ToLocalChecked(), Nan::New(getFieldTypeName(OFTBinary)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTDate
   * @type {string}
   */
  Nan::Set(target, Nan::New("OFTDate").ToLocalChecked(), Nan::New(getFieldTypeName(OFTDate)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTTime
   * @type {string}
   */
  Nan::Set(target, Nan::New("OFTTime").ToLocalChecked(), Nan::New(getFieldTypeName(OFTTime)).ToLocalChecked());
  /**
   * @final
   * @property gdal.OFTDateTime
   * @type {string}
   */
  Nan::Set(target, Nan::New("OFTDateTime").ToLocalChecked(), Nan::New(getFieldTypeName(OFTDateTime)).ToLocalChecked());

  /**
   * Resampling options that can be used with the gdal.reprojectImage() and gdal.RasterBandPixels.read methods.
   *
   * @class Constants (GRA)
   */

  /**
   * @final
   * @property gdal.GRA_NearestNeighbor
   * @type {string}
   */
  Nan::Set(target, Nan::New("GRA_NearestNeighbor").ToLocalChecked(), Nan::New("NearestNeighbor").ToLocalChecked());
  /**
   * @final
   * @property gdal.GRA_Bilinear
   * @type {string}
   */
  Nan::Set(target, Nan::New("GRA_Bilinear").ToLocalChecked(), Nan::New("Bilinear").ToLocalChecked());
  /**
   * @final
   * @property gdal.GRA_Cubic
   * @type {string}
   */
  Nan::Set(target, Nan::New("GRA_Cubic").ToLocalChecked(), Nan::New("Cubic").ToLocalChecked());
  /**
   * @final
   * @property gdal.GRA_CubicSpline
   * @type {string}
   */
  Nan::Set(target, Nan::New("GRA_CubicSpline").ToLocalChecked(), Nan::New("CubicSpline").ToLocalChecked());
  /**
   * @final
   * @property gdal.GRA_Lanczos
   * @type {string}
   */
  Nan::Set(target, Nan::New("GRA_Lanczos").ToLocalChecked(), Nan::New("Lanczos").ToLocalChecked());
  /**
   * @final
   * @property gdal.GRA_Average
   * @type {string}
   */
  Nan::Set(target, Nan::New("GRA_Average").ToLocalChecked(), Nan::New("Average").ToLocalChecked());
  /**
   * @final
   * @property gdal.GRA_Mode
   * @type {string}
   */
  Nan::Set(target, Nan::New("GRA_Mode").ToLocalChecked(), Nan::New("Mode").ToLocalChecked());

  /**
   * GDAL version (not the binding version)
   *
   * @final
   * @for gdal
   * @property gdal.version
   * @type {string}
   */
  Nan::Set(target, Nan::New("version").ToLocalChecked(), Nan::New(GDAL_RELEASE_NAME).ToLocalChecked());

  /**
   * GDAL library - system library (false) or bundled (true)
   *
   * @final
   * @for gdal
   * @property gdal.bundled
   * @type {boolean}
   */
#ifdef BUNDLED_GDAL
  Nan::Set(target, Nan::New("bundled").ToLocalChecked(), Nan::New(true));
#else
  Nan::Set(target, Nan::New("bundled").ToLocalChecked(), Nan::New(false));
#endif

  /**
   * Details about the last error that occurred. The property
   * will be null or an object containing three properties: "number",
   * "message", and "type".
   *
   * @final
   * @for gdal
   * @property gdal.lastError
   * @type {object}
   */
  Nan::SetAccessor(target, Nan::New<v8::String>("lastError").ToLocalChecked(), LastErrorGetter, LastErrorSetter);

  // Local<Object> versions = Nan::New<Object>();
  // Nan::Set(versions, Nan::New("node").ToLocalChecked(),
  // Nan::New(NODE_VERSION+1)); Nan::Set(versions,
  // Nan::New("v8").ToLocalChecked(), Nan::New(V8::GetVersion()));
  // Nan::Set(target, Nan::New("versions").ToLocalChecked(), versions);

  /**
   * Disables all output.
   *
   * @for gdal
   * @static
   * @method quiet
   */
  Nan::SetMethod(target, "quiet", QuietOutput);

  /**
   * Displays extra debugging information from GDAL.
   *
   * @for gdal
   * @static
   * @method verbose
   */
  Nan::SetMethod(target, "verbose", VerboseOutput);

  Nan::SetMethod(target, "startLogging", StartLogging);
  Nan::SetMethod(target, "stopLogging", StopLogging);
  Nan::SetMethod(target, "log", Log);

  Local<Object> supports = Nan::New<Object>();
  Nan::Set(target, Nan::New("supports").ToLocalChecked(), supports);

  NODE_DEFINE_CONSTANT(target, CPLE_OpenFailed);
  NODE_DEFINE_CONSTANT(target, CPLE_IllegalArg);
  NODE_DEFINE_CONSTANT(target, CPLE_NotSupported);
  NODE_DEFINE_CONSTANT(target, CPLE_AssertionFailed);
  NODE_DEFINE_CONSTANT(target, CPLE_NoWriteAccess);
  NODE_DEFINE_CONSTANT(target, CPLE_UserInterrupt);
}
}

} // namespace node_gdal

NODE_MODULE(NODE_GYP_MODULE_NAME, node_gdal::Init);
