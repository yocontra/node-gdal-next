# Generating `H5pubconf.h`, `libhdf5.settings` and `H5build_settings.c`

From the official h5df sources root while having the VS2019 environment and CMake:
```
mkdir build
cd build
cmake .. -DHDF5_BUILD_CPP_LIB:BOOL=ON -DHDF5_BUILD_HL_LIB:BOOL=ON -DALLOW_UNSUPPORTED:BOOL=ON -DZLIB_LIBRARY:FILEPATH=C:\Users\mmom\AppData\Local\node-gyp\Cache\18.13.0\x64\node.lib -DZLIB_INCLUDE_DIR:PATH=C:\Users\mmom\AppData\Local\node-gyp\Cache\18.13.0\include\node -DHDF5_ENABLE_SZIP_SUPPORT:BOOL=OFF
```

**The resulting build will be thread-safe when used with GDAL for NetCDF but not for HDF5 since this is not a supported configuration**

