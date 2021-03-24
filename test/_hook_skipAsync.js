const gdal = require('../lib/gdal.js')

let skipAsync = (done) => done()
// Skip async on GDAL 1.x
if (gdal.version.split('.')[0] < 2 || process.versions.node.split('.')[0] <= 10) {
  skipAsync = function (done) {
    let test = this.currentTest
    while (test) {
      if (test.title.match(/Async/)) {
        console.log('skip on GDAL 1.x', test.title)
        this.skip()
      }
      test = test.parent
    }
    done()
  }
}

exports.mochaHooks = {
  beforeEach: skipAsync
}
