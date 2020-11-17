const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
const assert = chai.assert
const gdal = require('../lib/gdal.js')

chai.use(chaiAsPromised)

describe('gdal.RasterBand', () => {
  afterEach(gc)

  it('should not be instantiable', () => {
    assert.throws(() => {
      new gdal.RasterBand()
    })
  })
  describe('instance', () => {
    describe('"description" property', () => {
      describe('getter', () => {
        it('should return string', () => {
          const ds = gdal.openAsync(`${__dirname}/data/dem_azimuth50_pa.img`)
          assert.eventually.equal(ds.then((r) => r.bands.get(1).description), 'hshade17')
        })
        it('should throw error if dataset already closed', () => {
          const ds = gdal.openAsync(`${__dirname}/data/dem_azimuth50_pa.img`)
          assert.isFulfilled(ds)
          ds.then((r) => {
            const band = r.bands.get(1)
            r.close()
            assert.throws(() => {
              console.log(band.description)
            })
          })
        })
      })
      describe('setter', () => {
        it('should throw error', () => {
          gdal.openAsync(`${__dirname}/data/dem_azimuth50_pa.img`,
            (e, ds) => {
              const band = ds.bands.get(1)
              assert.throws(() => {
                band.description = 'test'
              })
            })
        })
      })
    })
    describe('"readOnly" property', () => {
      describe('getter', () => {
        it('should return true on readOnly dataset', () => {
          const ds = gdal.openAsync(`${__dirname}/data/sample.tif`)
          assert.eventually.isTrue(ds.then((r) => r.bands.get(1).readOnly))
        })
      })
    })
    describe('"pixels" property', () => {
      describe('readAsync() w/cb', () => {
        it('should not crash if the dataset is immediately closed', () => {
          gdal.openAsync(`${__dirname}/data/sample.tif`, (e, ds) => {
            const band = ds.bands.get(1)
            const w = 20
            const h = 30
            band.pixels.readAsync(190, 290, w, h, () => {})
            ds.close()
          })
        })
        it('should return a TypedArray', () => {
          gdal.openAsync(`${__dirname}/data/sample.tif`, (e, ds) => {
            const band = ds.bands.get(1)
            const w = 20
            const h = 30
            band.pixels.readAsync(190, 290, w, h, (e, data) => {
              assert.instanceOf(data, Uint8Array)
              assert.equal(data.length, w * h)
              assert.equal(data[10 * 20 + 10], 10)
            })
          })
        })
      })
      describe('readAsync() w/Promise', () => {
        it('should return a TypedArray', () => {
          const ds = gdal.openAsync(`${__dirname}/data/sample.tif`)
          assert.isFulfilled(ds)
          ds.then((r) => {
            const band = r.bands.get(1)
            const w = 20
            const h = 30
            const p = band.pixels.readAsync(190, 290, w, h)
            assert.isFulfilled(p)
            p.then((data) => {
              assert.instanceOf(data, Uint8Array)
              assert.equal(data.length, w * h)
              assert.equal(data[10 * 20 + 10], 10)
            })
          })
        })
        describe('w/data argument', () => {
          it('should put the data in the existing array', () => {
            const ds = gdal.openAsync('temp',
              'w',
              'MEM',
              256,
              256,
              1,
              gdal.GDT_Byte)
            assert.isFulfilled(ds)
            ds.then((r) => {
              const band = r.bands.get(1)
              const data = new Uint8Array(new ArrayBuffer(20 * 30))
              data[15] = 31
              const result = band.pixels.readAsync(0, 0, 20, 30, data)
              assert.isFulfilled(result)
              result.then((data) => {
                assert.eventually.equal(result, data)
                assert.equal(data[15], 0)
              })
            })
          })
          it('should create new array if null', () => {
            const ds = gdal.openAsync(
              'temp',
              'w',
              'MEM',
              256,
              256,
              1,
              gdal.GDT_Byte)
            assert.isFulfilled(ds)
            ds.then((r) => {
              const band = r.bands.get(1)
              const p = band.pixels.readAsync(0, 0, 20, 30, null)
              assert.isFulfilled(p)
              p.then((data) => {
                assert.instanceOf(data, Uint8Array)
                assert.equal(data.length, 20 * 30)
              })
            })
          })
          it('should throw error if array is too small', () => {
            const ds = gdal.openAsync('temp',
              'w',
              'MEM',
              256,
              256,
              1,
              gdal.GDT_Byte)
            assert.isFulfilled(ds)
            ds.then((r) => {
              const band = r.bands.get(1)
              const data = new Uint8Array(new ArrayBuffer(20 * 30))
              assert.isRejected(band.pixels.readAsync(0, 0, 20, 31, data))
            })
          })
          it('should automatically translate data to array data type', () => {
            const ds = gdal.openAsync('temp',
              'w',
              'MEM',
              256,
              256,
              1,
              gdal.GDT_Byte
            )
            assert.isFulfilled(ds)
            ds.then((r) => {
              const band = r.bands.get(1)
              band.pixels.set(1, 1, 30)
              const data = new Float64Array(new ArrayBuffer(20 * 30 * 8))
              const p = band.pixels.readAsync(1, 1, 20, 30, data)
              assert.isFulfilled(p)
              p.then(() => {
                assert.equal(data[0], 30)
              })
            })
          })
        })
        describe('w/options', () => {
          describe('"buffer_width", "buffer_height"', () => {
            it('should default to width, height when not present', () => {
              gdal.openAsync(`${__dirname}/data/sample.tif`).then((ds) => {
                const band = ds.bands.get(1)
                band.pixels.readAsync(0, 0, 20, 30).then((data) => {
                  assert.equal(data.length, 20 * 30)
                })
              })
            })
            it("should create new array with given dimensions if array isn't given", () => {
              gdal.openAsync(`${__dirname}/data/sample.tif`).then((ds) => {
                const band = ds.bands.get(1)
                band.pixels.readAsync(0, 0, 20, 30, null, {
                  buffer_width: 10,
                  buffer_height: 15
                }).then((data) => {
                  assert.equal(data.length, 10 * 15)
                })
              })
            })
            it('should throw error if given array is smaller than given dimensions', () => {
              const ds = gdal.openAsync(`${__dirname}/data/sample.tif`)
              assert.isFulfilled(ds)
              ds.then((r) => {
                const band = r.bands.get(1)
                const data = new Float64Array(new ArrayBuffer(8 * 10 * 14))
                assert.isRejected(band.pixels.readAsync(0, 0, 20, 30, data, {
                  buffer_width: 10,
                  buffer_height: 15
                }), /Array length must be greater than.*/)
              })
            })
          })
          describe('"type"', () => {
            it('should be ignored if typed array is given', () => {
              gdal.openAsync(`${__dirname}/data/sample.tif`).then((ds) => {
                const band = ds.bands.get(1)
                const data = new Float64Array(new ArrayBuffer(20 * 30 * 8))
                const result = band.pixels.read(0, 0, 20, 30, data, {
                  type: gdal.GDT_Byte
                })
                assert.instanceOf(result, Float64Array)
              })
            })
            it('should create output array with given type', () => {
              gdal.openAsync(`${__dirname}/data/sample.tif`).then((ds) => {
                const band = ds.bands.get(1)
                const data = band.pixels.read(0, 0, 20, 30, null, {
                  type: gdal.GDT_Float64
                })
                assert.instanceOf(data, Float64Array)
              })
            })
          })
          describe('"pixel_space", "line_space"', () => {
            it('should read data with space between values', () => {
              const w = 16,
                h = 16
              gdal.openAsync('temp', 'w', 'MEM', w, h, 2, gdal.GDT_Byte).then((ds) => {
                const red = ds.bands.get(1)
                const blue = ds.bands.get(2)
                red.fill(1)
                blue.fill(2)

                const interleaved = new Uint8Array(new ArrayBuffer(w * h * 2))

                const read_options = {
                  buffer_width: w,
                  buffer_height: h,
                  type: gdal.GDT_Byte,
                  pixel_space: 2,
                  line_space: 2 * w
                }

                red.pixels.readAsync(0, 0, w, h, interleaved, read_options).then((interleaved) => {
                  blue.pixels.readAsync(
                    0,
                    0,
                    w,
                    h,
                    interleaved.subarray(1),
                    read_options
                  ).then(() => {
                    for (let y = 0; y < h; y++) {
                      for (let x = 0; x < w; x++) {
                        const r = interleaved[x * 2 + 0 + y * w * 2]
                        const b = interleaved[x * 2 + 1 + y * w * 2]
                        assert.equal(r, 1)
                        assert.equal(b, 2)
                      }
                    }
                  })
                })
              })
            })
            it('should throw error if array is not long enough to store result', () => {
              const w = 16,
                h = 16
              gdal.openAsync('temp', 'w', 'MEM', w, h, 2, gdal.GDT_Byte).then((ds) => {
                const red = ds.bands.get(1)
                const blue = ds.bands.get(2)
                red.fill(1)
                blue.fill(2)

                const interleaved = new Uint8Array(new ArrayBuffer(w * h * 2))
                const read_options = {
                  buffer_width: w,
                  buffer_height: h,
                  type: gdal.GDT_Byte,
                  pixel_space: 2,
                  line_space: 2 * w
                }

                red.pixels.readAsync(0, 0, w, h, interleaved, read_options).then((interleaved) => {
                  assert.isRejected(blue.pixels.readAsync(
                    0,
                    0,
                    w,
                    h,
                    interleaved.subarray(2),
                    read_options
                  ))
                })
              })
            })
          })
          it('should throw an error if region is out of bounds', () => {
            const ds = gdal.openAsync(`${__dirname}/data/sample.tif`)
            assert.isFulfilled(ds)
            ds.then((r) => {
              const band = r.bands.get(1)
              assert.isRejected(band.pixels.readAsync(2000, 2000, 16, 16))
            })
          })
          it('should throw error if dataset already closed', () => {
            const ds = gdal.openAsync(`${__dirname}/data/sample.tif`)
            assert.isFulfilled(ds)
            ds.then((r) => {
              const band = r.bands.get(1)
              r.close()
              assert.isRejected(band.pixels.readAsync(0, 0, 16, 16))
            })
          })
        })
      })
    })
  })
})
