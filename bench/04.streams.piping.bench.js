const b = require('benny')
const { pipeTest, muxTest } = require('./streams.common')

module.exports = b.suite(
  'piping/RasterMuxStream/RasterTransform',

  b.add('piping w/o transform',
    async () => pipeTest('/vsimem/AROME_T2m_10_raw.tiff')),
  b.add('piping w/ transform w/ block optimization',
    async () => muxTest('/vsimem/AROME_T2m_10_raw.tiff', '/vsimem/AROME_D2m_10_raw.tiff', true)),
  b.add('piping w/ transform w/o block optimization',
    async () => muxTest('/vsimem/AROME_T2m_10_raw.tiff', '/vsimem/AROME_D2m_10_raw.tiff', false)),

  b.cycle(),
  b.complete()
)
