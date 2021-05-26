#!/bin/bash

set -eu

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/libnetcdf"

NETCDF_VERSION=4.8.0
dir_netcdf=./netcdf

#
# download netcdf source
#

rm -rf $dir_netcdf
if [[ ! -f netcdf-${NETCDF_VERSION}.tar.gz ]]; then
	curl -L https://github.com/Unidata/netcdf-c/archive/refs/tags/v${NETCDF_VERSION}.tar.gz -o netcdf-${NETCDF_VERSION}.tar.gz
fi
tar -xzf netcdf-${NETCDF_VERSION}.tar.gz
mv netcdf-c-${NETCDF_VERSION} $dir_netcdf
cp config.h $dir_netcdf
cat netcdf/include/netcdf_dispatch.h.in | sed 's/@NC_DISPATCH_VERSION@/3/' > netcdf/include/netcdf_dispatch.h
[ -d ${dir_netcdf} ] && rm -rf ${dir_netcdf}/{ncdap_test,ncdump,nc_test,nc_perf,nc_test4}
