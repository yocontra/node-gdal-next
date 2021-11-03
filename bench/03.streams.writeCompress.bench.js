const b = require('benny')
const { writeTest } = require('./streams.common')

// It is unclear why GDAL's compression is faster
// when writing line-by-line, but it seems to be true
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
