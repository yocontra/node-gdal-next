# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [3.4.0] WIP

### Added
 - PROJ 8.1.1
 - GEOS 3.9.1
 - GDAL 3.4.0-git (2021-10-07)
 - Add `gdal.Dataset.getMetadataAsync` and `gdal.RasterBand.getMetadataAsync`
 - Add `gdal.Dataset.setMetadata{Async}` and `gdal.RasterBand.setMetadata{Async}`

### Changed
 - (***BREAKING***) Move the progress callback of `gdal.Driver.createCopy{Async}` before `strict` to allow using it with a Promise
 - `gdal.Driver.create{Async}` now throw if they fail to parse the options instead of returning `undefined`
 - `gdal.DatasetBands.create{Async}` and `gdal.SpatialReference.fromESRI` now have correct TypeScript signatures, all options lists are supported either in `{object}` or in `string[]` form
 - `gdal.checksumImage{Async}` now throw/reject on error instead of returning 0 if the GDAL method returned an error, but the GDAL method still returns 0 on some errors and does take into account fractional numbers < 1.0

### Changed
 - Fix #13, now two different warnings are emitted whether a dataset is closed by `gdal.Dataset.close` or it is destroyed by the GC - the former is indicative of a bug in the user application, while the latter is indicative of a bug in `gdal-async` itself

## [3.3.4] 2021-09-28

### Added
 - Add support for Amazon Linux and restore Ubuntu 16.04 support (glibc 2.23)
 - On Linux, build GDAL with `ENABLE_UFFD` for virtual I/O support on drivers that allow it (currently only NetCDF) to allow accessing NetCDF subdatasets with remote virtual filesystems
 - Add a new npm script - `npm run prune` - not to be confused with `npm prune` - which allows to keep only the module runtime, significantly reducing the size of the installed package

### Changed
 - Fix `gdal.RasterBand.flushAsync()`
 - Implement the previously non-existing `strict` argument of `gdal.Driver.createCopy{Async}()` and move it after `options`
 - Implement progress callbacks in `gdal.Driver.createCopy{Async}()`
 - `gdal.Driver.createCopy{Async}()` now always throws an `Error` / rejects the Promise if the operation failed instead of returning a null object in some cases
 - Fix #14, correctly handle exceptions in progress callbacks and return them to the calling user code
 - Add a previously missing TypeScript signature for `gdal.CoordinateTransformation.transformPoint(point: xyz)`
 - Fix the documentation / TypeScript signature for `gdal.Geometry.segmentize` - it returns `undefined`
 - Removed all source tarballs of the bundled dependencies from the published package to reduce its size

## [3.3.3] 2021-09-07

### Added
 - GDAL 3.3.2

### Changed
 - Fix #9, do not enumerate async getters
 - Fix #12, build-from-source is broken when building through npm
 - Compatibility with `rollup-plugin-natives`
 - Fix #6, `gdal.vsimem.release` is now always safe to use

## [3.3.2] 2021-07-08

### Added
 - GDAL 3.3.1
 - Support async getters
   - Add `gdal.Dataset.rasterSizeAsync`
   - Add `gdal.Dataset.srsAsync`
   - Add `gdal.Dataset.geoTransformAsync`
 - Add `gdal.DatasetBands.getEnvelope()`
 - Add `gdal.vsimem.set` and `gdal.vsimem.release` allowing to load and unload files between a `Buffer` and GDAL's in-memory `vsimem` file system
 - Add `gdal.Geometry.makeValid{Async}()`

### Changed
 - Correctly measure the wall time for the event loop warnings
 - Fix a number of memory leaks in `gdal.SpatialReference.clone()`, `gdal.SpatialReference.cloneGeogCS()` and when constructing a `gdal.SpatialReference` with a `wkt` argument
 - Remove a wasteful reallocation in `gdal.Dataset.root`

## [3.3.1] 2021-06-17

### Changed
 - `gdal.DatasetLayers.get{Async}()` now throws an `Error` if an invalid layer is requested instead of returning a null object
 - `gdal.FeatureDefnFields.get{Async}()` now throws an `Error` if an invalid field definition is requested instead of returning a null object
 - `gdal.FeatureFields.get{Async}()` now throws an `Error` if an invalid field is requested instead of returning a null object
    - it can still return `null` if the field exists in the definition but it is not set in the feature
 - `gdal.GDALDrivers.get()` now throws an `Error` if an invalid driver is requested instead of returning a null object
 - `gdal.GeometryCollectionChildren.get()` now throws an `Error` if an invalid sub-geometry is requested instead of returning a null object
 - `gdal.LayerFeatures.get{Async}()` now throws an `Error` if an invalid feature is requested instead of returning a null object
 - `gdal.LayerFields.get{Async}()` now throws an `Error` if an invalid field is requested instead of returning a null object
 - `gdal.LineStringPoints.get()` now throws an `Error` if an invalid point is requested instead of returning a null object
 - `gdal.PolygonRings.get()` now throws an `Error` if an invalid ring is requested instead of returning a null object
 - All `gdal.Geometry` methods that return a `gdal.Geometry` throw an `Error` on error instead of returning a null object
 - Fix #6, a case of sleeping in the GC while destroying the sibling of an object with an active asynchronous operation
 - Fix a potential race condition in the object store
 - Fix several potential race conditions in `gdal.RasterBand`
 - Correctly throw an `Error` with an empty message if a GDAL method fails without setting the error message instead of the last previously encountered error

