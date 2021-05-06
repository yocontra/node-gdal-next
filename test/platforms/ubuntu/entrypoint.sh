#!/bin/bash

echo "Preparing source tree"
cp -a /src /target
cd /target
rm -rf build node_modules package-lock.json test/data
git checkout test/data
npm install --ignore-scripts
npx @mapbox/node-pre-gyp configure --shared_gdal
npx @mapbox/node-pre-gyp build -j max
npm test
# Launch docker -it ... /bin/bash to get a shell after running the test
exec $@