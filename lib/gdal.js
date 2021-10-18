const path = require('path')
const fs = require('fs')
const binary = require('@mapbox/node-pre-gyp')

const binding_path = binary.find(path.resolve(path.join(__dirname, '../package.json')))
const gdal = require(binding_path)

const data_path = path.resolve(__dirname, '../deps/libgdal/gdal/data')
const proj_path = path.resolve(__dirname, '../deps/libproj/proj/data')

if (process.env.GDAL_DATA === undefined && !fs.existsSync(data_path)) {
  throw new Error(
    `The bundled data path for node-gdal is missing '${data_path}' and GDAL_DATA environment is not set`
  )
}

const proj_lib_env_undefined = process.env.PROJ_LIB === undefined
if (proj_lib_env_undefined && !fs.existsSync(proj_path)) {
  throw new Error(
    `The bundled proj data path for node-gdal is missing '${proj_path}' and PROJ_LIB environment is not set`
  )
}

module.exports = gdal

if (proj_lib_env_undefined && gdal.bundled) {
  gdal.setPROJSearchPath(proj_path)
}

gdal.Point.Multi = gdal.MultiPoint
gdal.LineString.Multi = gdal.MultiLineString
gdal.LinearRing.Multi = gdal.MultiLineString
gdal.Polygon.Multi = gdal.MultiPolygon

gdal.quiet()

gdal.config = {}

/**
 * @class gdal.config
 */

/**
 * Gets a GDAL configuration setting.
 *
 * @example
 * ```
 * data_path = gdal.config.get('GDAL_DATA');```
 *
 * @static
 * @method get
 * @param {string} key
 * @return {string}
 */
gdal.config.get = gdal.getConfigOption

/**
 * Sets a GDAL configuration setting.
 *
 * @example
 * ```
 * gdal.config.set('GDAL_DATA', data_path);```
 *
 * @static
 * @method set
 * @param {string} key
 * @param {string} value
 * @return {void}
 */
gdal.config.set = gdal.setConfigOption

delete gdal.getConfigOption
delete gdal.setConfigOption

if (process.env.CURL_CA_BUNDLE === undefined) {
  gdal.config.set('CURL_CA_BUNDLE', path.resolve(__dirname, '../deps/libcurl/cacert.pem'))
}

/**
 * Callback using the standard Node.js error convention
 * @element callback
 * @typedef callback<T> (Error, T) => void
 */

if (process.env.GDAL_DATA === undefined && gdal.bundled) {
  gdal.config.set('GDAL_DATA', data_path)
}

gdal.Envelope = require('./envelope.js')(gdal)
gdal.Envelope3D = require('./envelope_3d.js')(gdal)

const getEnvelope = gdal.Geometry.prototype.getEnvelope
gdal.Geometry.prototype.getEnvelope = function () {
  const obj = getEnvelope.apply(this, arguments)
  return new gdal.Envelope(obj)
}

const getEnvelope3D = gdal.Geometry.prototype.getEnvelope3D
gdal.Geometry.prototype.getEnvelope3D = function () {
  const obj = getEnvelope3D.apply(this, arguments)
  return new gdal.Envelope3D(obj)
}

const getEnvelopeAsync = gdal.Geometry.prototype.getEnvelopeAsync
gdal.Geometry.prototype.getEnvelopeAsync = function () {
  // arguments[arguments.length - 1] is the callback
  const old_cb = arguments[arguments.length - 1]
  const new_cb = (e, r) => {
    const obj = e ? undefined : new gdal.Envelope(r)
    old_cb(e, obj)
  }
  arguments[arguments.length - 1] = new_cb
  getEnvelopeAsync.apply(this, arguments)
}

const getEnvelope3DAsync = gdal.Geometry.prototype.getEnvelope3DAsync
gdal.Geometry.prototype.getEnvelope3DAsync = function () {
  const old_cb = arguments[arguments.length - 1]
  const new_cb = (e, r) => {
    const obj = e ? undefined : new gdal.Envelope3D(r)
    old_cb(e, obj)
  }
  arguments[arguments.length - 1] = new_cb
  getEnvelope3DAsync.apply(this, arguments)
}

const getExtent = gdal.Layer.prototype.getExtent
gdal.Layer.prototype.getExtent = function () {
  const obj = getExtent.apply(this, arguments)
  return new gdal.Envelope(obj)
}

/**
 * Returns a {{#crossLink "Envelope"}}gdal.Envelope{{/crossLink}} object for the raster bands
 *
 * @example
 * ```
 * const extent = dataset.getEnvelope()
 * ````
 *
 * @for gdal.DatasetBands
 * @method getEnvelope
 * @return {Envelope}
 */
gdal.DatasetBands.prototype.getEnvelope = function () {
  const ulx = this.ds.geoTransform[0]
  const uly = this.ds.geoTransform[3]
  const lrx = this.ds.geoTransform[0] + this.ds.geoTransform[1] * this.ds.rasterSize.x
  const lry = this.ds.geoTransform[3] + this.ds.geoTransform[5] * this.ds.rasterSize.y
  return new gdal.Envelope({
    minX: Math.min(ulx, lrx),
    minY: Math.min(uly, lry),
    maxX: Math.max(ulx, lrx),
    maxY: Math.max(uly, lry)
  })
}

/**
 * @interface xyz
 * @property {number} x
 * @property {number} y
 * @property {number} [z]
 */

// --- add additional functionality to collections ---

/**
 * A simple key/value structure
 * @interface fieldValue { key: string, value: any }
 */

/**
 * forEach() callback type
 * @element forEachCb
 * @typedef forEachCb<T> (obj: T, idx: number) => boolean|void
 */
function defaultForEach(callback) {
  const n = this.count()
  for (let i = 0; i < n; i++) {
    if (callback(this.get(i), i) === false) return
  }
}

/**
 * map() callback type
 * @element mapCb
 * @typedef mapCb<T,U> (obj: T, index: number) => U
 */
function defaultMap(callback) {
  const result = []
  this.forEach((value, i) => {
    result.push(callback(value, i))
  })
  return result
}

