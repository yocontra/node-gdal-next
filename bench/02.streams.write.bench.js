const b = require('benny')
const { writeTest } = require('./streams.common')

module.exports = b.suite(
  'RasterWriteStream',

  b.add('RasterWriteStream w/ block consolidation w/ big chunks',
    async () => writeTest(801, 601, 1803, 2, true)),
  b.add('RasterWriteStream w/ block consolidation w/ small chunks',
    async () => writeTest(801, 601, 267, 2, true)),
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
