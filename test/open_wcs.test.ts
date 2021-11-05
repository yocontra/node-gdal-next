import * as gdal from '..'
import * as chai from 'chai'
const assert = chai.assert
import * as chaiAsPromised from 'chai-as-promised'
import * as semver from 'semver'
chai.use(chaiAsPromised)

const wcsURL = 'WCS:https://geobretagne.fr/geoserver/photo/wcs?version=2.0.1&coverage=photo__ir-35-2020'

describe('Open', () => {
  afterEach(global.gc)

  // System-installed versions do not always have the WCS driver
  if (!gdal.bundled && gdal.drivers.get('WCS') === null) {
    return
  }
  if (semver.lt(gdal.version, '2.3.0')) {
    return
  }

  describe('WCS w/Net', () => {
    let ds: gdal.Dataset

    after(() => (ds && ds.close()))

    it('should not throw', () => {
      ds = gdal.open(wcsURL)
    })

    it('should be able to the bands', () => {
      assert.equal(ds.bands.count(), 3)
    })

    it('should have projection', () => {
      assert.isTrue(ds.srs?.isSame(gdal.SpatialReference.fromEPSG(2154)))
    })
  })

  describe('WCS/Async w/Net', () => {
    let ds: Promise<gdal.Dataset>

    after(() => ds && ds.then((r) => r.close()))

    it('should not throw', () => {
      ds = gdal.openAsync(wcsURL)
      return assert.isFulfilled(ds)
    })

    it('should be able to read raster size', () =>
      assert.isFulfilled(Promise.all([
        assert.eventually.equal(ds.then((r) => r.bands.count()), 3)
      ]))
    )

    it('should have projection', () =>
      assert.eventually.isTrue(ds.then((r) =>
        r.srs?.isSame(gdal.SpatialReference.fromEPSG(2154))
      )))
  })
})