function defaultToArray() {
  const array = []
  this.forEach((geom) => {
    array.push(geom)
  })
  return array
}

function defaultIterator() {
  let i = 0

  return {
    next: () => {
      const done = !(i < this.count())
      return {
        done,
        value: done ? null : this.get(i++)
      }
    }
  }
}

/**
 * Iterates through all bands using a callback function.
 * Note: GDAL band indexes start at 1, not 0.
 *
 * @example
 * ```
 * dataset.bands.forEach(function(band, i) { ... });```
 *
 * @for gdal.DatasetBands
 * @method forEach
 * @param {forEachCb<gdal.RasterBand>} callback The callback to be called with each {{#crossLink "RasterBand"}}RasterBand{{/crossLink}}
 */
gdal.DatasetBands.prototype.forEach = function (callback) {
  const n = this.count()
  for (let i = 1; i <= n; i++) {
    if (callback(this.get(i), i) === false) return
  }
}

/**
 * Iterates through all bands using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = dataset.bands.map(function(band, i) {
 *     return value;
 * });```
 *
 * @for gdal.DatasetBands
 * @method map<U>
 * @param {mapCb<gdal.RasterBand,U>} callback The callback to be called with each {{#crossLink "RasterBand"}}RasterBand{{/crossLink}}
 * @return {U[]}
 */
gdal.DatasetBands.prototype.map = defaultMap

/**
 * Iterates through all bands using an iterator
 *
 * @example
 * ```
 * for (const band of dataset.bands) {
 * }```
 *
 * @for gdal.DatasetBands
 * @type {gdal.RasterBand}
 * @method Symbol.iterator
 */
gdal.DatasetBands.prototype[Symbol.iterator] = function () {
  let i = 1

  return {
    next: () => {
      const done = !(i <= this.count())
      return {
        done,
        value: done ? null : this.get(i++)
      }
    }
  }
}

/**
 * Iterates through all features using a callback function.
 *
 * @example
 * ```
 * layer.features.forEach(function(feature, i) { ... });```
 *
 * @for gdal.LayerFeatures
 * @method forEach
 * @param {forEachCb<gdal.Feature>} callback The callback to be called with each {{#crossLink "Feature"}}Feature{{/crossLink}}
 */
gdal.LayerFeatures.prototype.forEach = function (callback) {
  let i = 0
  let feature = this.first()
  while (feature) {
    if (callback(feature, i++) === false) return
    feature = this.next()
  }
}

/**
 * Iterates through all features using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = layer.features.map(function(band, i) {
 *     return value;
 * });```
 *
 * @for gdal.LayerFeatures
 * @method map<U>
 * @param {mapCb<gdal.Feature,U>} callback The callback to be called with each {{#crossLink "Feature"}}Feature{{/crossLink}}
 * @return {U[]}
 */
gdal.LayerFeatures.prototype.map = defaultMap

/**
 * Iterates through all features using an iterator
 *
 * @example
 * ```
 * for (const feature of layer.features) {
 * }```
 *
 * @for gdal.LayerFeatures
 * @type {gdal.Feature}
 * @method Symbol.iterator
 */
gdal.LayerFeatures.prototype[Symbol.iterator] = function defaultIterator() {
  let feature

  return {
    next: () => {
      feature = feature ? this.next() : this.first()
      return {
        done: !feature,
        value: feature
      }
    }
  }
}

/**
 * Iterates through all fields using a callback function.
 *
 * @example
 * ```
 * layer.features.get(0).fields.forEach(function(value, key) { ... });```
 *
 * @for gdal.FeatureFields
 * @method forEach
 * @param {forEachCb<fieldValue>} callback The callback to be called with each feature `value` and `key`.
 */
gdal.FeatureFields.prototype.forEach = function (callback) {
  const obj = this.toObject()
  Object.entries(obj).every(([ k, v ]) =>
    callback(v, k) !== false
  )
}

/**
 * Iterates through all fields using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = layer.features.get(0).fields.map(function(value, key) {
 *     return value;
 * });```
 *
 * @for gdal.FeatureFields
 * @method map<U>
 * @param {mapCb<fieldValue,U>} callback The callback to be called with each feature `value` and `key`.
 * @return {U[]}
 */
gdal.FeatureFields.prototype.map = defaultMap

/**
 * Outputs the fields as a serialized JSON string.
 *
 * @for gdal.FeatureFields
 * @method toJSON
 * @return {string} Serialized JSON
 */
gdal.FeatureFields.prototype.toJSON = function () {
  return JSON.stringify(this.toObject())
}

/**
 * Converts the geometry to a GeoJSON object representation.
 *
 * @for gdal.Geometry
 * @method toObject
 * @return {object} GeoJSON
 */
gdal.Geometry.prototype.toObject = function () {
  return JSON.parse(this.toJSON())
}

/**
 * Iterates through all field definitions using a callback function.
 *
 * @example
 * ```
 * layer.fields.forEach(function(field, i) { ... });```
 *
 * @for gdal.LayerFields
 * @method forEach
 * @param {forEachCb<gdal.FieldDefn>} callback The callback to be called with each {{#crossLink "FieldDefn"}}FieldDefn{{/crossLink}}
 */
gdal.LayerFields.prototype.forEach = defaultForEach

/**
 * Iterates through all field definitions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = layer.fields.map(function(field, i) {
 *     return value;
 * });```
 *
 * @for gdal.LayerFields
 * @method map<U>
 * @param {mapCb<gdal.FieldDefn,U>} callback The callback to be called with each {{#crossLink "FieldDefn"}}FieldDefn{{/crossLink}}
 * @return {U[]}
 */
gdal.LayerFields.prototype.map = defaultMap

/**
 * Iterates through all field definitions using an iterator
 *
 * @example
 * ```
 * for (const curve of layer.fields) {
 * }```
 *
 * @for gdal.LayerFields
 * @type {gdal.FieldDefn}
 * @method Symbol.iterator
 */
gdal.LayerFields.prototype[Symbol.iterator] = defaultIterator

