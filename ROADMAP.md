# v1.0.0

- Finish updating dependencies (one test is failing)
- Update the test and build matrix to support every node version >= 10
  - Get all of the tests passing for these versions
  - Get prebuilt binaries published for these versions

# v2.0.0

- Switch from nan to N-API
  - Normalize the build system for this package to match more recent native modules like node-sqlite
- Automate the yuidoc publishing
- Build out an async API
- Add a streaming API for parsing files
- Find a way to keep the dependency source code out of the repository to reduce noise
- Reduce the number of manual patching done in the gdal format gyp files
- Automate dependency updates and prebuilt binaries for new node releases
  - It would be nice if we had a bot that did this weekly
