const assert = require('chai').assert
const gdal = require('../lib/gdal.js')

describe('gdal.CompoundCurve', () => {
  afterEach(gc)

  it('should be instantiable', () => {
    new gdal.CompoundCurve()
  })
  it('should inherit from Geometry', () => {
    assert.instanceOf(new gdal.CompoundCurve(), gdal.CompoundCurve)
    assert.instanceOf(new gdal.CompoundCurve(), gdal.Geometry)
  })
  describe('instance', () => {
    let compoundcurve
    before(() => {
      compoundcurve = gdal.Geometry.fromWKT('COMPOUNDCURVE (CIRCULARSTRING (692012.37315768 594722.610031277,692057.127042054 594649.528941062,692067.186040178 594564.425636366),(692067.186040178 594564.425636366,692026.997800346 594156.751911029),CIRCULARSTRING (692026.997800346 594156.751911029,692061.574244064 594070.897749602,692151.782327678 594050.18617928))')
    })
    it('should be parsed from WKT', () => {
      assert.instanceOf(compoundcurve, gdal.CompoundCurve)
      assert.equal(compoundcurve.curves.count(), 3)
      assert.instanceOf(compoundcurve.curves.get(0), gdal.CircularString)
    })
    it('should support forEach', () => {
      let i = 0
      compoundcurve.curves.forEach((curve) => {
        assert.instanceOf(curve, gdal.SimpleCurve)
        i++
      })
      assert.equal(i, 3)
    })
    it('should support map', () => {
      const curves = compoundcurve.curves.map((curve) => curve)
      assert.isArray(curves)
      assert.equal(curves.length, 3)
    })
    it('should have an iterator', () => {
      let i = 0
      for (const curve of compoundcurve.curves) {
        assert.instanceOf(curve, gdal.SimpleCurve)
        i++
      }
      assert.equal(i, 3)
    })
  })
})

describe('gdal.MultiCurve', () => {
  afterEach(gc)

  it('should be instantiable', () => {
    new gdal.MultiCurve()
  })
  it('should inherit from GeometryCollection', () => {
    assert.instanceOf(new gdal.MultiCurve(), gdal.MultiCurve)
    assert.instanceOf(new gdal.MultiCurve(), gdal.GeometryCollection)
    assert.instanceOf(new gdal.MultiCurve(), gdal.Geometry)
  })
  describe('instance', () => {
    let multicurve
    it('should be parsed from WKT', () => {
      multicurve = gdal.Geometry.fromWKT('MULTICURVE (COMPOUNDCURVE (CIRCULARSTRING (692012.37315768 594722.610031277,692057.127042054 594649.528941062,692067.186040178 594564.425636366),(692067.186040178 594564.425636366,692026.997800346 594156.751911029),CIRCULARSTRING (692026.997800346 594156.751911029,692061.574244064 594070.897749602,692151.782327678 594050.18617928)))')
      assert.instanceOf(multicurve, gdal.MultiCurve)
      assert.equal(multicurve.children.count(), 1)
      assert.instanceOf(multicurve.children.get(0), gdal.CompoundCurve)
    })
  })
})
