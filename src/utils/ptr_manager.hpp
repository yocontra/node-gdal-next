
#ifndef __PTR_MANAGER_H__
#define __PTR_MANAGER_H__

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

template <typename GDALPTR> struct PtrManagerItem {
  long uid;
  shared_ptr<PtrManagerItem<GDALDataset *>> parent;
  GDALPTR ptr;
};

template <> struct PtrManagerItem<OGRLayer *> {
  long uid;
  shared_ptr<PtrManagerItem<GDALDataset *>> parent;
  OGRLayer *ptr;
  bool is_result_set;
};
template <> struct PtrManagerItem<GDALDataset *> {
  long uid;
  list<long> children;
  GDALDataset *ptr;
  shared_ptr<uv_sem_t> async_lock;
};

namespace node_gdal {

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
// * All operations on the PtrManager should acquire the master_lock
// - This implicit in all cases except isAlive()
// - The caller should explicitly lock isAlive()
//
// * All objects carry the dataset uid
//
// * All GDAL operations on an object require locking the parent dataset
// - This is best accomplished though tryLockDataSet
//
// * Deadlock avoidance strategy
// - One should never lock the master lock while holding an async_lock
// - Multiple datasets are to be locked with tryLockDatasets which sorts locks
//

template <typename GDALPTR> using uidmap = map<long, shared_ptr<PtrManagerItem<GDALPTR>>>;
class PtrManager {
    public:
  template <typename GDALPTR> long add(GDALPTR ptr, long parent_uid);
  long add(OGRLayer *ptr, long parent_uid, bool is_result_set);
  long add(GDALDataset *ptr, shared_ptr<uv_sem_t> async_lock);

  void dispose(long uid);
  bool isAlive(long uid);
  shared_ptr<uv_sem_t> tryLockDataset(long uid);
  vector<shared_ptr<uv_sem_t>> tryLockDatasets(vector<long> uids);
  inline void lock();
  inline void unlock();

  PtrManager();
  ~PtrManager();

    private:
  long uid;
  uv_mutex_t master_lock;
  template <typename GDALPTR> void dispose(shared_ptr<PtrManagerItem<GDALPTR>> item);

  // this is a manual implementation of member overloading which does not exist in C++
  template <typename GDALPTR> inline constexpr uidmap<GDALPTR> &getUidMap();

  template <typename GDALPTR> inline void erase(GDALPTR item);

  uidmap<OGRLayer *> layers;
  uidmap<GDALRasterBand *> bands;
  uidmap<GDALDataset *> datasets;
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
  uidmap<shared_ptr<GDALGroup>> groups;
  uidmap<shared_ptr<GDALMDArray>> arrays;
  uidmap<shared_ptr<GDALDimension>> dimensions;
  uidmap<shared_ptr<GDALAttribute>> attributes;
#endif
};

} // namespace node_gdal

#endif