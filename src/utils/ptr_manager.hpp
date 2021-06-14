
#ifndef __OBJ_STORE_H__
#define __OBJ_STORE_H__

// node
#include <node.h>

// nan
#include "../nan-wrapper.h"

// gdal
#include <gdal_priv.h>

// ogr
#include <ogrsf_frmts.h>

#include <list>
#include <map>

using namespace v8;
using namespace std;

namespace node_gdal {

typedef shared_ptr<uv_sem_t> AsyncLock;

template <typename GDALPTR> struct ObjectStoreItem {
  long uid;
  shared_ptr<ObjectStoreItem<GDALDataset *>> parent;
  GDALPTR ptr;
  Nan::Persistent<v8::Object> obj;
  ~ObjectStoreItem();
};

template <> struct ObjectStoreItem<OGRLayer *> {
  long uid;
  shared_ptr<ObjectStoreItem<GDALDataset *>> parent;
  OGRLayer *ptr;
  bool is_result_set;
  Nan::Persistent<v8::Object> obj;
  ~ObjectStoreItem();
};

template <> struct ObjectStoreItem<GDALDataset *> {
  long uid;
  shared_ptr<ObjectStoreItem<GDALDataset *>> parent;
  list<long> children;
  GDALDataset *ptr;
  AsyncLock async_lock;
  Nan::Persistent<v8::Object> obj;
  ~ObjectStoreItem();
};

struct uv_sem_deleter {
  void operator()(uv_sem_t *p);
};

class ObjectStore {
    public:
  template <typename GDALPTR> long add(GDALPTR ptr, const Local<Object> &obj, long parent_uid);
  long add(OGRLayer *ptr, const Local<Object> &obj, long parent_uid, bool is_result_set);
  long add(GDALDataset *ptr, const Local<Object> &obj, long parent_uid);

  void dispose(long uid);
  bool isAlive(long uid);
  inline void lockDataset(AsyncLock lock) {
    uv_sem_wait(lock.get());
  }
  inline void unlockDataset(AsyncLock lock) {
    uv_sem_post(lock.get());
    uv_cond_broadcast(&master_sleep);
  }
  inline void unlockDatasets(vector<AsyncLock> locks) {
    for (const AsyncLock &l : locks) uv_sem_post(l.get());
    uv_cond_broadcast(&master_sleep);
  }
  AsyncLock lockDataset(long uid);
  vector<AsyncLock> lockDatasets(vector<long> uids);
  AsyncLock tryLockDataset(long uid);
  vector<AsyncLock> tryLockDatasets(vector<long> uids);

  template <typename GDALPTR>
  static void weakCallback(const Nan::WeakCallbackInfo<shared_ptr<ObjectStoreItem<GDALPTR>>> &data);

  template <typename GDALPTR> bool has(GDALPTR ptr);
  template <typename GDALPTR> Local<Object> get(GDALPTR ptr);

  ObjectStore();
  ~ObjectStore();

    private:
  long uid;
  uv_mutex_t master_lock;
  uv_cond_t master_sleep;
  vector<AsyncLock> _tryLockDatasets(vector<long> uids);
  template <typename GDALPTR> void dispose(shared_ptr<ObjectStoreItem<GDALPTR>> item);
  void do_dispose(long uid);
};

} // namespace node_gdal

#endif
