const gdal = require('../lib/gdal.js')
const path = require('path')
const assert = require('chai').assert

describe('Open', () => {
  afterEach(gc)

  describe('vsigzip', () => {
    let filename, ds

    it('should not throw', () => {
      filename = path.join(__dirname, 'data/vsigzip/hp40ne.gz')
      ds = gdal.open(filename)
    })
    it('should be able to read layer count', () => {
      assert.equal(ds.layers.count(), 4)
    })

    describe('layer', () => {
      let layer
      before(() => {
        layer = ds.layers.get(0)
      })
      it('should have all fields defined', () => {
        assert.equal(layer.fields.count(), 8)
        assert.deepEqual(layer.fields.getNames(), [
          'fid',
          'featureCode',
          'featureDescription',
          'anchorPosition',
          'font',
          'height',
          'orientation',
          'textString'
        ])
      })
      let layer2
      before(() => {
        layer2 = ds.layers.get(1)
      })
      describe('field properties', () => {
        it('should evaluate datatypes', () => {
          assert.equal('string', layer2.fields.get(0).type)
          assert.equal('integer', layer2.fields.get(1).type)
          assert.equal('string', layer2.fields.get(2).type)
        })
      })
      describe('features', () => {
        it('should be readable', () => {
          assert.equal(layer2.features.count(), 381)
          // layer2.features.get(0); doesn't work, as there is no 'id', but 'fid' instead
          const feature = layer2.features.next()
          const fields = feature.fields.toObject()

          assert.deepEqual(fields, {
            fid: 'ID_105',
            featureCode: 15600,
            featureDescription: 'Water Feature'
          })
        })
      })
    })
  })
})
