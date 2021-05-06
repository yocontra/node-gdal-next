#!/bin/bash

cd /src
rm -rf build
npm install --ignore-scripts
npx @mapbox/node-pre-gyp configure --shared_gdal
npx @mapbox/node-pre-gyp build -j max
npm test
# Launch docker -it ... /bin/bash to get a shell after running the test
exec $@