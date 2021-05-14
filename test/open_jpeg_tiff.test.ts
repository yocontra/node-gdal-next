import * as gdal from '..'
import * as path from 'path'
import { assert } from 'chai'

if (process.env.TARGET !== 'SHARED') {
  describe('Open', () => {
    describe('JPEG-compressed TIFF', () => {
      let filename, ds

      it('should not throw', () => {
        filename = path.join(__dirname, 'data/sample_jpeg.tif')
        ds = gdal.open(filename)
      })

      it('should be able to read raster size', () => {
        assert.equal(ds.rasterSize.x, 4)
        assert.equal(ds.rasterSize.y, 4)
        assert.equal(ds.bands.count(), 3)
      })
    })
  })
}
