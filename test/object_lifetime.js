const gdal = require('../lib/gdal.js')
const assert = require('chai').assert
const path = require('path')

describe('object cache', () => {
  it('should return same object if pointer is same', () => {
    for (let i = 0; i < 10; i++) {
      gdal.log(`Object Cache test run #${i}`)
      const ds = gdal.open('temp', 'w', 'MEM', 4, 4, 1)
      const band1 = ds.bands.get(1)
      const band2 = ds.bands.get(1)
      assert.instanceOf(band1, gdal.RasterBand)
      assert.equal(band1, band2)
      assert.equal(band1.size.x, 4)
      assert.equal(band2.size.x, 4)
      gc()
    }
  })
})
describe('object lifetimes', () => {
  it('datasets should stay alive until all bands go out of scope', () => {
    let ds = gdal.open('temp', 'w', 'MEM', 4, 4, 1)
    let band = ds.bands.get(1)

    const ds_uid = ds._uid
    const band_uid = band._uid

    ds = null
    gc()

    assert.isTrue(gdal._isAlive(ds_uid))
    assert.isTrue(gdal._isAlive(band_uid))

    band = null
    gc()

    assert.isFalse(gdal._isAlive(ds_uid))
    assert.isFalse(gdal._isAlive(band_uid))
  })
  it('bands should immediately be garbage collected as they go out of scope', () => {
    const ds = gdal.open('temp', 'w', 'MEM', 4, 4, 1)
    let band = ds.bands.get(1)

    const ds_uid = ds._uid
    const band_uid = band._uid

    band = null
    gc()

    assert.isTrue(gdal._isAlive(ds_uid))
    assert.isFalse(gdal._isAlive(band_uid))
  })
  it('datasets should stay alive until all layers go out of scope', () => {
    let ds = gdal.open(path.join(__dirname, 'data/shp/sample.shp'))
    let layer = ds.layers.get(0)

    const ds_uid = ds._uid
    const layer_uid = layer._uid

    ds = null
    gc()

    assert.isTrue(gdal._isAlive(ds_uid))
    assert.isTrue(gdal._isAlive(layer_uid))

    layer = null
    gc()

    assert.isFalse(gdal._isAlive(ds_uid))
    assert.isFalse(gdal._isAlive(layer_uid))
  })
  it('layers should immediately be garbage collected as they go out of scope', () => {
    const ds = gdal.open(path.join(__dirname, 'data/shp/sample.shp'))
    let layer = ds.layers.get(0)

    const ds_uid = ds._uid
    const layer_uid = layer._uid

    layer = null
    gc()

    assert.isTrue(gdal._isAlive(ds_uid))
    assert.isFalse(gdal._isAlive(layer_uid))
  })
})
