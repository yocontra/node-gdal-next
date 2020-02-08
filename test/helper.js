const gdal = require('../lib/gdal.js')

function getTestFullname(test) {
  let name = ''
  do {
    name = `${test.title} ${name}`
    test = test.parent
  } while (test)
  return name
}

beforeEach(function () {
  gdal.log(`BEGIN TEST:${getTestFullname(this.currentTest)}`)
})

afterEach(function () {
  gdal.log(`END TEST:${getTestFullname(this.currentTest)}`)
})
