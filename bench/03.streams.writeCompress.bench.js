const b = require('benny')
const { writeTest } = require('./streams.common')

// When writing line-by-line, GDAL will buffer
// and delay the compression until the final flush (or if it runs out of memory)
// When writing block-by-block, it will compress each block as it is received
// In the particular case of gdal-async the line-by-line mode allows for better use of the CPU L1 cache
// as all of the compression will happen in a single thread
// The performance of the zero-copy mode is in fact higher with less threads (UV_THREADPOOL_SIZE=1)
// This can't be solved unless gdal-async implements its own scheduling and multi-threading on top of libuv,
// https://github.com/mmomtchev/node-gdal-async/issues/2
module.exports = b.suite(
  'RasterWriteStream w/Compression',

  b.add('RasterWriteStream w/ block consolidation w/ big chunks',
    async () => writeTest(801, 601, 1803, 2, true, true)),
  b.add('RasterWriteStream w/ block consolidation w/ small chunks',
    async () => writeTest(801, 601, 267, 2, true, true)),
  b.add('RasterWriteStream w/ zero-copy',
    async () => writeTest(801, 601, 1602, 2, true, true)),
  b.add('RasterWriteStream in line mode w/ big chunks',
    async () => writeTest(801, 601, 1803, 2, false, true)),
  b.add('RasterWriteStream in line mode w/ small chunks',
    async () => writeTest(801, 601, 267, 2, false, true)),

  b.cycle(),
  b.complete()
)