/**
 * Iterates through all layers using a callback function.
 *
 * @example
 * ```
 * dataset.layers.forEach(function(layer, i) { ... });```
 *
 * @for gdal.DatasetLayers
 * @method forEach
 * @param {forEachCb<gdal.Layer>} callback The callback to be called with each {{#crossLink "Layer"}}Layer{{/crossLink}}
 */
gdal.DatasetLayers.prototype.forEach = defaultForEach

/**
 * Iterates through all layers using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = dataset.layers.map(function(field, i) {
 *     return value;
 * });```
 *
 * @for gdal.DatasetLayers
 * @method map<U>
 * @param {mapCb<gdal.Layer,U>} callback The callback to be called with each {{#crossLink "Layer"}}Layer{{/crossLink}}
 * @return {U[]}
 */
gdal.DatasetLayers.prototype.map = defaultMap

/**
 * Iterates through all layers using an iterator
 *
 * @example
 * ```
 * for (const curve of dataset.layers) {
 * }```
 *
 * @for gdal.DatasetLayers
 * @type {gdal.Layer}
 * @method Symbol.iterator
 */
gdal.DatasetLayers.prototype[Symbol.iterator] = defaultIterator

/**
 * Iterates through all field definitions using a callback function.
 *
 * @example
 * ```
 * featureDefn.forEach(function(field, i) { ... });```
 *
 * @for gdal.FeatureDefnFields
 * @method forEach
 * @param {forEachCb<gdal.FieldDefn>} callback The callback to be called with each {{#crossLink "FieldDefn"}}FieldDefn{{/crossLink}}
 */
gdal.FeatureDefnFields.prototype.forEach = defaultForEach

/**
 * Iterates through all field definitions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = featureDefn.map(function(field, i) {
 *     return value;
 * });```
 *
 * @for gdal.FeatureDefnFields
 * @method map<U>
 * @param {mapCb<gdal.FieldDefn,U>} callback The callback to be called with each {{#crossLink "FieldDefn"}}FieldDefn{{/crossLink}}
 * @return {U[]}
 */
gdal.FeatureDefnFields.prototype.map = defaultMap

/**
 * Iterates through all field definitions using an iterator
 *
 * @example
 * ```
 * for (const defn of featureDefn) {
 * }```
 *
 * @for gdal.FeatureDefnFields
 * @type {gdal.FieldDefn}
 * @method Symbol.iterator
 */
gdal.FeatureDefnFields.prototype[Symbol.iterator] = defaultIterator

/**
 * Iterates through all rings using a callback function.
 *
 * @example
 * ```
 * polygon.rings.forEach(function(ring, i) { ... });```
 *
 * @for gdal.PolygonRings
 * @method forEach
 * @param {forEachCb<gdal.LineString>} callback The callback to be called with each {{#crossLink "LineString"}}LineString{{/crossLink}}
 */
gdal.PolygonRings.prototype.forEach = defaultForEach

/**
 * Iterates through all rings using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = polygon.rings.map(function(ring, i) {
 *     return value;
 * });```
 *
 * @for gdal.PolygonRings
 * @method map<U>
 * @param {mapCb<gdal.LineString,U>} callback The callback to be called with each {{#crossLink "LineString"}}LineString{{/crossLink}}
 * @return {U[]}
 */
gdal.PolygonRings.prototype.map = defaultMap

/**
 * Iterates through all rings using an iterator
 *
 * @example
 * ```
 * for (const ring of polygon.rings) {
 * }```
 *
 * @for gdal.PolygonRings
 * @type {gdal.LineString}
 * @method Symbol.iterator
 */
gdal.PolygonRings.prototype[Symbol.iterator] = defaultIterator

/**
 * Iterates through all points using a callback function.
 *
 * @example
 * ```
 * lineString.points.forEach(function(point, i) { ... });```
 *
 * @for gdal.LineStringPoints
 * @method forEach
 * @param {forEachCb<gdal.Point>} callback The callback to be called with each {{#crossLink "Point"}}Point{{/crossLink}}
 */
gdal.LineStringPoints.prototype.forEach = defaultForEach

/**
 * Iterates through all points using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = lineString.points.map(function(point, i) {
 *     return value;
 * });```
 *
 * @for gdal.LineStringPoints
 * @method map<U>
 * @param {mapCb<gdal.Point,U>} callback The callback to be called with each {{#crossLink "Point"}}Point{{/crossLink}}
 * @return {U[]}
 */
gdal.LineStringPoints.prototype.map = defaultMap

/**
 * Iterates through all points using an iterator
 *
 * @example
 * ```
 * for (const point of lineString.points) {
 * }```
 *
 * @for gdal.LineStringPoints
 * @type {gdal.Point}
 * @method Symbol.iterator
 */
gdal.LineStringPoints.prototype[Symbol.iterator] = defaultIterator

if (gdal.CompoundCurveCurves) {
  /**
   * Iterates through all curves using a callback function.
   *
   * @example
   * ```
   * compoundCurve.curves.forEach(function(curve, i) { ... });```
   *
   * @for gdal.CompoundCurveCurves
   * @method forEach
   * @param {forEachCb<gdal.SimpleCurve>} callback The callback to be called with each {{#crossLink "SimpleCurve"}}SimpleCurve{{/crossLink}}
   */
  gdal.CompoundCurveCurves.prototype.forEach = defaultForEach

  /**
   * Iterates through all curves using a callback function and builds
   * an array of the returned values.
   *
   * @example
   * ```
   * var result = compoundCurves.curves.map(function(curve, i) {
   *     return value;
   * });```
   *
   * @for gdal.CompoundCurveCurves
   * @method map<U>
   * @param {mapCb<gdal.SimpleCurve,U>} callback The callback to be called with each {{#crossLink "SimpleCurve"}}SimpleCurve{{/crossLink}}
   * @return {U[]}
   */
  gdal.CompoundCurveCurves.prototype.map = defaultMap

  /**
   * Iterates through all curves using an iterator
   *
   * @example
   * ```
   * for (const curve of compoundCurves.curves) {
   * }
   *
   * @for gdal.CompoundCurveCurves
   * @type {gdal.SimpleCurve}
   * @method Symbol.iterator
   */
  gdal.CompoundCurveCurves.prototype[Symbol.iterator] = defaultIterator
}

