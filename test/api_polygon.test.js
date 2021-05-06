const assert = require('chai').assert
const gdal = require('../lib/gdal.js')

describe('gdal.Polygon', () => {
  afterEach(gc)

  it('should be instantiable', () => {
    new gdal.Polygon()
  })
  it('should inherit from Geometry', () => {
    assert.instanceOf(new gdal.Polygon(), gdal.Polygon)
    assert.instanceOf(new gdal.Polygon(), gdal.Geometry)
  })
  describe('instance', () => {
    describe('"rings" property', () => {
      describe('get()', () => {
        it("should return null if ring doesn't exist", () => {
          const polygon = new gdal.Polygon()
          assert.isNull(polygon.rings.get(2))
        })
        it('should return LinearRing instance', () => {
          const polygon = new gdal.Polygon()
          const ring = new gdal.LinearRing()
          ring.points.add(0, 0, 0)
          ring.points.add(10, 0, 0)
          ring.points.add(10, 10, 0)
          ring.points.add(0, 10, 0)
          ring.points.add(0, 0, 0)
          polygon.rings.add(ring)
          assert.instanceOf(polygon.rings.get(0), gdal.LinearRing)
        })
      })
      describe('count()', () => {
        it('should return ring count', () => {
          const polygon = new gdal.Polygon()
          assert.equal(polygon.rings.count(), 0)

          const ring = new gdal.LinearRing()
          ring.points.add(0, 0, 0)
          ring.points.add(10, 0, 0)
          ring.points.add(10, 10, 0)
          ring.points.add(0, 10, 0)
          ring.points.add(0, 0, 0)
          polygon.rings.add(ring)
          assert.equal(polygon.rings.count(), 1)
        })
      })
      describe('add()', () => {
        const ring1 = new gdal.LinearRing()
        ring1.points.add(0, 0, 0)
        ring1.points.add(10, 0, 0)
        ring1.points.add(10, 11, 0)
        ring1.points.add(0, 10, 0)
        ring1.points.add(0, 0, 0)
        it('should add a ring', () => {
          const polygon = new gdal.Polygon()
          polygon.rings.add(ring1)
          const ring_result = polygon.rings.get(0)
          assert.instanceOf(ring_result, gdal.LinearRing)
          assert.equal(ring_result.points.get(2).y, 11)
        })
        it('should accept multiple LinearRing instances', () => {
          const ring2 = new gdal.LinearRing()
          ring2.points.add(1, 0, 0)
          ring2.points.add(11, 0, 0)
          ring2.points.add(11, 11, 0)
          ring2.points.add(1, 10, 0)
          ring2.points.add(1, 0, 0)

          const polygon = new gdal.Polygon()
          polygon.rings.add([ ring1, ring2 ])
          assert.equal(polygon.rings.count(), 2)
        })
        it('should reject invalid geometries', () => {
          const polygon = new gdal.Polygon()
          polygon.rings.add(ring1)
          const ring2 = new gdal.LineString()
          assert.throws(() => {
            polygon.rings.add(ring2)
          }, /must be a LinearRing/)
        })
      })
      let polygon
      const createRings = () => {
        const ring1 = new gdal.LinearRing()
        ring1.points.add(0, 0, 0)
        ring1.points.add(10, 0, 0)
        ring1.points.add(10, 11, 0)
        ring1.points.add(0, 10, 0)
        ring1.points.add(0, 0, 0)
        const ring2 = new gdal.LinearRing()
        ring2.points.add(1, 0, 0)
        ring2.points.add(11, 0, 0)
        ring2.points.add(11, 11, 0)
        ring2.points.add(1, 10, 0)
        ring2.points.add(1, 0, 0)
        const ring3 = new gdal.LinearRing()
        ring3.points.add(2, 0, 0)
        ring3.points.add(20, 0, 0)
        ring3.points.add(20, 11, 0)
        ring3.points.add(3, 10, 0)
        ring3.points.add(3, 0, 0)

        polygon = new gdal.Polygon()
        polygon.rings.add([ ring1, ring2, ring3 ])
      }
      const original = [
        [
          '{ "type": "Point", "coordinates": [ 0.0, 0.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 10.0, 0.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 10.0, 11.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 0.0, 10.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 0.0, 0.0, 0.0 ] }'
        ],
        [
          '{ "type": "Point", "coordinates": [ 1.0, 0.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 11.0, 0.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 11.0, 11.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 1.0, 10.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 1.0, 0.0, 0.0 ] }'
        ],
        [
          '{ "type": "Point", "coordinates": [ 2.0, 0.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 20.0, 0.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 20.0, 11.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 3.0, 10.0, 0.0 ] }',
          '{ "type": "Point", "coordinates": [ 3.0, 0.0, 0.0 ] }'
        ]
      ]
      describe('forEach()', () => {
        before(createRings)
        it('should stop if callback returns false', () => {
          let count = 0
          polygon.rings.forEach((pt, i) => {
            count++
            assert.isNumber(i)
            if (i === 1) return false
          })
          assert.equal(count, 2)
        })
        it('should iterate through all points', () => {
          const result = []
          polygon.rings.forEach((ring) => {
            result.push(ring.points.toArray().map((pt) => pt.toJSON()))
          })

          assert.deepEqual(result, original)
        })
      })
      describe('map()', () => {
        it('should operate normally', () => {
          const polygon = new gdal.Polygon()
          const ring = new gdal.LinearRing()
          ring.points.add(0, 0, 0)
          ring.points.add(10, 0, 0)
          ring.points.add(10, 10, 0)
          ring.points.add(0, 11, 0)
          ring.points.add(0, 0, 0)
          polygon.rings.add(ring)

          const result = polygon.rings.map((ring, i) => {
            assert.isNumber(i)
            assert.instanceOf(ring, gdal.LinearRing)
            return 'a'
          })

          assert.isArray(result)
          assert.lengthOf(result, 1)
          assert.equal(result[0], 'a')
        })
      })
      describe('@@iterator()', () => {
        before(createRings)
        it('should iterate through all points', () => {
          const result = []
          for (const ring of polygon.rings) {
            result.push(ring.points.toArray().map((pt) => pt.toJSON()))
          }

          assert.deepEqual(result, original)
        })
      })
      describe('toArray()', () => {
        it('should return array of LinearRing instances', () => {
          const polygon = new gdal.Polygon()
          const ring = new gdal.LinearRing()
          ring.points.add(0, 0, 0)
          ring.points.add(10, 0, 0)
          ring.points.add(10, 10, 0)
          ring.points.add(0, 11, 0)
          ring.points.add(0, 0, 0)
          polygon.rings.add(ring)
          const array = polygon.rings.toArray()
          assert.isArray(array)
          assert.lengthOf(array, 1)
          assert.instanceOf(array[0], gdal.LinearRing)
          assert.equal(array[0].points.get(3).y, 11)
        })
      })
    })
    describe('getArea()', () => {
      it('should return area', () => {
        const polygon = new gdal.Polygon()
        const ring = new gdal.LinearRing()
        ring.points.add(0, 0, 0)
        ring.points.add(10, 0, 0)
        ring.points.add(10, 10, 0)
        ring.points.add(0, 10, 0)
        ring.points.add(0, 0, 0)
        polygon.rings.add(ring)
        assert.closeTo(ring.getArea(), 100, 0.001)
      })
    })
  })
})
