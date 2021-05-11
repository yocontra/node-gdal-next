const assert = require('chai').assert
const gdal = require('../lib/gdal.js')

// create = function -> class cannot be directly instantiated
// create = array -> these are the arguments for the new
const create = {
  CircularString: [],
  CompoundCurve: [],
  CompoundCurveCurves: () => new gdal.CompoundCurve().curves,
  CoordinateTransformation: [ gdal.SpatialReference.fromEPSG(4326), gdal.SpatialReference.fromEPSG(3857) ],
  Dataset: () => gdal.open('temp', 'w', 'MEM', 32, 32, 1, gdal.GDT_Byte),
  DatasetLayers: () => gdal.open(`${__dirname}/data/park.geo.json`).layers,
  Driver: () => gdal.open('temp', 'w', 'MEM', 32, 32, 1, gdal.GDT_Byte).driver,
  Feature: [ new gdal.FeatureDefn() ],
  FeatureDefn: [],
  FeatureDefnFields: () => new gdal.FeatureDefn().fields,
  FeatureFields: () => gdal.open(`${__dirname}/data/park.geo.json`).layers.get(0).features.get(0).fields,
  FieldDefn: [ 'id', gdal.OFTInteger ],
  GDALDrivers: () => gdal.drivers,
  Geometry: () => new gdal.LineString(),
  GeometryCollection: [],
  GeometryCollectionChildren: () => new gdal.GeometryCollection().children,
  Layer: () => gdal.open(`${__dirname}/data/park.geo.json`).layers.get(0),
  LayerFields: () => gdal.open(`${__dirname}/data/park.geo.json`).layers.get(0).fields,
  LinearRing: [],
  LineString: [],
  LineStringPoints: () => new gdal.LineString().points,
  MultiCurve: [],
  MultiLineString: [],
  MultiPoint: [],
  MultiPolygon: [],
  Point: [ 0, 0 ],
  Polygon: [],
  PolygonRings: () => new gdal.Polygon().rings,
  RasterBand: () => gdal.open('temp', 'w', 'MEM', 32, 32, 1, gdal.GDT_Byte).bands.get(1),
  RasterBandOverviews: () => gdal.open('temp', 'w', 'MEM', 32, 32, 1, gdal.GDT_Byte).bands.get(1).overviews,
  RasterBandPixels: () => gdal.open('temp', 'w', 'MEM', 32, 32, 1, gdal.GDT_Byte).bands.get(1).pixels,
  SimpleCurve: () => new gdal.LineString(),
  SpatialReference: []
}

describe('Class semantics', () => {
  afterEach(gc)

  for (const name in create) {
    it(`gdal.${name}`, () => {
      let o
      if (typeof create[name] === 'function') {
        o = create[name]()
        assert.throws(() => {
          new gdal[name]()
        }, /Cannot create .* directly|doesnt have a constructor|abstract/)
      } else if (Array.isArray(create[name])) {
        // This is a technique for calling apply on the new operator
        o = new (Function.prototype.bind.apply(gdal[name], [ null, ...create[name] ]))()
      }
      assert.instanceOf(o, gdal[name])
      assert.match(gdal[name].prototype.toString.call(o), new RegExp(name))
      assert.throws(() => {
        gdal[name]()
      }, /Cannot call constructor|abstract/)
    })
  }
})