/**
 * Iterates through all child geometries using a callback function.
 *
 * @example
 * ```
 * geometryCollection.children.forEach(function(geometry, i) { ... });```
 *
 * @for gdal.GeometryCollectionChildren
 * @method forEach
 * @param {forEachCb<gdal.Geometry>} callback The callback to be called with each {{#crossLink "Geometry"}}Geometry{{/crossLink}}
 */
gdal.GeometryCollectionChildren.prototype.forEach = defaultForEach

/**
 * Iterates through all child geometries using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = geometryCollection.children.map(function(geometry, i) {
 *     return value;
 * });```
 *
 * @for gdal.GeometryCollectionChildren
 * @method map<U>
 * @param {mapCb<gdal.Geometry,U>} callback The callback to be called with each {{#crossLink "Geometry"}}Geometry{{/crossLink}}
 * @return {U[]}
 */
gdal.GeometryCollectionChildren.prototype.map = defaultMap

/**
 * Iterates through all overviews using a callback function.
 *
 * @example
 * ```
 * band.overviews.forEach(function(overviewBand, i) { ... });```
 *
 * @for gdal.RasterBandOverviews
 * @method forEach
 * @param {forEachCb<gdal.RasterBand>} callback
 */
gdal.RasterBandOverviews.prototype.forEach = defaultForEach

/**
 * Iterates through all raster overviews using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = band.overviews.map(function(overviewBand, i) {
 *     return value;
 * });```
 *
 * @for gdal.RasterBandOverviews
 * @method map<U>
 * @param {mapCb<gdal.RasterBand,U>} callback The callback to be called with each {{#crossLink "RasterBand"}}RasterBand{{/crossLink}}
 * @return {U[]}
 */
gdal.RasterBandOverviews.prototype.map = defaultMap

/**
 * Iterates through all overview using an iterator
 *
 * @example
 * ```
 * for (const overview of band.overviews) {
 * }
 *
 * @for gdal.RasterBandOverviews
 * @type {gdal.RasterBand}
 * @method Symbol.iterator
 */
gdal.RasterBandOverviews.prototype[Symbol.iterator] = defaultIterator

/**
 * Iterates through all registered drivers using a callback function.
 *
 * @example
 * ```
 * gdal.drivers.forEach(function(driver, i) { ... });```
 *
 * @for gdal.GDALDrivers
 * @method forEach
 * @param {forEachCb<gdal.Driver>} callback The callback to be called with each {{#crossLink "Driver"}}Driver{{/crossLink}}
 */
gdal.GDALDrivers.prototype.forEach = defaultForEach

/**
 * Iterates through all drivers using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = gdal.drivers.map(function(driver, i) {
 *     return value;
 * });```
 *
 * @for gdal.GDALDrivers
 * @method map<U>
 * @param {mapCb<gdal.Driver,U>} callback The callback to be called with each {{#crossLink "Driver"}}Driver{{/crossLink}}
 * @return {U[]}
 */
gdal.GDALDrivers.prototype.map = defaultMap

/**
 * Iterates through all drivers using an iterator
 *
 * @example
 * ```
 * for (const driver of gdal.drivers) {
 * }
 *
 * @for gdal.GDALDrivers
 * @type {gdal.Driver}
 * @method Symbol.iterator
 */
gdal.GDALDrivers.prototype[Symbol.iterator] = defaultIterator

/**
 * Outputs all geometries as a regular javascript array.
 *
 * @for gdal.GeometryCollectionChildren
 * @method toArray
 * @return {gdal.Geometry[]} List of {{#crossLink "Geometry"}}Geometry{{/crossLink}} instances.
 */
gdal.GeometryCollectionChildren.prototype.toArray = defaultToArray

/**
 * Outputs all points as a regular javascript array.
 *
 * @for gdal.LineStringPoints
 * @method toArray
 * @return {gdal.Point[]} List of {{#crossLink "Point"}}Point{{/crossLink}} instances.
 */
gdal.LineStringPoints.prototype.toArray = defaultToArray

/**
 * Outputs all rings as a regular javascript array.
 *
 * @for gdal.PolygonRings
 * @method toArray
 * @return {gdal.LineString[]} List of {{#crossLink "LineString"}}LineString{{/crossLink}} instances.
 */
gdal.PolygonRings.prototype.toArray = defaultToArray

