#!/bin/sh

OP=$1
DIST=$2
VERSION=$3
NODEJS=$4
GDAL=$5
if [ -z "${OP}" ]; then
  OP=all
fi
if [ -z "${DIST}" ]; then
  DIST=ubuntu
fi
if [ -z "${VERSION}" ]; then
  VERSION=20.04
fi
if [ -z "${NODEJS}" ]; then
  NODEJS=lts
fi
if [ -z "${GDAL}" ]; then
  GDAL=""
fi

SEP="\n=======================================================\n"
case ${OP} in
  all|build)
    echo -e ${SEP}
    echo "Building container ${DIST}-node-gdal:${VERSION}_${NODEJS}${GDAL}"
    echo -e ${SEP}
    docker build --build-arg VERSION=${VERSION} --build-arg NODEJS=${NODEJS} --build-arg GDAL=${GDAL} -t ${DIST}-node-gdal:${VERSION}_${NODEJS}${GDAL} -f test/platforms/${DIST}/Dockerfile test/platforms
esac
case ${OP} in
  all|test)
    echo -e ${SEP}
    echo "Testing in ${DIST}-node-gdal:${VERSION}_${NODEJS}${GDAL}"
    echo -e ${SEP}
    docker run -v `pwd`:/src ${DIST}-node-gdal:${VERSION}_${NODEJS}${GDAL}
    ;;
  shell)
    echo -e ${SEP}
    echo "Testing in ${DIST}-node-gdal:${VERSION}_${NODEJS}${GDAL} and running a shell"
    echo -e ${SEP}
    docker run -it -v `pwd`:/src ${DIST}-node-gdal:${VERSION}_${NODEJS}${GDAL} /bin/bash
    ;;
esac
