import * as gdal from '..'
import * as path from 'path'
const assert = require('assert')

describe('Open', () => {
  afterEach(global.gc)

  it('should throw when invalid file', () => {
    const filename = path.join(__dirname, 'data/invalid')
    assert.throws(() => {
      gdal.open(filename)
    }, /Error/)
  })
})
