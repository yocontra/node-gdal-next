const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  ipcRenderer.invoke('gdal:version').then((version) => replaceText('gdal-version', version))
  ipcRenderer.invoke('gdal:readWKT').then((wkt) => replaceText('gdal-wkt', wkt));
})

contextBridge.exposeInMainWorld('electronAPI', {
  gdalVersion: () => ipcRenderer.invoke('gdal:version')
})
