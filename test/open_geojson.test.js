const gdal = require('../lib/gdal.js')
const path = require('path')
const assert = require('chai').assert

describe('Open', () => {
  afterEach(gc)

  describe('GeoJSON', () => {
    let filename, ds

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/park.geo.json')
      ds = gdal.open(filename)
    })
    it('should be able to read layer count', () => {
      assert.equal(ds.layers.count(), 1)
    })

    describe('layer', () => {
      let layer
      it('should exist', () => {
        layer = ds.layers.get(0)
        assert.ok(layer)
        assert.instanceOf(layer, gdal.Layer)
      })
      it('should have all fields defined', () => {
        assert.equal(layer.fields.count(), 3)
        assert.deepEqual(layer.fields.getNames(), [ 'kind', 'name', 'state' ])
      })
      describe('features', () => {
        it('should be readable', () => {
          assert.equal(layer.features.count(), 1)
          const feature = layer.features.get(0)
          const fields = feature.fields.toObject()

          assert.deepEqual(fields, {
            kind: 'county',
            state: 'WY',
            name: 'Park'
          })
        })
      })
    })
  })
})
