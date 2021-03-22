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
    let filename, ds, ds2, buffer

    after(() => {
      ds.close()
    })
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
    it('should throw on an empty buffer', () => {
      const buffer = Buffer.alloc(0)
      assert.throws(() => gdal.open(buffer))
    })
    it('should throw on an invalid buffer', () => {
      const buffer = Buffer.alloc(1024)
      assert.throws(() => gdal.open(buffer))
    })
    it('should be shareable across datasets', () => {
      const ds2 = gdal.open(buffer)
      assert.equal(ds2.buffer, ds.buffer)
      ds2.close()
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
    // Not supported on GDAL 1.x
    if (parseFloat(gdal.version) < 2) return
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
    it('should throw on an empty buffer', () => {
      buffer = Buffer.alloc(0)
      assert.isRejected(gdal.openAsync(buffer))
    })
    it('should throw on an invalid buffer', () => {
      buffer = Buffer.alloc(1024)
      assert.isRejected(gdal.openAsync(buffer))
    })
  })
})
