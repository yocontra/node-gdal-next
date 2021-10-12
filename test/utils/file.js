const fs = require('fs')
const path = require('path')

const copyRecursiveSync = function (src, dest) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (exists && isDirectory) {
    fs.mkdirSync(dest)
    fs.readdirSync(src).forEach((child) => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child))
    })
  } else {
    fs.linkSync(src, dest)
  }
}

module.exports.clone = function (file) {
  const base = path.basename(file)
  const dotpos = base.lastIndexOf('.')
  const destname = `${base.substring(0, dotpos)}.tmp${String(Math.random()).substring(2)}${base.substring(dotpos)}`
  const destdir = path.resolve(path.dirname(file), 'temp')
  fs.mkdirSync(destdir, { recursive: true })
  const result = path.resolve(destdir, destname)

  fs.writeFileSync(result, fs.readFileSync(file))
  return result
}

module.exports.cloneDir = function (dir) {
  const name = path.basename(dir)
  const name_new = `${name}.${String(Math.random()).substring(2)}.tmp`
  const result = `${path.resolve(__dirname, '..')}/data/temp/${name_new}`
  copyRecursiveSync(dir, result)
  return result
}
