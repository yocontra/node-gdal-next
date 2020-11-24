const gdal = require('../lib/gdal.js')
const path = require('path')
const fs = require('fs')
const assert = require('chai').assert

describe('Open', () => {
  afterEach(gc)

  describe('vsimem', () => {
    let filename, ds

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/park.geo.json')
      const buffer = fs.readFileSync(filename)
      ds = gdal.open(buffer)
    })
    it('should be able to read band count', () => {
      assert.equal(ds.layers.count(), 1)
    })

    describe('layer', () => {
      let layer
      before(() => {
        layer = ds.layers.get(0)
      })
      it('should have all fields defined', () => {
        assert.equal(layer.fields.count(), 3)
        assert.deepEqual(layer.fields.getNames(), [
          'kind',
          'name',
          'state'
        ])
      })
    })
  })
})
