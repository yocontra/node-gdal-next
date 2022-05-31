# Building for Electron

:warning: Unlike stock Node.js, Electron does not export OpenSSL for its native modules and `https` based protocols are not supported

# UNIX

```shell
export npm_config_disturl=https://electronjs.org/headers
export npm_config_runtime=electron
export npm_config_target=19.0.1
npm install --save gdal-async
```

# Windows

:warning: This is still highly experimental. The binary distribution of Electron, unlike Node.js, is built using `clang`/`libc++` and is not fully binary compatible with `MSVC` built projects.

First of all, install `clang` >= 14.0.0 for Windows from [https://releases.llvm.org/download.html](https://releases.llvm.org/download.html).

Checkout and build `libc++` according to their instructions. This is a very important step since it is using `libc++` which renders the module compatible with Electron.

Alternatively, follow Electron's build instructions for Windows - when building it, you will also obtain `libc++`.

Checkout `gdal-async` from git and do the following:
```cmd
set npm_config_disturl=https://electronjs.org/headers
set npm_config_runtime=electron
set npm_config_target=19.0.1
npx node-pre-gyp configure
```

Then go edit `build/gdal.vcxproj` (there is no way to do this from a configuration file: [#1573](https://github.com/nodejs/node-gyp/issues/1537), [#2309](https://github.com/nodejs/node-gyp/issues/2309)) and add the following `PropertyGroup`:
```xml
<PropertyGroup>
  <CLToolExe>clang-cl.exe</CLToolExe>
  <CLToolPath>C:\Program Files\LLVM\bin</CLToolPath>
</PropertyGroup>
```

Remove from the `Release` `<ItemDefinitionGroup>`:
```xml
<RuntimeLibrary>MultiThreadedDebug</RuntimeLibrary>
```

Then manually add in `<Link>/<AdditionalDependencies>` your own `libc++`

Then build normally:
```cmd
npx node-pre-gyp build -j max
```

You will obtain a `gdal.node` that you will be able to use with Electron in `build\Release\gdal.node`
