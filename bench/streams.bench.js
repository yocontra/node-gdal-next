const b = require('benny')

const path = require('path')
const fs = require('fs')
const assert = require('assert')
const { finished } = require('stream')
const finishedP = require('util').promisify(finished)

const gdal = require('..')

async function readTestAsyncIterator(file, blockOptimize) {
  const ds = await gdal.openAsync(path.resolve(__dirname, '..', 'test', 'data', file))
  const band = await ds.bands.getAsync(1)
  const rs = band.pixels.createReadStream({ blockOptimize })
  let length = 0
  for await (const chunk of rs) {
    length += chunk.length
  }
  const rasterSize = await ds.rasterSizeAsync
  assert(length == rasterSize.x * rasterSize.y)
}

async function readTest(file, blockOptimize) {
  const ds = await gdal.openAsync(path.resolve(__dirname, '..', 'test', 'data', file))
  const band = await ds.bands.getAsync(1)
  const rs = band.pixels.createReadStream({ blockOptimize })
  let length = 0
  rs.on('data', (chunk) => length += chunk.length)

  const rasterSize = await ds.rasterSizeAsync
  return new Promise((resolve) => {
    rs.on('end', () => {
      assert(length == rasterSize.x * rasterSize.y)
      resolve()
    })
  })
}


// Even in Node 17 there is still no awaitable drain
async function writeTest(w, h, len, blockSize, blockOptimize, compress) {
  const filename = `/vsimem/ds_ws_test.${String(
    Math.random()
  ).substring(2)}.tmp.tiff`
  const ds = await gdal.openAsync(filename, 'w', 'GTiff', w, h, 1, gdal.GDT_Float64,
    { BLOCKXSIZE: w, BLOCKYSIZE: blockSize, COMPRESS: compress ? 'DEFLATE' : undefined })
  const band = await ds.bands.getAsync(1)
  const ws = band.pixels.createWriteStream({ blockOptimize })
  const data = new Float64Array(len)
  for (let i = 0; i < len; i++) data[i] = i

  let written = 0

  let resolve
  const ret = new Promise((res) => {
    resolve = res
  })

  // this is the callback for the final write
  function end() {
    ds.flushAsync().then(() => {
      ds.close()
      gdal.vsimem.release(filename)
      resolve()
    })
  }

  function write() {
    while (written < w*h) {
      written += data.length
      // write until finished or write returns false because the buffer is full
      if (!ws.write(data, undefined, written == w*h ? end : undefined)) break
    }
  }

  ws.on('drain', write)

  // start writing
  write()

  return ret
}

async function pipeTest(file) {
  const dsIn = await gdal.openAsync(file)
  const filename = `/vsimem/ds_pipe_test.${String(
    Math.random()
  ).substring(2)}.tmp.tiff`
  const dsOut = await gdal.openAsync(filename, 'w', 'GTiff', dsIn.rasterSize.x, dsIn.rasterSize.y, 1, gdal.GDT_Float64)
  const bandIn = await dsIn.bands.getAsync(1)
  const bandOut = await dsOut.bands.getAsync(1)
  const rs = bandIn.pixels.createReadStream()
  const ws = bandOut.pixels.createWriteStream()

  rs.pipe(ws)
  await finishedP(ws)
  await dsOut.flushAsync()
  dsOut.close()
  gdal.vsimem.release(filename)
}

async function muxTest(file1, file2, blockOptimize) {
  const dsT2m = await gdal.openAsync(file1)
  const dsD2m = await gdal.openAsync(file2)

  const filename = `/vsimem/ds_mux_test.${String(
    Math.random()
  ).substring(2)}.tmp.tiff`
  const dsCloudBase = gdal.open(filename, 'w', 'GTiff', dsT2m.rasterSize.x, dsD2m.rasterSize.y, 1, gdal.GDT_Float64)

  const mux = new gdal.RasterMuxStream({
    T2m: dsT2m.bands.get(1).pixels.createReadStream(),
    D2m: dsD2m.bands.get(1).pixels.createReadStream()
  }, { blockOptimize })

  const ws = dsCloudBase.bands.get(1).pixels.createWriteStream()

  // Espy's estimation for cloud base height (lifted condensation level)
  // LCL = 125 * (T2m - Td2m)
  // where T2m is the temperature at 2m and Td2m is the dew point at 2m
  const fn = (t,td) => 125 * (t - td)
  const espyEstimation = new gdal.RasterTransform({ type: Float64Array, fn })

  mux.pipe(espyEstimation).pipe(ws)
  await finishedP(ws)
  await dsCloudBase.flushAsync()
  dsCloudBase.close()
  gdal.vsimem.release(filename)
}

