const gdal = require('../lib/gdal.js')

let skipAsync = (done) => done()
// Skip async on GDAL 1.x
if (gdal.version.split('.')[0] < 2) {
  skipAsync = (done) => {
    if (this.currentTest.parent.title && this.currentTest.parent.title.match(/Async/)) {
      console.log(this.currentTest.parent.title)
      this.skip()
    }
    done()
  }
}

exports.mochaHooks = {
  beforeEach: skipAsync
}
