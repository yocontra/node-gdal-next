const b = require('benny')
const { readTest, readTestAsyncIterator } = require('./streams.common')

module.exports = b.suite(
  'RasterReadStream',

  b.add('RasterReadStream w/ blockOptimize',
    async () => readTest('/vsimem/AROME_T2m_10_raw.tiff', true)),
  b.add('RasterReadStream w/o blockOptimize',
    async () => readTest('/vsimem/AROME_T2m_10_raw.tiff', false)),
  b.add('RasterReadStream w/ blockOptimize w/async iterator',
    async () => readTestAsyncIterator('/vsimem/AROME_T2m_10_raw.tiff', true)),
  b.add('RasterReadStream w/o blockOptimize w/async iterator',
    async () => readTestAsyncIterator('/vsimem/AROME_T2m_10_raw.tiff', false)),

  b.cycle(),
  b.complete()
)
