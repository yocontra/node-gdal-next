const gdal = require('../lib/gdal.js')
const path = require('path')
const assert = require('assert')

describe('Open', () => {
  afterEach(gc)

  it('should throw when invalid file', () => {
    const filename = path.join(__dirname, 'data/invalid')
    assert.throws(() => {
      gdal.open(filename)
    }, /Error/)
  })
})
