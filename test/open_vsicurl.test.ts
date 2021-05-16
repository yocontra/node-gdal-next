import * as gdal from '..'
import * as os from 'os'
import { assert } from 'chai'

describe('Open', () => {
  afterEach(global.gc)

  if (os.type() !== 'Linux' && os.type() !== 'Darwin') {
    return
  }

  describe('vsicurl', () => {
    let ds

    it('should not throw', () => {
      ds = gdal.open('/vsicurl/https://s3.amazonaws.com/elevation-tiles-prod/geotiff/1/1/1.tif')
    })

    it('should be able to read raster size', () => {
      assert.equal(ds.rasterSize.x, 512)
      assert.equal(ds.rasterSize.y, 512)
      assert.equal(ds.bands.count(), 1)
    })

    it('should have projection', () => {
      assert.isTrue(ds.srs.isSame(gdal.SpatialReference.fromEPSG(3857)))
    })
  })
})
