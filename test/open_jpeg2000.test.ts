import * as gdal from 'gdal-async'
import * as path from 'path'
import { assert } from 'chai'

describe('Open', () => {
  afterEach(global.gc)

  describe('OpenJPEG', () => {
    let filename, ds: gdal.Dataset

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/stefan_full_rgba_alpha_1bit.jp2')
      ds = gdal.open(filename)
    })

    it('should be able to read raster size', () => {
      assert.equal(ds.rasterSize.x, 162)
      assert.equal(ds.rasterSize.y, 150)
      assert.equal(ds.bands.count(), 4)
    })

    it('should not have a geotransform', () => {
      assert.isNull(ds.geoTransform)
    })

    it('should not have a projection', () => {
      assert.isNull(ds.srs)
    })

    it('should be able to read statistics', () => {
      const band = ds.bands.get(1)
      const expected_stats = {
        min: 0,
        max: 255,
        mean: 21.367489711934,
        std_dev: 52.006939358465
      }

      const actual_stats = band.getStatistics(false, true) as typeof expected_stats
      const delta = 10e-6
      assert.closeTo(expected_stats.min, actual_stats.min, delta)
      assert.closeTo(expected_stats.max, actual_stats.max, delta)
      assert.closeTo(expected_stats.mean, actual_stats.mean, delta)
      assert.closeTo(expected_stats.std_dev, actual_stats.std_dev, delta)
    })
  })
})
