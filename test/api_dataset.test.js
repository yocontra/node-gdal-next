const fs = require('fs')
const gdal = require('../lib/gdal.js')
const path = require('path')
const assert = require('chai').assert
const fileUtils = require('./utils/file.js')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const NAD83_WKT =
  'PROJCS["NAD_1983_UTM_Zone_10N",' +
  'GEOGCS["GCS_North_American_1983",' +
  'DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137,298.257222101]],' +
  'PRIMEM["Greenwich",0],UNIT["Degree",0.0174532925199433]],' +
  'PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],' +
  'PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-123.0],' +
  'PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_of_Origin",0.0],' +
  'UNIT["Meter",1.0]]'

describe('gdal.Dataset', () => {
  afterEach(gc)

  let ds
  before(() => {
    ds = gdal.open(`${__dirname}/data/dem_azimuth50_pa.img`)
  })
  it('should be exposed', () => {
    assert.ok(gdal.Dataset)
  })
  it('should not be instantiable', () => {
    assert.throws(() => {
      new gdal.Dataset()
    }, /Cannot create dataset directly/)
  })

  describe('instance', () => {
    describe('"bands" property', () => {
      it('should exist', () => {
        assert.instanceOf(ds.bands, gdal.DatasetBands)
      })
      describe('count()', () => {
        it('should return number', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          assert.equal(ds.bands.count(), 1)
        })
        it('should be 0 for vector datasets', () => {
          const arr = []
          for (let i = 0; i < 10000; i++) arr.push(i)
          console.log('before')
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          console.log('after')
          assert.equal(ds.bands.count(), 0)
        })
        it('should throw if dataset is closed', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          ds.close()
          assert.throws(() => {
            ds.bands.count()
          })
        })
      })
      describe('countAsync()', () => {
        it('should return number', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          assert.becomes(ds.bands.countAsync(), 1)
        })
        it('should be 0 for vector datasets', () => {
          const arr = []
          for (let i = 0; i < 10000; i++) arr.push(i)
          console.log('before')
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          console.log('after')
          assert.becomes(ds.bands.countAsync(), 0)
        })
        it('should throw if dataset is closed', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          ds.close()
          assert.isRejected(ds.bands.countAsync())
        })
      })
      describe('get()', () => {
        it('should return RasterBand', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          assert.instanceOf(ds.bands.get(1), gdal.RasterBand)
        })
        it('should return null if band id is out of range', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          assert.isNull(ds.bands.get(0))
        })
        it('should throw if dataset is closed', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          ds.close()
          assert.throws(() => {
            ds.bands.get(1)
          })
        })
      })
      describe('getAsync()', () => {
        it('should return RasterBand', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          const p = ds.bands.getAsync(1)
          return assert.eventually.instanceOf(p, gdal.RasterBand)
        })
        it('should return null if band id is out of range', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          return assert.eventually.isNull(ds.bands.getAsync(0))
        })
        it('should throw if dataset is closed', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          ds.close()
          return assert.isRejected(ds.bands.getAsync(1))
        })
      })
      describe('forEach()', () => {
        it('should call callback for each RasterBand', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          const expected_ids = [ 1 ]
          const ids = []
          ds.bands.forEach((band, i) => {
            assert.isNumber(i)
            assert.isTrue(i > 0)
            assert.instanceOf(band, gdal.RasterBand)
            ids.push(band.id)
          })
          assert.deepEqual(ids, expected_ids)
        })
        it('should throw if dataset is closed', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          ds.close()
          assert.throws(() => {
            ds.bands.forEach(() => {})
          })
        })
      })
      describe('@@iterator', () => {
        it('should iterate over all values', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          const expected_ids = [ 1 ]
          const ids = []
          for (const band of ds.bands) {
            assert.instanceOf(band, gdal.RasterBand)
            ids.push(band.id)
          }
          assert.deepEqual(ids, expected_ids)
        })
        it('should throw if dataset is closed', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          ds.close()
          assert.throws(() => {
            for (const band of ds.bands) band
          })
        })
      })
      describe('map()', () => {
        it('should operate normally', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          const result = ds.bands.map((band, i) => {
            assert.isNumber(i)
            assert.instanceOf(band, gdal.RasterBand)
            return 'a'
          })

          assert.isArray(result)
          assert.equal(result[0], 'a')
          assert.equal(result.length, ds.bands.count())
        })
      })
    })
    describe('"layers" property', () => {
      it('should exist', () => {
        assert.instanceOf(ds.layers, gdal.DatasetLayers)
      })
      describe('count()', () => {
        it('should return number', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          assert.equal(ds.layers.count(), 1)
        })
        it('should be 0 for raster datasets', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          assert.equal(ds.layers.count(), 0)
        })
        it('should throw if dataset is closed', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          ds.close()
          assert.throws(() => {
            ds.layers.count()
          })
        })
      })
      describe('countAsync()', () => {
        it('should return number', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          return assert.eventually.equal(ds.layers.countAsync(), 1)
        })
        it('should be 0 for raster datasets', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          return assert.eventually.equal(ds.layers.countAsync(), 0)
        })
        it('should throw if dataset is closed', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          ds.close()
          return assert.isRejected(ds.layers.countAsync())
        })
      })
      describe('get()', () => {
        describe('w/id argument', () => {
          it('should return Layer', () => {
            const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
            assert.instanceOf(ds.layers.get(0), gdal.Layer)
          })
          it('should return null if layer id is out of range', () => {
            const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
            assert.isNull(ds.layers.get(5))
          })
          it('should throw if dataset is closed', () => {
            const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
            ds.close()
            assert.throws(() => {
              ds.layers.get(0)
            })
          })
        })
        describe('w/name argument', () => {
          it('should return Layer', () => {
            const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
            assert.instanceOf(ds.layers.get('sample'), gdal.Layer)
          })
          it('should return null if layer name doesnt exist', () => {
            const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
            assert.isNull(ds.layers.get('bogus'))
          })
          it('should throw if dataset is closed', () => {
            const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
            ds.close()
            assert.throws(() => {
              ds.layers.get('sample')
            })
          })
        })
      })
      describe('getAsync()', () => {
        describe('w/id argument', () => {
          it('should return Layer', () => {
            const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
            return assert.eventually.instanceOf(ds.layers.getAsync(0), gdal.Layer)
          })
        })
        describe('w/name argument', () => {
          it('should return Layer', () => {
            const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
            return assert.eventually.instanceOf(ds.layers.getAsync('sample'), gdal.Layer)
          })
        })
      })
      describe('forEach()', () => {
        it('should call callback for each Layer', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          const expected_names = [ 'sample' ]
          const names = []
          ds.layers.forEach((layer, i) => {
            assert.isNumber(i)
            assert.instanceOf(layer, gdal.Layer)
            names.push(layer.name)
          })
          assert.deepEqual(names, expected_names)
        })
        it('should throw if dataset is closed', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          ds.close()
          assert.throws(() => {
            ds.layers.forEach(() => {})
          })
        })
      })
      describe('map()', () => {
        it('should operate normally', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          const result = ds.layers.map((layer, i) => {
            assert.isNumber(i)
            assert.instanceOf(layer, gdal.Layer)
            return 'a'
          })

          assert.isArray(result)
          assert.equal(result[0], 'a')
          assert.equal(result.length, ds.layers.count())
        })
      })
      describe('create()', () => {
        it('should return Layer', () => {
          const file = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}.tmp.shp`
          const ds = gdal.open(file, 'w', 'ESRI Shapefile')
          const srs = gdal.SpatialReference.fromEPSG(4326)
          const lyr = ds.layers.create('layer_name', srs, gdal.wkbPoint)
          assert.instanceOf(lyr, gdal.Layer)
          assert.equal(lyr.geomType, gdal.wkbPoint)
        })
        it('should set spatial reference of created layer', () => {
          const file = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}.tmp.shp`
          const ds = gdal.open(file, 'w', 'ESRI Shapefile')
          const srs = gdal.SpatialReference.fromEPSG(4326)
          const lyr = ds.layers.create('layer_name', srs, gdal.wkbPoint)
          assert.instanceOf(lyr.srs, gdal.SpatialReference)
        })
        it('should accept null for srs', () => {
          const file = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}.tmp.shp`
          const ds = gdal.open(file, 'w', 'ESRI Shapefile')
          const lyr = ds.layers.create('layer_name', null, gdal.wkbPoint)
          assert.instanceOf(lyr, gdal.Layer)
        })
        it('should accept Geometry constructor for geom_type', () => {
          const file = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}.tmp.shp`
          const ds = gdal.open(file, 'w', 'ESRI Shapefile')
          const lyr = ds.layers.create('layer_name', null, gdal.Point)
          assert.instanceOf(lyr, gdal.Layer)
          assert.equal(lyr.geomType, gdal.wkbPoint)
        })
        it('should accept 2.5D Types for geom_type', () => {
          let file = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}.tmp.shp`
          let ds = gdal.open(file, 'w', 'ESRI Shapefile')
          let lyr = ds.layers.create('layer_name', null, gdal.wkbPoint25D)
          assert.instanceOf(lyr, gdal.Layer)
          assert.equal(lyr.geomType, gdal.wkbPoint25D)

          file = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}.tmp.shp`
          ds = gdal.open(file, 'w', 'ESRI Shapefile')
          lyr = ds.layers.create(
            'layer_name',
            null,
            gdal.wkbPoint | gdal.wkb25DBit
          )
          assert.instanceOf(lyr, gdal.Layer)
          assert.equal(lyr.geomType, gdal.wkbPoint25D)
        })
        it('should throw if bad geometry type is given', () => {
          const file = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}.tmp.shp`
          const ds = gdal.open(file, 'w', 'ESRI Shapefile')
          assert.throws(() => {
            ds.layers.create('layer_name', null, console.log)
          })
          assert.throws(() => {
            ds.layers.create('layer_name', null, 16819189)
          })
        })
        it('should error if dataset doesnt support creating layers', () => {
          ds = gdal.open(
            fileUtils.clone(`${__dirname}/data/park.geo.json`),
            'r'
          )
          assert.throws(() => {
            ds.layers.create('layer_name', null, gdal.wkbPoint)
          })
        })
        it('should accept layer creation options', () => {
          const basename = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}`
          const file = `${basename}.dbf`
          const ds = gdal.open(file, 'w', 'ESRI Shapefile')
          const lyr = ds.layers.create('layer_name', null, null, [ 'SHPT=NULL' ])
          assert.instanceOf(lyr, gdal.Layer)
          ds.close()
          // check if .dbf file was created
          fs.statSync(file)
          // make sure that .shp file wasnt created
          assert.throws(() => {
            fs.statSync(`${basename}.shp`)
          })
        })
        it('should throw if dataset is closed', () => {
          const file = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}.tmp.shp`
          const ds = gdal.open(file, 'w', 'ESRI Shapefile')
          ds.close()
          assert.throws(() => {
            ds.layers.create('layer_name', null, gdal.wkbPoint)
          })
        })
      })
      describe('createAsync()', () => {
        it('should return Layer', () => {
          const file = `${__dirname}/data/temp/ds_layer_test.${String(
            Math.random()
          ).substring(2)}.tmp.shp`
          const ds = gdal.open(file, 'w', 'ESRI Shapefile')
          const srs = gdal.SpatialReference.fromEPSG(4326)
          const lyr = ds.layers.createAsync('layer_name', srs, gdal.wkbPoint)
          return Promise.all([ assert.eventually.instanceOf(lyr, gdal.Layer),
            assert.eventually.propertyVal(lyr, 'geomType', gdal.wkbPoint) ])
        })
      })
    })
    describe('"srs" property', () => {
      describe('getter', () => {
        it('should return SpatialReference', () => {
          const ds = gdal.open(`${__dirname}/data/dem_azimuth50_pa.img`)
          assert.ok(ds.srs.toWKT().indexOf('PROJCS["WGS_1984_Albers"') > -1)
        })
        it("should return null when dataset doesn't have projection", () => {
          let ds
          ds = gdal.open(`${__dirname}/data/blank.jpg`)
          assert.isNull(ds.srs)

          ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          assert.isNull(ds.srs)
        })
        it('should throw if dataset is already closed', () => {
          const ds = gdal.open(`${__dirname}/data/dem_azimuth50_pa.img`)
          ds.close()
          assert.throws(() => {
            console.log(ds.srs)
          })
        })
      })
      describe('setter', () => {
        it('should throw when not an SpatialReference object', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          assert.throws(() => {
            ds.srs = '`1`inoinawfawfian!@121'
          }, /srs must be SpatialReference object/)
        })
        it('should set projection', () => {
          const ds = gdal.open(
            fileUtils.clone(`${__dirname}/data/dem_azimuth50_pa.img`)
          )
          const expected = [
            'PROJCS["NAD83 / UTM zone 10N",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",-123],PARAMETER["scale_factor",0.9996],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH]]', // new gdal
            'PROJCS["NAD_1983_UTM_Zone_10N",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-123.0],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_of_Origin",0.0],UNIT["Meter",1.0]]' // old gdal
          ]
          ds.srs = gdal.SpatialReference.fromWKT(NAD83_WKT)
          assert.include(expected, ds.srs.toWKT())
        })
        it('should throw error if dataset doesnt support setting srs', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          assert.throws(() => {
            ds.srs = gdal.SpatialReference.fromWKT(NAD83_WKT)
          })
        })
        it('should throw if dataset is already closed', () => {
          const ds = gdal.open(
            fileUtils.clone(`${__dirname}/data/dem_azimuth50_pa.img`)
          )
          ds.close()

          assert.throws(() => {
            ds.srs = gdal.SpatialReference.fromWKT(NAD83_WKT)
          })
        })
      })
    })

    describe('"rasterSize" property', () => {
      describe('getter', () => {
        it('should return dataset dimensions', () => {
          const ds = gdal.open(`${__dirname}/data/dem_azimuth50_pa.img`)
          assert.deepEqual(ds.rasterSize, {
            x: 495,
            y: 286
          })
        })
        it('should return null if dataset isnt a raster', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          assert.isNull(ds.rasterSize)
        })
        it('should throw if dataset is already closed', () => {
          const ds = gdal.open(`${__dirname}/data/dem_azimuth50_pa.img`)
          ds.close()
          assert.throws(() => {
            console.log(ds.rasterSize)
          })
        })
      })
      describe('setter', () => {
        it('should throw', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          assert.throws(() => {
            ds.rasterSize = { x: 0, y: 0 }
          }, /rasterSize is a read-only property/)
        })
      })
    })

    describe('"driver" property', () => {
      describe('getter', () => {
        it('should return Driver instance', () => {
          let ds
          ds = gdal.open(`${__dirname}/data/sample.tif`)
          assert.instanceOf(ds.driver, gdal.Driver)
          assert.equal(ds.driver.description, 'GTiff')

          ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          assert.instanceOf(ds.driver, gdal.Driver)
          assert.equal(ds.driver.description, 'ESRI Shapefile')
        })
        it('should throw if dataset is already closed', () => {
          const ds = gdal.open(`${__dirname}/data/dem_azimuth50_pa.img`)
          ds.close()
          assert.throws(() => {
            console.log(ds.driver)
          })
        })
      })
      describe('setter', () => {
        it('should throw', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          assert.throws(() => {
            ds.driver = null
          })
        })
      })
    })

    describe('"geoTransform" property', () => {
      describe('getter', () => {
        it('should return array', () => {
          const ds = gdal.open(`${__dirname}/data/sample.tif`)
          const expected_geotransform = [
            -1134675.2952829634,
            7.502071930146189,
            0,
            2485710.4658232867,
            0,
            -7.502071930145942
          ]

          const actual_geotransform = ds.geoTransform
          const delta = 0.00001
          assert.closeTo(
            actual_geotransform[0],
            expected_geotransform[0],
            delta
          )
          assert.closeTo(
            actual_geotransform[1],
            expected_geotransform[1],
            delta
          )
          assert.closeTo(
            actual_geotransform[2],
            expected_geotransform[2],
            delta
          )
          assert.closeTo(
            actual_geotransform[3],
            expected_geotransform[3],
            delta
          )
          assert.closeTo(
            actual_geotransform[4],
            expected_geotransform[4],
            delta
          )
          assert.closeTo(
            actual_geotransform[5],
            expected_geotransform[5],
            delta
          )
        })
        it('should return null if dataset doesnt have geotransform', () => {
          const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
          assert.isNull(ds.geoTransform)
        })
        it('should throw if dataset is already closed', () => {
          const ds = gdal.open(`${__dirname}/data/dem_azimuth50_pa.img`)
          ds.close()
          assert.throws(() => {
            console.log(ds.geoTransform)
          })
        })
      })
      describe('setter', () => {
        it('should set geotransform', () => {
          const ds = gdal.open(fileUtils.clone(`${__dirname}/data/sample.vrt`))

          const transform = [ 0, 2, 0, 0, 0, 2 ]
          ds.geoTransform = transform
          assert.deepEqual(ds.geoTransform, transform)
        })
        it('should throw if dataset doesnt support setting geotransform', () => {
          let ds
          const transform = [ 0, 2, 0, 0, 0, 2 ]

          ds = gdal.open(fileUtils.clone(`${__dirname}/data/park.geo.json`))
          assert.throws(() => {
            ds.geoTransform = transform
          })

          ds = gdal.open(fileUtils.clone(`${__dirname}/data/sample.tif`))
          assert.throws(() => {
            ds.geoTransform = transform
          })
        })
        it('should throw if dataset is already closed', () => {
          const ds = gdal.open(fileUtils.clone(`${__dirname}/data/sample.vrt`))
          ds.close()

          const transform = [ 0, 2, 0, 0, 0, 2 ]
          assert.throws(() => {
            ds.geoTransform = transform
          })
        })
        it('should throw if geotransform is invalid', () => {
          const ds = gdal.open(fileUtils.clone(`${__dirname}/data/sample.vrt`))
          assert.throws(() => {
            ds.geoTransform = [ 0, 1, 'bad_value', 0, 0, 1 ]
          })
          assert.throws(() => {
            ds.geoTransform = [ 0, 1 ]
          })
        })
      })
    })
    describe('executeSQL()', () => {
      it('should return Layer', () => {
        const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
        const result_set = ds.executeSQL('SELECT name FROM sample')

        assert.instanceOf(result_set, gdal.Layer)
        assert.deepEqual(result_set.fields.getNames(), [ 'name' ])
      })
      it('should destroy result set when dataset is closed', () => {
        const ds = gdal.open(`${__dirname}/data/shp/sample.shp`)
        const result_set = ds.executeSQL('SELECT name FROM sample')
        ds.close()
        assert.throws(() => {
          result_set.fields.getNames()
        })
      })
      it('should throw if dataset already closed', () => {
        const ds = gdal.open(`${__dirname}/data/sample.vrt`)
        ds.close()
        assert.throws(() => {
          ds.executeSQL('SELECT name FROM sample')
        })
      })
    })
    describe('getFileList()', () => {
      it('should return list of filenames', () => {
        const ds = gdal.open(path.join(__dirname, 'data', 'sample.vrt'))
        const expected_filenames = [
          ds.description,
          path.join(__dirname, 'data', 'sample.tif')
        ]
        assert.deepEqual(ds.getFileList(), expected_filenames)
      })
      it('should throw if dataset already closed', () => {
        const ds = gdal.open(`${__dirname}/data/sample.vrt`)
        ds.close()
        assert.throws(() => {
          ds.getFileList()
        })
      })
    })
    describe('getMetadata()', () => {
      it('should return object', () => {
        const ds = gdal.open(`${__dirname}/data/sample.tif`)
        const metadata = ds.getMetadata()
        assert.isObject(metadata)
        assert.equal(metadata.AREA_OR_POINT, 'Area')
      })
      it('should throw if dataset already closed', () => {
        const ds = gdal.open(`${__dirname}/data/sample.tif`)
        ds.close()
        assert.throws(() => {
          ds.getMetadata()
        })
      })
    })
    describe('buildOverviews()', () => {
      it('should generate overviews for all bands', () => {
        const ds = gdal.open(
          fileUtils.clone(`${__dirname}/data/multiband.tif`),
          'r+'
        )
        const expected_w = [
          ds.rasterSize.x / 2,
          ds.rasterSize.x / 4,
          ds.rasterSize.x / 8
        ]
        ds.buildOverviews('NEAREST', [ 2, 4, 8 ])
        ds.bands.forEach((band) => {
          const w = []
          assert.equal(band.overviews.count(), 3)
          band.overviews.forEach((overview) => {
            w.push(overview.size.x)
          })
          assert.sameMembers(w, expected_w)
        })
        ds.close()
      })
      it('should not fail hard if invalid overview is given', () => {
        // 1.11 introduced an error for this, but 1.10 and lower
        // fail silently - so really all we can do is make sure
        // nothing fatal (segfault, etc) happens
        const ds = gdal.open(
          fileUtils.clone(`${__dirname}/data/sample.tif`),
          'r+'
        )
        try {
          ds.buildOverviews('NEAREST', [ 2, 4, -3 ])
        } catch (e) {
          /* ignore (see above) */
        }
      })
      it('should throw if overview is not a number', () => {
        const ds = gdal.open(
          fileUtils.clone(`${__dirname}/data/sample.tif`),
          'r+'
        )
        assert.throws(() => {
          ds.buildOverviews('NEAREST', [ 2, 4, {} ])
        })
      })
      describe('w/bands argument', () => {
        it('should generate overviews only for the given bands', () => {
          gdal.config.set('USE_RRD', 'YES')
          const ds = gdal.open(
            fileUtils.clone(`${__dirname}/data/multiband.tif`),
            'r+'
          )
          ds.buildOverviews('NEAREST', [ 2, 4, 8 ], [ 1 ])
          assert.equal(ds.bands.get(1).overviews.count(), 3)
        })
        it('should throw if invalid band given', () => {
          const ds = gdal.open(
            fileUtils.clone(`${__dirname}/data/sample.tif`),
            'r+'
          )
          assert.throws(() => {
            ds.buildOverviews('NEAREST', [ 2, 4, 8 ], [ 4 ])
          })
        })
        it('should throw if band id is not a number', () => {
          const ds = gdal.open(
            fileUtils.clone(`${__dirname}/data/sample.tif`),
            'r+'
          )
          assert.throws(() => {
            ds.buildOverviews('NEAREST', [ 2, 4, 8 ], [ {} ])
          })
        })
      })
      it('should throw if dataset already closed', () => {
        const ds = gdal.open(
          fileUtils.clone(`${__dirname}/data/sample.tif`),
          'r+'
        )
        ds.close()
        assert.throws(() => {
          ds.buildOverviews('NEAREST', [ 2, 4, 8 ])
        })
      })
    })
  })
  describe('setGCPs()', () => {
    it('should update gcps', () => {
      const driver = gdal.drivers.get('MEM')
      const outputFilename = '' // __dirname + '/data/12_791_1476.tif';
      const ds = driver.createCopy(
        outputFilename,
        gdal.open(`${__dirname}/data/12_791_1476.jpg`)
      )
      ds.srs = gdal.SpatialReference.fromEPSG(4326)
      const bounds = {
        minX: -110.478515625,
        maxX: -110.390625,
        minY: 44.77793589631623,
        maxY: 44.84029065139799
      }
      const expectedGCPs = [
        {
          dfGCPPixel: 0,
          dfGCPLine: 0,
          dfGCPX: bounds.minX,
          dfGCPY: bounds.maxY,
          dfGCPZ: 0
        },
        {
          dfGCPPixel: 255,
          dfGCPLine: 0,
          dfGCPX: bounds.maxX,
          dfGCPY: bounds.maxY,
          dfGCPZ: 0
        },
        {
          dfGCPPixel: 255,
          dfGCPLine: 255,
          dfGCPX: bounds.maxX,
          dfGCPY: bounds.minY,
          dfGCPZ: 0
        },
        {
          dfGCPPixel: 0,
          dfGCPLine: 255,
          dfGCPX: bounds.minX,
          dfGCPY: bounds.minY,
          dfGCPZ: 0
        }
      ]

      ds.setGCPs(expectedGCPs)
      const actualGCPs = ds.getGCPs()

      expectedGCPs.forEach((expectedGCP, i) => {
        const actualGCP = actualGCPs[i]
        const delta = 0.00001
        assert.closeTo(actualGCP.dfGCPLine, expectedGCP.dfGCPLine, delta)
        assert.closeTo(actualGCP.dfGCPPixel, expectedGCP.dfGCPPixel, delta)
        assert.closeTo(actualGCP.dfGCPX, expectedGCP.dfGCPX, delta)
        assert.closeTo(actualGCP.dfGCPY, expectedGCP.dfGCPY, delta)
        assert.closeTo(actualGCP.dfGCPZ, expectedGCP.dfGCPZ, delta)
      })

      ds.close()
    })
  })
})
