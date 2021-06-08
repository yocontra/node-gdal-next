#ifndef __NODE_GDAL_ARRAY_DIMENSIONS_COLLECTION_H__
#define __NODE_GDAL_ARRAY_DIMENSIONS_COLLECTION_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// gdal
#include <gdal_priv.h>

#include "group_collection.hpp"
#include "../gdal_dimension.hpp"
#include "../gdal_mdarray.hpp"

#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)

using namespace v8;
using namespace node;

namespace node_gdal {

class ArrayDimensions : public GroupCollection<ArrayDimensions, GDALDimension, GDALMDArray, Dimension, MDArray> {
    public:
  static constexpr const char *_className = "ArrayDimensions";
  static Nan::Persistent<FunctionTemplate> constructor;
  static int __getIdx(std::shared_ptr<GDALMDArray> parent, std::string const &name);
  static std::shared_ptr<GDALDimension> __get(std::shared_ptr<GDALMDArray> parent, std::string const &name);
  static std::shared_ptr<GDALDimension> __get(std::shared_ptr<GDALMDArray> parent, size_t idx);
  static std::vector<std::string> __getNames(std::shared_ptr<GDALMDArray> parent);
  static int __count(std::shared_ptr<GDALMDArray> parent);
};

} // namespace node_gdal
#endif
#endif
