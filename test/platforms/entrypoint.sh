#!/bin/bash

SEP="\n=======================================================\n"
echo -e "${SEP}Preparing source tree${SEP}"
rsync -r /src/ /target --exclude=build --exclude=test/data --exclude node_modules
cd /target
rm -rf lib/binding package-lock.json
git checkout test/data
npm install --ignore-scripts

if [ "${GDAL}" == "shared" ]; then
  GDAL_OPT="--shared_gdal"
  GDAL_NAME="system-installed"
else
  GDAL_OPT=""
  GDAL_NAME="bundled"
fi

case ${1} in
  DEV)
    echo -e "${SEP}Testing current version against ${GDAL_NAME} GDAL${SEP}"
    echo npx @mapbox/node-pre-gyp configure ${GDAL_OPT}
    npx @mapbox/node-pre-gyp configure ${GDAL_OPT}
    npx @mapbox/node-pre-gyp build -j max
    npm test
    R=$?
    ;;

  RELEASE)
    echo -e "${SEP}Testing pre-built binary${SEP}"
    npx @mapbox/node-pre-gyp install
    npm test
    R=$?
    ;;

  PUBLISH)
    echo -e "${SEP}Publishing pre-built binary${SEP}"
    npx @mapbox/node-pre-gyp configure
    npx @mapbox/node-pre-gyp build -j max
    npm test
    npx @mapbox/node-pre-gyp package
    npx node-pre-gyp-github publish
    R=$?
    ;;
esac

# Launch docker -it ... /bin/bash to get a shell after running the test
if [ ! -z "${2}" ]; then
  shift
  exec $@
fi

exit $R