// This example implements a simple HTTP server
// supporting multiple concurrent connections
// serving raster data from a GDAL dataset

const gdal = require('..')
const http = require('http')
const path = require('path')

const datasetFile = path.join(__dirname, '..', 'test', 'data', 'sample.tif')
const port = 8010

gdal.openAsync(datasetFile).then((ds) => {
  console.log(`Opened ${datasetFile}`)

  const server = http.createServer((req, res) => {
    const params = req.url.split('/')
    if (params.length > 2 && params[1].length && params[2].length
        && !isNaN(params[1]) && ! isNaN(params[2])) {

      ds.bands.getAsync(1)
        .catch((e) => {
          e.httpCode = 500
          throw e
        })
        .then((band) => band.pixels.getAsync(+params[1], +params[2]))
        .catch((e) => {
          if (!e.httpCode) e.httpCode = 404
          throw e
        })
        .then((value) => {
          res.writeHead(200)
          res.end(`Value at position ${params[1]}:${params[2]} is ${value}\n`)
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
    console.log(`Try  curl http://localhost:${port}/120/100`)
  })
})
