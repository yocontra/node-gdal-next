import * as gdal from '..'
import * as fs from 'fs'
import * as path from 'path'
import { assert } from 'chai'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

describe('gdal.fs', () => {
  describe('stat()', () => {
    it('should return information on file system objects', () => {
      const stat = gdal.fs.stat(path.resolve(__dirname, 'data', 'sample.tif'))
      assert.equal(stat.size, BigInt(794079))
      assert.isTrue((stat.mode & fs.constants.S_IFREG) === fs.constants.S_IFREG)
    })
    it('should throw on non-existent files', () => {
      assert.throws(() => {
        gdal.fs.stat(path.resolve(__dirname, 'data', 'sample2.tif'))
      })
    })
  })
  describe('statAsync()', () => {
    it('should return information on file system objects', () => {
      const stat = gdal.fs.statAsync(path.resolve(__dirname, 'data', 'sample.tif'))
      return assert.eventually.propertyVal(stat, 'size', BigInt(794079))
    })
    it('should reject on non-existent files', () =>
      assert.isRejected(gdal.fs.statAsync(path.resolve(__dirname, 'data', 'sample2.tif'))))
  })
})
