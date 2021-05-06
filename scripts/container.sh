#!/bin/sh

OP=$1
UBUNTU=$2
NODEJS=$3
if [ -z "${OP}" ]; then
  OP=all
fi
if [ -z "${UBUNTU}" ]; then
  UBUNTU=20.04
fi
if [ -z "${NODEJS}" ]; then
  NODEJS=lts
fi

SEP="\n=======================================================\n"
case ${OP} in
  all|build)
    echo -e ${SEP}
    echo "Building container ubuntu-node-gdal:${UBUNTU}_${NODEJS}"
    echo -e ${SEP}
    docker build --build-arg UBUNTU=${UBUNTU} --build-arg NODEJS=${NODEJS} -t ubuntu-node-gdal:${UBUNTU}_${NODEJS} test/platforms/ubuntu
esac
case ${OP} in
  all|test)
    echo -e ${SEP}
    echo "Testing in ubuntu-node-gdal:${UBUNTU}_${NODEJS}"
    echo -e ${SEP}
    docker run -v `pwd`:/src ubuntu-node-gdal:16.04
    ;;
  shell)
    echo -e ${SEP}
    echo "Testing in ubuntu-node-gdal:${UBUNTU}_${NODEJS} and running a shell"
    echo -e ${SEP}
    docker run -it -v `pwd`:/src ubuntu-node-gdal:16.04 /bin/bash
    ;;
esac