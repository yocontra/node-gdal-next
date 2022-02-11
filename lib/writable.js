const { Writable } = require('stream')

const debug = process.env.NODE_DEBUG && process.env.NODE_DEBUG.match(/gdal_write|gdal([^_]|$)/) ?
  console.debug.bind(console, 'RasterWriteStream:') :
  () => undefined

/**
 * @interface RasterWritableOptions
 * @extends stream.WritableOptions
 * @property {boolean} [blockOptimize]
 * @property {boolean} [convertNoData]
 */

/**
 * create a Writable stream from a raster band
 *
 * @memberof RasterBandPixels
 * @instance
 * @method createWriteStream
 * @param {RasterWritableOptions} [options]
 * @param {boolean} [options.blockOptimize=true] Write by file blocks when possible (when rasterSize.x == blockSize.x)
 * @param {boolean} [options.convertNoData=true] Automatically convert `NaN` to `RasterBand.noDataValue` if it is set
 * @returns {RasterWriteStream}
 */
function createWriteStream(options) {
  const writable = new RasterWriteStream({ ...options ||{}, band: this.band })
  return writable
}

/**
 * Class implementing {@link RasterBand}
 * writing as a stream of pixels
 *
 * Writing is buffered and it is aligned on the underlying
 * compression blocks for maximum efficiency when possible
 *
 * When piping between rasters using identical blocks,
 * the transfer is zero-copy
 *
 * The input stream must be in row-major order
 *
 * If the data type of the stream is different from the data type
 * of the file, GDAL will automatically convert. Mixing data types
 * across chunks is not supported, all chunks must have the same type.
 *
 * Writing is zero-copy when writing chunks that are exact
 * multiples of the underlying stream block size as returned
 * by `gdal.RasterBandPixels.blockSize`
 *
 * Block are written only when full, so the stream must
 * receive exactly `width * height` pixels to write the last block
 *
 * @class RasterWriteStream
 * @extends stream.Writable
 * @constructor
 * @param {RasterWritableOptions} [options]
 * @param {RasterBand} options.band RasterBand to use
 * @param {boolean} [options.blockOptimize=true] Write by file blocks when possible (when rasterSize.x == blockSize.x)
 * @param {boolean} [options.convertNoData=false] Automatically convert `NaN` to `RasterBand.noDataValue` if it is set when the stream is constructed
 */
class RasterWriteStream extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true })
    this.band = options.band
    this.buffers = []
    this.buffered = 0
    this.writingPos = 0
    this.blockPos = 0

    if (!options.band.pixels) {
      throw new TypeError('"band" must be a gdal.RasterBand')
    }

    this.initQ = Promise.all([ this.band.blockSizeAsync, this.band.sizeAsync, this.band.noDataValueAsync ])
      .then(([ blockSize, rasterSize, noDataValue ]) => {
        this.blockSize = blockSize
        this.blockLen = blockSize.x * blockSize.y
        this.rasterSize = rasterSize
        if (options.convertNoData && noDataValue !== null) {
          this._convertNoData = this._doConvertNoData.bind(this, noDataValue)
        } else {
          this._convertNoData = () => undefined
        }
        if (blockSize.x == rasterSize.x && options.blockOptimize !== false) {
          debug('init done, optimized block write', blockSize, rasterSize)
          this._writeNextBuffer = RasterWriteStream.prototype._writeNextBlock
          return
        }
        debug('init done, line by line write', blockSize, rasterSize)
        this.blockLen = this.rasterSize.x
        this._writeNextBuffer = RasterWriteStream.prototype._writeNextLine
      })
  }
}

RasterWriteStream.prototype._doConvertNoData = function (noData, buffer) {
  for (let i = 0; i < buffer.length; i++) {
    if (isNaN(buffer[i])) buffer[i] = noData
  }
}

RasterWriteStream.prototype._writeNextBlock = function (buffer) {
  const q = this.band.pixels.writeBlockAsync(0, this.blockPos, buffer)
  this.blockPos++
  this.writingPos += this.blockSize.y
  if (this.writingPos + this.blockSize.y > this.rasterSize.y) {
    // the next block will be an edge block
    this._writeNextBuffer = RasterWriteStream.prototype._writeNextLine
    this.blockLen = this.rasterSize.x
    debug('next block will be an edge block of size', this.blockLen)
  }
  return q
}

