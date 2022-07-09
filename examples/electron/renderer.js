// Here I can call GDAL
window.electronAPI.gdalVersion().then((version) => console.log('obtained in main', version))