if (gdal.MDArray) {
/**
 * Iterates through all arrays using a callback function.
 *
 * @example
 * ```
 * group.arrays.forEach(function(array, i) { ... });```
 *
 * @for gdal.GroupArrays
 * @method forEach
 * @param {forEachCb<gdal.MDArray>} callback The callback to be called with each {{#crossLink "MDArray"}}MDArray{{/crossLink}}
 */
  gdal.GroupArrays.prototype.forEach = defaultForEach

  /**
 * Iterates through all arrays using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = group.arrays.map(function(array, i) {
 *     return value;
 * });```
 *
 * @for gdal.GroupArrays
 * @method map<U>
 * @param {mapCb<gdal.MDArray,U>} callback The callback to be called with each {{#crossLink "MDArray"}}MDArray{{/crossLink}}
 * @return {U[]}
 */
  gdal.GroupArrays.prototype.map = defaultMap

  /**
 * Iterates through all arrays using an iterator
 *
 * @example
 * ```
 * for (const array of group.arrays) {
 * }
 *
 * @for gdal.GroupArrays
 * @type {gdal.MDArray}
 * @method Symbol.iterator
 */
  gdal.GroupArrays.prototype[Symbol.iterator] = defaultIterator

  /**
 * Iterates through all groups using a callback function.
 *
 * @example
 * ```
 * group.groups.forEach(function(array, i) { ... });```
 *
 * @for gdal.GroupGroups
 * @method forEach
 * @param {forEachCb<gdal.Group>} callback The callback to be called with each {{#crossLink "Group"}}Group{{/crossLink}}
 */
  gdal.GroupGroups.prototype.forEach = defaultForEach

  /**
 * Iterates through all groups using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = group.groups.map(function(group, i) {
 *     return value;
 * });```
 *
 * @for gdal.GroupGroups
 * @method map<U>
 * @param {mapCb<gdal.Group,U>} callback The callback to be called with each {{#crossLink "Group"}}Group{{/crossLink}}
 * @return {U[]}
 */
  gdal.GroupGroups.prototype.map = defaultMap

  /**
 * Iterates through all groups using an iterator
 *
 * @example
 * ```
 * for (const group of group.groups) {
 * }
 *
 * @for gdal.GroupGroups
 * @type {gdal.Group}
 * @method Symbol.iterator
 */
  gdal.GroupGroups.prototype[Symbol.iterator] = defaultIterator

  /**
 * Iterates through all dimensions using a callback function.
 *
 * @example
 * ```
 * group.dimensions.forEach(function(array, i) { ... });```
 *
 * @for gdal.GroupDimensions
 * @method forEach
 * @param {forEachCb<gdal.Dimension>} callback The callback to be called with each {{#crossLink "Dimension"}}Dimension{{/crossLink}}
 */
  gdal.GroupDimensions.prototype.forEach = defaultForEach

  /**
 * Iterates through all dimensions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = group.dimensions.map(function(dimension, i) {
 *     return value;
 * });```
 *
 * @for gdal.GroupDimensions
 * @method map<U>
 * @param {mapCb<gdal.Dimension,U>} callback The callback to be called with each {{#crossLink "Dimension"}}Dimension{{/crossLink}}
 * @return {U[]}
 */
  gdal.GroupDimensions.prototype.map = defaultMap

  /**
 * Iterates through all dimensions using an iterator
 *
 * @example
 * ```
 * for (const dimension of group.dimensions) {
 * }
 *
 * @for gdal.GroupDimensions
 * @type {gdal.Dimension}
 * @method Symbol.iterator
 */
  gdal.GroupDimensions.prototype[Symbol.iterator] = defaultIterator

  /**
 * Iterates through all attributes using a callback function.
 *
 * @example
 * ```
 * group.attributes.forEach(function(array, i) { ... });```
 *
 * @for gdal.GroupAttributes
 * @method forEach
 * @param {forEachCb<gdal.Dimension>} callback The callback to be called with each {{#crossLink "Dimension"}}Dimension{{/crossLink}}
 */
  gdal.GroupAttributes.prototype.forEach = defaultForEach

  /**
 * Iterates through all attributes using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = group.attributes.map(function(array, i) {
 *     return value;
 * });```
 *
 * @for gdal.GroupAttributes
 * @method map<U>
 * @param {mapCb<gdal.Attribute,U>} callback The callback to be called with each {{#crossLink "Attribute"}}Attribute{{/crossLink}}
 * @return {U[]}
 */
  gdal.GroupAttributes.prototype.map = defaultMap

  /**
 * Iterates through all attributes using an iterator
 *
 * @example
 * ```
 * for (const attribute of group.attributes) {
 * }
 *
 * @for gdal.GroupAttributes
 * @type {gdal.Attribute}
 * @method Symbol.iterator
 */
  gdal.GroupAttributes.prototype[Symbol.iterator] = defaultIterator

  /**
 * Iterates through all dimensions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = array.dimensions.map(function(dimension, i) {
 *     return value;
 * });```
 *
 * @for gdal.GroupDimensions
 * @method map<U>
 * @param {mapCb<gdal.Dimension,U>} callback The callback to be called with each {{#crossLink "Dimension"}}Dimension{{/crossLink}}
 * @return {U[]}
 */
  gdal.ArrayDimensions.prototype.forEach = defaultForEach

  /**
 * Iterates through all dimensions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = group.dimensions.map(function(array, i) {
 *     return value;
 * });```
 *
 * @for gdal.ArrayDimensions
 * @method map<U>
 * @param {mapCb<gdal.Dimension,U>} callback The callback to be called with each {{#crossLink "Dimension"}}Dimension{{/crossLink}}
 * @return {U[]}
 */
  gdal.ArrayDimensions.prototype.map = defaultMap

  /**
 * Iterates through all dimensions using an iterator
 *
 * @example
 * ```
 * for (const dimension of group.dimensions) {
 * }
 *
 * @for gdal.ArrayDimensions
 * @type {gdal.Dimension}
 * @method Symbol.iterator
 */
  gdal.ArrayDimensions.prototype[Symbol.iterator] = defaultIterator

  /**
 * Iterates through all attributes using a callback function.
 *
 * @example
 * ```
 * group.attributes.forEach(function(array, i) { ... });```
 *
 * @for gdal.ArrayAttributes
 * @method forEach
 * @param {forEachCb<gdal.Dimension>} callback The callback to be called with each {{#crossLink "Dimension"}}Dimension{{/crossLink}}
 */
  gdal.ArrayAttributes.prototype.forEach = defaultForEach

  /**
 * Iterates through all attributes using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = group.attributes.map(function(array, i) {
 *     return value;
 * });```
 *
 * @for gdal.ArrayAttributes
 * @method map<U>
 * @param {mapCb<gdal.Attribute,U>} callback The callback to be called with each {{#crossLink "Attribute"}}Attribute{{/crossLink}}
 * @return {U[]}
 */
  gdal.ArrayAttributes.prototype.map = defaultMap

  /**
 * Iterates through all attributes using an iterator
 *
 * @example
 * ```
 * for (const attribute of group.attributes) {
 * }
 *
 * @for gdal.ArrayAttributes
 * @type {gdal.Attribute}
 * @method Symbol.iterator
 */
  gdal.ArrayAttributes.prototype[Symbol.iterator] = defaultIterator
}

/**
 * Creates or opens a dataset. Dataset should be explicitly closed with `dataset.close()` method if opened in `"w"` mode to flush any changes. Otherwise, datasets are closed when (and if) node decides to garbage collect them.
 *
 * @example
 * ```
 * var dataset = gdal.open('./data.shp');```
 *
 * @example
 * ```
 * var dataset = gdal.open(fs.readFileSync('./data.shp'));```
 *
 * @for gdal
 * @throws Error
 * @method open
 * @static
 * @param {string|Buffer} path Path to dataset or in-memory Buffer to open
 * @param {string} [mode="r"] The mode to use to open the file: `"r"`, `"r+"`, or `"w"`
 * @param {string|string[]} [drivers] Driver name, or list of driver names to attempt to use.
 *
 * @param {number} [x_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {number} [y_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {number} [band_count] Used when creating a raster dataset with the `"w"` mode.
 * @param {string} [data_type] Used when creating a raster dataset with the `"w"` mode.
 * @param {string[]|object} [creation_options] Used when creating a dataset with the `"w"` mode.
 *
 * @return {Dataset}
 */
