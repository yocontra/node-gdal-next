// This example implements a simple HTTP server
// supporting multiple concurrent connections
// serving raster data from a GDAL dataset
//
// This is the same as serve.js but using ES2017 async/await

const gdal = require('..')
const http = require('http')
const path = require('path')

const datasetFile = path.join(__dirname, '..', 'test', 'data', 'sample.tif')
const port = 8010

gdal.openAsync(datasetFile).then((ds) => {
  console.log(`Opened ${datasetFile}`)

  const server = http.createServer(async (req, res) => {
    const params = req.url.split('/')
    if (params.length > 2 && params[1].length && params[2].length
        && !isNaN(params[1]) && ! isNaN(params[2])) {
          let band, value

          try {
            band = await ds.bands.getAsync(1)
          } catch (e) {
            res.writeHead(500)
            res.end(e.toString())
            return
          }

          try {
            value = await band.pixels.getAsync(+params[1], +params[2])
          } catch (e) {
            res.writeHead(404)
            res.end(e.toString())
            return
          }

          res.writeHead(200)
          res.end(`Value at position ${params[1]}:${params[2]} is ${value}\n`)

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
