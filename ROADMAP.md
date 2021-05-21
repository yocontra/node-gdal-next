
# 3.3
- GDAL 3.3
- Add EventEmitters
- Support aborting of GDAL operations (that allow it) through the AbortController (Node.js >= 15)
- *Dropping support for Node.js 10.x, GDAL 1.x, Python 2 and Ubuntu 16.04*

# One day, maybe

- Switch from nan to N-API
  - Normalize the build system for this package to match more recent native modules like node-sqlite
- Switch off of G++ to Clang for all CI work
- Add a streaming API for parsing files
- Find a way to keep the dependency source code out of the repository to reduce noise
- Reduce the manual patching done in the gdal format gyp files
- Automate dependency updates and prebuilt binaries for new node releases
  - It would be nice if we had a bot that did this weekly
