const fs = require('fs')
const gdal = require('../lib/gdal.js')
const assert = require('chai').assert

// http://epsg.io/
// http://spatialreference.org/ref/

describe('gdal.SpatialReference', () => {
  afterEach(gc)

  it('should be exposed', () => {
    assert.ok(gdal.SpatialReference)
  })
  it('should be instantiable', () => {
    assert.instanceOf(new gdal.SpatialReference(), gdal.SpatialReference)
  })
  describe('fromWKT()', () => {
    it('should return SpatialReference', () => {
      const wkt =
        'PROJCS["NAD_1983_UTM_Zone_10N",' +
        'GEOGCS["GCS_North_American_1983",' +
        'DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137,298.257222101]],' +
        'PRIMEM["Greenwich",0],UNIT["Degree",0.0174532925199433]],' +
        'PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],' +
        'PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-123.0],' +
        'PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_of_Origin",0.0],' +
        'UNIT["Meter",1.0]]'

      const ref = gdal.SpatialReference.fromWKT(wkt)
      assert.instanceOf(ref, gdal.SpatialReference)
    })
  })
  describe('fromProj4()', () => {
    it('should return SpatialReference', () => {
      const proj =
        '+proj=stere +lat_ts=-37 +lat_0=-90 +lon_0=145 +k_0=1.0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
      const ref = gdal.SpatialReference.fromProj4(proj)
      assert.instanceOf(ref, gdal.SpatialReference)
    })
  })
  describe('fromEPSG()', () => {
    it('should return SpatialReference', () => {
      const epsg = 4326
      const ref = gdal.SpatialReference.fromEPSG(epsg)
      assert.instanceOf(ref, gdal.SpatialReference)
    })
  })
  describe('fromEPSGA()', () => {
    it('should return SpatialReference', () => {
      const epsga = 26910
      const ref = gdal.SpatialReference.fromEPSGA(epsga)
      assert.instanceOf(ref, gdal.SpatialReference)
    })
  })
  describe('fromESRI', () => {
    it('should return SpatialReference', () => {
      const esri = [
        'GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]'
      ]
      const ref = gdal.SpatialReference.fromESRI(esri)
      assert.instanceOf(ref, gdal.SpatialReference)
    })
  })
  describe('fromXML', () => {
    it('should return SpatialReference', () => {
      const gml = fs.readFileSync(`${__dirname}/data/srs/sample.gml`, 'utf8')
      const ref = gdal.SpatialReference.fromXML(gml)
      assert.instanceOf(ref, gdal.SpatialReference)
    })
  })
  describe('fromWMSAUTO', () => {
    it('should return SpatialReference', () => {
      const wms = 'AUTO:42001,99,8888'
      const ref = gdal.SpatialReference.fromWMSAUTO(wms)
      assert.instanceOf(ref, gdal.SpatialReference)
    })
  })
  describe('fromURN', () => {
    it('should return SpatialReference', () => {
      const wms = 'urn:ogc:def:crs:EPSG::26912'
      const ref = gdal.SpatialReference.fromURN(wms)
      assert.instanceOf(ref, gdal.SpatialReference)
    })
  })
  describe('fromCRSURL', () => {
    it('should return SpatialReference', () => {
      const wms = 'http://www.opengis.net/def/crs/EPSG/0/3857'
      const ref = gdal.SpatialReference.fromCRSURL(wms)
      assert.instanceOf(ref, gdal.SpatialReference)
    })
  })
  describe('validate', () => {
    it('should validate a SpatialReference', () => {
      const epsg = 4326
      const ref = gdal.SpatialReference.fromEPSG(epsg)
      assert.isNull(ref.validate())
    })
  })
  describe('exportToPrettyWKT', () => {
    it('should pretty-print WKT', () => {
      const wms = 'http://www.opengis.net/def/crs/EPSG/0/3857'
      const ref = gdal.SpatialReference.fromCRSURL(wms)
      assert.include(ref.toPrettyWKT(), 'WGS 84 / Pseudo-Mercato')
    })
  })
  describe('getAngularUnits', () => {
    it('should validate a SpatialReference', () => {
      const wms = 'http://www.opengis.net/def/crs/EPSG/0/3857'
      const ref = gdal.SpatialReference.fromCRSURL(wms)
      const angular = ref.getAngularUnits()
      assert.closeTo(angular.value, 0.0174, 0.001)
      assert.equal(angular.units, 'degree')
    })
  })
  describe('getAuthorityCode', () => {
    it('should support string argument', () => {
      const srs = gdal.SpatialReference.fromUserInput('EPSG:27700')
      assert.strictEqual(srs.getAuthorityCode('PROJCS'), '27700')
    })
    it('should support null argument', () => {
      // https://github.com/naturalatlas/node-gdal/issues/218
      const wkt =
        'GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]'
      const srs = gdal.SpatialReference.fromWKT(wkt)
      srs.autoIdentifyEPSG()
      assert.strictEqual(srs.getAuthorityCode(null), '4269')
    })
    it('should support no arguments', () => {
      const wkt =
        'GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]'
      const srs = gdal.SpatialReference.fromWKT(wkt)
      srs.autoIdentifyEPSG()
      assert.strictEqual(srs.getAuthorityCode(), '4269')
    })
  })
  describe('getAuthorityName', () => {
    it('should support string argument', () => {
      const srs = gdal.SpatialReference.fromUserInput('EPSG:27700')
      assert.strictEqual(srs.getAuthorityName('PROJCS'), 'EPSG')
    })
    it('should support null argument', () => {
      const wkt =
        'GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]'
      const srs = gdal.SpatialReference.fromWKT(wkt)
      srs.autoIdentifyEPSG()
      assert.strictEqual(srs.getAuthorityName(null), 'EPSG')
    })
    it('should support no arguments', () => {
      const wkt =
        'GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]'
      const srs = gdal.SpatialReference.fromWKT(wkt)
      srs.autoIdentifyEPSG()
      assert.strictEqual(srs.getAuthorityName(), 'EPSG')
    })
  })
  describe('toProj4', () => {
    it('should return string', () => {
      const srs = gdal.SpatialReference.fromUserInput('NAD83')
      const expected = [
        '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs', // old gdal
        '+proj=longlat +datum=NAD83 +no_defs' // new gdal
      ]
      assert.include(expected, srs.toProj4())
    })
  })
  describe('isGeographic', () => {
    it('should return true if geographic coordinate system', () => {
      assert.equal(gdal.SpatialReference.fromEPSG(4326).isGeographic(), true)
    })
    it('should return false if not geographic coordinate system', () => {
      assert.equal(gdal.SpatialReference.fromEPSG(2154).isGeographic(), false)
    })
  })
})
