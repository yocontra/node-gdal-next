const { app, BrowserWindow, ipcMain } = require('electron')
const gdal = require('gdal-async')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}

const ds = gdal.open(path.resolve(__dirname, '..', '..', 'test', 'data', 'sample.tif'))

const gdalVersion = () => gdal.version
const gdalReadWKT = () => ds.srs.toWKT()

app.whenReady().then(() => {
  ipcMain.handle('gdal:version', gdalVersion)
  ipcMain.handle('gdal:readWKT', gdalReadWKT)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

