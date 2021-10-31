/**
 * @typedef ProgressOptions
 * @property {ProgressCb} progress_cb
 */

/**
 * @typedef ProgressCb ( complete: number, msg: string ) => void
 */

/**
 * @typedef UtilOptions
 * @property {ProgressCb} [progress_cb]
 */

/**
 * @typedef units
 * @property {string} units
 * @property {number} value
 */

/**
 * @typedef stats
 * @property {number} min
 * @property {number} max
 * @property {number} mean
 * @property {number} std_dev
 */

/**
 * @typedef MDArrayOptions
 * @property {number[]} origin
 * @property {number[]} span
 * @property {number[]} [stride]
 * @property {string} [data_type]
 * @property {TypedArray} [data]
 * @property {number} [_offset]
 */

/**
 * @typedef CreateOptions
 * @property {ProgressCb} [progress_cb]
 */

/**
 * @typedef FillOptions
 * @property {gdal.RasterBand} src
 * @property {gdal.RasterBand} [mask]
 * @property {number} searchDist
 * @property {number} [smoothingIterations]
 */

/**
 * @typedef SieveOptions
 * @property {gdal.RasterBand} src
 * @property {gdal.RasterBand} dst
 * @property {gdal.RasterBand} [mask]
 * @property {number} threshold
 * @property {number} [connectedness]
 * @property {ProgressCb} [progress_cb]
 */

/**
 * @typedef ContourOptions
 * @property {gdal.RasterBand} src
 * @property {gdal.Layer} dst
 * @property {number} [offset]
 * @property {number} [interval]
 * @property {number[]} [fixedLevels]
 * @property {number} [nodata]
 * @property {number} [idField]
 * @property {number} [elevField]
 * @property {ProgressCb} [progress_cb]
 */

/**
 * @typedef ContourOptions
 * @property {gdal.RasterBand} src
 * @property {gdal.Layer} dst
 * @property {number} [offset]
 * @property {number} [interval]
 * @property {number[]} [fixedLevels]
 * @property {number} [nodata]
 * @property {number} [idField]
 * @property {number} [elevField]
 * @property {ProgressCb} [progress_cb]
 */

/**
 * @typedef PolygonizeOptions
 * @property {gdal.RasterBand} src
 * @property {gdal.Layer} dst
 * @property {gdal.RasterBand} [mask]
 * @property {number} pixValField The attribute field index indicating the feature attribute into which the pixel value of the polygon should be written.
 * @property {number} [connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @property {boolean} [useFloats=false] Use floating point buffers instead of int buffers.
 * @property {ProgressCb} [progress_cb] {{{progress_cb}}}
 */

/**
 * @typedef ReprojectOptions
 * @property {gdal.Dataset} src
 * @property {gdal.Dataset} dst
 * @property {gdal.SpatialReference} s_srs
 * @property {gdal.SpatialReference} t_srs
 * @property {string} [resampling]
 * @property {gdal.Geometry} [cutline]
 * @property {number[]} [srcBands]
 * @property {number[]} [dstBands]
 * @property {number} [srcAlphaBand]
 * @property {number} [dstAlphaBand]
 * @property {number} [srcNodata]
 * @property {number} [dstNodata]
 * @property {number} [blend]
 * @property {number} [memoryLimit]
 * @property {number} [maxError]
 * @property {boolean} [multi]
 * @property {object} [options]
 * @property {ProgressCb} [progress_cb]
 */

/**
 * @typedef WarpOptions
 * @property {gdal.Dataset} src
 * @property {gdal.SpatialReference} s_srs
 * @property {gdal.SpatialReference} t_srs
 * @property {number} [maxError]
 */

/**
 * @typedef WarpOutput
 * @property {xyz} rasterSize
 * @property {number[]} geoTransform
 */

/**
 * @typedef TypedArray Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array
 */

/**
 * @typedef ReadOptions
 * @property {number} [buffer_width]
 * @property {number} [buffer_height]
 * @property {string} [type]
 * @property {number} [pixel_space]
 * @property {number} [line_space]
 * @property {string} [resampling]
 * @property {ProgressCb} [progress_cb]
 * @property {number} [offset]
 */

/**
 * @typedef WriteOptions
 * @property {number} [buffer_width]
 * @property {number} [buffer_height]
 * @property {number} [pixel_space]
 * @property {number} [line_space]
 * @property {ProgressCb} [progress_cb]
 * @property {number} [offset]
 */

/**
 * @typedef Color
 * @property {number} c1
 * @property {number} c2
 * @property {number} c3
 * @property {number} c4
 */

/**
 * @interface xyz
 * @property {number} x
 * @property {number} y
 * @property {number} [z]
 */

/**
 * A simple key/value structure
 * @interface fieldValue { key: string, value: any }
 */

/**
 * @interface RasterReadableOptions
 * @extends stream.ReadableOptions
 * @property {boolean} blockOptimize
 */

/**
 * @interface RasterWritableOptions
 * @extends stream.WritableOptions
 * @property {boolean} blockOptimize
 */

/**
 * @interface RasterTransformOptions
 * @extends stream.TransformOptions
 * @property {Function} fn Function to be applied on all data
 * @property {new (len: number) => TypedArray} type Typed array constructor
 */
