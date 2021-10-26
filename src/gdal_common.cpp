// node
#include <node.h>

// nan
#include "nan-wrapper.h"

#include <string>

#include "gdal_common.hpp"

using namespace v8;

NAN_SETTER(READ_ONLY_SETTER) {
  std::string name = *Nan::Utf8String(property);
  std::string err = name + " is a read-only property";
  Nan::ThrowError(err.c_str());
}
