import * as gdal from '..'
import * as path from 'path'
import { assert } from 'chai'

describe('Open', () => {
  afterEach(global.gc)

  describe('GRIB', () => {
    let filename, ds

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/gfs.t00z.pgrb2b.4p.f000.grb2')
      ds = gdal.open(filename)
    })

    it('should be able to read raster size', () => {
      assert.equal(ds.rasterSize.x, 90)
      assert.equal(ds.rasterSize.y, 45)
      assert.equal(ds.bands.count(), 5)
    })

    it('should be able to read geotransform', () => {
      const expected_geotransform = [ -0.125, 4, 0, 90.125, 0, -4 ]

      const actual_geotransform = ds.geoTransform
      const delta = 0.00001
      assert.closeTo(actual_geotransform[0], expected_geotransform[0], delta)
      assert.closeTo(actual_geotransform[1], expected_geotransform[1], delta)
      assert.closeTo(actual_geotransform[2], expected_geotransform[2], delta)
      assert.closeTo(actual_geotransform[3], expected_geotransform[3], delta)
      assert.closeTo(actual_geotransform[4], expected_geotransform[4], delta)
      assert.closeTo(actual_geotransform[5], expected_geotransform[5], delta)
    })

    it('should have projection', () => {
      assert.match(ds.srs.toWKT(), /GEOGCS/)
    })

    it('should be able to read statistics', () => {
      const band = ds.bands.get(1)
      const expected_stats = {
        min: 42013.355,
        max: 49383.754,
        mean: 46972.756,
        std_dev: 2171.471
      }

      const actual_stats = band.getStatistics(false, true)
      const delta = 0.001
      assert.closeTo(expected_stats.min, actual_stats.min, delta)
      assert.closeTo(expected_stats.max, actual_stats.max, delta)
      assert.closeTo(expected_stats.mean, actual_stats.mean, delta)
      assert.closeTo(expected_stats.std_dev, actual_stats.std_dev, delta)
    })
  })
})
