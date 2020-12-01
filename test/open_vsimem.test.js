const gdal = require('../lib/gdal.js')
const path = require('path')
const fs = require('fs')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const assert = chai.assert
chai.use(chaiAsPromised)

describe('Open', () => {
  afterEach(gc)

  describe('vsimem', () => {
    let filename, ds, buffer

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/park.geo.json')
      buffer = fs.readFileSync(filename)
      ds = gdal.open(buffer)
    })
    it('should be able to read band count', () => {
      assert.equal(ds.layers.count(), 1)
    })
    it('should keep the buffer in the dataset', () => {
      assert.instanceOf(ds.buffer, Buffer)
      assert.equal(ds.buffer, buffer)
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
  describe('vsimem/Async', () => {
    let filename, ds, buffer

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/park.geo.json')
      buffer = fs.readFileSync(filename)
      ds = gdal.openAsync(buffer)
    })
    it('should be able to read band count', () => {
      assert.eventually.equal(ds.then((ds) => ds.layers.count()), 1)
    })
    it('should keep the buffer in the dataset', () => {
      assert.eventually.instanceOf(ds.then((ds) => ds.buffer), Buffer)
      assert.eventually.equal(ds.then((ds) => ds.buffer), buffer)
    })
  })
})
