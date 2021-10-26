

module.exports = function (gdal) {

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

  function defaultAsyncIterator() {
    let i = 0

    return {
      next: () => this.countAsync()
        .then((count) => {
          if (i < count) {
            return this.getAsync(i++).then((value) => ({ done: false, value }))
          }
          return { done: true, value: null }
        })
    }
  }


  /**
 * Iterates through all layers using a callback function.
 *
 * @example
 * ```
 * dataset.layers.forEach(function(array, i) { ... });```
 *
 * @for gdal.DatasetLayers
 * @method forEach
 * @param {forEachCb<gdal.Layer>} callback The callback to be called with each {{#crossLink "Layer"}}Layer{{/crossLink}}
 */
  gdal.DatasetLayers.prototype.forEach = defaultForEach


  /**
 * Iterates through layers using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = dataset.layers.map(function(array, i) {
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
 * for (const array of dataset.layers) {
 * }
 *
 * @for gdal.DatasetLayers
 * @type {gdal.Layer}
 * @method Symbol.iterator
 */
  gdal.DatasetLayers.prototype[Symbol.iterator] = defaultIterator


  /**
 * Iterates through all layers using an async iterator
 *
 * @example
 * ```
 * for await (const array of dataset.layers) {
 * }
 *
 * @for gdal.DatasetLayers
 * @type {gdal.Layer}
 * @method Symbol.asyncIterator
 */
  if (Symbol.asyncIterator) {
    gdal.DatasetLayers.prototype[Symbol.asyncIterator] = defaultAsyncIterator
  }


  /**
 * Iterates through raster bands using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = dataset.bands.map(function(array, i) {
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
 * Iterates through all overviews using a callback function.
 *
 * @example
 * ```
 * band.overviews.forEach(function(array, i) { ... });```
 *
 * @for gdal.RasterBandOverviews
 * @method forEach
 * @param {forEachCb<gdal.RasterBand>} callback The callback to be called with each {{#crossLink "RasterBand"}}RasterBand{{/crossLink}}
 */
  gdal.RasterBandOverviews.prototype.forEach = defaultForEach


  /**
 * Iterates through overviews using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = band.overviews.map(function(array, i) {
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
 * Iterates through all overviews using an iterator
 *
 * @example
 * ```
 * for (const array of band.overviews) {
 * }
 *
 * @for gdal.RasterBandOverviews
 * @type {gdal.RasterBand}
 * @method Symbol.iterator
 */
  gdal.RasterBandOverviews.prototype[Symbol.iterator] = defaultIterator


  /**
 * Iterates through all overviews using an async iterator
 *
 * @example
 * ```
 * for await (const array of band.overviews) {
 * }
 *
 * @for gdal.RasterBandOverviews
 * @type {gdal.RasterBand}
 * @method Symbol.asyncIterator
 */
  if (Symbol.asyncIterator) {
    gdal.RasterBandOverviews.prototype[Symbol.asyncIterator] = defaultAsyncIterator
  }


  /**
 * Iterates through all drivers using a callback function.
 *
 * @example
 * ```
 * gdal.drivers.forEach(function(array, i) { ... });```
 *
 * @for gdal.GDALDrivers
 * @method forEach
 * @param {forEachCb<gdal.Driver>} callback The callback to be called with each {{#crossLink "Driver"}}Driver{{/crossLink}}
 */
  gdal.GDALDrivers.prototype.forEach = defaultForEach


  /**
 * Iterates through drivers using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = gdal.drivers.map(function(array, i) {
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
 * for (const array of gdal.drivers) {
 * }
 *
 * @for gdal.GDALDrivers
 * @type {gdal.Driver}
 * @method Symbol.iterator
 */
  gdal.GDALDrivers.prototype[Symbol.iterator] = defaultIterator


  /**
 * Iterates through features using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = layer.features.map(function(array, i) {
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
 * Iterates through field definitions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = layer.features.get(0).fields.map(function(array, i) {
 *     return value;
 * });```
 *
 * @for gdal.FeatureFields
 * @method map<U>
 * @param {mapCb<gdal.fieldValue,U>} callback The callback to be called with each {{#crossLink "fieldValue"}}fieldValue{{/crossLink}}
 * @return {U[]}
 */
  gdal.FeatureFields.prototype.map = defaultMap


  /**
 * Iterates through all field definitions using a callback function.
 *
 * @example
 * ```
 * layer.fields.forEach(function(array, i) { ... });```
 *
 * @for gdal.LayerFields
 * @method forEach
 * @param {forEachCb<gdal.FieldDefn>} callback The callback to be called with each {{#crossLink "FieldDefn"}}FieldDefn{{/crossLink}}
 */
  gdal.LayerFields.prototype.forEach = defaultForEach


  /**
 * Iterates through field definitions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = layer.fields.map(function(array, i) {
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
 * for (const array of layer.fields) {
 * }
 *
 * @for gdal.LayerFields
 * @type {gdal.FieldDefn}
 * @method Symbol.iterator
 */
  gdal.LayerFields.prototype[Symbol.iterator] = defaultIterator


  /**
 * Iterates through all field definitions using an async iterator
 *
 * @example
 * ```
 * for await (const array of layer.fields) {
 * }
 *
 * @for gdal.LayerFields
 * @type {gdal.FieldDefn}
 * @method Symbol.asyncIterator
 */
  if (Symbol.asyncIterator) {
    gdal.LayerFields.prototype[Symbol.asyncIterator] = defaultAsyncIterator
  }


  /**
 * Iterates through all field definitions using a callback function.
 *
 * @example
 * ```
 * featureDefn.forEach(function(array, i) { ... });```
 *
 * @for gdal.FeatureDefnFields
 * @method forEach
 * @param {forEachCb<gdal.FieldDefn>} callback The callback to be called with each {{#crossLink "FieldDefn"}}FieldDefn{{/crossLink}}
 */
  gdal.FeatureDefnFields.prototype.forEach = defaultForEach


  /**
 * Iterates through field definitions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = featureDefn.map(function(array, i) {
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
 * for (const array of featureDefn) {
 * }
 *
 * @for gdal.FeatureDefnFields
 * @type {gdal.FieldDefn}
 * @method Symbol.iterator
 */
  gdal.FeatureDefnFields.prototype[Symbol.iterator] = defaultIterator


  /**
 * Iterates through all field definitions using an async iterator
 *
 * @example
 * ```
 * for await (const array of featureDefn) {
 * }
 *
 * @for gdal.FeatureDefnFields
 * @type {gdal.FieldDefn}
 * @method Symbol.asyncIterator
 */
  if (Symbol.asyncIterator) {
    gdal.FeatureDefnFields.prototype[Symbol.asyncIterator] = defaultAsyncIterator
  }


  /**
 * Iterates through all points using a callback function.
 *
 * @example
 * ```
 * lineString.points.forEach(function(array, i) { ... });```
 *
 * @for gdal.LineStringPoints
 * @method forEach
 * @param {forEachCb<gdal.Point>} callback The callback to be called with each {{#crossLink "Point"}}Point{{/crossLink}}
 */
  gdal.LineStringPoints.prototype.forEach = defaultForEach


  /**
 * Iterates through points using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = lineString.points.map(function(array, i) {
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
 * for (const array of lineString.points) {
 * }
 *
 * @for gdal.LineStringPoints
 * @type {gdal.Point}
 * @method Symbol.iterator
 */
  gdal.LineStringPoints.prototype[Symbol.iterator] = defaultIterator


  /**
 * Outputs all points as a regular javascript array.
 *
 * @for gdal.LineStringPoints
 * @method toArray
 * @return {gdal.Point[]} List of {{#crossLink "Point"}}Point{{/crossLink}} instances.
 */
  gdal.LineStringPoints.prototype.toArray = defaultToArray


  /**
 * Iterates through all rings using a callback function.
 *
 * @example
 * ```
 * polygon.rings.forEach(function(array, i) { ... });```
 *
 * @for gdal.PolygonRings
 * @method forEach
 * @param {forEachCb<gdal.LineString>} callback The callback to be called with each {{#crossLink "LineString"}}LineString{{/crossLink}}
 */
  gdal.PolygonRings.prototype.forEach = defaultForEach


  /**
 * Iterates through rings using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = polygon.rings.map(function(array, i) {
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
 * for (const array of polygon.rings) {
 * }
 *
 * @for gdal.PolygonRings
 * @type {gdal.LineString}
 * @method Symbol.iterator
 */
  gdal.PolygonRings.prototype[Symbol.iterator] = defaultIterator


  /**
 * Outputs all rings as a regular javascript array.
 *
 * @for gdal.PolygonRings
 * @method toArray
 * @return {gdal.LineString[]} List of {{#crossLink "LineString"}}LineString{{/crossLink}} instances.
 */
  gdal.PolygonRings.prototype.toArray = defaultToArray

  if (gdal.CompoundCurveCurves) {


    /**
 * Iterates through all curves using a callback function.
 *
 * @example
 * ```
 * compoundCurves.curves.forEach(function(array, i) { ... });```
 *
 * @for gdal.CompoundCurveCurves
 * @method forEach
 * @param {forEachCb<gdal.SimpleCurve>} callback The callback to be called with each {{#crossLink "SimpleCurve"}}SimpleCurve{{/crossLink}}
 */
    gdal.CompoundCurveCurves.prototype.forEach = defaultForEach


    /**
 * Iterates through curves using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = compoundCurves.curves.map(function(array, i) {
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
 * for (const array of compoundCurves.curves) {
 * }
 *
 * @for gdal.CompoundCurveCurves
 * @type {gdal.SimpleCurve}
 * @method Symbol.iterator
 */
    gdal.CompoundCurveCurves.prototype[Symbol.iterator] = defaultIterator


    /**
 * Iterates through all curves using an async iterator
 *
 * @example
 * ```
 * for await (const array of compoundCurves.curves) {
 * }
 *
 * @for gdal.CompoundCurveCurves
 * @type {gdal.SimpleCurve}
 * @method Symbol.asyncIterator
 */
    if (Symbol.asyncIterator) {
      gdal.CompoundCurveCurves.prototype[Symbol.asyncIterator] = defaultAsyncIterator
    }


    /**
 * Outputs all curves as a regular javascript array.
 *
 * @for gdal.CompoundCurveCurves
 * @method toArray
 * @return {gdal.SimpleCurve[]} List of {{#crossLink "SimpleCurve"}}SimpleCurve{{/crossLink}} instances.
 */
    gdal.CompoundCurveCurves.prototype.toArray = defaultToArray

  }


  /**
 * Iterates through all child geometries using a callback function.
 *
 * @example
 * ```
 * geometryCollection.children.forEach(function(array, i) { ... });```
 *
 * @for gdal.GeometryCollectionChildren
 * @method forEach
 * @param {forEachCb<gdal.Geometry>} callback The callback to be called with each {{#crossLink "Geometry"}}Geometry{{/crossLink}}
 */
  gdal.GeometryCollectionChildren.prototype.forEach = defaultForEach


  /**
 * Iterates through child geometries using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = geometryCollection.children.map(function(array, i) {
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
 * Iterates through all child geometries using an iterator
 *
 * @example
 * ```
 * for (const array of geometryCollection.children) {
 * }
 *
 * @for gdal.GeometryCollectionChildren
 * @type {gdal.Geometry}
 * @method Symbol.iterator
 */
  gdal.GeometryCollectionChildren.prototype[Symbol.iterator] = defaultIterator


  /**
 * Iterates through all color entries using a callback function.
 *
 * @example
 * ```
 * band.colorTable.forEach(function(array, i) { ... });```
 *
 * @for gdal.ColorTable
 * @method forEach
 * @param {forEachCb<gdal.Color>} callback The callback to be called with each {{#crossLink "Color"}}Color{{/crossLink}}
 */
  gdal.ColorTable.prototype.forEach = defaultForEach


  /**
 * Iterates through color entries using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = band.colorTable.map(function(array, i) {
 *     return value;
 * });```
 *
 * @for gdal.ColorTable
 * @method map<U>
 * @param {mapCb<gdal.Color,U>} callback The callback to be called with each {{#crossLink "Color"}}Color{{/crossLink}}
 * @return {U[]}
 */
  gdal.ColorTable.prototype.map = defaultMap


  /**
 * Iterates through all color entries using an iterator
 *
 * @example
 * ```
 * for (const array of band.colorTable) {
 * }
 *
 * @for gdal.ColorTable
 * @type {gdal.Color}
 * @method Symbol.iterator
 */
  gdal.ColorTable.prototype[Symbol.iterator] = defaultIterator


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
 * Iterates through arrays using a callback function and builds
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
 * Iterates through all arrays using an async iterator
 *
 * @example
 * ```
 * for await (const array of group.arrays) {
 * }
 *
 * @for gdal.GroupArrays
 * @type {gdal.MDArray}
 * @method Symbol.asyncIterator
 */
    if (Symbol.asyncIterator) {
      gdal.GroupArrays.prototype[Symbol.asyncIterator] = defaultAsyncIterator
    }


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
 * Iterates through groups using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = group.groups.map(function(array, i) {
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
 * for (const array of group.groups) {
 * }
 *
 * @for gdal.GroupGroups
 * @type {gdal.Group}
 * @method Symbol.iterator
 */
    gdal.GroupGroups.prototype[Symbol.iterator] = defaultIterator


    /**
 * Iterates through all groups using an async iterator
 *
 * @example
 * ```
 * for await (const array of group.groups) {
 * }
 *
 * @for gdal.GroupGroups
 * @type {gdal.Group}
 * @method Symbol.asyncIterator
 */
    if (Symbol.asyncIterator) {
      gdal.GroupGroups.prototype[Symbol.asyncIterator] = defaultAsyncIterator
    }


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
 * Iterates through dimensions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = group.dimensions.map(function(array, i) {
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
 * for (const array of group.dimensions) {
 * }
 *
 * @for gdal.GroupDimensions
 * @type {gdal.Dimension}
 * @method Symbol.iterator
 */
    gdal.GroupDimensions.prototype[Symbol.iterator] = defaultIterator


    /**
 * Iterates through all dimensions using an async iterator
 *
 * @example
 * ```
 * for await (const array of group.dimensions) {
 * }
 *
 * @for gdal.GroupDimensions
 * @type {gdal.Dimension}
 * @method Symbol.asyncIterator
 */
    if (Symbol.asyncIterator) {
      gdal.GroupDimensions.prototype[Symbol.asyncIterator] = defaultAsyncIterator
    }


    /**
 * Iterates through all attributes using a callback function.
 *
 * @example
 * ```
 * group.attributes.forEach(function(array, i) { ... });```
 *
 * @for gdal.GroupAttributes
 * @method forEach
 * @param {forEachCb<gdal.Attribute>} callback The callback to be called with each {{#crossLink "Attribute"}}Attribute{{/crossLink}}
 */
    gdal.GroupAttributes.prototype.forEach = defaultForEach


    /**
 * Iterates through attributes using a callback function and builds
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
 * for (const array of group.attributes) {
 * }
 *
 * @for gdal.GroupAttributes
 * @type {gdal.Attribute}
 * @method Symbol.iterator
 */
    gdal.GroupAttributes.prototype[Symbol.iterator] = defaultIterator


    /**
 * Iterates through all attributes using an async iterator
 *
 * @example
 * ```
 * for await (const array of group.attributes) {
 * }
 *
 * @for gdal.GroupAttributes
 * @type {gdal.Attribute}
 * @method Symbol.asyncIterator
 */
    if (Symbol.asyncIterator) {
      gdal.GroupAttributes.prototype[Symbol.asyncIterator] = defaultAsyncIterator
    }


    /**
 * Iterates through all dimensions using a callback function.
 *
 * @example
 * ```
 * array.dimensions.forEach(function(array, i) { ... });```
 *
 * @for gdal.ArrayDimensions
 * @method forEach
 * @param {forEachCb<gdal.Dimension>} callback The callback to be called with each {{#crossLink "Dimension"}}Dimension{{/crossLink}}
 */
    gdal.ArrayDimensions.prototype.forEach = defaultForEach


    /**
 * Iterates through dimensions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = array.dimensions.map(function(array, i) {
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
 * for (const array of array.dimensions) {
 * }
 *
 * @for gdal.ArrayDimensions
 * @type {gdal.Dimension}
 * @method Symbol.iterator
 */
    gdal.ArrayDimensions.prototype[Symbol.iterator] = defaultIterator


    /**
 * Iterates through all dimensions using an async iterator
 *
 * @example
 * ```
 * for await (const array of array.dimensions) {
 * }
 *
 * @for gdal.ArrayDimensions
 * @type {gdal.Dimension}
 * @method Symbol.asyncIterator
 */
    if (Symbol.asyncIterator) {
      gdal.ArrayDimensions.prototype[Symbol.asyncIterator] = defaultAsyncIterator
    }


    /**
 * Iterates through all attributes using a callback function.
 *
 * @example
 * ```
 * array.attributes.forEach(function(array, i) { ... });```
 *
 * @for gdal.ArrayAttributes
 * @method forEach
 * @param {forEachCb<gdal.Attribute>} callback The callback to be called with each {{#crossLink "Attribute"}}Attribute{{/crossLink}}
 */
    gdal.ArrayAttributes.prototype.forEach = defaultForEach


    /**
 * Iterates through attributes using a callback function and builds
 * an array of the returned values.
 *
 * @example
 * ```
 * var result = array.attributes.map(function(array, i) {
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
 * for (const array of array.attributes) {
 * }
 *
 * @for gdal.ArrayAttributes
 * @type {gdal.Attribute}
 * @method Symbol.iterator
 */
    gdal.ArrayAttributes.prototype[Symbol.iterator] = defaultIterator


    /**
 * Iterates through all attributes using an async iterator
 *
 * @example
 * ```
 * for await (const array of array.attributes) {
 * }
 *
 * @for gdal.ArrayAttributes
 * @type {gdal.Attribute}
 * @method Symbol.asyncIterator
 */
    if (Symbol.asyncIterator) {
      gdal.ArrayAttributes.prototype[Symbol.asyncIterator] = defaultAsyncIterator
    }


  }

}
