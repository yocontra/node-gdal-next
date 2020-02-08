const gdal = require('../lib/gdal.js')
const path = require('path')
const assert = require('chai').assert

describe('Open', () => {
  afterEach(gc)

  describe('MapInfo', () => {
    let filename, ds

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/mitab/EXTRACT_POLYGON.mif')
      ds = gdal.open(filename)
    })
    it('should be able to read layer count', () => {
      assert.equal(ds.layers.count(), 1)
    })
    it('should be able to read features', () => {
      const layer = ds.layers.get(0)
      const featureCount = layer.features.count()
      assert.equal(featureCount, 1, 'layer.features.count()')
      assert.instanceOf(layer.features.first().getGeometry(), gdal.Polygon)
    })
  })
})