gdal.open = (function () {
  const open = gdal.open

  // add 'w' mode to gdal.open() method and also GDAL2-style driver selection
  return function (
    filename,
    mode,
    drivers /* , x_size, y_size, n_bands, datatype, options */
  ) {
    if (filename instanceof Buffer) {
      const buffer = filename
      arguments[0] = gdal.vsimem._anonymous(filename)
      const ds = gdal.open.apply(gdal, arguments)
      ds.buffer = buffer
      return ds
    }

    if (typeof drivers === 'string') {
      drivers = [ drivers ]
    } else if (drivers && !Array.isArray(drivers)) {
      throw new Error('driver(s) must be a string or list of strings')
    }

    if (mode && mode.includes && mode.includes('w')) {
      // create file with given driver
      if (!drivers) {
        throw new Error('Driver must be specified')
      }
      if (drivers.length !== 1) {
        throw new Error('Only one driver can be used to create a file')
      }
      const driver = gdal.drivers.get(drivers[0])
      if (!driver) {
        throw new Error(`Cannot find driver: ${drivers[0]}`)
      }

      const args = Array.prototype.slice.call(arguments, 3) // x_size, y_size, ...
      args.unshift(filename)
      return driver.create.apply(driver, args)
    }

    if (arguments.length > 2) {
      // open file with driver list
      // loop through given drivers trying to open file
      let ds
      drivers.forEach((driver_name) => {
        const driver = gdal.drivers.get(driver_name)
        if (!driver) {
          throw new Error(`Cannot find driver: ${driver_name}`)
        }
        try {
          ds = driver.open(filename, mode)
          return false
        } catch (err) {
          /* skip driver */
        }
      })

      if (!ds) throw new Error('Error opening dataset')
      return ds
    }

    // call gdal.open() method normally
    return open.apply(gdal, arguments)
  }
})()

const promisify = require('util').promisify
const callbackify = require('util').callbackify

/**
 * Asynchronously creates or opens a dataset. Dataset should be explicitly closed with `dataset.close()` method if opened in `"w"` mode to flush any changes. Otherwise, datasets are closed when (and if) node decides to garbage collect them.
 * If the last parameter is a callback, then this callback is called on completion and undefined is returned. Otherwise the function returns a Promise resolved with the result.
 *
 * @example
 * ```
 * var dataset = await gdal.openAsync('./data.shp');```
 *
 * @example
 * ```
 * var dataset = await gdal.openAsync(await fd.readFile('./data.shp'));```
 *
 * @example
 * ```
 * gdal.openAsync('./data.shp', (err, ds) => {...});```
 *
 * @for gdal
 * @method openAsync
 * @static
 * @param {string|Buffer} path Path to dataset or in-memory Buffer to open
 * @param {string} [mode="r"] The mode to use to open the file: `"r"`, `"r+"`, or `"w"`
 * @param {string|string[]} [drivers] Driver name, or list of driver names to attempt to use.
 *
 * @param {number} [x_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {number} [y_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {number} [band_count] Used when creating a raster dataset with the `"w"` mode.
 * @param {string} [data_type] Used when creating a raster dataset with the `"w"` mode.
 * @param {string[]|object} [creation_options] Used when creating a dataset with the `"w"` mode.
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 *
 */

/**
 * TypeScript shorthand version with callback and no optional arguments
 *
 * @for gdal
 * @method openAsync
 * @static
 * @param {string|Buffer} path Path to dataset or in-memory Buffer to open
 * @param {callback<void>} callback {{{cb}}}
 * @return {void}
 */

gdal.openAsync = (function () {
  const openPromise = (function () {
    const openPromise = promisify(gdal.openAsync)

    // add 'w' mode to gdal.open() method and also GDAL2-style driver selection
    return function (
      filename,
      mode,
      drivers,
      _x_size,
      _y_size,
      _n_bands,
      _datatype,
      _options
    ) {
      if (filename instanceof Buffer) {
        const buffer = filename
        try {
          // vsimem._anonymous is always synchronous
          arguments[0] = gdal.vsimem._anonymous(filename)
        } catch (e) {
          return Promise.reject(e)
        }
        return gdal.openAsync.apply(gdal, arguments).then((ds) => {
          ds.buffer = buffer
          return ds
        })
      }
      if (typeof drivers === 'string') {
        drivers = [ drivers ]
      } else if (drivers && !Array.isArray(drivers)) {
        throw new Error('driver(s) must be a string or list of strings')
      }

      if (mode === 'w') {
        // create file with given driver
        if (!drivers) {
          throw new Error('Driver must be specified')
        }
        if (drivers.length !== 1) {
          throw new Error('Only one driver can be used to create a file')
        }
        const driver = gdal.drivers.get(drivers[0])
        if (!driver) {
          throw new Error(`Cannot find driver: ${drivers[0]}`)
        }

        const args = Array.prototype.slice.call(arguments, 3) // x_size, y_size, ...
        args.unshift(filename)
        return gdal.Driver.prototype.createAsync.apply(driver, args)
      }

      if (arguments.length > 2 && drivers) {
        const p = []
        for (const driver_name of drivers) {
          const driver = gdal.drivers.get(driver_name)
          if (!driver) {
            throw new Error(`Cannot find driver: ${driver_name}`)
          }
          p.push(gdal.Driver.prototype.openAsync.call(driver, filename, mode))
        }
        // first driver to open the file wins
        // normally, there are no formats supported by two drivers
        return Promise.any(p).catch(() => {
          throw new Error('Error opening dataset')
        })
      }

      // call gdal.open() method normally
      return openPromise.call(gdal, filename, mode)
    }
  })()

  const openCb = callbackify(openPromise)
  return function (filename,
    mode,
    drivers,
    x_size,
    y_size,
    n_bands,
    datatype,
    options,
    callback) {
    if (typeof arguments[arguments.length - 1] === 'function' && callback === undefined) {
      callback = arguments[arguments.length - 1]
      arguments[arguments.length - 1] = undefined
    }
    if (callback) {
      const args = arguments
      Array.prototype.push.call(args, callback)
      return openCb.apply(gdal, args)
    }
    return openPromise.apply(gdal, arguments)
  }
})()

