
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
  uv_mutex_t *async_lock;
#if GDAL_VERSION_MAJOR < 2
  OGRDataSource *ptr_datasource;
#endif
};

namespace node_gdal {

// A class for cleaning up GDAL objects that depend on open datasets

// Async lock semantics:
// * There is one global master lock
// * There is one async lock per dataset
// * All operations on the PtrManager should acquire the master_lock
// - This implicit in all cases except isAlive()
// - The caller should explicitly lock isAlive()
// * All objects carry the dataset uid
// * All I/O operations on the dataset require locking the dataset async_lock
// - This is best accomplished though tryLockDataSet
// * Deadlock avoidance strategy:
// - One should never lock the master lock while holding an async_lock
//
// Weaknesses:
// - A long-running operation has locked a dataset
// - Another operation on that dataset tries to get its async_lock
// - While the second operation is waiting, creating new datasets is blocked

class PtrManager {
    public:
  long add(GDALDataset *ptr, uv_mutex_t *async_lock);
#if GDAL_VERSION_MAJOR < 2
  long add(OGRDataSource *ptr);
#endif
  long add(GDALRasterBand *ptr, long parent_uid);
  long add(OGRLayer *ptr, long parent_uid, bool is_result_set);
  void dispose(long uid);
  bool isAlive(long uid);
  uv_mutex_t *tryLockDataset(long uid);
  void lock();
  void unlock();

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