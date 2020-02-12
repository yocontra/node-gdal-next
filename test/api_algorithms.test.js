const gdal = require('../lib/gdal.js')
const assert = require('chai').assert

describe('gdal', () => {
  afterEach(gc)

  describe('contourGenerate()', () => {
    let src, srcband, dst, lyr

    before(() => {
      // create a simple ramp in memory
      const w = 64
      const h = 64
      src = gdal.open('temp', 'w', 'MEM', w, h, 1)
      srcband = src.bands.get(1)
      for (let y = 0; y < h; y++) {
        const buf = Buffer.alloc(w)
        buf.fill(y * 4)
        srcband.pixels.write(0, y, w, 1, new Uint8Array(buf))
      }
    })
    after(() => {
      src.close()
    })
    beforeEach(() => {
      dst = gdal.open('temp', 'w', 'Memory')

      lyr = dst.layers.create('temp', null, gdal.Linestring)
      lyr.fields.add(new gdal.FieldDefn('id', gdal.OFTInteger))
      lyr.fields.add(new gdal.FieldDefn('elev', gdal.OFTReal))
    })
    afterEach(() => {
      try {
        dst.close()
      } catch (err) {
        /* ignore */
      }
    })
    it('should generate contours when passed an interval / base', () => {
      const offset = 7
      const interval = 32

      gdal.contourGenerate({
        src: srcband,
        dst: lyr,
        offset: offset,
        interval: interval,
        idField: 0,
        elevField: 1
      })

      assert(lyr.features.count() > 0, 'features were created')

      lyr.features.forEach((feature) => {
        assert(
          (feature.fields.get('elev') - offset) % interval === 0,
          'contour used correct interval / base'
        )
        assert.isFalse(feature.getGeometry().isEmpty())
      })
    })
    it.skip('should accept an array of fixed levels', () => {
      const levels = [ 53, 43, 193 ].sort()

      gdal.contourGenerate({
        src: srcband,
        dst: lyr,
        fixedLevels: levels,
        idField: 0,
        elevField: 1
      })

      assert(lyr.features.count() > 0, 'features were created')

      const actual_levels = []

      lyr.features.forEach((feature) => {
        const elev = feature.fields.get('elev')
        assert.include(
          levels,
          elev,
          'contour elevation in array of fixed levels'
        )
        assert.isFalse(feature.getGeometry().isEmpty())
        if (actual_levels.indexOf(elev) === -1) actual_levels.push(elev)
      })

      assert.deepEqual(levels, actual_levels.sort(), 'all fixed levels used')
    })
  })
  describe('fillNodata()', () => {
    let src, srcband
    const holes_x = [ 53, 61, 61, 1, 43, 44, 5 ]
    const holes_y = [ 11, 5, 6, 33, 22, 11, 0 ]
    const nodata = 33

    beforeEach(() => {
      const w = 64
      const h = 64

      src = gdal.open('temp', 'w', 'MEM', w, h, 1)
      srcband = src.bands.get(1)
      srcband.noDataValue = nodata

      // sprinkle a solid fill with nodata
      const buf = Buffer.alloc(w * h)
      buf.fill(128)
      srcband.pixels.write(0, 0, w, h, new Uint8Array(buf))
      for (let i = 0; i < holes_x.length; i++) {
        srcband.pixels.set(holes_x[i], holes_y[i], nodata)
        assert.equal(srcband.pixels.get(holes_x[i], holes_y[i]), nodata)
      }
    })
    afterEach(() => {
      try {
        src.close()
      } catch (err) {
        /* ignore */
      }
    })
    it('should fill nodata values', () => {
      gdal.fillNodata({
        src: srcband,
        searchDist: 3,
        smoothingIterations: 2
      })

      for (let i = 0; i < holes_x.length; i++) {
        assert.notEqual(srcband.pixels.get(holes_x[i], holes_y[i]), nodata)
      }
    })
  })
  describe('checksumImage()', () => {
    let src, band
    const w = 16
    const h = 16
    beforeEach(() => {
      src = gdal.open('temp', 'w', 'MEM', w, h, 1)
      band = src.bands.get(1)
    })
    afterEach(() => {
      try {
        src.close()
      } catch (err) {
        /* ignore */
      }
    })
    it('should generate unique checksum for the given region', () => {
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          band.pixels.set(x, y, (x * h + y) % 255)
        }
      }
      band.pixels.set(4, 4, 25)
      const a = gdal.checksumImage(band)
      band.pixels.set(4, 4, 93)
      const b = gdal.checksumImage(band)
      const c = gdal.checksumImage(band, 8, 0, w / 2, h)

      assert.notEqual(a, b)
      assert.notEqual(b, c)
    })
  })
  describe('sieveFilter()', () => {
    let src, band
    const w = 64
    const h = 64
    beforeEach(() => {
      src = gdal.open('temp', 'w', 'MEM', w, h, 1)
      band = src.bands.get(1)

      // create two rectangles next to eachother of differing sizes
      const small_buffer = Buffer.alloc(4 * 4)
      small_buffer.fill(10)
      const big_buffer = Buffer.alloc(32 * 32)
      big_buffer.fill(20)

      band.pixels.write(5, 5, 32, 32, new Uint8Array(big_buffer))
      band.pixels.write(7, 7, 4, 4, new Uint8Array(small_buffer))
    })
    afterEach(() => {
      try {
        src.close()
      } catch (err) {
        /* ignore */
      }
    })
    it('should fill smaller polygons with value from neighboring bigger polygon', () => {
      assert.equal(band.pixels.get(8, 8), 10)

      gdal.sieveFilter({
        src: band,
        dst: band, // in place
        threshold: 4 * 4 + 1,
        connectedness: 8
      })

      assert.equal(band.pixels.get(8, 8), 20)
    })
  })
  describe('polygonize()', () => {
    let src, srcband, dst, lyr

    before(() => {
      // create two identical rectangles
      const w = 64
      const h = 64
      src = gdal.open('temp', 'w', 'MEM', w, h, 1)
      srcband = src.bands.get(1)
      for (let y = 0; y < h; y++) {
        const buf = Buffer.alloc(w)
        buf.fill(y & 32)
        srcband.pixels.write(0, y, w, 1, new Uint8Array(buf))
      }
    })
    after(() => {
      try {
        src.close()
      } catch (err) {
        /* ignore */
      }
    })
    beforeEach(() => {
      dst = gdal.open('temp', 'w', 'Memory')
      lyr = dst.layers.create('temp', null, gdal.Polygon)
      lyr.fields.add(new gdal.FieldDefn('val', gdal.OFTInteger))
    })
    afterEach(() => {
      try {
        dst.close()
      } catch (err) {
        /* ignore */
      }
    })
    it('should generate polygons from a RasterBand', () => {
      gdal.polygonize({
        src: srcband,
        dst: lyr,
        pixValField: 0,
        connectedness: 8
      })

      assert.equal(lyr.features.count(), 2)
      lyr.features.forEach((f) => {
        const geom = f.getGeometry()
        assert.isFalse(geom.isEmpty())
        assert.instanceOf(geom, gdal.Polygon)
      })
    })
  })
})
