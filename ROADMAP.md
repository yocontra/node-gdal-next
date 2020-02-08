# v1.0.0

- Finish updating dependencies (one test is failing)
- Define clearly which versions of node are supported, and make sure they are all in the test matrix
  - Get all of the tests passing for these versions
  - Get prebuilt binaries published for these versions
- Add GPKG support (possible now that the dependencies are updated)

# v2.0.0

- Switch from nan to N-API
- Find a way to keep the dependency source code out of the repository to reduce noise
- Reduce the number of manual patching done in the gdal format gyp files
- Automate dependency updates and prebuilt binaries for new node releases
  - It would be nice if we had a bot that did this weekly
