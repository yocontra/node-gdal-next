const gdal = require('.')
const fs = require('fs')

function swallow(data, file, print) {
  gdal.vsimem.copy(data, file)
  const ds = gdal.open(file)
  ds.close()
  const buf = gdal.vsimem.release(file)
  if (print) console.log(typeof buf)
}

const data = fs.readFileSync(`${__dirname}/test/data/sample.tif`)
for (let i = 0; i < 3e3; i++) {
  swallow(data, `/vsimem/temp${i}.tif`, i % 1e3 == 0)
  global.gc()
}
