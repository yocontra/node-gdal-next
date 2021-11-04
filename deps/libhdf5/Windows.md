# Generating `H5pubconf.h` and `settings-win.c`

From the official h5df sources root while having the VS2019 environment and CMake:
```
mkdir build
cd build
cmake .. -DDEFAULT_API_VERSION:STRING=v18 -DHDF5_BUILD_CPP_LIB:BOOL=ON -DHDF5_ENABLE_THREADSAFE:BOOL=ON -DHDF5_BUILD_HL_LIB:BOOL=ON -DALLOW_UNSUPPORTED:BOOL=ON
cd src
msbuild H5make_libsettings.vcxproj
..\bin\Debug\HD5make_libsettings.exe > settings-win.c
```

After this both files will be in your current directory

**The resulting build will be thread-safe when used with GDAL for NetCDF but not for HDF5 since this is not a supported configuration**

You can enable Z_LIB manually, it will be present when building in the Node.js environment

