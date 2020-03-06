const gdal = require('../lib/gdal.js')
const assert = require('chai').assert

const WGS84 =
  'GEOGCS["WGS_84",DATUM["WGS_1984",SPHEROID["WGS_84",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.0174532925199433],AXIS["Longitude",EAST],AXIS["Latitude",NORTH]]'

describe('gdal.Geometry', () => {
  afterEach(gc)

  describe('toJSON()', () => {
    it('should return valid result', () => {
      const point2d = new gdal.Point(1, 2)
      assert.deepEqual(JSON.parse(point2d.toJSON()), {
        type: 'Point',
        coordinates: [ 1, 2 ]
      })
      const point3d = new gdal.Point(1, 2, 3)
      assert.deepEqual(JSON.parse(point3d.toJSON()), {
        type: 'Point',
        coordinates: [ 1, 2, 3 ]
      })
    })
  })
  describe('toObject()', () => {
    it('should return valid result', () => {
      const point2d = new gdal.Point(1, 2)
      assert.deepEqual(point2d.toObject(), {
        type: 'Point',
        coordinates: [ 1, 2 ]
      })
      const point3d = new gdal.Point(1, 2, 3)
      assert.deepEqual(point3d.toObject(), {
        type: 'Point',
        coordinates: [ 1, 2, 3 ]
      })
    })
  })
  describe('toKML()', () => {
    it('should return valid result', () => {
      const point2d = new gdal.Point(1, 2)
      assert.equal(
        point2d.toKML(),
        '<Point><coordinates>1,2</coordinates></Point>'
      )
      const point3d = new gdal.Point(1, 2, 3)
      assert.equal(
        point3d.toKML(),
        '<Point><coordinates>1,2,3</coordinates></Point>'
      )
    })
  })
  describe('toWKT()', () => {
    it('should return valid result', () => {
      const point2d = new gdal.Point(1, 2)
      assert.equal(point2d.toWKT(), 'POINT (1 2)')
      const point3d = new gdal.Point(1, 2, 3)
      assert.equal(point3d.toWKT(), 'POINT (1 2 3)')
    })
  })
  describe('toGML()', () => {
    it('should return valid result', () => {
      const point2d = new gdal.Point(1, 2)
      assert.equal(
        point2d.toGML(),
        '<gml:Point><gml:coordinates>1,2</gml:coordinates></gml:Point>'
      )
      const point3d = new gdal.Point(1, 2, 3)
      assert.equal(
        point3d.toGML(),
        '<gml:Point><gml:coordinates>1,2,3</gml:coordinates></gml:Point>'
      )
    })
  })
  describe('toWKB()', () => {
    it('should return valid result', () => {
      const point2d = new gdal.Point(1, 2)
      const wkb = point2d.toWKB()
      let expected
      if (wkb[0] === 0) {
        expected = '00000000013ff00000000000004000000000000000'
      } else {
        expected = '0101000000000000000000f03f0000000000000040'
      }
      assert.equal(wkb.toString('hex'), expected)
    })
  })
  describe('fromWKT()', () => {
    it('should return valid result', () => {
      const point2d = gdal.Geometry.fromWKT('POINT (1 2)')
      assert.equal(point2d.wkbType, gdal.wkbPoint)
      assert.equal(point2d.x, 1)
      assert.equal(point2d.y, 2)
    })
  })
  describe('fromWKB()', () => {
    it('should return valid result', () => {
      const wkb = new gdal.Point(1, 2).toWKB()
      const point2d = gdal.Geometry.fromWKB(wkb)
      assert.equal(point2d.wkbType, gdal.wkbPoint)
      assert.equal(point2d.x, 1)
      assert.equal(point2d.y, 2)
    })
  })
  if (parseFloat(gdal.version) >= 2.3) {
    describe('fromGeoJson()', () => {
      it('should return valid result', () => {
        const point2d = gdal.Geometry.fromGeoJson({ type: 'Point', coordinates: [ 2, 1 ] })
        assert.equal(point2d.wkbType, gdal.wkbPoint)
        assert.equal(point2d.x, 2)
        assert.equal(point2d.y, 1)
      })
    })
  }
  describe('getConstructor()', () => {
    //  wkbUnknown = 0, wkbPoint = 1, wkbLineString = 2, wkbPolygon = 3,
    //  wkbMultiPoint = 4, wkbMultiLineString = 5, wkbMultiPolygon = 6, wkbGeometryCollection = 7,
    //  wkbNone = 100, wkbLinearRing = 101, wkbPoint25D = 0x80000001, wkbLineString25D = 0x80000002,
    //  wkbPolygon25D = 0x80000003, wkbMultiPoint25D = 0x80000004, wkbMultiLineString25D = 0x80000005, wkbMultiPolygon25D = 0x80000006,
    //  wkbGeometryCollection25D = 0x80000007
    it('should return proper constructor from wkbType', () => {
      assert.isNull(gdal.Geometry.getConstructor(0))
      assert.equal(gdal.Geometry.getConstructor(1), gdal.Point)
      assert.equal(gdal.Geometry.getConstructor(2), gdal.LineString)
      assert.equal(gdal.Geometry.getConstructor(3), gdal.Polygon)
      assert.equal(gdal.Geometry.getConstructor(4), gdal.MultiPoint)
      assert.equal(gdal.Geometry.getConstructor(5), gdal.MultiLineString)
      assert.equal(gdal.Geometry.getConstructor(6), gdal.MultiPolygon)
      assert.equal(gdal.Geometry.getConstructor(7), gdal.GeometryCollection)
      assert.equal(gdal.Geometry.getConstructor(101), gdal.LinearRing)
    })
  })
  describe('"wkbType" property', () => {
    it('should be set', () => {
      assert.equal(gdal.Point.wkbType, 1)
      assert.equal(gdal.LineString.wkbType, 2)
      assert.equal(gdal.Polygon.wkbType, 3)
      assert.equal(gdal.MultiPoint.wkbType, 4)
      assert.equal(gdal.MultiLineString.wkbType, 5)
      assert.equal(gdal.MultiPolygon.wkbType, 6)
      assert.equal(gdal.GeometryCollection.wkbType, 7)
      assert.equal(gdal.LinearRing.wkbType, 101)
    })
  })

  describe('instance', () => {
    describe('"wkbType" property', () => {
      it('should be set', () => {
        assert.equal(new gdal.Point().wkbType, 1)
        assert.equal(new gdal.LineString().wkbType, 2)
        assert.equal(new gdal.Polygon().wkbType, 3)
        assert.equal(new gdal.MultiPoint().wkbType, 4)
        assert.equal(new gdal.MultiLineString().wkbType, 5)
        assert.equal(new gdal.MultiPolygon().wkbType, 6)
        assert.equal(new gdal.GeometryCollection().wkbType, 7)
        assert.equal(new gdal.LinearRing().wkbType, 101)
      })
    })
    describe('"coordinateDimension" property', () => {
      it('should be set', () => {
        assert.equal(new gdal.Point(1, 2, 3).coordinateDimension, 3)
      })
      it('should be writable', () => {
        const point = new gdal.Point(1, 2, 3)
        assert.equal(point.coordinateDimension, 3)
        assert.equal(point.z, 3)
        point.coordinateDimension = 2
        assert.equal(point.coordinateDimension, 2)
        assert.equal(point.z, 0)
      })
    })
    describe('"srs" property', () => {
      it('should be able to be get', () => {
        const point = new gdal.Point(0, 0)
        assert.equal(point.srs, null)

        point.srs = gdal.SpatialReference.fromWKT(WGS84)
        assert.instanceOf(point.srs, gdal.SpatialReference)
        assert.equal(point.srs.toWKT(), WGS84)
      })
      it('should be able to be set', () => {
        const point = new gdal.Point(1, 2)
        point.srs = gdal.SpatialReference.fromWKT(WGS84)
        point.srs = null
      })
      it('must require SpatialReference when setting', () => {
        const point = new gdal.Point(1, 2)
        assert.throws(() => {
          point.srs = 'invalid'
        })
      })
    });

    // comparison functions
    (function () {
      let ring, square, point_inner, point_inner_clone, point_outer
      before(() => {
        ring = new gdal.LinearRing()
        ring.points.add({ x: 0, y: 0 })
        ring.points.add({ x: 10, y: 0 })
        ring.points.add({ x: 10, y: 10 })
        ring.points.add({ x: 0, y: 10 })
        ring.closeRings()

        square = new gdal.Polygon()
        square.rings.add(ring)

        point_inner = new gdal.Point(5, 5)
        point_outer = new gdal.Point(0, 20)
        point_inner_clone = new gdal.Point(5, 5)
      })
      describe('contains()', () => {
        it('should return correct result', () => {
          assert.equal(square.contains(point_inner), true)
          assert.equal(square.contains(point_outer), false)
        })
      })
      describe('within()', () => {
        it('should return correct result', () => {
          assert.equal(point_inner.within(square), true)
          assert.equal(point_outer.within(square), false)
        })
      })
      describe('intersects()', () => {
        it('should return correct result', () => {
          assert.equal(point_inner.intersects(square), true)
          assert.equal(point_outer.intersects(square), false)
        })
      })
      describe('equals()', () => {
        it('should return correct result', () => {
          assert.equal(point_inner.equals(square), false)
          assert.equal(point_outer.equals(square), false)
          assert.equal(point_inner.equals(point_inner_clone), true)
        })
        it('should determine if geometries are identical', () => {
          const point1 = new gdal.Point(3, 3)
          const point2 = new gdal.Point(3, 3)
          const point3 = new gdal.Point(5, 3)
          assert.equal(point1.equals(point2), true)
          assert.equal(point1.equals(point3), false)
        })
      })
      describe('disjoint()', () => {
        it('should return correct result', () => {
          assert.equal(point_inner.disjoint(square), false)
          assert.equal(point_outer.disjoint(square), true)
        })
      })
      describe('crosses()', () => {
        it('should return correct result', () => {
          const line_cross = new gdal.LineString()
          line_cross.points.add(-1, -1)
          line_cross.points.add(11, 11)
          const line_nocross = new gdal.LineString()
          line_nocross.points.add(-1, -1)
          line_nocross.points.add(-1, 11)

          assert.equal(point_inner.crosses(square), false)
          assert.equal(point_outer.crosses(square), false)
          assert.equal(line_cross.crosses(square), true)
          assert.equal(line_nocross.crosses(square), false)
        })
      })
      describe('overlaps()', () => {
        it('should return correct result', () => {
          const ring1 = new gdal.LinearRing()
          ring1.points.add({ x: 1, y: 0 })
          ring1.points.add({ x: 11, y: 0 })
          ring1.points.add({ x: 11, y: 10 })
          ring1.points.add({ x: 1, y: 10 })
          ring1.closeRings()

          const square1 = new gdal.Polygon()
          square1.rings.add(ring1)

          const ring2 = new gdal.LinearRing()
          ring2.points.add({ x: 100, y: 0 })
          ring2.points.add({ x: 110, y: 0 })
          ring2.points.add({ x: 110, y: 10 })
          ring2.points.add({ x: 100, y: 10 })
          ring2.closeRings()

          const square2 = new gdal.Polygon()
          square2.rings.add(ring2)

          assert.equal(square1.overlaps(square), true)
          assert.equal(square2.overlaps(square), false)
        })
      })
      describe('touches()', () => {
        it('should return correct result', () => {
          const point_edge = new gdal.Point(10, 0)
          assert.equal(point_edge.touches(square), true)
          assert.equal(point_outer.touches(square), false)
        })
      })
    })()

    // calculation functions
    describe('distance()', () => {
      it('should return correct result', () => {
        const point1 = new gdal.Point(0, 0)
        const point2 = new gdal.Point(10, 10)
        const distance_expected = Math.sqrt(10 * 10 + 10 * 10)
        const distance_actual = point1.distance(point2)
        assert.closeTo(distance_actual, distance_expected, 0.001)
      })
    })
    describe('boundary()', () => {
      it('should return geometry without inner rings', () => {
        const outerRing = new gdal.LinearRing()
        outerRing.points.add({ x: 0, y: 0 })
        outerRing.points.add({ x: 20, y: 0 })
        outerRing.points.add({ x: 20, y: 10 })
        outerRing.points.add({ x: 0, y: 10 })
        outerRing.closeRings()
        const innerRing = new gdal.LinearRing()
        innerRing.points.add({ x: 1, y: 9 })
        innerRing.points.add({ x: 19, y: 9 })
        innerRing.points.add({ x: 19, y: 1 })
        innerRing.points.add({ x: 1, y: 1 })
        innerRing.closeRings()

        const squareDonut = new gdal.Polygon()
        squareDonut.rings.add(outerRing)
        squareDonut.rings.add(innerRing)

        const boundary = squareDonut.boundary()
        assert.instanceOf(boundary, gdal.MultiLineString)
      })
    })
    describe('centroid()', () => {
      it('should return correct result', () => {
        const ring = new gdal.LinearRing()
        ring.points.add({ x: 0, y: 0 })
        ring.points.add({ x: 20, y: 0 })
        ring.points.add({ x: 20, y: 10 })
        ring.points.add({ x: 0, y: 10 })
        ring.closeRings()

        const square = new gdal.Polygon()
        square.rings.add(ring)

        const centroid = square.centroid()

        assert.instanceOf(centroid, gdal.Point)
        assert.closeTo(centroid.x, 10, 0.0001)
        assert.closeTo(centroid.y, 5, 0.0001)
      })
    })
    describe('buffer()', () => {
      it('should return correct result', () => {
        const point = new gdal.Point(0, 0)
        const circle = point.buffer(1, 1000)
        assert.instanceOf(circle, gdal.Polygon)
        assert.closeTo(circle.getArea(), 3.1415, 0.0001)
      })
    })
    describe('simplify()', () => {
      it('should return simplified LineString', () => {
        const line = new gdal.LineString()
        line.points.add(0, 0)
        line.points.add(1, 1)
        line.points.add(10, 10)
        line.points.add(2, 2)
        line.points.add(5, 5)

        const simplified = line.simplify(0.1)
        assert.instanceOf(simplified, gdal.LineString)
        assert.equal(simplified.points.count(), 4)
        assert.closeTo(simplified.points.get(0).x, 0, 0.001)
        assert.closeTo(simplified.points.get(0).y, 0, 0.001)
        assert.closeTo(simplified.points.get(1).x, 10, 0.001)
        assert.closeTo(simplified.points.get(1).y, 10, 0.001)
        assert.closeTo(simplified.points.get(2).x, 2, 0.001)
        assert.closeTo(simplified.points.get(2).y, 2, 0.001)
        assert.closeTo(simplified.points.get(3).x, 5, 0.001)
        assert.closeTo(simplified.points.get(3).y, 5, 0.001)
      })
    })
    describe('union()', () => {
      it('should merge geometries', () => {
        const ring1 = new gdal.LinearRing()
        ring1.points.add({ x: 0, y: 0 })
        ring1.points.add({ x: 10, y: 0 })
        ring1.points.add({ x: 10, y: 10 })
        ring1.points.add({ x: 0, y: 10 })
        ring1.closeRings()

        const square1 = new gdal.Polygon()
        square1.rings.add(ring1)

        const ring2 = new gdal.LinearRing()
        ring2.points.add({ x: 10, y: 0 })
        ring2.points.add({ x: 20, y: 0 })
        ring2.points.add({ x: 20, y: 10 })
        ring2.points.add({ x: 10, y: 10 })
        ring2.closeRings()

        const square2 = new gdal.Polygon()
        square2.rings.add(ring2)

        const result = square1.union(square2)
        assert.instanceOf(result, gdal.Polygon)
        assert.equal(result.getArea(), 200)
      })
    })
    describe('intersection()', () => {
      it('should return the intersection of two geometries', () => {
        const ring1 = new gdal.LinearRing()
        ring1.points.add({ x: 0, y: 0 })
        ring1.points.add({ x: 10, y: 0 })
        ring1.points.add({ x: 10, y: 10 })
        ring1.points.add({ x: 0, y: 10 })
        ring1.closeRings()

        const square1 = new gdal.Polygon()
        square1.rings.add(ring1)

        const ring2 = new gdal.LinearRing()
        ring2.points.add({ x: 5, y: 0 })
        ring2.points.add({ x: 20, y: 0 })
        ring2.points.add({ x: 20, y: 10 })
        ring2.points.add({ x: 5, y: 10 })
        ring2.closeRings()

        const square2 = new gdal.Polygon()
        square2.rings.add(ring2)

        const result = square1.intersection(square2)
        assert.instanceOf(result, gdal.Polygon)
        assert.equal(result.getArea(), 50)
      })
    })
  })
})
