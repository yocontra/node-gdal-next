#ifndef __NODE_GDAL_ASYNC_OPEN_H__
#define __NODE_GDAL_ASYNC_OPEN_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-parameter"
#include <nan.h>
#pragma GCC diagnostic pop

// gdal
#include <gdal_priv.h>

#include "../gdal_dataset.hpp"

namespace node_gdal {

class AsyncOpen : public Nan::AsyncWorker {
    private:
  std::string path;
  unsigned flags;
  GDALDataset *raw;

    public:
  AsyncOpen(Nan::Callback *pCallback, std::string path, unsigned flags);

  void Execute();
  void HandleOKCallback();
  void HandleErrorCallback();
};
} // namespace node_gdal
#endif