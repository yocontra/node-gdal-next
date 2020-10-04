# Fork Notes

This project is a fork of https://github.com/contra/node-gdal-next which is a fork of https://github.com/naturalatlas/node-gdal with:

- Early experimental support for asynchronous IO

See the [ROADMAP](ROADMAP.md) for more info about the future of this fork. All thanks and credit goes to the original maintainers!

### Breaking Changes relative to node-gdal

- With PROJ 6+, the order of coordinates for EPSG geographic coordinate reference systems is latitude first,
longitude second. If you don't want to make large code changes, you can replace code like `gdal.SpatialReference.fromEPSG(4326)` with `gdal.SpatialReference.fromProj4('+init=epsg:4326')`

### Breaking Changes relative to node-gdal-next

- None, I will keep the fork in sync and will merge back when the features are of sufficient quality

# node-gdal-async

Read and write raster and vector geospatial datasets straight from [Node.js](http://nodejs.org) with this native asynchrounous [GDAL](http://www.gdal.org/) binding. To get started, browse the [**API Documentation**](https://contra.io/node-gdal-next/classes/gdal.html) or [examples](examples/).

The project is not published on NPM, it is meant to be merged back to node-gdal-next when ready

By default all dependencies are the latest versions and bundled out of the box, but if you would like to link against a pre-installed gdal you can use these flags when installing:

```sh
# requires libgdal-dev (debian: sudo apt-get install libgdal-dev)
$ npm install gdal-next --build-from-source --shared_gdal
```

## Sample Usage

Only asynchronous raster reading and asynchrounous opening are supported in the current version. Mixing synchronous and asynchronous operations should work **as long as you do not touch dataset object itself while asynchrounous operations are running**

#### Raster

```js
const gdal = require("gdal-next")
gdal.openAsync("sample.tif", undefined, (e,r) => {
    if (e) {
        console.error(e);
        return;
    }
    const dataset = r;
    let data;
    dataset.bands.get(1).pixels.readAsync(0, 0, dataset.rasterSize.x, dataset.rasterSize.y, data,
        undefined, undefined, undefined, undefined, undefined, (e, r) => {
            console.log(data);
        });
});
```


## Bundled Drivers

`AAIGrid`, `ACE2`, `ADRG`, `AIG`, `AVCBin`, `AVCE00`, `AeronavFAA`, `AirSAR`, `BLX`, `BMP`, `BNA`, `BT`, `CEOS`, `COASP`, `COSAR`, `CPG`, `CSV`, `CTG`, `CTable2`, `DGN`, `DIMAP`, `DIPEx`, `DOQ1`, `DOQ2`, `DTED`, `DXF`, `E00GRID`, `ECRGTOC`, `EDIGEO`, `EHdr`, `EIR`, `ELAS`, `ENVI`, `ERS`, `ESAT`, `ESRI Shapefile`, `MapInfo File`, `MBTiles`, `FAST`, `FIT`, `FujiBAS`, `GFF`, `GML`, `GPSBabel`, `GPSTrackMaker`, `GPX`, `GRASSASCIIGrid`, `GS7BG`, `GSAG`, `GSBG`, `GSC`, `GTX`, `GTiff`, `GenBin`, `GeoJSON`, `GeoRSS`, `Geoconcept`, `GPKG`, `HF2`, `HFA`, `HTF`, `IDA`, `ILWIS`, `INGR`, `IRIS`, `ISIS2`, `ISIS3`, `Idrisi`, `JAXAPALSAR`, `JDEM`, `JPEG`, `KMLSUPEROVERLAY`, `KML`, `KRO`, `L1B`, `LAN`, `LCP`, `LOSLAS`, `Leveller`, `MAP`, `MEM`, `MFF2`, `MFF`, `Memory`, `MVT`, `NDF`, `NGSGEOID`, `NITF`, `NTv2`, `NWT_GRC`, `NWT_GRD`, `OGR_GMT`, `OGR_PDS`, `OGR_SDTS`, `OGR_VRT`, `OSM`, `OpenAir`, `OpenFileGDB`, `PAux`, `PCIDSK`, `PDS`, `PGDUMP`, `PNG`, `PNM`, `REC`, `RMF`, `ROI_PAC`, `RPFTOC`, `RS2`, `RST`, `R`, `S57`, `SAGA`, `SAR_CEOS`, `SDTS`, `SEGUKOOA`, `SEGY`, `SGI`, `SNODAS`, `SQLite`, `SRP`, `SRTMHGT`, `SUA`, `SVG`, `SXF`, `TIL`, `TSX`, `Terragen`, `UK .NTF`, `USGSDEM`, `VICAR`, `VRT`, `WAsP`, `XPM`, `XPlane`, `XYZ`, `ZMap`

## Contributors

This binding is a collaboration between [Natural Atlas](https://github.com/naturalatlas) and [Mapbox](https://github.com/mapbox). Its contributors are [Brandon Reavis](https://github.com/brandonreavis), [Brian Reavis](https://github.com/brianreavis), [Dane Springmeyer](https://github.com/springmeyer), [Zac McCormick](https://github.com/zhm), and [others](https://github.com/naturalatlas/node-gdal/graphs/contributors).

node-gdal-next is maintained by [@contra](https://github.com/contra)

The async bindings are by [@mmomtchev](https://github.com/mmomtchev)

Before submitting pull requests, please update the [tests](test) and make sure they all pass.

```sh
$ make test # test against bundled gdal
$ make test-shared # test against shared gdal
```

## License

Copyright &copy; 2015–2017 [Natural Atlas, Inc.](https://github.com/naturalatlas) & [Contributors](https://github.com/naturalatlas/node-gdal/graphs/contributors)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
