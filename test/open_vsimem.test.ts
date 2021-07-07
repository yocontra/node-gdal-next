import * as gdal from '..'
import * as path from 'path'
import * as fs from 'fs'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
const assert = chai.assert
chai.use(chaiAsPromised)

describe('Open', () => {
  afterEach(global.gc)

  describe('vsimem/open', () => {
    let filename, ds, buffer
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */

    after(() => {
      ds.close()
      global.gc()
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
      const buffer2 = Buffer.alloc(0)
      assert.throws(() => gdal.open(buffer2))
    })
    it('should throw on an invalid buffer', () => {
      const buffer2 = Buffer.alloc(1024)
      assert.throws(() => gdal.open(buffer2))
    })
    it('should be shareable across datasets', () => {
      const ds2 = gdal.open(buffer)
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      assert.equal((ds2 as any).buffer, ds.buffer)
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      ds2.close()
    })
    it('layer should have all fields defined', () => {
      const layer = ds.layers.get(0)
      assert.equal(layer.fields.count(), 3)
      assert.deepEqual(layer.fields.getNames(), [
        'kind',
        'name',
        'state'
      ])
    })
  })
  describe('vsimem/openAsync', () => {
    let filename, ds, buffer
    after(() => ds.then((r) => {
      r.close()
      global.gc()
    }))
    afterEach(global.gc)

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/park.geo.json')
      buffer = fs.readFileSync(filename)
      ds = gdal.openAsync(buffer)
    })
    it('should be able to read band count', () =>
      assert.eventually.equal(ds.then((ds) => ds.layers.count()), 1)
    )
    it('should keep the buffer in the dataset', () =>
      Promise.all([ assert.eventually.instanceOf(ds.then((ds) => ds.buffer), Buffer),
        assert.eventually.equal(ds.then((ds) => ds.buffer), buffer)
      ])
    )
    it('should throw on an empty buffer', () => {
      const buffer2 = Buffer.alloc(0)
      return assert.isRejected(gdal.openAsync(buffer2))
    })
    it('should throw on an invalid buffer', () => {
      const buffer2 = Buffer.alloc(1024)
      return assert.isRejected(gdal.openAsync(buffer2))
    })
  })

  describe('vsimem/set', () => {
    after(() => {
      global.gc()
    })
    it('should create a vsimem file from a Buffer', () => {
      const buffer_in = fs.readFileSync(path.join(__dirname, 'data/park.geo.json'))
      gdal.vsimem.set(buffer_in, '/vsimem/park.geo.json')
      const ds = gdal.open('/vsimem/park.geo.json')
      ds.close()
      const buffer_out = gdal.vsimem.release('/vsimem/park.geo.json')
      assert.strictEqual(buffer_in, buffer_out)
    })
    it('should throw if the buffer is not a Buffer', () => {
      assert.throws(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gdal.vsimem.set(({}) as any, '/vsimem/park.geo.json')
      })
    })
  })

  describe('vsimem/release', () => {
    it('should allow to retrieve the contents from a vsimem', () => {
      const ds = gdal.open('/vsimem/temp1.tiff', 'w', 'GTiff', 16, 16, 1, gdal.GDT_Byte)
      ds.close()
      const buffer = gdal.vsimem.release('/vsimem/temp1.tiff')
      assert.instanceOf(buffer, Buffer)
      const tmpName = path.join(__dirname, 'data', 'temp', `temp_vsimem_${Date.now()}.tiff`)
      fs.writeFileSync(tmpName, buffer)
      const tmp = gdal.open(tmpName)
      assert.instanceOf(tmp, gdal.Dataset)
      assert.deepEqual(tmp.rasterSize, { x: 16, y: 16 })
      fs.unlinkSync(tmpName)
    })
    it('should throw if the file is not a vsimem file', () => {
      assert.throws(() => {
        gdal.vsimem.release('park.geo.json')
      })
    })
  })
})
