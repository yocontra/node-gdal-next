import * as fs from 'fs'
import * as path from 'path'
import * as gdal from 'gdal-async'

export function copyRecursiveSync (src: string, dest: string) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = stats && stats.isDirectory()
  if (exists && isDirectory) {
    fs.readdirSync(src).forEach((child) => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child))
    })
  } else {
    gdal.vsimem.copy(fs.readFileSync(src), dest)
  }
}

export function deleteRecursiveVSIMEM(dir: string) {
  const list = gdal.fs.readDir(dir)
  for (const file of list) gdal.vsimem.release(dir + '/' + file)
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
  const result = `/vsimem/${name_new}`
  copyRecursiveSync(dir, result)
  return result
}
