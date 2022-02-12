#!/bin/sh

OP=$1
DIST=$2
NODEJS=$3
GDAL=$4
if [ -z "${OP}" ]; then
  echo "container.sh <release|dev|shell> [ubuntu:{18.04|20.04|21.10}|centos:stream8|fedora:{33|34}|debian:{buster|bullseye}|amazonlinux] [<Node.js version>] [shared]"
  exit 1
fi
if [ ! -d "test/platforms" ]; then
  echo "This command must be run from the node-gdal-async root directory"
  exit 1
fi

if [ -z "${DIST}" ]; then
  DIST=ubuntu
  VERSION=16.04
else
  VERSION=`echo ${DIST} | cut -f 2 -d":"`
  DIST=`echo ${DIST} | cut -f 1 -d":"`
fi
if [ -z "${NODEJS}" ]; then
  NODEJS=lts
fi
if [ -z "${GDAL}" ]; then
  GDAL="bundled"
fi

CONTAINER="${DIST}-node-gdal:${VERSION}_${NODEJS}_${GDAL}"
SEP="\n=======================================================\n"
echo -e "${SEP}Building container ${CONTAINER}${SEP}"

docker build \
        --build-arg VERSION=${VERSION} --build-arg NODEJS=${NODEJS} --build-arg GDAL=${GDAL} \
        -t ${CONTAINER} -f test/platforms/Dockerfile.${DIST} test/platforms

case ${OP} in
  release)
    echo -e "${SEP}Testing in ${CONTAINER}${SEP}"
    docker run --env MOCHA_TEST_NETWORK -v `pwd`:/src ${CONTAINER} RELEASE || exit 1
    ;;
  dev)
    echo -e "${SEP}Testing in ${CONTAINER}${SEP}"
    docker run --env MOCHA_TEST_NETWORK -v `pwd`:/src ${CONTAINER} DEV || exit 1
    ;;
  publish)
    echo -e "${SEP}Publishing in ${CONTAINER}${SEP}"
    docker run --env MOCHA_TEST_NETWORK --env NODE_PRE_GYP_GITHUB_TOKEN -v `pwd`:/src ${CONTAINER} PUBLISH || exit 1
    ;;
  shell)
    echo -e "${SEP}Testing in ${CONTAINER} and running a shell${SEP}"
    docker run -it --env MOCHA_TEST_NETWORK -v `pwd`:/src ${CONTAINER} DEV /bin/bash
    ;;
  asan)
    echo -e "${SEP}Testing w/asan in ${CONTAINER}${SEP}"
    docker run --env MOCHA_TEST_NETWORK -v `pwd`:/src ${CONTAINER} DEV || exit 1
    ;;
esac
