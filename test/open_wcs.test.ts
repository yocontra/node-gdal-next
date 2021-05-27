import * as gdal from '..'
import * as chai from 'chai'
const assert = chai.assert
import * as chaiAsPromised from 'chai-as-promised'
import * as semver from 'semver'
chai.use(chaiAsPromised)

const columbiaPop = 'WCS:https://sedac.ciesin.columbia.edu/geoserver/wcs?VERSION=1.0.0&COVERAGE=anthromes:anthromes-anthropogenic-biomes-world-v2-2000'

describe('Open', () => {
  afterEach(global.gc)

  // System-installed versions do not always have the WCS driver
  if (!gdal.bundled && gdal.drivers.get('WCS') === null) {
    return
  }
  if (semver.lt(gdal.version, '2.3.0')) {
    return
  }

  describe('WCS', () => {
    let ds: gdal.Dataset

    after(() => (ds && ds.close()))

    it('should not throw', () => {
      ds = gdal.open(columbiaPop)
    })

    it('should be able to the bands', () => {
      assert.equal(ds.bands.count(), 1)
      assert.equal(ds.bands.get(1).overviews.get(2).size.x, 540)
    })

    it('should have projection', () => {
      assert.isTrue(ds.srs.isSame(gdal.SpatialReference.fromEPSG(4326)))
    })
  })

  describe('WCS/Async', () => {
    let ds: Promise<gdal.Dataset>

    after(() => ds && ds.then((r) => r.close()))

    it('should not throw', () => {
      ds = gdal.openAsync(columbiaPop)
      return assert.isFulfilled(ds)
    })

    it('should be able to read raster size', () =>
      assert.isFulfilled(Promise.all([
        assert.eventually.equal(ds.then((r) => r.bands.count()), 1),
        assert.eventually.equal(ds.then((r) => r.bands.get(1).overviews.get(2).size.x), 540)
      ]))
    )

    it('should have projection', () =>
      assert.eventually.isTrue(ds.then((r) =>
        r.srs.isSame(gdal.SpatialReference.fromEPSG(4326))
      )))
  })
})