RasterWriteStream.prototype._writeNextLine = function (buffer) {
  const q = this.band.pixels.writeAsync(0, this.writingPos, this.rasterSize.x, 1, buffer)
  this.blockPos++
  this.writingPos++
  return q
}

RasterWriteStream.prototype._writeNext = function (cb) {
  const q = []
  while (this.buffered >= this.blockLen) {
    // We have enough for one block
    let buffer
    if (this.buffers[0].length == this.blockLen) {
      debug('writing full block in zero-copy mode', this.buffered, this.blockLen)
      // zero-copy piping when:
      // source.blockSize == target.blockSize && target.blockSize.x = target.rasterSize.x
      buffer = this.buffers[0]
      this.buffers.shift()
    } else {
      debug('writing full block in block consolidation mode', this.buffered, this.blockLen, this.buffers.map((buf) => buf.length))
      // block writing with in-memory copying (no gdal.RasterBand.pixels.writev)
      // source.blockSize != target.blockSize && target.blockSize.x = target.rasterSize.x
      buffer = new this.buffers[0].constructor(this.blockLen)
      let len = 0
      while (len + this.buffers[0].length < this.blockLen) {
        buffer.set(this.buffers[0], len)
        len += this.buffers[0].length
        this.buffers.shift()
      }
      buffer.set(this.buffers[0].subarray(0, this.blockLen - len), len)
      if (this.blockLen - len < this.buffers[0].length) {
        this.buffers[0] = this.buffers[0].subarray(this.blockLen - len)
      } else {
        this.buffers.shift()
      }
    }

    debug('writing', this.blockPos, this.writingPos, buffer.length)
    this._convertNoData(buffer)
    q.push(this._writeNextBuffer(buffer))
    this.buffered -= buffer.length
    if (this.writingPos == this.rasterSize.y) {
      debug('raster finished')
      // We just wrote the last block
      this.rasterFinished = true
    }

    if (this.writingPos > this.rasterSize.y ||
          this.rasterFinished && this.buffers[0] && this.buffers[0].length > 0) {
      debug('emit write beyond end error')
      cb(new RangeError('Writing beyond the end of the raster, ' +
        `${this.buffered + (this.writingPos - this.rasterSize.y) * this.rasterSize.x} extra element(s)`))
      return
    }
  }

  if (q.length) {
    // We were actually writing
    // Signal the writer only when all blocks are written
    Promise.all(q)
      .then((r) => {
        debug('signal when writing', r.length)
        try {
          cb()
        } catch (e) {
          // Exceptions in the user callback are tricky
          this.destroy(e)
        }
      })
      .catch((err) => {
        debug('re-emitting error', err)
        cb(err)
      })
    return
  }

  // We are block-buffering for now so tell the writer to continue
  debug('signal when buffering')
  cb()
}

RasterWriteStream.prototype._write = function (chunk, _, callback) {
  debug('got', chunk.length)

  let err
  if (!chunk.length || !chunk.BYTES_PER_ELEMENT) err = new TypeError('Only TypedArrays are supported')
  if (this.buffers.length > 0 && this.buffers[0].constructor !== chunk.constructor) err = TypeError('Type mixing is not supported')
  if (this.rasterFinished) err = new RangeError('Writing beyond the end of the raster')
  if (err) {
    debug('emit error', err)
    callback(err)
    return
  }

  this.buffers.push(chunk)
  this.buffered += chunk.length

  this.initQ.then(() => this._writeNext(callback))
}

RasterWriteStream.prototype._final = function (cb) {
  if (this.buffered > 0) return cb('Stream finished with pending data')
  if (!this.rasterFinished) return cb('Stream finished before filling the raster')
  this.band.ds.flushAsync()
    .catch((e) => ({ err: e }))
    .then((r) => {
      if (r && r.err) {
        cb(r.err)
        return
      }
      cb()
    })
}

module.exports = {
  createWriteStream,
  RasterWriteStream
}
