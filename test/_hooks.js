const gdal = require('../lib/gdal.js')

const cleanup = () => {
  delete gdal.drivers
  gc()
}

exports.mochaHooks = {
  afterAll: cleanup
}
