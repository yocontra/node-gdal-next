# node-gdal-async

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Node.js CI](https://github.com/mmomtchev/node-gdal-async/workflows/Node.js%20CI/badge.svg)

Read and write raster and vector geospatial datasets straight from [Node.js](http://nodejs.org) with this native asynchrounous [GDAL](http://www.gdal.org/) binding. To get started, browse the [**API Documentation**](https://contra.io/node-gdal-next/classes/gdal.html) or [examples](examples/).

# Fork Notes

This project is a fork of <https://github.com/contra/node-gdal-next> which is a fork of <https://github.com/naturalatlas/node-gdal> with:

- **Support for asynchronous IO**

## As of November 9th 2020, async support for raster data has been completely merged into <https://github.com/contra/node-gdal-next>
The work on async support for vector data has started, but there is nothing usable at the moment
I am currently working on the universal async framework on the universal-async branch

See the [ROADMAP](ROADMAP.md) for more info about the future of this fork. All thanks and credit goes to the original maintainers!

### Breaking Changes relative to node-gdal

- With PROJ 6+, the order of coordinates for EPSG geographic coordinate reference systems is latitude first,
longitude second. If you don't want to make large code changes, you can replace code like `gdal.SpatialReference.fromEPSG(4326)` with `gdal.SpatialReference.fromProj4('+init=epsg:4326')`

### Breaking Changes relative to node-gdal-next

- None, this branch is currently merged into node-gdal-next

## Installation

If you need async support, you should install the official package from <https://github.com/contra/node-gdal-next>

This project is not published on NPM, it is meant to support experimental development work on the async API

By default all dependencies are the latest versions and bundled out of the box, but if you would like to link against a pre-installed gdal you can use these flags when installing:

```sh
$ git clone https://github.com/mmomtchev/node-gdal-async.git
$ cd node-gdal-async
$ npm i
$ npx node-pre-gyp configure
$ npx node-pre-gyp build [--shared_gdal]  # --shared_gdal allows linking to the OS-provided libgdal, requires libgdal-dev (debian: sudo apt-get install libgdal-dev)
```

## Sample Usage

Only asynchronous raster reading/writing and asynchrounous opening are supported in the current version.
Mixing synchronous and asynchronous operations is supported.

#### Safe mixing of asynchronous operations

Simultaneous operations on distinct dataset objects are always safe and can run it parallel.
Simultaneous operations on the same dataset object should be safe too but they won't run in parallel. This is a limitation of GDAL. The only way to have multiple parallel operations on the same file is to use multiple dataset objects.

**Does not support worker_threads**

#### With callbacks

If the last argument of an xxxAsync function is a callback,
it will be called on completion with standard *(e,r)* semantics
In this case the function will return a resolved *Promise*
```js
const gdal = require('../node-gdal-async') // Or where it is installed
gdal.openAsync('sample.tif', (e, dataset) => {
    dataset.bands.get(1).pixels.readAsync(0, 0, dataset.rasterSize.x,
        dataset.rasterSize.y, (e, data) => {
        if (e) {
            console.error(e);
            return;
        }
        console.log(data);
    });
});
```

#### With promises

If there is no callback, the function will return a *Promise*
then can be *then()*ed, *catch()*ed or *await*ed
```js
gdal.openAsync('sample.tif').then((dataset) => {
    dataset.bands.get(1).pixels.readAsync(0, 0, dataset.rasterSize.x, dataset.rasterSize.y)
        .then((data) => {
            console.log(data);
        }).catch(e => console.error(e));
}).catch(e => console.error(e));
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