function fieldTypeFromValue(val) {
  const type = typeof val
  if (type === 'number') {
    if (val % 1 === 0) return gdal.OFTInteger
    return gdal.OFTReal
  } else if (type === 'string') {
    return gdal.OFTString
  } else if (type === 'boolean') {
    return gdal.OFTInteger
  } else if (val instanceof Date) {
    return gdal.OFTDateTime
  } else if (val instanceof Array) {
    const sub_type = fieldTypeFromValue(val[0])
    switch (sub_type) {
      case gdal.OFTString:
        return gdal.OFTStringList
      case gdal.OFTInteger:
        return gdal.OFTIntegerList
      case gdal.OFTReal:
        return gdal.OFTRealList
      default:
        throw new Error('Array element cannot be converted into OGRFieldType')
    }
  } else if (val instanceof Buffer) {
    return gdal.OFTBinary
  }

  throw new Error('Value cannot be converted into OGRFieldType')
}

/**
 * Creates a LayerFields instance from an object of keys and values.
 *
 * @method fromJSON
 * @for gdal.LayerFields
 * @param {object} object
 * @param {boolean} [approx_ok=false]
 */
gdal.LayerFields.prototype.fromJSON = (function () {
  let warned = false
  return function (obj, approx_ok) {
    if (!warned) {
      console.warn(
        'NODE-GDAL Deprecation Warning: LayerFields fromJSON() is deprecated, use fromObject() instead'
      )
      warned = true
    }
    return this.fromObject(obj, approx_ok)
  }
})()

gdal.LayerFields.prototype.fromObject = function (obj, approx_ok) {
  approx_ok = approx_ok || false
  Object.entries(obj).forEach(([ k, v ]) => {
    const type = fieldTypeFromValue(v)
    const def = new gdal.FieldDefn(k, type)
    this.add(def, approx_ok)
  })
}

/**
* @for gdal.Geometry
* @property wkbType
* @final
* @static
* @type {number}
*/
gdal.Point.wkbType = gdal.wkbPoint
gdal.LineString.wkbType = gdal.wkbLineString
gdal.LinearRing.wkbType = gdal.wkbLinearRing
if (gdal.CircularString) {
  gdal.CircularString.wkbType = gdal.wkbCircularString
  gdal.CompoundCurve.wkbType = gdal.wkbCompoundCurve
  gdal.MultiCurve.wkbType = gdal.wkbMultiCurve
}
gdal.Polygon.wkbType = gdal.wkbPolygon
gdal.MultiPoint.wkbType = gdal.wkbMultiPoint
gdal.MultiLineString.wkbType = gdal.wkbMultiLineString
gdal.MultiPolygon.wkbType = gdal.wkbMultiPolygon
gdal.GeometryCollection.wkbType = gdal.wkbGeometryCollection

// enable passing geometry constructors as the geometry type
gdal.DatasetLayers.prototype.create = (function () {
  const create = gdal.DatasetLayers.prototype.create
  return function (name, srs, geom_type /* , creation_options */) {
    if (arguments.length > 2 && geom_type instanceof Function) {
      if (typeof geom_type.wkbType === 'undefined') {
        throw new Error('Function must be a geometry constructor')
      }
      arguments[2] = geom_type.wkbType
    }
    return create.apply(this, arguments)
  }
})()

function getTypedArrayType(array) {
  if (array instanceof Uint8Array) return 1 // gdal.GDT_Byte
  if (array instanceof Int8Array) return 1 // gdal.GDT_Byte
  if (array instanceof Int16Array) return 3 // gdal.GDT_Int16
  if (array instanceof Uint16Array) return 2 // gdal.GDT_UInt16
  if (array instanceof Int32Array) return 5 // gdal.GDT_Int32
  if (array instanceof Uint32Array) return 4 // gdal.GDT_UInt32
  if (array instanceof Float32Array) return 6 // gdal.GDT_Float32
  if (array instanceof Float64Array) return 7 // gdal.GDT_Float64
  return 0 // gdal.GDT_Unknown
}

const mangleWrite = (args) => {
  let [ x, y, width, height, data, options ] = args
  if (!options) options = {}
  if (data) data._gdal_type = getTypedArrayType(data)
  return [
    x,
    y,
    width,
    height,
    data,
    options.buffer_width,
    options.buffer_height,
    options.pixel_space,
    options.line_space,
    options.progress_cb,
    options.offset
  ]
}

const mangleRead = (args) => {
  let [ x, y, width, height, data, options ] = args
  if (!options) options = {}
  if (data) data._gdal_type = getTypedArrayType(data)
  return [
    x,
    y,
    width,
    height,
    data,
    options.buffer_width,
    options.buffer_height,
    options.type,
    options.pixel_space,
    options.line_space,
    options.resampling,
    options.progress_cb,
    options.offset
  ]
}

const mangleBlock = (args) => {
  if (args[2]) args[2]._gdal_type = getTypedArrayType(args[2])
  return args
}

const mangleMDArray = (args) => {
  if (typeof args[0] === 'object' && typeof args[0].data === 'object') {
    args[0].data._gdal_type = getTypedArrayType(args[0].data)
  }
  return args
}

gdal.RasterBandPixels.prototype.read = (function () {
  const read = gdal.RasterBandPixels.prototype.read
  return function () {
    return read.apply(this, mangleRead(arguments))
  }
})()

gdal.RasterBandPixels.prototype.write = (function () {
  const write = gdal.RasterBandPixels.prototype.write
  return function () {
    return write.apply(this, mangleWrite(arguments))
  }
})()

