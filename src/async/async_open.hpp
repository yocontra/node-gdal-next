#ifndef __NODE_GDAL_ASYNC_OPEN_H__
#define __NODE_GDAL_ASYNC_OPEN_H__

#include <functional>

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

/**
 * This class handles async open
 *
 * The caller must provide a lambda that can be executed in
 * another thread with the proper open sequence
 */
class AsyncOpen : public Nan::AsyncWorker {
    private:
  std::function<GDALDataset *()> doit;
  GDALDataset *raw;

    public:
  explicit AsyncOpen(Nan::Callback *pCallback, const std::function<GDALDataset *()> doit);

  void Execute();
  void HandleOKCallback();
  void HandleErrorCallback();
};
} // namespace node_gdal
#endif