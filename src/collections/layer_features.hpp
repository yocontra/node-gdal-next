#ifndef __NODE_GDAL_FEATURE_COLLECTION_H__
#define __NODE_GDAL_FEATURE_COLLECTION_H__

// node
#include <node.h>
#include <node_object_wrap.h>

// nan
#include "../nan-wrapper.h"

// gdal
#include <gdal_priv.h>

#include "../async.hpp"

using namespace v8;
using namespace node;

namespace node_gdal {

class LayerFeatures : public Nan::ObjectWrap {
    public:
  static Nan::Persistent<FunctionTemplate> constructor;

  static void Initialize(Local<Object> target);
  static NAN_METHOD(New);
  static Local<Value> New(Local<Value> layer_obj);
  static NAN_METHOD(toString);

  GDAL_ASYNCABLE_DECLARE(get);
  GDAL_ASYNCABLE_DECLARE(first);
  GDAL_ASYNCABLE_DECLARE(next);
  GDAL_ASYNCABLE_DECLARE(count);
  GDAL_ASYNCABLE_DECLARE(add);
  GDAL_ASYNCABLE_DECLARE(set);
  GDAL_ASYNCABLE_DECLARE(remove);

  static NAN_GETTER(layerGetter);

  LayerFeatures();

    private:
  ~LayerFeatures();
};

} // namespace node_gdal
#endif
