const gdal = require('../lib/gdal.js')
const assert = require('chai').assert

describe('gdal.Feature', () => {
  afterEach(gc)

  let ds, lyr, defn, fields
  before(() => {
    ds = gdal.open('', 'w', 'Memory')
    lyr = ds.layers.create('', null, gdal.Point)
    fields = [
      new gdal.FieldDefn('id', gdal.OFTInteger),
      new gdal.FieldDefn('name', gdal.OFTString),
      new gdal.FieldDefn('value', gdal.OFTReal)
    ]
    defn = new gdal.FeatureDefn()
    defn.fields.add(fields)
    lyr.fields.add(fields)
  })

  describe('constructor', () => {
    describe('w/Layer', () => {
      it('should create instance', () => {
        new gdal.Feature(lyr)
      })
      it('instance should use fields from LayerDefn', () => {
        const feature = new gdal.Feature(lyr)
        assert.deepEqual(feature.fields.getNames(), lyr.fields.getNames())
      })
      it('should throw error if layer is destroyed', () => {
        const ds = gdal.open('', 'w', 'Memory')
        const lyr = ds.layers.create('', null, gdal.Point)
        lyr.fields.add(fields)
        ds.close()
        assert.throws(() => {
          new gdal.Feature(lyr)
        })
      })
      it('should not throw error if layer is destroyed after feature is created', () => {
        const ds = gdal.open('', 'w', 'Memory')
        const lyr = ds.layers.create('', null, gdal.Point)
        lyr.fields.add(fields)
        const feature = new gdal.Feature(lyr)
        ds.close()
        assert.doesNotThrow(() => {
          feature.defn.fields.getNames()
        })
      })
    })
    describe('w/FeatureDefn', () => {
      it('should create instance', () => {
        new gdal.Feature(defn)
      })
      it('instance should use fields from FeatureDefn', () => {
        const feature = new gdal.Feature(defn)
        assert.deepEqual(feature.fields.getNames(), defn.fields.getNames())
      })
    })
  })

  describe('instance', () => {
    describe('"fid" property', () => {
      describe('getter', () => {
        it('should return integer', () => {
          const feature = new gdal.Feature(defn)
          assert.equal(feature.fid, -1)
        })
      })
      describe('setter', () => {
        it('should set fid', () => {
          const feature = new gdal.Feature(defn)
          feature.fid = 5
          assert.equal(feature.fid, 5)
        })
      })
    })

    describe('"defn" property', () => {
      describe('getter', () => {
        it('should return FeatureDefn', () => {
          const feature = new gdal.Feature(defn)
          assert.instanceOf(feature.defn, gdal.FeatureDefn)
        })
      })
      describe('setter', () => {
        it('should throw error', () => {
          const feature = new gdal.Feature(defn)
          assert.throws(() => {
            feature.defn = null
          })
        })
      })
    })

    describe('"fields" property', () => {
      describe('getter', () => {
        it('should return FeatureFields', () => {
          const feature = new gdal.Feature(defn)
          assert.instanceOf(feature.fields, gdal.FeatureFields)
        })
      })
      describe('setter', () => {
        it('should throw error', () => {
          const feature = new gdal.Feature(defn)
          assert.throws(() => {
            feature.fields = null
          }, /fields is a read-only property/)
        })
      })
      describe('count()', () => {
        it('should return an integer', () => {
          const feature = new gdal.Feature(defn)
          assert.equal(feature.fields.count(), 3)
        })
      })
      describe('set()', () => {
        describe('w/id argument', () => {
          it('should properly set values', () => {
            const feature = new gdal.Feature(defn)

            feature.fields.set(0, 5)
            feature.fields.set(1, 'test')
            feature.fields.set(2, 3.14)

            assert.equal(feature.fields.get(0), 5)
            assert.equal(feature.fields.get(1), 'test')
            assert.closeTo(feature.fields.get(2), 3.14, 0.0001)
          })
          it('should unset field if value is null', () => {
            const feature = new gdal.Feature(defn)
            feature.fields.set(1, 'test')
            feature.fields.set(1, null)
            assert.isNull(feature.fields.get(1))
          })
          it('should throw an error if id is out of range', () => {
            const feature = new gdal.Feature(defn)
            assert.throws(() => {
              feature.fields.set(100, 'test')
            })
          })
        })
        describe('w/name argument', () => {
          it('should properly set values', () => {
            const feature = new gdal.Feature(defn)

            feature.fields.set('id', 5)
            feature.fields.set('name', 'test')
            feature.fields.set('value', 3.14)

            assert.equal(feature.fields.get('id'), 5)
            assert.equal(feature.fields.get('name'), 'test')
            assert.closeTo(feature.fields.get('value'), 3.14, 0.0001)
          })
          it('should unset field if value is null', () => {
            const feature = new gdal.Feature(defn)
            feature.fields.set('name', 'test')
            feature.fields.set('name', null)
            assert.isNull(feature.fields.get('name'))
          })
          it('should throw an error if field name does not exist', () => {
            const feature = new gdal.Feature(defn)
            assert.throws(() => {
              feature.fields.set('bogus', 'test')
            })
          })
        })
        describe('w/array argument', () => {
          it('should properly set all fields', () => {
            const feature = new gdal.Feature(defn)
            feature.fields.set([ 5, 'test', 3.14 ])
            assert.equal(feature.fields.get(0), 5)
            assert.equal(feature.fields.get(1), 'test')
            assert.closeTo(feature.fields.get(2), 3.14, 0.0001)
          })
        })
        describe('w/object argument', () => {
          it('should properly set all fields', () => {
            const feature = new gdal.Feature(defn)
            feature.fields.set({ id: 5, name: 'test', value: 3.14 })
            assert.equal(feature.fields.get(0), 5)
            assert.equal(feature.fields.get(1), 'test')
            assert.closeTo(feature.fields.get(2), 3.14, 0.0001)
          })
        })
      })
      describe('get()', () => {
        describe('w/id argument', () => {
          it('should properly get values', () => {
            const feature = new gdal.Feature(defn)

            feature.fields.set(0, 5)
            feature.fields.set(1, 'test')
            feature.fields.set(2, 3.14)

            assert.equal(feature.fields.get(0), 5)
            assert.equal(feature.fields.get(1), 'test')
            assert.closeTo(feature.fields.get(2), 3.14, 0.0001)
          })
          it('should return unset fields as null', () => {
            const feature = new gdal.Feature(defn)

            assert.isNull(feature.fields.get(0))
            assert.isNull(feature.fields.get(1))
            assert.isNull(feature.fields.get(2))
          })
          it('should throw an error if id out of range', () => {
            const feature = new gdal.Feature(defn)
            assert.throws(() => {
              feature.fields.get(100)
            })
          })
        })
        describe('w/name argument', () => {
          it('should properly get/set values', () => {
            const feature = new gdal.Feature(defn)

            feature.fields.set('id', 5)
            feature.fields.set('name', 'test')
            feature.fields.set('value', 3.14)

            assert.equal(feature.fields.get('id'), 5)
            assert.equal(feature.fields.get('name'), 'test')
            assert.closeTo(feature.fields.get('value'), 3.14, 0.0001)
          })
          it('should return unset fields as null', () => {
            const feature = new gdal.Feature(defn)

            assert.isNull(feature.fields.get('id'))
            assert.isNull(feature.fields.get('name'))
            assert.isNull(feature.fields.get('value'))
          })
          it('should throw an error if field name doesnt exist', () => {
            const feature = new gdal.Feature(defn)
            assert.throws(() => {
              feature.fields.get('bogus')
            })
          })
        })
      })
      describe('toObject()', () => {
        it('should return the fields as a JSON object', () => {
          const feature = new gdal.Feature(defn)
          feature.fields.set([ 5, 'test', 3.14 ])
          const obj = feature.fields.toObject()
          assert.equal(obj.id, 5)
          assert.equal(obj.name, 'test')
          assert.closeTo(obj.value, 3.14, 0.0001)
        })
      })
      describe('toJSON()', () => {
        it('should return the fields as a stringified JSON object', () => {
          const feature = new gdal.Feature(defn)
          feature.fields.set([ 5, 'test', 3.14 ])
          const obj = JSON.parse(feature.fields.toJSON())
          assert.equal(obj.id, 5)
          assert.equal(obj.name, 'test')
          assert.closeTo(obj.value, 3.14, 0.0001)
        })
      })
      describe('toArray()', () => {
        it('should return an array of field values', () => {
          const feature = new gdal.Feature(defn)
          feature.fields.set([ 5, 'test', 3.14 ])
          const array = feature.fields.toArray()
          assert.equal(array[0], 5)
          assert.equal(array[1], 'test')
          assert.closeTo(array[2], 3.14, 0.0001)
        })
      })
      describe('forEach()', () => {
        it('should return pass each value and key to callback', () => {
          const feature = new gdal.Feature(defn)
          const expected_keys = [ 'id', 'name', 'value' ]
          const expected_values = [ 5, 'test', 3.14 ]
          const values = []
          const keys = []
          feature.fields.set(expected_values)
          feature.fields.forEach((value, key) => {
            values.push(value)
            keys.push(key)
          })
          assert.equal(keys.length, 3)
          assert.deepEqual(keys, expected_keys)
          assert.equal(values[0], expected_values[0])
          assert.equal(values[1], expected_values[1])
          assert.closeTo(values[2], expected_values[2], 0.0001)
        })
      })
      describe('getNames()', () => {
        it('should return an array of field names', () => {
          const feature = new gdal.Feature(defn)
          const expected_names = [ 'id', 'name', 'value' ]
          assert.deepEqual(feature.fields.getNames(), expected_names)
        })
      })
      describe('indexOf()', () => {
        it('should return index of field name', () => {
          const feature = new gdal.Feature(defn)
          assert.equal(feature.fields.indexOf('name'), 1)
        })
      })
      describe('reset()', () => {
        describe('w/no argument', () => {
          it('should reset all fields to null', () => {
            const feature = new gdal.Feature(defn)
            feature.fields.set([ 5, 'test', 3.14 ])
            feature.fields.reset()
            assert.isNull(feature.fields.get(0))
            assert.isNull(feature.fields.get(1))
            assert.isNull(feature.fields.get(2))
          })
        })
        describe('w/object argument', () => {
          it('should set fields from object and reset others', () => {
            const feature = new gdal.Feature(defn)
            feature.fields.set([ 5, 'test', 3.14 ])
            feature.fields.reset({ name: 'reset' })
            assert.isNull(feature.fields.get(0))
            assert.equal(feature.fields.get(1), 'reset')
            assert.isNull(feature.fields.get(2))
          })
        })
      })
    })

    describe('clone()', () => {
      it('should return new Feature', () => {
        const feature = new gdal.Feature(defn)
        const clone = feature.clone()
        assert.instanceOf(clone, gdal.Feature)
        assert.notEqual(clone, feature)
      })
    })
    describe('setGeometry()', () => {
      it('should set geometry', () => {
        const feature = new gdal.Feature(defn)
        feature.setGeometry(new gdal.Point(5, 10))
        const pt = feature.getGeometry()
        assert.equal(pt.x, 5)
        assert.equal(pt.y, 10)
      })
      it('should clear geometry if null is passed', () => {
        const feature = new gdal.Feature(defn)
        feature.setGeometry(new gdal.Point(5, 10))
        feature.setGeometry(null)
        assert.isNull(feature.getGeometry())
      })
      it('should clear geometry if undefined is passed', () => {
        const feature = new gdal.Feature(defn)
        feature.setGeometry(new gdal.Point(5, 10))
        feature.setGeometry(undefined)
        assert.isNull(feature.getGeometry())
      })
      /*
			// http://gdal.org/1.11/ogr/classOGRFeature.html#af1181ade837a52129ea25b46dd50cf30
			// "checking for geometry type not yet implemented"
			it('should throw error if wrong geometry type', function(){
				var feature = new gdal.Feature(defn);
				assert.throws(function(){
					feature.setGeometry(new gdal.LineString());
				});
			});
			*/
    })
    describe('getGeometry()', () => {
      it('should get geometry', () => {
        const feature = new gdal.Feature(defn)
        feature.setGeometry(new gdal.Point(5, 10))
        const pt = feature.getGeometry()
        assert.equal(pt.x, 5)
        assert.equal(pt.y, 10)
      })
      it('should return null if geometry is not set', () => {
        const feature = new gdal.Feature(defn)
        const geom = feature.getGeometry()
        assert.isNull(geom)
      })
    })
    describe('setFrom()', () => {
      it('should set fields and geometry from other feature', () => {
        const feature1 = new gdal.Feature(defn)
        const feature2 = new gdal.Feature(defn)
        feature1.setGeometry(new gdal.Point(5, 10))
        feature1.fields.set([ 5, 'test', 3.14 ])
        feature2.setFrom(feature1)

        const pt = feature2.getGeometry()
        assert.equal(pt.x, 5)
        assert.equal(pt.y, 10)
        assert.equal(feature2.fields.get(0), 5)
        assert.equal(feature2.fields.get(1), 'test')
        assert.closeTo(feature2.fields.get(2), 3.14, 0.0001)
      })
    })
  })
})
