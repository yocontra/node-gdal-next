# v3.0.0 [Finishing Cleanup]

- Switch from nan to N-API
  - Normalize the build system for this package to match more recent native modules like node-sqlite
- Switch off of G++ to Clang for all CI work
- Reduce the manual patching done in the gdal format gyp files
- Move from Travis-CI to CircleCI

# v4.0.0 [New Features]

- Automate dependency updates and prebuilt binaries for new node releases
  - It would be nice if we had a bot that did this weekly
- Find a way to keep the dependency source code out of the repository to reduce noise
- Build out an async API
- Add a streaming API for parsing files
- Improve performance by reducing parse/serialize flows
  - `Geometry.toObject()`
  - `Geometry.fromGeoJson()`
