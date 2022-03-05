#ifndef __GDAL_ALGORITHMS_H__
#define __GDAL_ALGORITHMS_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// gdal
#include <gdal_alg.h>
#include <gdal_priv.h>

// ogr
#include <ogrsf_frmts.h>

#include "async.hpp"

using namespace v8;
using namespace node;

// Methods from gdal_alg.h
// https://gdal.org/doxygen/gdal__alg_8h.html

namespace node_gdal {
namespace Algorithms {

void Initialize(Local<Object> target);

GDAL_ASYNCABLE_GLOBAL(fillNodata);
GDAL_ASYNCABLE_GLOBAL(contourGenerate);
GDAL_ASYNCABLE_GLOBAL(sieveFilter);
GDAL_ASYNCABLE_GLOBAL(checksumImage);
GDAL_ASYNCABLE_GLOBAL(polygonize);
NAN_METHOD(addPixelFunc);
NAN_METHOD(toPixelFunc);
GDAL_ASYNCABLE_GLOBAL(_acquireLocks);
} // namespace Algorithms
} // namespace node_gdal

#endif
