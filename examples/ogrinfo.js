const gdal = require('../lib/gdal.js')

const filename = process.argv[2]
if (!filename) {
  console.error('Filename must be provided')
  process.exit(1)
}

const ds = gdal.open(filename)

const driver = ds.driver
const driver_metadata = driver.getMetadata()
if (driver_metadata.DCAP_VECTOR !== 'YES') {
  console.error('Source file is not a vector')
  process.exit(1)
}

console.log(`Driver = ${driver.description}`)
console.log('')

// layers
let i = 0
console.log('Layers: ')
ds.layers.forEach((layer) => {
  console.log(`${i++}: ${layer.name}`)

  console.log(`  Geometry Type = ${gdal.Geometry.getName(layer.geomType)}`)
  console.log(
    `  Spatial Reference = ${layer.srs ? layer.srs.toWKT() : 'null'}`
  )

  const extent = layer.getExtent()
  console.log('  Extent: ')
  console.log(`    minX = ${extent.minX}`)
  console.log(`    minY = ${extent.minY}`)
  console.log(`    maxX = ${extent.maxX}`)
  console.log(`    maxY = ${extent.maxY}`)

  console.log('  Fields: ')
  layer.fields.forEach((field) => {
    console.log(`    -${field.name} (${field.type})`)
  })

  console.log(`  Feature Count = ${layer.features.count()}`)
})
