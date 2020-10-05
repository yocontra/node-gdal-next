const chaiAsPromised = require('chai-as-promised')
const chai = require('chai');
const assert = chai.assert
const gdal = require('../lib/gdal.js')

chai.use(chaiAsPromised)
const expect = chai.expect

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
          gdal.openPromise(`${__dirname}/data/dem_azimuth50_pa.img`).then(ds => {
            const band = ds.bands.get(1)
            assert.equal(band.description, 'hshade17')
          })
        })
        it('should throw error if dataset already closed', () => {
          gdal.openPromise(`${__dirname}/data/dem_azimuth50_pa.img`).then(ds => {
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
          const ds = gdal.openAsync(`${__dirname}/data/dem_azimuth50_pa.img`, undefined, (e, ds) => {
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
          gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
            const band = ds.bands.get(1)
            assert.isTrue(band.readOnly)
          })
        })
      })
    })
    describe('"pixels" property', () => {
      describe('readAsync()', () => {
        it('should return a TypedArray', () => {
          const ds = gdal.openAsync(`${__dirname}/data/sample.tif`, undefined, (e, ds) => {
            const band = ds.bands.get(1)
            const w = 20
            const h = 30
            band.pixels.readAsync(190, 290, w, h, undefined, {}, (e, data) => {
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
        describe('w/data argument', () => {
          it('should put the data in the existing array', () => {
            gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
              const band = ds.bands.get(1)
              const data = new Uint8Array(new ArrayBuffer(20 * 30))
              data[15] = 31
              band.pixels.readPromise(0, 0, 20, 30, data).then(result => {
                assert.equal(data, result)
                assert.equal(data[15], 0)
              })
            })
          })
          it('should create new array if null', () => {
            gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
              const band = ds.bands.get(1)
              band.pixels.readPromise(0, 0, 20, 30, null).then(data => {
                assert.instanceOf(data, Uint8Array)
                assert.equal(data.length, 20 * 30)
              })
            })
          })
          it('should throw error if array is too small', () => {
            gdal.openPromise(`${__dirname}/data/sample.tif`).then(async (ds) => {
              const band = ds.bands.get(1)
              const data = new Uint8Array(new ArrayBuffer(20 * 30))
              await expect(band.pixels.readPromise(0, 0, 20, 31, data)).to.be.eventually.rejectedWith(Error)
            })
          })
          /*
          Requires writing
          it('should automatically translate data to array data type', () => {
            const ds = gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
              const band = ds.bands.get(1)
              band.pixels.set(1, 1, 30)
              const data = new Float64Array(new ArrayBuffer(20 * 30 * 8))
              band.pixels.readPromise(1, 1, 20, 30).then(data => {
                assert.equal(data[0], 30)
              })
            })
          })
          */
        })
        describe('w/options', () => {
          describe('"buffer_width", "buffer_height"', () => {
            it('should default to width, height when not present', () => {
              gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
                const band = ds.bands.get(1)
                band.pixels.readPromise(0, 0, 20, 30).then(data => {
                  assert.equal(data.length, 20 * 30)
                })
              })
            })
            it("should create new array with given dimensions if array isn't given", () => {
              gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
                const band = ds.bands.get(1)
                band.pixels.readPromise(0, 0, 20, 30, null, {
                  buffer_width: 10,
                  buffer_height: 15
                }).then(data => {
                  assert.equal(data.length, 10 * 15)
                })
              })
            })
            it('should throw error if given array is smaller than given dimensions', () => {
              gdal.openPromise(`${__dirname}/data/sample.tif`).then(async (ds) => {
                const band = ds.bands.get(1)
                const data = new Float64Array(new ArrayBuffer(8 * 10 * 14))
                await expect(band.pixels.readPromise(0, 0, 20, 30, data, {
                    buffer_width: 10,
                    buffer_height: 15
                }, /Array length must be greater than.*/)).to.be.eventually.rejectedWith(Error)
              })
            })
          })
          describe('"type"', () => {
            it('should be ignored if typed array is given', () => {
              gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
                const band = ds.bands.get(1)
                const data = new Float64Array(new ArrayBuffer(20 * 30 * 8))
                const result = band.pixels.read(0, 0, 20, 30, data, {
                  type: gdal.GDT_Byte
                })
                assert.instanceOf(result, Float64Array)
              })
            })
            it('should create output array with given type', () => {
              gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
                const band = ds.bands.get(1)
                const data = band.pixels.read(0, 0, 20, 30, null, {
                  type: gdal.GDT_Float64
                })
                assert.instanceOf(data, Float64Array)
              })
            })
          })
          /* Requires writing
          describe('"pixel_space", "line_space"', () => {
            it('should read data with space between values', () => {
              const w = 16,
                h = 16
              gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
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

                red.pixels.readPromise(0, 0, w, h, interleaved, read_options).then(interleaved => {
                  blue.pixels.readPromise(
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
              const ds = gdal.openPromise(`${__dirname}/data/sample.tif`).then(ds => {
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

                red.pixels.readPromise(0, 0, w, h, interleaved, read_options).then(interleaved => {
                  assert.throws(() => {
                    blue.pixels.readPromise(
                      0,
                      0,
                      w,
                      h,
                      interleaved.subarray(2),
                      read_options
                    )
                  }, /Array length must be greater than./)
                })
              })
            })
          })
          */
          it('should throw an error if region is out of bounds', () => {
            gdal.openPromise(`${__dirname}/data/sample.tif`).then(async (ds) => {
              const band = ds.bands.get(1)
              await expect(band.pixels.readPromise(2000, 2000, 16, 16)).to.be.eventually.rejectedWith(3)
            })
          })
          it('should throw error if dataset already closed', () => {
            gdal.openPromise(`${__dirname}/data/sample.tif`).then(async (ds) => {
              const band = ds.bands.get(1)
              ds.close()
              await expect(band.pixels.readPromise(0, 0, 16, 16)).to.be.eventually.rejectedWith(Error)
            })
          })
        })
      })
    })
  })
})