## [3.3.0] 2021-06-15

### Added
  - GDAL 3.3.0
  - Read-only support of the new Multidimensional Raster Data Model introduced in GDAL 3.1, requires GDAL >= 3.1
  - NetCDF, GRIB, HDF5, Carto, FlatGeobuf, WMS, WMTS and WCS drivers
  - Support generalized strides in `gdal.RasterBandPixels.{write|read}()`
  - Add `gdal.RasterBandPixels.{set|get}Async()`
  - Add `gdal.RasterBand.computeStatisticsAsync`
  - Add an explicit stderr warning when the GC has to active sleep on an async operation and solve all (known) occurrences
  - Add an explicit stderr warning when user code is calling a synchronous method while an asynchronous operation is running in the background

### Changed
 - Vastly improved locking mechanism allowing better parallelization
 - Linux release builds have lazy binding enabled
 - `gdal.DatasetBands.get{Async}()` now throws an `Error` if an invalid band is requested instead of returning a null object
 - Completely reworked persistent object storage
 - Thread-safe `gdal.RasterBand.fillAsync`
 - Fix a number of cases where an unreferenced `gdal.Dataset` was not protected from the GC during an asynchronous operation

### Removed
 - Drop support for linking against a system-installed GDAL 1.x library
 - Drop support for Ubuntu 16.04
 - Drop support for Node.js 10.x and 15.x
 - Drop support for Python 2
 - Drop support for the drivers removed in GDAL 3.3: AeronavFAA, BNA, E00Grid, HTF, OpenAir, SEGUKOOA, SEGY, SUA and XPlane

## [3.2.3] 2021-06-03

### Added
 - Add async versions of `gdal.Layer.flush`, `gdal.RasterBand.flush` and `gdal.RasterBand.fill`

### Changed
 - Fix #1, locking on some `gdal.Layer` operations: `flush`, `getExtent`, `testCapability`, `setSpatialFilter`, `getSpatialFilter` and most scalar getters

## [3.2.2] 2021-05-25

### Changed
 - Fix a failing unit test on GDAL 1.x (no effect on the bindings)
 - Fix another randomly failing unit test (no effect on the bindings)

## [3.2.1] 2021-05-24

### Changed
 - Fix a number of memory leaks (exception throwing paths in all `gdal.SpatialReference.from*`, `gdal.DatasetBands.create`)

## [3.2.0] 2021-05-21

### Added
 - GDAL 3.2.3
 - Built-in vsicurl and major cloud services (Amazon, Google, Microsoft and Alibaba) support on all platforms
 - Support async_hooks
 - Support progress callbacks
 - Support different algorithms when resampling on-the-fly
 - Add `gdal.Geometry.fromGeoJsonBuffer(Async)()`, a completely parallelizable alternative to `gdal.Geometry.fromGeoJson()` for importing large GeoJSON geometries without blocking the event loop
 - Add `gdal.LayerFeatures.setAsync()`

### Changed
 - `gdal.Geometry.fromGeoJson` now throws an `Error` on error instead of simply returning a null geometry

   Previously all `gdal.Geometry.from*` functions except `fromGeoJson` threw undocumented errors, now all of them, including `fromGeoJson` throw documented errors

## [3.1.1] 2021-05-14

### Changed
  - Fully unit-tested TypeScript definitions with many method signatures fixed
  - Properties without setters are now correctly identified as being read-only in the TypeScript bindings
  - Exported all previously internal `_options` types used for methods such as `RasterBand.read` or `reprojectImage`

## [3.1.0] 2021-05-11

### Added
  - Add full TypeScript support

  - Complete reworking of the Geometry code adding support for CircularString, CompoundCurve and MultiCurve
  - Add JS iterators to all collections
  - Enable MapInfo TAB and MIF/MID
  - Fixed a typo in `gdal.SpatialReference`, `isVectical()` method should be `isVertical()`, the misspelled method will be kept until the next major release
  - Expanded unit testing, code coverage is 81% up from 70%

### Changed
  - Process the unit testing suite with ASAN and fix all memory leaks

### Added
  - Support Node.js 16
  - Merge `node-gdal-next@2.8.0`

## Changed
  - Build GDAL against the internal zlib in Node.js to avoid a conflict causing data corruption
  - Enforce code coverage checks and re-enable all disabled unit tests

## [3.0.1] 2021-04-09

### Changed

  - Follow the Node.js callback error convention, returning `null` instead of `undefined` for the `error` argument on success and returning an `Error` object instead of a string on error
  - Lots of minor documentation fixes

# [3.0.0] 2021-03-26

First release of `node-gdal-async`, forked from `node-gdal-next@2.6.2`

### Added
  - **Full support for asynchronous operations**
  - GDAL 3.2.2
  - vsimem support
  - MVT writing
  - SQLite integration

### Changed
  - Packages built through Github Actions
  - Packages published through Github Packages
  - Numerous small bugfixes
