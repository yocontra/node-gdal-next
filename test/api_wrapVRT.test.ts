import * as gdal from '..'
import * as chai from 'chai'
const assert = chai.assert

describe('gdal.wrapVRT', () => {

  it('should produce identical Dataset by default', () => {
    const expected = `<VRTDataset rasterXSize="984" rasterYSize="804">
  <SRS>PROJCS["unnamed",GEOGCS["GRS 1980(IUGG, 1980)",DATUM["unknown",SPHEROID["GRS80",6378137,298.257222101],TOWGS84[0,0,0,0,0,0,0]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]]],PROJECTION["Albers_Conic_Equal_Area"],PARAMETER["latitude_of_center",23],PARAMETER["longitude_of_center",-96],PARAMETER["standard_parallel_1",29.5],PARAMETER["standard_parallel_2",45.5],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH]]</SRS>
  <GeoTransform>-1134675.2952829634, 7.502071930146189, 0, 2485710.4658232867, 0, -7.502071930145942</GeoTransform>
  <Metadata>
    <MDI key="AREA_OR_POINT">Area</MDI>
  </Metadata>
  <VRTRasterBand dataType="Byte" band="1">
    <SimpleSource>
      <SourceFilename relativeToVRT="0">test/data/sample.tif</SourceFilename>
      <SourceBand>1</SourceBand>
    </SimpleSource>
  </VRTRasterBand>
</VRTDataset>`
    assert.equal(gdal.wrapVRT(gdal.open('test/data/sample.tif')),
      expected)
  })

  it('should apply a pixel function when specified', () => {
    const expected = `<VRTDataset rasterXSize="984" rasterYSize="804">
  <SRS>PROJCS["unnamed",GEOGCS["GRS 1980(IUGG, 1980)",DATUM["unknown",SPHEROID["GRS80",6378137,298.257222101],TOWGS84[0,0,0,0,0,0,0]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]]],PROJECTION["Albers_Conic_Equal_Area"],PARAMETER["latitude_of_center",23],PARAMETER["longitude_of_center",-96],PARAMETER["standard_parallel_1",29.5],PARAMETER["standard_parallel_2",45.5],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH]]</SRS>
  <GeoTransform>-1134675.2952829634, 7.502071930146189, 0, 2485710.4658232867, 0, -7.502071930145942</GeoTransform>
  <Metadata>
    <MDI key="AREA_OR_POINT">Area</MDI>
  </Metadata>
  <VRTRasterBand dataType="Int16" band="1" subClass="VRTDerivedRasterBand">
    <PixelFunctionType>inv</PixelFunctionType>
    <PixelFunctionArguments k="3"/>
    <SourceTransferType>Float32</SourceTransferType>
    <SimpleSource>
      <SourceFilename relativeToVRT="0">test/data/sample.tif</SourceFilename>
      <SourceBand>1</SourceBand>
    </SimpleSource>
  </VRTRasterBand>
</VRTDataset>`

    assert.equal(gdal.wrapVRT(gdal.open('test/data/sample.tif'), {
      bands: [
        {
          pixelFunc: 'inv',
          pixelFuncArgs: { k: 3 },
          type: gdal.GDT_Int16,
          sourceTransferType: gdal.GDT_Float32
        }
      ]
    }), expected)
  })

  it('should support multiband files', () => {
    const expected = `<VRTDataset rasterXSize="512" rasterYSize="512">
  <SRS>EPSG:3857</SRS>
  <GeoTransform>-11584184.5107, 30.00058143924877, 0, 5635549.221409999, 0, -30.00058143924877</GeoTransform>
  <Metadata>
    <MDI key="AREA_OR_POINT">Area</MDI>
    <MDI key="TIFFTAG_DOCUMENTNAME">*</MDI>
    <MDI key="TIFFTAG_RESOLUTIONUNIT">2 (pixels/inch)</MDI>
    <MDI key="TIFFTAG_XRESOLUTION">72</MDI>
    <MDI key="TIFFTAG_YRESOLUTION">72</MDI>
  </Metadata>
  <VRTRasterBand dataType="Byte" band="1">
    <SimpleSource>
      <SourceFilename relativeToVRT="0">test/data/multiband.tif</SourceFilename>
      <SourceBand>1</SourceBand>
    </SimpleSource>
  </VRTRasterBand>
  <VRTRasterBand dataType="Byte" band="2">
    <SimpleSource>
      <SourceFilename relativeToVRT="0">test/data/multiband.tif</SourceFilename>
      <SourceBand>2</SourceBand>
    </SimpleSource>
  </VRTRasterBand>
  <VRTRasterBand dataType="Byte" band="3">
    <SimpleSource>
      <SourceFilename relativeToVRT="0">test/data/multiband.tif</SourceFilename>
      <SourceBand>3</SourceBand>
    </SimpleSource>
  </VRTRasterBand>
</VRTDataset>`

    assert.equal(gdal.wrapVRT(gdal.open('test/data/multiband.tif')),
      expected)
  })
})
