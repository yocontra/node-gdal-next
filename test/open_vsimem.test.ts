import * as gdal from '..'
import * as path from 'path'
import * as fs from 'fs'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
const assert = chai.assert
chai.use(chaiAsPromised)
import * as semver from 'semver'

describe('Open', () => {
  afterEach(global.gc)

  // The bufferHolder/delete acrobatics are needed for the ASAN builds
  // This simulates the buffer going out of scope
  describe('vsimem', () => {
    let filename, ds
    const bufferHolder = {} as any

    after(() => {
      delete ds.buffer
      ds.close()
      delete bufferHolder.buffer
      global.gc()
    })
    it('should not throw', () => {
      filename = path.join(__dirname, 'data/park.geo.json')
      bufferHolder.buffer = fs.readFileSync(filename)
      ds = gdal.open(bufferHolder.buffer)
    })
    it('should be able to read band count', () => {
      assert.equal(ds.layers.count(), 1)
    })
    it('should keep the buffer in the dataset', () => {
      assert.instanceOf(ds.buffer, Buffer)
      assert.equal(ds.buffer, bufferHolder.buffer)
    })
    it('should throw on an empty buffer', () => {
      bufferHolder.buffer2 = Buffer.alloc(0)
      assert.throws(() => gdal.open(bufferHolder.buffer2))
      delete bufferHolder.buffer2
    })
    it('should throw on an invalid buffer', () => {
      bufferHolder.buffer2 = Buffer.alloc(1024)
      assert.throws(() => gdal.open(bufferHolder.buffer2))
      delete bufferHolder.buffer2
    })
    it('should be shareable across datasets', () => {
      const ds2 = gdal.open(bufferHolder.buffer)
      assert.equal((ds2 as any).buffer, ds.buffer)
      delete (ds2 as any).buffer
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
    if (semver.lt(gdal.version, '2.0.0')) return
    let filename, ds
    const bufferHolder = {} as any
    after(() => {
      ds.then((r) => {
        delete r.buffer
        r.close()
        delete bufferHolder.buffer
        delete bufferHolder.buffer2
        global.gc()
      })
    })
    afterEach(global.gc)

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/park.geo.json')
      bufferHolder.buffer = fs.readFileSync(filename)
      ds = gdal.openAsync(bufferHolder.buffer)
    })
    it('should be able to read band count', () =>
      assert.eventually.equal(ds.then((ds) => ds.layers.count()), 1)
    )
    it('should keep the buffer in the dataset', () =>
      Promise.all([ assert.eventually.instanceOf(ds.then((ds) => ds.buffer), Buffer),
        assert.eventually.equal(ds.then((ds) => ds.buffer), bufferHolder.buffer)
      ])
    )
    it('should throw on an empty buffer', () => {
      bufferHolder.buffer2 = Buffer.alloc(0)
      return assert.isRejected(gdal.openAsync(bufferHolder.buffer2))
    })
    it('should throw on an invalid buffer', () => {
      bufferHolder.buffer2 = Buffer.alloc(1024)
      return assert.isRejected(gdal.openAsync(bufferHolder.buffer2))
    })
  })
})
