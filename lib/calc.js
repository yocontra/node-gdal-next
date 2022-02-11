
/**
 * @typedef {object} CalcOptions
 * @property {boolean} [convertNoData]
 */

/**
 * Compute a new output band as a pixel-wise function of given input bands
 *
 * This is an alternative implementation of `gdal_calc.py`
 *
 * It is fully async and reading and decoding of input and output bands happen
 * in separate background threads for each band as long as they are in separate datasets.
 *
 * The main bottleneck is the passed function `fn` which must always run on the main Node.js/V8 thread.
 * This is a fundamental Node.js/V8 limitation that is impossible to overcome.
 *
 * This function is not to be used in server code that must remain responsive at all times.
 * It does not directly block the event loop, but it is very CPU-heavy and cannot
 * run parallel to other instances of itself. If multiple instances run in parallel, they
 * will all compete for the main thread, executing `fn` on the incoming data chunks on turn by turn basis.
 *
 * It internally uses a {@link RasterTransform} which can also be used directly for
 * a finer-grained control over the transformation.
 *
 * There is no sync version
 *
 * @function calcAsync
 * @param {Record<string, RasterBand>} inputs An object containing all the input bands
 * @param {RasterBand} output Output raster band
 * @param {(...args: number[]) => number} fn Function to apply on all pixels, it must have the same number of arguments as there are input bands
 * @param {CalcOptions} [options] Options
 * @param {boolean} [options.convertNoData=false] Input bands will have their NoData pixels converted to NaN and a NaN output value of the given function will be converted to a NoData pixel, provided that the output raster band has its `RasterBand.noDataValue` set
 * @return {Promise<void>}
 * @static
 *
 * @example
 *
 * const T2m = await gdal.openAsync('TEMP_2M.tiff'));
 * const D2m = await gdal.openAsync('DEWPOINT_2M.tiff'));
 * const size = await T2m.rasterSizeAsync
 * const cloudBase = await gdal.openAsync('CLOUDBASE.tiff', 'w', 'GTiff',
 *    size.x, size.y, 1, gdal.GDT_Float64);
 *
 * (await cloudBase.bands.getAsync(1)).noDataValue = -1e38
 * // Espy's estimation for cloud base height
 * const espyFn = (t, td) => 125 * (t - td);
 *
 * await calcAsync({
 *  t: await T2m.bands.getAsync(1),
 *  td: await D2m.bands.getAsync(1)
 * }, cloudBase.bands.getAsync(1), espyFn, { convertNoData: true });
 */

const calc = (gdal) => function calcAsync(inputs, output, fn, options) {
  const convertNoData = (options || {}).convertNoData

  for (const inp of Object.keys(inputs)) {
    if (!(inputs[inp] instanceof gdal.RasterBand)) {
      return Promise.reject(new TypeError('All inputs must be instances of gdal.RasterBand'))
    }
  }
  if (!(output instanceof gdal.RasterBand)) return Promise.reject(new TypeError('output must be an instance of gdal.RasterBand'))
  if (typeof fn !== 'function') return Promise.reject(new TypeError('fn must be a function'))

  const inSizesQ = Object.keys(inputs).map((inp) => inputs[inp].sizeAsync)
  const outSizeQ = output.sizeAsync
  const outTypeQ = output.dataTypeAsync

  return Promise.all([ outTypeQ, outSizeQ,...inSizesQ ]).then((values) => {
    const outType = values[0]
    for (let i = 2; i < values.length; i++) {
      if (values[1].x != values[i].x || values[1].y != values[i].y) {
        throw new RangeError('All raster bands dimensions must match')
      }
    }

    const streams = Object.keys(inputs)
      .map((inp) => ({ id: inp, stream: inputs[inp].pixels.createReadStream({ convertNoData }) }))
      .reduce((obj, stream) => {
        obj[stream.id] = stream.stream
        return obj
      }, {})
    const mux = new gdal.RasterMuxStream(streams)

    const ws = output.pixels.createWriteStream({ convertNoData })

    const xform = new gdal.RasterTransform({ type: gdal.fromDataType(outType), fn })

    return new Promise((resolve, reject) => {
      mux.on('error', reject)
      ws.on('error', reject)

      mux.pipe(xform).pipe(ws)

      ws.on('finish', resolve)
    })
  })
}

module.exports = calc
