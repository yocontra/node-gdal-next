module.exports = {
  header: 'import * as stream from \'stream\';',
  include: [ 'src/**/*.@(cpp|hpp|h|c)', 'lib/*.js' ],
  output: 'lib/index.d.ts',
  root: 'gdal',
  mangle: (name) => name.replace(/gdal\./g, ''),
  filter: (name) => !name.match(/options\.|Constants/g)
}
