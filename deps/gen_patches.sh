#!/bin/bash

if [ ! -d "$1" ]; then
  echo "usage:"
  echo "~/src/node-gdal-async/deps$ gen_patches.sh <dep_dir>"
  exit 1
fi

for ORIG in `find $1 -name *.orig`; do
  FILE=`echo ${ORIG} | rev | cut -f 2- -d "." | rev`
  DIFF=`echo ${FILE} | tr '/' '_'`
  echo $1/patches/${DIFF}.diff
  diff -bu ${ORIG} ${FILE} > $1/patches/${DIFF}.diff
done
