
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

struct PtrManagerDatasetItem;
struct PtrManagerLayerItem {
  long uid;
  PtrManagerDatasetItem *parent;
  OGRLayer *ptr;
  bool is_result_set;
};

struct PtrManagerRasterBandItem {
  long uid;
  PtrManagerDatasetItem *parent;
  GDALRasterBand *ptr;
};

struct PtrManagerDatasetItem {
  long uid;
  std::list<PtrManagerLayerItem *> layers;
  std::list<PtrManagerRasterBandItem *> bands;
  GDALDataset *ptr;
  uv_sem_t *async_lock;
};

namespace node_gdal {

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

class PtrManager {
    public:
  long add(GDALDataset *ptr, uv_sem_t *async_lock);
  long add(GDALRasterBand *ptr, long parent_uid);
  long add(OGRLayer *ptr, long parent_uid, bool is_result_set);
  void dispose(long uid);
  bool isAlive(long uid);
  uv_sem_t *tryLockDataset(long uid);
  std::vector<uv_sem_t *> tryLockDatasets(std::vector<long> uids);
  inline void lock();
  inline void unlock();

  PtrManager();
  ~PtrManager();

    private:
  long uid;
  uv_mutex_t master_lock;
  void dispose(PtrManagerLayerItem *item);
  void dispose(PtrManagerRasterBandItem *item);
  void dispose(PtrManagerDatasetItem *item);
  std::map<long, PtrManagerLayerItem *> layers;
  std::map<long, PtrManagerRasterBandItem *> bands;
  std::map<long, PtrManagerDatasetItem *> datasets;
};

} // namespace node_gdal

#endif