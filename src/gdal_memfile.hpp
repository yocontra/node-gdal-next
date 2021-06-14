#ifndef __NODE_GDAL_MEMFILE_H__
#define __NODE_GDAL_MEMFILE_H__

// node
#include <node.h>
#include <node_buffer.h>
#include <node_object_wrap.h>

// nan
#include "nan-wrapper.h"

// gdal
#include <gdal_priv.h>

using namespace v8;
using namespace node;

// A vsimem file

namespace node_gdal {

class Memfile {
  void *data;
  size_t len;
  Nan::Persistent<Object> *weakHandle;
  static void weakCallback(const Nan::WeakCallbackInfo<Memfile> &);

    public:
  std::string filename;
  Memfile(void *, size_t);
  static Memfile *get(Local<Object>);
  void release();
  static std::map<void *, Memfile *> memfile_collection;
};
} // namespace node_gdal
#endif
