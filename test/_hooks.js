const gdal = require('../lib/gdal.js')
const os = require('os')

let noFailNet = function () {
  let test = this.currentTest
  while (test) {
    if (test.title.match(/w\/Net/)) {
      this.retries(3)
    }
    test = test.parent
  }
}

if (!process.env.MOCHA_TEST_NETWORK || process.env.MOCHA_TEST_NETWORK == 0) {
  noFailNet = function () {
    let test = this.currentTest
    while (test) {
      if (test.title.match(/w\/Net/)) {
        console.log('test requires networking, run with MOCHA_TEST_NETWORK=1 npm test to enable:', test.title)
        this.skip()
      }
      test = test.parent
    }
  }
}

const platformSkip = function () {
  let test = this.currentTest
  while (test) {
    if (test.title.match(/^on Linux/) && os.platform() != 'linux') {
      console.log('test requires Linux: ', test.title)
      this.skip()
    }
    test = test.parent
  }
}

const cleanup = () => {
  delete gdal.drivers
  gc()
}

exports.mochaHooks = {
  beforeEach: function (done) {
    platformSkip.call(this)
    noFailNet.call(this)
    done()
  },
  afterAll: cleanup
}
