
# 3.4
- GDAL 3.4
- Add EventEmitters
- Add a streaming API for parsing files

# 3.5
- Switch from nan to N-API
- Support aborting of GDAL operations (that allow it) through the AbortController (Node.js >= 15)

# One day, maybe

  - Normalize the build system for this package to match more recent native modules like node-sqlite
- Switch off of G++ to Clang for all CI work
- Find a way to keep the dependency source code out of the repository to reduce noise
- Reduce the manual patching done in the gdal format gyp files
- Automate dependency updates and prebuilt binaries for new node releases
  - It would be nice if we had a bot that did this weekly
