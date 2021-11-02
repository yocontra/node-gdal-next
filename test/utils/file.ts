import * as fs from 'fs'
import * as path from 'path'

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
  const destname = `${base.substring(0, dotpos)}.tmp${String(Math.random()).substring(2)}${base.substring(dotpos)}`
  const destdir = path.resolve(path.dirname(file), 'temp')
  fs.mkdirSync(destdir, { recursive: true })
  const result = path.resolve(destdir, destname)

  fs.writeFileSync(result, fs.readFileSync(file))
  return result
}

export function cloneDir(dir: string) {
  const name = path.basename(dir)
  const name_new = `${name}.${String(Math.random()).substring(2)}.tmp`
  const result = `${path.resolve(__dirname, '..')}/data/temp/${name_new}`
  copyRecursiveSync(dir, result)
  return result
}
