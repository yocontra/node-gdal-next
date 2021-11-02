import * as fs from 'fs'
import * as path from 'path'
import * as gdal from '../..'

export function copyRecursiveSync (src: string, dest: string) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = stats && stats.isDirectory()
  if (exists && isDirectory) {
    fs.mkdirSync(dest)
    fs.readdirSync(src).forEach((child) => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child))
    })
  } else {
    fs.linkSync(src, dest)
  }
}

export function clone(file: string) {
  const base = path.basename(file)
  const dotpos = base.lastIndexOf('.')
  const destname = `/vsimem/${base.substring(0, dotpos)}.tmp${String(Math.random()).substring(2)}${base.substring(dotpos)}`
  const buffer = fs.readFileSync(file)
  gdal.vsimem.copy(buffer, destname)
  return destname
}

export function cloneDir(dir: string) {
  const name = path.basename(dir)
  const name_new = `${name}.${String(Math.random()).substring(2)}.tmp`
  const result = `${path.resolve(__dirname, '..')}/data/temp/${name_new}`
  copyRecursiveSync(dir, result)
  return result
}

export function tempDir(dir: string) {
  const destdir = path.resolve(dir, 'data', 'temp')
  fs.mkdirSync(destdir, { recursive: true })
  return destdir
}