gdal.RasterBandPixels.prototype.readBlock = (function () {
  const readBlock = gdal.RasterBandPixels.prototype.readBlock
  return function (x, y, data) {
    if (data) data._gdal_type = getTypedArrayType(data)
    return readBlock.apply(this, arguments)
  }
})()

gdal.RasterBandPixels.prototype.writeBlock = (function () {
  const writeBlock = gdal.RasterBandPixels.prototype.writeBlock
  return function (x, y, data) {
    data._gdal_type = getTypedArrayType(data)
    return writeBlock.apply(this, arguments)
  }
})()

if (gdal.MDArray) {
  gdal.MDArray.prototype.read = (function () {
    const read = gdal.MDArray.prototype.read
    return function () {
      return read.apply(this, mangleMDArray(arguments))
    }
  })()
}

const GroupCollection = {
  countAsync: 0,
  getAsync: 1
}

// Generic promisifiable methods and the argument number of their callbacks
const promisifiables = {
  Driver: {
    createAsync: 6,
    createCopyAsync: 5,
    openAsync: 2
  },
  Dataset: {
    flushAsync: 0,
    buildOverviewsAsync: 4,
    executeSQLAsync: 3,
    getMetadataAsync: 1,
    setMetadataAsync: 2
  },
  Layer: {
    flushAsync: 0
  },
  RasterBand: {
    flushAsync: 0,
    fillAsync: 2,
    computeStatisticsAsync: 1,
    getMetadataAsync: 1,
    setMetadataAsync: 2
  },
  RasterBandPixels: {
    readAsync: 13,
    writeAsync: 11,
    readBlockAsync: 3,
    writeBlockAsync: 3,
    getAsync: 2,
    setAsync: 3
  },
  DatasetLayers: {
    getAsync: 1,
    createAsync: 4,
    countAsync: 0,
    copyAsync: 3,
    removeAsync: 1
  },
  LayerFeatures: {
    getAsync: 1,
    setAsync: 2,
    firstAsync: 0,
    nextAsync: 0,
    addAsync: 1,
    countAsync: 1,
    removeAsync: 1
  },
  DatasetBands: {
    getAsync: 1,
    createAsync: 2,
    countAsync: 0
  },
  Geometry: {
    $fromWKTAsync: 2,
    $fromWKBAsync: 2,
    $fromGeoJsonAsync: 1,
    $fromGeoJsonBufferAsync: 1,
    toKMLAsync: 0,
    toGMLAsync: 0,
    toWKTAsync: 0,
    toWKBAsync: 2,
    toJSONAsync: 0,
    centroidAsync: 0,
    convexHullAsync: 0,
    boundaryAsync: 0,
    intersectionAsync: 1,
    flattenTo2DAsync: 0,
    unionAsync: 1,
    differenceAsync: 1,
    symDifferenceAsync: 1,
    simplifyAsync: 1,
    simplifyPreserveTopologyAsync: 1,
    bufferAsync: 2,
    getEnvelopeAsync: 0,
    getEnvelope3DAsync: 0,
    closeRingsAsync: 0,
    emptyAsync: 0,
    swapXYAsync: 0,
    isEmptyAsync: 0,
    isValidAsync: 0,
    makeValidAsync: 0,
    isSimpleAsync: 0,
    isRingAsync: 0,
    intersectsAsync: 1,
    equalsAsync: 1,
    disjointAsync: 1,
    touchesAsync: 1,
    crossesAsync: 1,
    withinAsync: 1,
    containsAsync: 1,
    overlapsAsync: 1,
    distanceAsync: 1,
    transformAsync: 1,
    transformToAsync: 1
  },
  SpatialReference: {
    $fromURLAsync: 1,
    $fromCRSURLAsync: 1,
    $fromUserInputAsync: 1
  },
  MDArray: {
    readAsync: 1
  },
  GroupArrays: GroupCollection,
  GroupDimensions: GroupCollection,
  GroupAttributes: GroupCollection,
  GroupGroups: GroupCollection,
  ArrayDimensions: GroupCollection,
  ArrayAttributes: GroupCollection,
  $: {
    $fillNodataAsync: 1,
    $contourGenerateAsync: 1,
    $sieveFilterAsync: 1,
    $checksumImageAsync: 5,
    $polygonizeAsync: 1,
    $reprojectImageAsync: 1,
    $suggestedWarpOutputAsync: 1,
    $translateAsync: 3,
    $vectorTranslateAsync: 3,
    $infoAsync: 2,
    $_acquireLocksAsync: 3
  }
}

const argMangle = {
  RasterBandPixels: {
    readAsync: mangleRead,
    writeAsync: mangleWrite,
    readBlockAsync: mangleBlock,
    writeBlockAsync: mangleBlock
  },
  MDArray: {
    readAsync: mangleMDArray
  }
}

// For each *Async function create a function that checks if the last parameter is a callback
// Then call either the original, either the promisified version with the callback
// placed at the right argument number since the C++ code does not support floating callbacks
for (const c of Object.keys(promisifiables)) {
  const klass = c === '$' ? gdal : gdal[c]
  if (klass === undefined) {
    continue
  }
  for (const _m of Object.keys(promisifiables[c])) {
    const { base, m } = _m.startsWith('$') ?
      { base: klass, m: _m.slice(1) } :
      { base: klass.prototype, m: _m }
    if (base[m] === undefined) {
      continue
    }
    base[m] = (function () {
      const promisified = promisify(base[m])
      const original = base[m]
      const cbArg = promisifiables[c][_m]
      const mangle = argMangle[c] && argMangle[c][_m] ? argMangle[c][_m] : (a) => a
      return function () {
        let callback
        if (typeof arguments[arguments.length - 1] === 'function') {
          callback = arguments[arguments.length - 1]
          arguments[arguments.length - 1] = undefined
        }
        let args = Array.prototype.slice.call(mangle(arguments), 0, cbArg)
        if (callback) {
          args[cbArg] = callback
          return original.apply(this, args)
        }
        args = Object.assign(new Array(cbArg).fill(undefined), args)
        return promisified.apply(this, args)
      }
    })()
  }
}
