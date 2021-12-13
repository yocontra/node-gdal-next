#!/bin/bash

set -eu

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/libopenjpeg"

OPENJPEG_VERSION=2.4.0
dir_openjpeg=./openjpeg

#
# download openjpeg source
#

rm -rf $dir_openjpeg
if [[ ! -f openjpeg-${OPENJPEG_VERSION}.tar.gz ]]; then
  curl -L https://github.com/uclouvain/openjpeg/archive/refs/tags/v${OPENJPEG_VERSION}.tar.gz -o openjpeg-${OPENJPEG_VERSION}.tar.gz
fi
tar -xzf openjpeg-${OPENJPEG_VERSION}.tar.gz
mv openjpeg-${OPENJPEG_VERSION} $dir_openjpeg
cp opj_config_private.h opj_config.h $dir_openjpeg/src/lib/openjp2
