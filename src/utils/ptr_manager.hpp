
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
  shared_ptr<uv_sem_t> async_lock;
  Nan::Persistent<v8::Object> obj;
  ~ObjectStoreItem();
};

struct uv_sem_deleter {
  void operator()(uv_sem_t *p);
};

// A class for cleaning up GDAL objects that depend on open datasets

// Async lock semantics:
//
// * There is one global master lock
//
// * There is one async lock per dataset
//
// * All operations on the ObjectStore should acquire the master_lock
// - This implicit in all cases except isAlive()
// - The caller should explicitly lock isAlive()
//
// * All objects carry the dataset uid
//
// * All GDAL operations on an object require locking the parent dataset
// - This is best accomplished though tr.tryLockDataset
//
// * Deadlock avoidance strategy
// - One should never lock the master lock while holding an async_lock
// - Multiple datasets are to be locked with .tryLockDataset which sorts locks
//

class ObjectStore {
    public:
  template <typename GDALPTR> long add(GDALPTR ptr, const Local<Object> &obj, long parent_uid);
  long add(OGRLayer *ptr, const Local<Object> &obj, long parent_uid, bool is_result_set);
  long add(GDALDataset *ptr, const Local<Object> &obj, long parent_uid);

  void dispose(long uid);
  bool isAlive(long uid);
  shared_ptr<uv_sem_t> tryLockDataset(long uid);
  vector<shared_ptr<uv_sem_t>> tryLockDatasets(vector<long> uids);
  inline void lock() {
    uv_mutex_lock(&master_lock);
  }
  inline void unlock() {
    uv_mutex_unlock(&master_lock);
  }

  template <typename GDALPTR>
  static void weakCallback(const Nan::WeakCallbackInfo<shared_ptr<ObjectStoreItem<GDALPTR>>> &data);

  template <typename GDALPTR> inline bool has(GDALPTR ptr);
  template <typename GDALPTR> inline Local<Object> get(GDALPTR ptr);

  ObjectStore();
  ~ObjectStore();

    private:
  long uid;
  uv_mutex_t master_lock;
  template <typename GDALPTR> void dispose(shared_ptr<ObjectStoreItem<GDALPTR>> item);
};

} // namespace node_gdal

#endif
