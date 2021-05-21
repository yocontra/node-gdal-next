const gdal = require('../lib/gdal.js')
const semver = require('semver')

let skipAsync = (done) => done()
// Skip async on GDAL 1.x
if (semver.lt(gdal.version, '2.0.0')) {
  skipAsync = function (done) {
    let test = this.currentTest
    while (test) {
      if (test.title.match(/Async|CircularString|CompoundCurve|MultiCurve|progress_cb/)) {
        console.log('skip on GDAL 1.x', test.title)
        this.skip()
      }
      test = test.parent
    }
    done()
  }
}

const cleanup = () => {
  delete gdal.drivers
  gc()
}

exports.mochaHooks = {
  beforeEach: skipAsync,
  afterAll: cleanup
}
