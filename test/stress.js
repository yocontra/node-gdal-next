const openDatasets = 20
const parallelOps = 50
const probabilityToKeepDataset = 0.85
const magicOffset = 98500
const magicData = 75

const gdal = require('..')
const path = require('path')
const os = require('os')
const assert = require('assert')

const datasets = new Array(openDatasets)
const operations = new Array(parallelOps)

let opens = 0, ops = 0

process.on('SIGINT', async () => {
  console.log('Ctrl-C... exiting')
  await Promise.all(operations.filter((op) => op))
  console.log(`total opens: ${opens}, total ops: ${ops}`)
  const cpuUserEnd = os.cpus().map((cpu) => cpu.times.user).reduce((a, x) => a + x, 0)
  const cpuIdleEnd = os.cpus().map((cpu) => cpu.times.idle).reduce((a, x) => a + x, 0)
  console.log('parallelization waste: ', ((cpuIdleEnd - cpuIdleStart) / (cpuUserEnd - cpuUserStart)).toPrecision(3))
  process.exit(0)
})

// Add tests here
const tests = [
  (ds) => ds.then((ds) => ds.bands.getAsync(1))
    .then((band) => band.pixels.read(0, 0, band.size.x, band.size.y))
    .then((data) => assert(data[magicOffset] === magicData))
]

function operation(slot) {
  const ds = Math.floor(Math.random() * openDatasets)
  if (datasets[ds] === undefined || Math.random() > probabilityToKeepDataset) {
    opens++
    datasets[ds] = gdal.openAsync(path.resolve(__dirname, 'data', 'sample.tif'))
  }

  ops++
  if (ops % 1000 == 0) process.stdout.write('.')
  const testFn = tests[Math.floor(Math.random() * tests.length)]
  operations[slot] = testFn(datasets[ds]).then(() => operations[slot] = undefined)
}

console.log('Hit Ctrl-C to stop')

const cpuUserStart = os.cpus().map((cpu) => cpu.times.user).reduce((a, x) => a + x, 0)
const cpuIdleStart = os.cpus().map((cpu) => cpu.times.idle).reduce((a, x) => a + x, 0);
(async () => {
// eslint-disable-next-line no-constant-condition
  while (true) {
    let freeSlot
    do {
      freeSlot = operations.findIndex((op) => !op)
      if (freeSlot == -1) {
        // eslint-disable-next-line no-await-in-loop
        await Promise.race(operations.filter((op) => op))
      }
    } while (freeSlot == -1)

    operation(freeSlot)
  }
})()
