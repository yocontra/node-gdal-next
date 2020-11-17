const path = require('path')
const fs = require('fs')
const binary = require('node-pre-gyp')

const binding_path = binary.find(path.join(__dirname, '../package.json'))
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

const gdal = module.exports = require(binding_path)

if (proj_lib_env_undefined) {
  gdal.setPROJSearchPath(proj_path)
}

gdal.Point.Multi = gdal.MultiPoint
gdal.LineString.Multi = gdal.MultiLineString
gdal.LinearRing.Multi = gdal.MultiLineString
gdal.Polygon.Multi = gdal.MultiPolygon

gdal.quiet()

gdal.config = {}

/**
 * Gets a GDAL configuration setting.
 *
 * @example
 * ```
 * data_path = gdal.config.get('GDAL_DATA');```
 *
 * @for gdal
 * @static
 * @method config.get
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
 * @for gdal
 * @static
 * @method config.set
 * @param {string} key
 * @param {string} value
 * @return {mixed}
 */
gdal.config.set = gdal.setConfigOption

delete gdal.getConfigOption
delete gdal.setConfigOption

if (process.env.GDAL_DATA === undefined) {
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

// --- add additional functionality to collections ---

function defaultForEach(callback) {
  const n = this.count()
  for (let i = 0; i < n; i++) {
    if (callback(this.get(i), i) === false) return
  }
}

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
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.RasterBand"}}RasterBand{{/crossLink}}
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
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.RasterBand"}}RasterBand{{/crossLink}}
 */
gdal.DatasetBands.prototype.map = defaultMap

/**
 * Iterates through all features using a callback function.
 *
 * @example
 * ```
 * layer.features.forEach(function(feature, i) { ... });```
 *
 * @for gdal.LayerFeatures
 * @method forEach
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Feature"}}Feature{{/crossLink}}
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
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Feature"}}Feature{{/crossLink}}
 */
gdal.LayerFeatures.prototype.map = defaultMap

/**
 * Iterates through all fields using a callback function.
 *
 * @example
 * ```
 * layer.features.get(0).fields.forEach(function(value, key) { ... });```
 *
 * @for gdal.FeatureFields
 * @method forEach
 * @param {Function} callback The callback to be called with each feature `value` and `key`.
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
 * @method map
 * @param {Function} callback The callback to be called with each feature `value` and `key`.
 */
gdal.FeatureFields.prototype.map = defaultMap

/**
 * Outputs the fields as a serialized JSON string.
 *
 * @for gdal.FeatureFields
 * @method toJSON
 * @return {String} Serialized JSON
 */
gdal.FeatureFields.prototype.toJSON = function () {
  return JSON.stringify(this.toObject())
}

/**
 * Converts the geometry to a GeoJSON object representation.
 *
 * @for gdal.Geometry
 * @method toObject
 * @return {Object} GeoJSON
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
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.FieldDefn"}}FieldDefn{{/crossLink}}
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
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.FieldDefn"}}FieldDefn{{/crossLink}}
 */
gdal.LayerFields.prototype.map = defaultMap

/**
 * Iterates through all layers using a callback function.
 *
 * @example
 * ```
 * dataset.layers.forEach(function(layer, i) { ... });```
 *
 * @for gdal.DatasetLayers
 * @method forEach
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Layer"}}Layer{{/crossLink}}
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
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Layer"}}Layer{{/crossLink}}
 */
gdal.DatasetLayers.prototype.map = defaultMap

/**
 * Iterates through all field definitions using a callback function.
 *
 * @example
 * ```
 * featureDefn.forEach(function(field, i) { ... });```
 *
 * @for gdal.FeatureDefnFields
 * @method forEach
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.FieldDefn"}}FieldDefn{{/crossLink}}
 */
gdal.FeatureDefnFields.prototype.forEach = defaultForEach

/**
 * Iterates through all field definitions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = dataset.layers.map(function(field, i) {
 *     return value;
 * });```
 *
 * @for gdal.FeatureDefnFields
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.FieldDefn"}}FieldDefn{{/crossLink}}
 */
gdal.FeatureDefnFields.prototype.map = defaultMap

/**
 * Iterates through all rings using a callback function.
 *
 * @example
 * ```
 * polygon.rings.forEach(function(ring, i) { ... });```
 *
 * @for gdal.PolygonRings
 * @method forEach
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.LineString"}}LineString{{/crossLink}}
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
 * @for gdal.LineStringPoints
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.LineString"}}LineString{{/crossLink}}
 */
gdal.PolygonRings.prototype.map = defaultMap

/**
 * Iterates through all points using a callback function.
 *
 * @example
 * ```
 * lineString.points.forEach(function(point, i) { ... });```
 *
 * @for gdal.LineStringPoints
 * @method forEach
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Point"}}Point{{/crossLink}}
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
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Point"}}Point{{/crossLink}}
 */
gdal.LineStringPoints.prototype.map = defaultMap

/**
 * Iterates through all child geometries using a callback function.
 *
 * @example
 * ```
 * geometryCollection.children.forEach(function(geometry, i) { ... });```
 *
 * @for gdal.GeometryCollectionChildren
 * @method forEach
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Geometry"}}Geometry{{/crossLink}}
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
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Geometry"}}Geometry{{/crossLink}}
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
 * @param {Function} callback
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
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Geometry"}}Geometry{{/crossLink}}
 */
gdal.RasterBandOverviews.prototype.map = defaultMap

/**
 * Iterates through all registered drivers using a callback function.
 *
 * @example
 * ```
 * gdal.drivers.forEach(function(driver, i) { ... });```
 *
 * @for gdal.GDALDrivers
 * @method forEach
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Driver"}}Driver{{/crossLink}}
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
 * @method map
 * @param {Function} callback The callback to be called with each {{#crossLink "gdal.Driver"}}Driver{{/crossLink}}
 */
gdal.GDALDrivers.prototype.map = defaultMap

/**
 * Outputs all geometries as a regular javascript array.
 *
 * @for gdal.GeometryCollectionChildren
 * @method toArray
 * @return {Array} List of {{#crossLink "gdal.Geometry"}}Geometry{{/crossLink}} instances.
 */
gdal.GeometryCollectionChildren.prototype.toArray = defaultToArray

/**
 * Outputs all points as a regular javascript array.
 *
 * @for gdal.LineStringPoints
 * @method toArray
 * @return {Array} List of {{#crossLink "gdal.Point"}}Point{{/crossLink}} instances.
 */
gdal.LineStringPoints.prototype.toArray = defaultToArray

/**
 * Outputs all rings as a regular javascript array.
 *
 * @for gdal.PolygonRings
 * @method toArray
 * @return {Array} List of {{#crossLink "gdal.LineString"}}LineString{{/crossLink}} instances.
 */
gdal.PolygonRings.prototype.toArray = defaultToArray

/**
 * Creates or opens a dataset. Dataset should be explicitly closed with `dataset.close()` method if opened in `"w"` mode to flush any changes. Otherwise, datasets are closed when (and if) node decides to garbage collect them.
 *
 * @example
 * ```
 * var dataset = gdal.open('./data.shp');```
 *
 * @for gdal
 * @throws Error
 * @method open
 * @static
 * @param {String} path Path to dataset to open
 * @param {String} [mode="r"] The mode to use to open the file: `"r"`, `"r+"`, or `"w"`
 * @param {String|Array} [drivers] Driver name, or list of driver names to attempt to use.
 *
 * @param {Integer} [x_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {Integer} [y_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {Integer} [band_count] Used when creating a raster dataset with the `"w"` mode.
 * @param {Integer} [data_type] Used when creating a raster dataset with the `"w"` mode.
 * @param {String[]|object} [creation_options] Used when creating a dataset with the `"w"` mode.
 *
 * @return {gdal.Dataset}
 */
gdal.open = (function () {
  const open = gdal.open

  // add 'w' mode to gdal.open() method and also GDAL2-style driver selection
  return function (
    filename,
    mode,
    drivers /* , x_size, y_size, n_bands, datatype, options */
  ) {
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

/**
 * Standard async request callback
 * @method requestCallback
 * @param {error} error error or undefined when the operation is successful
 * @param {object} result result of the asynchronous operation or undefined on error
 */

const promisify = require('util').promisify
const callbackify = require('util').callbackify

gdal.Driver.prototype.createAsync = (function () {
  const driverCreateCb = gdal.Driver.prototype.createAsync
  const driverCreatePromise = promisify(gdal.Driver.prototype.createAsync)
  return function (
    filename,
    x_size,
    y_size,
    n_bands,
    datatype,
    options,
    callback
  ) {
    if (typeof arguments[arguments.length - 1] === 'function' && callback === undefined) {
      callback = arguments[arguments.length - 1]
      arguments[arguments.length - 1] = undefined
    }
    if (callback) {
      return driverCreateCb.call(this, filename, x_size, y_size,
        n_bands, datatype, options, callback)
    }
    return driverCreatePromise.call(this, filename, x_size, y_size,
      n_bands, datatype, options)
  }
})()

gdal.Driver.prototype.createCopyAsync = (function () {
  const driverCreateCopyCb = gdal.Driver.prototype.createCopyAsync
  const driverCreateCopyPromise = promisify(gdal.Driver.prototype.createCopyAsync)
  return function (
    filename,
    src,
    options,
    callback
  ) {
    if (typeof arguments[arguments.length - 1] === 'function' && callback === undefined) {
      callback = arguments[arguments.length - 1]
      arguments[arguments.length - 1] = undefined
    }
    if (callback) {
      return driverCreateCopyCb.call(this, filename, src, options, callback)
    }
    return driverCreateCopyPromise.call(this, filename, src, options)
  }
})()

gdal.Driver.prototype.openAsync = (function () {
  const driverOpenCb = gdal.Driver.prototype.openAsync
  const driverOpenPromise = promisify(gdal.Driver.prototype.openAsync)
  return function (
    filename,
    mode,
    callback
  ) {
    if (typeof arguments[arguments.length - 1] === 'function' && callback === undefined) {
      callback = arguments[arguments.length - 1]
      arguments[arguments.length - 1] = undefined
    }
    if (callback) {
      return driverOpenCb.call(this, filename, mode, callback)
    }
    return driverOpenPromise.apply(this, filename, mode)
  }
})()

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
 * gdal.openAsync('./data.shp', (err, ds) => {...});```
 *
 * @for gdal
 * @method openAsync
 * @static
 * @param {String} path Path to dataset to open
 * @param {String} [mode="r"] The mode to use to open the file: `"r"`, `"r+"`, or `"w"`
 * @param {String|Array} [drivers] Driver name, or list of driver names to attempt to use.
 *
 * @param {Integer} [x_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {Integer} [y_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {Integer} [band_count] Used when creating a raster dataset with the `"w"` mode.
 * @param {Integer} [data_type] Used when creating a raster dataset with the `"w"` mode.
 * @param {String[]|object} [creation_options] Used when creating a dataset with the `"w"` mode.
 * @param {requestCallback} [callback] Promisifiable callback, always the last parameter, can be specified even if
 * certain optional parameters are omitted
 *
 * @return {gdal.Dataset}
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
 * @param {Object} object
 * @param {Boolean} [approx_ok=false]
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

gdal.Point.wkbType = gdal.wkbPoint
gdal.LineString.wkbType = gdal.wkbLineString
gdal.LinearRing.wkbType = gdal.wkbLinearRing
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

gdal.RasterBandPixels.prototype.read = (function () {
  const read = gdal.RasterBandPixels.prototype.read
  return function (x, y, width, height, data, options) {
    if (!options) options = {}
    if (data) data._gdal_type = getTypedArrayType(data)
    return read.apply(this, [
      x,
      y,
      width,
      height,
      data,
      options.buffer_width,
      options.buffer_height,
      options.type,
      options.pixel_space,
      options.line_space
    ])
  }
})()

gdal.RasterBandPixels.prototype.readAsync = (function () {
  const readCb = gdal.RasterBandPixels.prototype.readAsync
  const readPromise = promisify(gdal.RasterBandPixels.prototype.readAsync)
  return function (x, y, width, height, data, options, cb) {
    if (typeof arguments[arguments.length - 1] === 'function' && cb === undefined) {
      cb = arguments[arguments.length - 1]
      /* This has the desired effect of unsetting that argument */
      arguments[arguments.length - 1] = undefined
    }
    if (!options) options = {}
    if (data) data._gdal_type = getTypedArrayType(data)
    if (cb) {
      return readCb.apply(this, [
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
        cb
      ])
    }
    return readPromise.apply(this, [
      x,
      y,
      width,
      height,
      data,
      options.buffer_width,
      options.buffer_height,
      options.type,
      options.pixel_space,
      options.line_space
    ])
  }
})()

gdal.RasterBandPixels.prototype.write = (function () {
  const write = gdal.RasterBandPixels.prototype.write
  return function (x, y, width, height, data, options) {
    if (!options) options = {}
    if (data) data._gdal_type = getTypedArrayType(data)
    return write.apply(this, [
      x,
      y,
      width,
      height,
      data,
      options.buffer_width,
      options.buffer_height,
      options.pixel_space,
      options.line_space
    ])
  }
})()

gdal.RasterBandPixels.prototype.writeAsync = (function () {
  const writeCb = gdal.RasterBandPixels.prototype.writeAsync
  const writePromise = promisify(gdal.RasterBandPixels.prototype.writeAsync)
  return function (x, y, width, height, data, options, cb) {
    if (typeof arguments[arguments.length - 1] === 'function' && cb === undefined) {
      cb = arguments[arguments.length - 1]
      arguments[arguments.length - 1] = undefined
    }
    if (!options) options = {}
    if (data) data._gdal_type = getTypedArrayType(data)
    if (cb) {
      return writeCb.apply(this, [
        x,
        y,
        width,
        height,
        data,
        options.buffer_width,
        options.buffer_height,
        options.pixel_space,
        options.line_space,
        cb
      ])
    }
    return writePromise.apply(this, [
      x,
      y,
      width,
      height,
      data,
      options.buffer_width,
      options.buffer_height,
      options.pixel_space,
      options.line_space
    ])
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

// Generic promisifiable methods and the argument number of their callbacks
const promisifiables = {
  LayerFeatures: {
    getAsync: 1,
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
    toKMLAsync: 0,
    toGMLAsync: 0,
    toWKTAsync: 0,
    toWKBAsync: 2,
    toJSONAsync: 0,
    centroidAsync: 0,
    getEnvelopeAsync: 0,
    getEnvelope3DAsync: 0
  }
}

for (const c of Object.keys(promisifiables)) {
  for (const _m of Object.keys(promisifiables[c])) {
    const { base, m } = _m.startsWith('$') ?
      { base: gdal[c], m: _m.slice(1) } :
      { base: gdal[c].prototype, m: _m }
    base[m] = (function () {
      const promisified = promisify(base[m])
      const original = base[m]
      const cbArg = promisifiables[c][_m]
      return function () {
        let callback
        if (typeof arguments[arguments.length - 1] === 'function') {
          callback = arguments[arguments.length - 1]
          arguments[arguments.length - 1] = undefined
        }
        let args = Array.prototype.slice.call(arguments, 0, cbArg)
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
