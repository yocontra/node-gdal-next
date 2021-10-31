const { Readable } = require('stream')

const debug = process.env.NODE_DEBUG && process.env.NODE_DEBUG.match(/gdal_read|gdal^_/) ?
  console.debug.bind(console, 'RasterReadStream:') :
  () => undefined

/**
 * create a Readable stream from a raster band
 *
 * @for gdal.RasterBandPixels
 * @method createReadStream
 * @param {RasterReadableOptions} [options]
 * @param {bool} [options.blockOptimize=true] Read by file blocks when possible (when rasterSize.x == blockSize.x)
 * @returns {RasterReadStream}
 */
function createReadStream(options) {
  const readable = new RasterReadStream({ ...options ||{}, band: this.band })
  return readable
}

/**
 * Class implementing {{#crossLink "gdal.RasterBand"}}RasterBand{{/crossLink}} reading as a stream of pixels
 *
 * Reading is buffered and it is aligned on the underlying
 * compression blocks for maximum efficiency when possible
 *
 * Pixels are streamed in row-major order
 *
 * @class gdal.RasterReadStream
 * @extends stream.Readable
 * @constructor
 * @param {RasterReadableOptions} [options]
 * @param {RasterBand} options.band RasterBand to use
 * @param {bool} [options.blockOptimize=true] Read by file blocks when possible (when `rasterSize.x == blockSize.x`)
 */
class RasterReadStream extends Readable {
  constructor(options) {
    super({ ...options, objectMode: true })
    this.band = options.band
    this.readingPos = 0
    this.blockPos = 0
    this.readingInProgress = false
    this.rasterEnded = false

    // This part is an ideal candidate for Node 16 _construct,
    // but alas our baseline is Node 12 so some rather
    // cumbersome acrobatics are needed
    this.initQ = Promise.all([ this.band.blockSizeAsync, this.band.sizeAsync ])
      .then(([ blockSize, rasterSize ]) => {
        this.blockSize = blockSize
        this.rasterSize = rasterSize
        if (blockSize.x == rasterSize.x && options.blockOptimize !== false) {
          debug('init done, optimized block read', blockSize, rasterSize)
          this._readNextBuffer = RasterReadStream.prototype._readNextBlock
          return
        }
        debug('init done, line by line read', blockSize, rasterSize)
        this._readNextBuffer = RasterReadStream.prototype._readNextLine
      })
  }
}

RasterReadStream.prototype._readNext = function () {
  debug('reading next block', this.readingPos, this.readingInProgress)
  if (this.readingInProgress || this.rasterEnded) return
  this.readingInProgress = true
  this.initQ.then(() => {
    debug('do read')
    this._readNextBuffer()
      .then((data) => {
        this.readingInProgress = false

        debug('adding a new buffer', data.length)
        const flowing = this.push(data)
        if (this.readingPos == this.rasterSize.y) {
          debug('raster ended at ', this.readingPos)
          this.rasterEnded = true
          this.push(null)
          return
        }
        if (flowing) {
          this._readNext()
        } else {
          debug('push buffer is full')
        }
      })
      .catch((e) => {
        debug('emitting error', e)
        this.destroy(e)
      })
  })
}

// Optimized reading when horizontally there is only one block (blockSize.x == rasterSize.x)
// This is more often the case than not
RasterReadStream.prototype._readNextBlock = function () {
  const actualSize = this.readingPos + this.blockSize.y > this.rasterSize.y ?
    this.rasterSize.y - this.readingPos :
    this.blockSize.y
  const dataq = this.band.pixels.readBlockAsync(0, this.blockPos)

  return dataq
    .then((data) => {
      this.readingPos += actualSize
      this.blockPos++
      // Edge blocks, need to be clamped as the data is smaller than the block
      if (actualSize != this.blockSize.y) {
        debug('clamping', this.blockSize, actualSize)
        return data.subarray(0, actualSize * this.rasterSize.x)
      }
      return data
    })
}

// Line by line reading, in this case we are better off with
// GDAL's own block cache handling the block reading
// If GDAL can fit all the blocks from one horizontal line in its cache
// this case will be almost as fast as the previous one
RasterReadStream.prototype._readNextLine = function () {
  return this.band.pixels.readAsync(0, this.blockPos, this.rasterSize.x, 1)
    .then((data) => {
      this.readingPos++
      this.blockPos++
      return data
    })
}

RasterReadStream.prototype._read = function () {
  this._readNext()
}

module.exports = {
  createReadStream,
  RasterReadStream
}
