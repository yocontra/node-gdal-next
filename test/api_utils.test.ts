import * as gdal from '..'
import * as chaiAsPromised from 'chai-as-promised'
import * as chai from 'chai'
const assert = chai.assert
chai.use(chaiAsPromised)
import * as path from 'path'
import * as semver from 'semver'

describe('gdal_utils', () => {
  afterEach(global.gc)

  describe('translate', () => {
    it('should be equivalent to gdal_translate', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'multiband.tif'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.tif`
      const out = gdal.translate(tmpFile, ds, [ '-b', '1' ])
      assert.equal(out.bands.count(), 1)
      out.close()
      gdal.vsimem.release(tmpFile)
    })
    it('should be callable w/o options', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'multiband.tif'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.tif`
      const out = gdal.translate(tmpFile, ds)
      assert.equal(out.bands.count(), 3)
      out.close()
      gdal.vsimem.release(tmpFile)
    })
    it('should support progress callbacks', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'multiband.tif'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.tif`
      let calls = 0
      const out = gdal.translate(tmpFile, ds, [ '-b', '1' ], { progress_cb: () => calls++ })
      assert.isAbove(calls, 0)
      out.close()
      gdal.vsimem.release(tmpFile)
    })
    it('should throw on error', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'multiband.tif'))
      ds.close()
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.tif`
      assert.throws(() => {
        gdal.translate(tmpFile, ds)
      })
    })
  })

  describe('translateAsync', () => {
    it('should be equivalent to gdal_translate', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'multiband.tif'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.tif`
      return assert.isFulfilled(gdal.translateAsync(tmpFile, ds, [ '-b', '1' ])
        .then((out) => {
          assert.equal(out.bands.count(), 1)
          out.close()
          gdal.vsimem.release(tmpFile)
        })
      )
    })
    it('should be callable w/o options', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'multiband.tif'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.tif`
      return assert.isFulfilled(gdal.translateAsync(tmpFile, ds,)
        .then((out) => {
          assert.equal(out.bands.count(), 3)
          out.close()
          gdal.vsimem.release(tmpFile)
        })
      )
    })
    it('should reject when the dataset is already closed', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'multiband.tif'))
      ds.close()
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.tif`
      return assert.isRejected(gdal.translateAsync(tmpFile, ds), /already been destroyed/)
    })
    it('should reject on error', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'multiband.tif'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.tif`
      return assert.isRejected(gdal.translateAsync(tmpFile, ds, [ '-of', 'nosuchformat' ]), /not recognised/)
    })
  })

  describe('vectorTranslate', () => {
    if (semver.gte(gdal.version, '3.0.0')) {
      it('should accept a destination filename', () => {
        const ds = gdal.open(path.resolve(__dirname, 'data', 'park.geo.json'))
        const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`

        const out = gdal.vectorTranslate(tmpFile, ds, [ '-of', 'GPKG' ])

        assert.equal(out.layers.get(0).features.first().fields.get('kind'), 'county')
        out.close()
        gdal.vsimem.release(tmpFile)
      })
    }
    it('should accept a destination dataset', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'park.geo.json'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`
      const tmpDS = gdal.open(tmpFile, 'w', 'GPKG')

      const out = gdal.vectorTranslate(tmpDS, ds, [ '-of', 'GPKG' ])
      assert.strictEqual(out, tmpDS)

      assert.equal(out.layers.get(0).features.first().fields.get('kind'), 'county')
      assert.equal(out.driver.description, 'GPKG')
      out.close()
      gdal.vsimem.release(tmpFile)
    })
    it('should support progress callbacks', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'park.geo.json'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`
      const tmpDS = gdal.open(tmpFile, 'w', 'GPKG')

      let calls = 0
      const out = gdal.vectorTranslate(tmpDS, ds, [ '-of', 'GPKG' ], { progress_cb: () => calls++ })
      assert.isAbove(calls, 0)

      out.close()
      gdal.vsimem.release(tmpFile)
    })
    it('should throw on error', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'park.geo.json'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`

      assert.throws(() => {
        gdal.vectorTranslate(tmpFile, ds, [ '-f', 'nosuchformat' ])
      }, /nosuchformat/)
    })
  })

  describe('vectorTranslateAsync', () => {
    if (semver.gte(gdal.version, '3.0.0')) {
      it('should accept a destination filename', () => {
        const ds = gdal.open(path.resolve(__dirname, 'data', 'park.geo.json'))
        const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`

        return assert.isFulfilled(gdal.vectorTranslateAsync(tmpFile, ds, [ '-of', 'GPKG' ])
          .then((out) => {
            assert.equal(out.layers.get(0).features.first().fields.get('kind'), 'county')
            out.close()
            gdal.vsimem.release(tmpFile)
          })
        )
      })
    }
    it('should accept a destination dataset', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'park.geo.json'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`
      const tmpDS = gdal.open(tmpFile, 'w', 'GPKG')

      return assert.isFulfilled(gdal.vectorTranslateAsync(tmpDS, ds, [ '-of', 'GPKG' ])
        .then((out) => {
          assert.equal(out.layers.get(0).features.first().fields.get('kind'), 'county')
          assert.strictEqual(out, tmpDS)
          out.close()
          gdal.vsimem.release(tmpFile)
        })
      )
    })
    it('should reject on error', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'park.geo.json'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`

      return assert.isRejected(gdal.vectorTranslateAsync(tmpFile, ds, [ '-f', 'nosuchformat' ]), /nosuchformat/)
    })
    it('should reject when the dataset is already destroyed', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'park.geo.json'))
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`
      ds.close()

      return assert.isRejected(gdal.vectorTranslateAsync(tmpFile, ds), /already been destroyed/)
    })
  })

  describe('info', () => {
    it('should be equivalent to gdalinfo', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))
      const out = JSON.parse(gdal.info(ds, [ '-json' ]))
      assert.equal(out.bands[0].type, 'Byte')
    })
    it('should be callable w/o options', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))
      assert.isString(gdal.info(ds))
    })
    it('should throw on error', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))
      ds.close()
      assert.throws(() => {
        gdal.info(ds)
      }, /already been destroyed/)
    })
  })

  describe('infoAsync', () => {
    it('should be equivalent to gdalinfo', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))
      return assert.isFulfilled(gdal.infoAsync(ds, [ '-json' ])
        .then((out) => JSON.parse(out))
        .then((json) => {
          assert.equal(json.bands[0].type, 'Byte')
        })
      )
    })
    it('should reject on error', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))
      ds.close()
      return assert.isRejected(gdal.infoAsync(ds), /already been destroyed/)
    })
  })

  describe('warp', () => {
    it('should be equivalent to gdalwarp', () => {
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))

      let out = gdal.warp(tmpFile, null, [ ds ], [ '-t_srs', 'epsg:3587' ])

      assert.isTrue(out.srs.isSame(gdal.SpatialReference.fromEPSG(3587)))
      out.close()

      out = gdal.open(tmpFile)
      assert.isTrue(out.srs.isSame(gdal.SpatialReference.fromEPSG(3587)))
      out.close()

      gdal.vsimem.release(tmpFile)
    })
    it('should accept a target dataset', () => {
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`
      const src_ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))
      const dst_ds = gdal.open(tmpFile, 'w', 'GTiff', src_ds.rasterSize.x, src_ds.rasterSize.y, 1, gdal.GDT_CFloat64)
      dst_ds.srs = gdal.SpatialReference.fromEPSG(3587)
      dst_ds.geoTransform = [
        3968863.6398134492,
        7.510187636375825,
        0,
        469467.09900118795,
        0,
        -7.510187636375825
      ]

      const out = gdal.warp(null, dst_ds, [ src_ds ])
      assert.strictEqual(dst_ds, out)
      assert.isTrue(dst_ds.srs.isSame(gdal.SpatialReference.fromEPSG(3587)))
      out.close()

      gdal.vsimem.release(tmpFile)
    })
    it('should support progress callbacks', () => {
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))

      let calls = 0
      const out = gdal.warp(tmpFile, null, [ ds ], [ '-t_srs', 'epsg:3587' ], { progress_cb: () => calls++ })
      assert.isAbove(calls, 0)

      out.close()
      gdal.vsimem.release(tmpFile)
    })
    it('should throw without destination', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))
      assert.throws(() => {
        gdal.warp(null, null, [ ds ], [ '-t_srs', 'epsg:3587' ])
      }, /must be given/)
    })
    it('should throw without src datasets', () => {
      assert.throws(() => {
        gdal.warp('/vsimem/out.tif', null, [])
      }, /at least one/)
    })
    it('should throw if the source has been closed', () => {
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))
      ds.close()
      assert.throws(() => {
        gdal.warp('/vsimem/out.tif', null, [ ds ])
      }, /already been destroyed/)
    })
  })

  describe('warpAsync', () => {
    it('should be equivalent to gdalwarp', () => {
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))

      const out = gdal.warpAsync(tmpFile, null, [ ds ], [ '-t_srs', 'epsg:3587' ])

      return assert.isFulfilled(out.then((out_ds) => {
        assert.isTrue(out_ds.srs.isSame(gdal.SpatialReference.fromEPSG(3587)))
        out_ds.close()

        out_ds = gdal.open(tmpFile)
        assert.isTrue(out_ds.srs.isSame(gdal.SpatialReference.fromEPSG(3587)))
        out_ds.close()

        gdal.vsimem.release(tmpFile)
      }))
    })
    it('should reject on error', () => {
      const tmpFile = `/vsimem/${String(Math.random()).substring(2)}.gpkg`
      const ds = gdal.open(path.resolve(__dirname, 'data', 'sample.tif'))
      ds.close()
      return assert.isRejected(gdal.warpAsync(tmpFile, null, [ ds ], [ '-t_srs', 'epsg:3587' ]))
    })
  })
})
