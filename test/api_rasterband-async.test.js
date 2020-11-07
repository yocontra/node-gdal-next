const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
const assert = chai.assert
const gdal = require('../lib/gdal.js')

chai.use(chaiAsPromised)
const expect = chai.expect

/* Without this, unhandledRejections are silently ignored!!!
*/
process.on('unhandledRejection', (e) => {
  console.error(e); process.exit(1)
})

// Not supported on GDAL 1.x
if (gdal.version.split('.')[0] < 2) {
  return
}

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
          gdal.openAsync(`${__dirname}/data/dem_azimuth50_pa.img`).then((ds) => {
            const band = ds.bands.get(1)
            assert.equal(band.description, 'hshade17')
          })
        })
        it('should throw error if dataset already closed', () => {
          gdal.openAsync(`${__dirname}/data/dem_azimuth50_pa.img`).then((ds) => {
            const band = ds.bands.get(1)
            ds.close()
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
          gdal.openAsync(`${__dirname}/data/sample.tif`).then((ds) => {
            const band = ds.bands.get(1)
            assert.isTrue(band.readOnly)
          })
        })
      })
    })
    describe('"pixels" property', () => {
      describe('readAsync() w/cb', () => {
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
          gdal.openAsync(`${__dirname}/data/sample.tif`).then((ds) => {
            const band = ds.bands.get(1)
            const w = 20
            const h = 30
            band.pixels.readAsync(190, 290, w, h).then((data) => {
              assert.instanceOf(data, Uint8Array)
              assert.equal(data.length, w * h)
              assert.equal(data[10 * 20 + 10], 10)
            })
          })
        })
        describe('w/data argument', () => {
          it('should put the data in the existing array', () => {
            gdal.openAsync('temp',
              'w',
              'MEM',
              256,
              256,
              1,
              gdal.GDT_Byte).then((ds) => {
              const band = ds.bands.get(1)
              const data = new Uint8Array(new ArrayBuffer(20 * 30))
              data[15] = 31
              band.pixels.readAsync(0, 0, 20, 30, data).then((result) => {
                assert.equal(data, result)
                assert.equal(data[15], 0)
              })
            })
          })
          it('should create new array if null', () => {
            gdal.openAsync(
              'temp',
              'w',
              'MEM',
              256,
              256,
              1,
              gdal.GDT_Byte
            ).then((ds) => {
              const band = ds.bands.get(1)
              band.pixels.readAsync(0, 0, 20, 30, null).then((data) => {
                assert.instanceOf(data, Uint8Array)
                assert.equal(data.length, 20 * 30)
              })
            })
          })
          it('should throw error if array is too small', () => {
            gdal.openAsync('temp',
              'w',
              'MEM',
              256,
              256,
              1,
              gdal.GDT_Byte).then(async (ds) => {
              const band = ds.bands.get(1)
              const data = new Uint8Array(new ArrayBuffer(20 * 30))
              await expect(band.pixels.readAsync(0, 0, 20, 31, data)).to.be.rejectedWith(Error)
            })
          })
          it('should automatically translate data to array data type', () => {
            gdal.openAsync('temp',
              'w',
              'MEM',
              256,
              256,
              1,
              gdal.GDT_Byte
            ).then((ds) => {
              const band = ds.bands.get(1)
              band.pixels.set(1, 1, 30)
              const data = new Float64Array(new ArrayBuffer(20 * 30 * 8))
              band.pixels.readAsync(1, 1, 20, 30, data).then((data) => {
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
              gdal.openAsync(`${__dirname}/data/sample.tif`).then(async (ds) => {
                const band = ds.bands.get(1)
                const data = new Float64Array(new ArrayBuffer(8 * 10 * 14))
                await expect(band.pixels.readAsync(0, 0, 20, 30, data, {
                  buffer_width: 10,
                  buffer_height: 15
                } /*Array length must be greater than.*/)).to.be.rejectedWith(Error)
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

                red.pixels.readAsync(0, 0, w, h, interleaved, read_options).then(async (interleaved) => {
                  await expect(blue.pixels.readAsync(
                    0,
                    0,
                    w,
                    h,
                    interleaved.subarray(2),
                    read_options
                  )).to.be.rejectedWith(Error)
                })
              })
            })
          })
          it('should throw an error if region is out of bounds', () => {
            gdal.openAsync(`${__dirname}/data/sample.tif`).then(async (ds) => {
              const band = ds.bands.get(1)
              await expect(band.pixels.readAsync(2000, 2000, 16, 16)).to.be.rejectedWith(3)
            })
          })
          it('should throw error if dataset already closed', () => {
            gdal.openAsync(`${__dirname}/data/sample.tif`).then(async (ds) => {
              const band = ds.bands.get(1)
              ds.close()
              await expect(band.pixels.readAsync(0, 0, 16, 16)).to.be.rejectedWith(Error)
            })
          })
        })
      })
    })
  })
})
