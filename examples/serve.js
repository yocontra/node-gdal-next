// This example implements a simple HTTP server
// supporting multiple concurrent connections
// serving raster data from a GDAL dataset
//
// This is the same as serve.js but using pre-ES2017 syntax

const gdal = require('..')
const http = require('http')
const path = require('path')

const datasetFile = path.join(__dirname, '..', 'test', 'data', 'sample.tif')
const port = 8010
const wgs84 = gdal.SpatialReference.fromEPSG(4326)

gdal.openAsync(datasetFile).then((ds) => {
  const xform = new gdal.CoordinateTransformation(wgs84, ds)
  console.log(`Opened ${datasetFile}`)

  const server = http.createServer((req, res) => {
    const params = req.url.split('/')
    if (params.length > 3 && params[1].length && params[2].length
        && !isNaN(params[2]) && ! isNaN(params[3])) {

      let x, y
      switch (params[1]) {
        case 'pixels':
          x = +params[2]
          y = +params[3]
          break
        case 'WGS84':
          try {
            const coords = xform.transformPoint(+params[2], +params[3])
            x = Math.round(coords.x)
            y = Math.round(coords.y)
          } catch (e) {
            res.writeHead(500)
            res.end(e.toString())
            return
          }
          break
        default:
          res.writeHead(404)
          res.end('Unsupported method')
          return
      }

      ds.bands.getAsync(1)
        .catch((e) => {
          e.httpCode = 500
          throw e
        })
        .then((band) => band.pixels.getAsync(x, y))
        .catch((e) => {
          if (!e.httpCode) e.httpCode = 404
          throw e
        })
        .then((value) => {
          res.writeHead(200)
          res.end(`Value at position ${x}:${y} is ${value}\n`)
        })
        .catch((e) => {
          res.writeHead(e.httpCode)
          res.end(e.toString())
        })
    } else {
      res.writeHead(400)
      res.end('No or invalid coordinates specified')
    }
  })

  server.listen(port, 'localhost', () => {
    console.log(`Server up and running on http://localhost:${port}`)
    console.log('Try:')
    console.log(`curl http://localhost:${port}/pixels/120/100`)
    console.log(`curl http://localhost:${port}/WGS84/-110.3/44.55`)
  })
})
