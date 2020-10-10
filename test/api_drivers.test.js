const assert = require('chai').assert
const gdal = require('../lib/gdal.js')

describe('gdal.drivers', () => {
  afterEach(gc)

  describe('count()', () => {
    it('should return the number of drivers', () => {
      assert.isNumber(gdal.drivers.count())
    })
  })

  describe('getNames()', () => {
    it('should return array of strings', () => {
      const result = gdal.drivers.getNames()
      assert.isArray(result)
      result.forEach((driver) => {
        assert.isString(driver)
      })
    })
    it('should return array the same length as driver count', () => {
      const count = gdal.drivers.count()
      assert.lengthOf(gdal.drivers.getNames(), count)
    })
  })

  describe('get()', () => {
    it('should support numeric argument', () => {
      assert.instanceOf(gdal.drivers.get(0), gdal.Driver)
    })
    it('should support string argument', () => {
      assert.instanceOf(gdal.drivers.get('GTiff'), gdal.Driver)
    })
    it('should return null when not found', () => {
      assert.equal(gdal.drivers.get('awfag'), null)
    })

    // raster drivers
    const expected = {
      GTiff: {
        DMD_LONGNAME: 'GeoTIFF',
        DMD_MIMETYPE: 'image/tiff',
        DMD_EXTENSION: 'tif',
        DCAP_CREATE: 'YES'
      },
      'VRT:raster': {
        DMD_LONGNAME: 'Virtual Raster',
        DMD_MIMETYPE: undefined,
        DMD_EXTENSION: 'vrt',
        DCAP_CREATE: 'YES'
      },
      MEM: {
        DMD_LONGNAME: 'In Memory Raster',
        DMD_MIMETYPE: undefined,
        DMD_EXTENSION: undefined,
        DCAP_CREATE: 'YES'
      },
      PNG: {
        DMD_LONGNAME: 'Portable Network Graphics',
        DMD_MIMETYPE: 'image/png',
        DMD_EXTENSION: 'png',
        DCAP_CREATE: undefined
      },
      JPEG: {
        DMD_LONGNAME: 'JPEG JFIF',
        DMD_MIMETYPE: 'image/jpeg',
        DMD_EXTENSION: 'jpg',
        DCAP_CREATE: undefined
      }
    }

    Object.keys(expected).forEach((o) => {
      it(`should support "${o}" driver`, () => {
        const driver = gdal.drivers.get(o)
        assert.ok(driver)

        const metadata = driver.getMetadata()
        const expected_meta = expected[o]
        assert.equal(expected_meta.DMD_LONGNAME, metadata.DMD_LONGNAME)
        assert.equal(expected_meta.DMD_MIMETYPE, metadata.DMD_MIMETYPE)
        assert.equal(expected_meta.DMD_EXTENSION, metadata.DMD_EXTENSION)
        assert.equal(expected_meta.DCAP_CREATE, metadata.DCAP_CREATE)
      })
    })

    // vector drivers
    const drivers = [ 'GEOJSON', 'VRT:vector', 'ESRI Shapefile' ]

    drivers.forEach((o) => {
      it(`should support "${o}" (ogr) driver`, () => {
        assert.ok(gdal.drivers.get(o))
      })
    })
  })

  describe('forEach()', () => {
    it('should iterate through all Driver objects', () => {
      const n = gdal.drivers.count()
      let count = 0
      gdal.drivers.forEach((driver, i) => {
        assert.isNumber(i)
        assert.instanceOf(driver, gdal.Driver)
        assert.equal(driver, gdal.drivers.get(i))
        count++
      })
      assert.equal(count, n)
    })
    it('should stop when false is returned from callback', () => {
      let i = 0
      gdal.drivers.forEach(() => {
        if (++i === 1) return false
      })
      assert.equal(i, 1)
    })
    it('should always start from beginning', () => {
      const n = gdal.drivers.count()
      let i = 0,
        j = 0
      gdal.drivers.forEach(() => {
        if (i++ === 1) return false
      })
      gdal.drivers.forEach(() => {
        j++
      })
      assert.equal(j, n)
    })
  })

  describe('map()', () => {
    it('should operate normally', () => {
      const result = gdal.drivers.map((driver, i) => {
        assert.isNumber(i)
        assert.instanceOf(driver, gdal.Driver)
        assert.equal(driver, gdal.drivers.get(i))
        return 'a'
      })

      assert.isArray(result)
      assert.equal(result[0], 'a')
      assert.equal(result.length, gdal.drivers.count())
    })
  })

  describe('createCopyAsync', () => {
    it('should operate normally', () => {
      const driver = gdal.drivers.get('MEM')
      const outputFilename = '' // __dirname + '/data/12_791_1476.tif';
      driver.createCopyAsync(
        outputFilename,
        gdal.open(`${__dirname}/data/12_791_1476.jpg`)
      ).then((result) => {
        assert.equal(result.driver.description, 'MEM')
      }).catch((e) => {
        console.error(e)
        process.exit(1)
      })
    })
  })
})