(async () => {
  gdal.vsimem.set(await fs.promises.readFile(
    path.resolve(__dirname, '..', 'test', 'data', 'AROME_T2m_10.tiff')),
  '/vsimem/AROME_T2m_10.tiff')
  gdal.vsimem.set(await fs.promises.readFile(
    path.resolve(__dirname, '..', 'test', 'data', 'AROME_D2m_10.tiff')),
  '/vsimem/AROME_D2m_10.tiff')

  // Uncompress in memory
  await gdal.translateAsync('/vsimem/AROME_T2m_10_raw.tiff', await gdal.openAsync('/vsimem/AROME_T2m_10.tiff'))
  await gdal.translateAsync('/vsimem/AROME_D2m_10_raw.tiff', await gdal.openAsync('/vsimem/AROME_D2m_10.tiff'))

  await b.suite(
    'RasterReadStream',

    b.add('RasterReadStream w/ blockOptimize',
      async () => readTest('/vsimem/AROME_T2m_10_raw.tiff', true)),
    b.add('RasterReadStream w/o blockOptimize',
      async () => readTest('/vsimem/AROME_T2m_10_raw.tiff', false)),
    b.add('RasterReadStream w/ blockOptimize w/async interator',
      async () => readTestAsyncIterator('/vsimem/AROME_T2m_10_raw.tiff', true)),
    b.add('RasterReadStream w/o blockOptimize w/async iterator',
      async () => readTestAsyncIterator('/vsimem/AROME_T2m_10_raw.tiff', false)),

    b.cycle(),
    b.complete()
  )

  await b.suite(
    'RasterReadStream w/Compression',

    b.add('RasterReadStream w/ blockOptimize',
      async () => readTest('/vsimem/AROME_T2m_10.tiff', true)),
    b.add('RasterReadStream w/o blockOptimize',
      async () => readTest('/vsimem/AROME_T2m_10.tiff', false)),
    b.add('RasterReadStream w/ blockOptimize w/async interator',
      async () => readTestAsyncIterator('/vsimem/AROME_T2m_10.tiff', true)),
    b.add('RasterReadStream w/o blockOptimize w/async iterator',
      async () => readTestAsyncIterator('/vsimem/AROME_T2m_10.tiff', false)),

    b.cycle(),
    b.complete()
  )

  await b.suite(
    'RasterWriteStream',

    b.add('RasterWriteStream w/ block consolidation w/ big chunks',
      async () => writeTest(801, 601, 1803, 2, false)),
    b.add('RasterWriteStream w/ block consolidation w/ small chunks',
      async () => writeTest(801, 601, 267, 2, false)),
    // This one is unusually fast because it uses static allocation
    // The same buffer, containing a pattern, is used over and over again
    // Reading can't do this - it must allocate a new buffer on every operation
    b.add('RasterWriteStream w/ zero-copy',
      async () => writeTest(801, 601, 1803, 3, true)),
    b.add('RasterWriteStream in line mode w/ big chunks',
      async () => writeTest(801, 601, 1803, 2, false)),
    b.add('RasterWriteStream in line mode w/ small chunks',
      async () => writeTest(801, 601, 267, 2, false)),

    b.cycle(),
    b.complete()
  )

  await b.suite(
    'RasterWriteStream w/Compression',

    b.add('RasterWriteStream w/ block consolidation w/ big chunks',
      async () => writeTest(801, 601, 1803, 2, false, true)),
    b.add('RasterWriteStream w/ block consolidation w/ small chunks',
      async () => writeTest(801, 601, 267, 2, false, true)),
    b.add('RasterWriteStream w/ zero-copy',
      async () => writeTest(801, 601, 1803, 3, true, true)),
    b.add('RasterWriteStream in line mode w/ big chunks',
      async () => writeTest(801, 601, 1803, 2, false, true)),
    b.add('RasterWriteStream in line mode w/ small chunks',
      async () => writeTest(801, 601, 267, 2, false, true)),

    b.cycle(),
    b.complete()
  )

  await b.suite(
    'piping',

    b.add('RasterWriteStream w/ block consolidation',
      async () => pipeTest('/vsimem/AROME_T2m_10_raw.tiff')),

    b.cycle(),
    b.complete()
  )

  await b.suite(
    'RasterMuxStream/RasterTransform',

    b.add('RasterWriteStream w/ block optimization',
      async () => muxTest('/vsimem/AROME_T2m_10_raw.tiff', '/vsimem/AROME_D2m_10_raw.tiff', true)),
    b.add('RasterWriteStream w/o block optimization',
      async () => muxTest('/vsimem/AROME_T2m_10_raw.tiff', '/vsimem/AROME_D2m_10_raw.tiff', false)),

    b.cycle(),
    b.complete()
  )

})()
