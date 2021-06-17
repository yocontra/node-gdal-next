const gdal = require('../lib/gdal.js')

let noFailNet = function (done) {
  let test = this.currentTest
  while (test) {
    if (test.title.match(/w\/Net/)) {
      this.retries(3)
    }
    test = test.parent
  }
  done()
}

if (!process.env.MOCHA_TEST_NETWORK || process.env.MOCHA_TEST_NETWORK == 0) {
  noFailNet = function (done) {
    let test = this.currentTest
    while (test) {
      if (test.title.match(/w\/Net/)) {
        console.log('test requires networking, run with MOCHA_TEST_NETWORK=1 npm test to enable', test.title)
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
  beforeEach: noFailNet,
  afterAll: cleanup
}
