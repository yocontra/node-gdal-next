const gdal = require('../lib/gdal.js')
const path = require('path')
const assert = require('chai').assert

if (process.env.TARGET !== 'SHARED') {
  describe('Open', () => {
    describe('DEFLATE-compressed TIFF', () => {
      let filename, ds

      it('should not throw', () => {
        filename = path.join(__dirname, 'data/sample_deflate.tif')
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
