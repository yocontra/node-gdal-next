const assert = require('chai').assert
const gdal = require('../lib/gdal.js')

describe('gdal.RasterBand', () => {
  afterEach(gc)

  it('should not be instantiable', () => {
    assert.throws(() => {
      new gdal.RasterBand()
    })
  })
  describe('instance', () => {
    describe('"pixels" property', () => {
      describe('readAsync()', () => {
        it('should return a TypedArray', () => {
          const ds = gdal.openAsync(`${__dirname}/data/sample.tif`, undefined, (e, ds) => {
            const band = ds.bands.get(1)
            const w = 20
            const h = 30
            band.pixels.readAsync(190, 290, w, h, undefined, undefined, undefined, undefined, undefined, undefined, (e, data) => {
              assert.instanceOf(data, Uint8Array)
              assert.equal(data.length, w * h)
              assert.equal(data[10 * 20 + 10], 10)
            });
          })
        })
      })
      describe('readPromise()', () => {
        it('should return a TypedArray', () => {
          const ds = gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
            const band = ds.bands.get(1)
            const w = 20
            const h = 30
            band.pixels.readPromise(190, 290, w, h).then(data => {
              assert.instanceOf(data, Uint8Array)
              assert.equal(data.length, w * h)
              assert.equal(data[10 * 20 + 10], 10)
            });
          })
        })
      })
    })
  })
})
