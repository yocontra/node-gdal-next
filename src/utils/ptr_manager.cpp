#include "ptr_manager.hpp"
#include "../gdal_dataset.hpp"
#include "../gdal_group.hpp"
#include "../gdal_mdarray.hpp"
#include "../gdal_dimension.hpp"
#include "../gdal_attribute.hpp"
#include "../gdal_layer.hpp"
#include "../gdal_rasterband.hpp"

#include <sstream>
#include <thread>

// This is the other half of the mechanism called ObjectCache found in every
// JS-exposed class wrapping a GDAL base class
//
// It keeps track of created objects so that they can be reused
//
// It is called ObjectCache but its proper name should be ObjectStore as objects
// are not deleted unless expired by the GC
//
// The point of this mechanism is that it returns a reference to the same object
// for two successive calls of `ds.bands.get(1)` for example
//
// TODO: Merge everything in a single template

namespace node_gdal {

void uv_sem_deleter::operator()(uv_sem_t *p) {
  uv_sem_destroy(p);
  delete p;
}

PtrManager::PtrManager()
  : uid(1),
    layers(),
    bands(),
    datasets()
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
    ,
    groups(),
    arrays(),
    dimensions(),
    attributes()
#endif
{
  uv_mutex_init_recursive(&master_lock);
}

PtrManager::~PtrManager() {
}

inline void PtrManager::lock() {
  uv_mutex_lock(&master_lock);
}

inline void PtrManager::unlock() {
  uv_mutex_unlock(&master_lock);
}

bool PtrManager::isAlive(long uid) {
  if (uid == 0) return true;
  return bands.count(uid) > 0 || layers.count(uid) > 0 || datasets.count(uid) > 0
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
    || groups.count(uid) > 0 || arrays.count(uid) > 0 || dimensions.count(uid) > 0 || attributes.count(uid) > 0
#endif
    ;
}

shared_ptr<uv_sem_t> PtrManager::tryLockDataset(long uid) {
  while (true) {
    lock();
    auto parent = datasets.find(uid);
    if (parent != datasets.end()) {
      int r = uv_sem_trywait(parent->second->async_lock.get());
      unlock();
      if (r == 0) return parent->second->async_lock;
    } else {
      unlock();
      throw "Parent Dataset object has already been destroyed";
    }
    std::this_thread::yield();
  }
}

vector<shared_ptr<uv_sem_t>> PtrManager::tryLockDatasets(vector<long> uids) {
  // There is lots of copying around here but these vectors are never longer than 3 elements
  // Avoid deadlocks
  std::sort(uids.begin(), uids.end());
  // Eliminate dupes
  uids.erase(std::unique(uids.begin(), uids.end()), uids.end());
  while (true) {
    vector<shared_ptr<uv_sem_t>> locks;
    lock();
    for (long uid : uids) {
      if (!uid) continue;
      auto parent = datasets.find(uid);
      if (parent == datasets.end()) {
        unlock();
        throw "Parent Dataset object has already been destroyed";
      }
      locks.push_back(parent->second->async_lock);
    }
    vector<shared_ptr<uv_sem_t>> locked;
    int r = 0;
    for (shared_ptr<uv_sem_t> &async_lock : locks) {
      r = uv_sem_trywait(async_lock.get());
      if (r == 0) {
        locked.push_back(async_lock);
      } else {
        // We failed acquiring one of the locks =>
        // free all acquired locks and start a new cycle
        for (shared_ptr<uv_sem_t> &lock : locked) { uv_sem_post(lock.get()); }
        break;
      }
    }
    unlock();
    if (r == 0) return locks;
    std::this_thread::yield();
  }
}

template <> inline constexpr uidmap<GDALDataset *> &PtrManager::getUidMap() {
  return datasets;
}
template <> inline void PtrManager::erase(GDALDataset *ptr) {
  Dataset::dataset_cache.erase(ptr);
}
template <> inline constexpr uidmap<OGRLayer *> &PtrManager::getUidMap() {
  return layers;
}
template <> inline void PtrManager::erase(OGRLayer *ptr) {
  Layer::cache.erase(ptr);
}
template <> inline constexpr uidmap<GDALRasterBand *> &PtrManager::getUidMap() {
  return bands;
}
template <> inline void PtrManager::erase(GDALRasterBand *ptr) {
  RasterBand::cache.erase(ptr);
}
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
template <> inline constexpr uidmap<shared_ptr<GDALGroup>> &PtrManager::getUidMap() {
  return groups;
}
template <> inline void PtrManager::erase(shared_ptr<GDALGroup> ptr) {
  Group::group_cache.erase(ptr);
}
template <> inline constexpr uidmap<shared_ptr<GDALMDArray>> &PtrManager::getUidMap() {
  return arrays;
}
template <> inline void PtrManager::erase(shared_ptr<GDALMDArray> ptr) {
  MDArray::array_cache.erase(ptr);
}
template <> inline constexpr uidmap<shared_ptr<GDALDimension>> &PtrManager::getUidMap() {
  return dimensions;
}
template <> inline void PtrManager::erase(shared_ptr<GDALDimension> ptr) {
  Dimension::dimension_cache.erase(ptr);
}
template <> inline constexpr uidmap<shared_ptr<GDALAttribute>> &PtrManager::getUidMap() {
  return attributes;
}
template <> inline void PtrManager::erase(shared_ptr<GDALAttribute> ptr) {
  Attribute::attribute_cache.erase(ptr);
}
#endif

long PtrManager::add(OGRLayer *ptr, long parent_uid, bool is_result_set) {
  lock();
  shared_ptr<PtrManagerItem<OGRLayer *>> item(new PtrManagerItem<OGRLayer *>);
  shared_ptr<PtrManagerItem<GDALDataset *>> parent = datasets[parent_uid];
  item->uid = uid++;
  item->parent = parent;
  item->is_result_set = is_result_set;
  item->ptr = ptr;
  layers[item->uid] = item;
  parent->children.push_back(item->uid);
  unlock();
  return item->uid;
}

long PtrManager::add(GDALDataset *ptr, shared_ptr<uv_sem_t> async_lock) {
  lock();
  shared_ptr<PtrManagerItem<GDALDataset *>> item(new PtrManagerItem<GDALDataset *>);
  item->uid = uid++;
  item->async_lock = async_lock;
  item->ptr = ptr;
  getUidMap<GDALDataset *>()[item->uid] = item;
  unlock();
  return item->uid;
}

template <typename GDALPTR> long PtrManager::add(GDALPTR ptr, long parent_uid) {
  lock();
  shared_ptr<PtrManagerItem<GDALPTR>> item(new PtrManagerItem<GDALPTR>);
  shared_ptr<PtrManagerItem<GDALDataset *>> parent = datasets[parent_uid];
  item->uid = uid++;
  item->parent = parent;
  item->ptr = ptr;
  getUidMap<GDALPTR>()[item->uid] = item;
  parent->children.push_back(item->uid);
  unlock();
  return item->uid;
}

// Explicit instantiation:
// * allows calling ptr_manager.add without <>
// * makes sure that this class template won't be accidentally instantiated with an unsupported type
template long PtrManager::add(GDALRasterBand *, long);
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
template long PtrManager::add(shared_ptr<GDALAttribute>, long);
template long PtrManager::add(shared_ptr<GDALDimension>, long);
template long PtrManager::add(shared_ptr<GDALGroup>, long);
template long PtrManager::add(shared_ptr<GDALMDArray>, long);
#endif

template <> void PtrManager::dispose(shared_ptr<PtrManagerItem<GDALDataset *>> item) {
  lock();
  uv_sem_wait(item->async_lock.get());
  datasets.erase(item->uid);
  uv_sem_post(item->async_lock.get());

  while (!item->children.empty()) { dispose(item->children.back()); }

  if (item->ptr) {
    Dataset::dataset_cache.erase(item->ptr);
    GDALClose(item->ptr);
  }

  unlock();
}

template <typename GDALPTR> void PtrManager::dispose(shared_ptr<PtrManagerItem<GDALPTR>> item) {
  lock();
  shared_ptr<uv_sem_t> async_lock = nullptr;
  try {
    async_lock = tryLockDataset(item->parent->uid);
  } catch (const char *) {};
  erase(item->ptr);
  getUidMap<GDALPTR>().erase(item->uid);
  item->parent->children.remove(item->uid);
  if (async_lock != nullptr) uv_sem_post(async_lock.get());
  unlock();
}

template <> void PtrManager::dispose(shared_ptr<PtrManagerItem<OGRLayer *>> item) {
  lock();
  shared_ptr<uv_sem_t> async_lock = nullptr;
  try {
    async_lock = tryLockDataset(item->parent->uid);
  } catch (const char *) {};
  GDALDataset *parent_ds = item->parent->ptr;
  if (item->is_result_set) { parent_ds->ReleaseResultSet(item->ptr); }
  erase(item->ptr);
  layers.erase(item->uid);
  item->parent->children.remove(item->uid);
  if (async_lock != nullptr) uv_sem_post(async_lock.get());
  unlock();
}

void PtrManager::dispose(long uid) {
  lock();
  if (datasets.count(uid))
    dispose(datasets[uid]);
  else if (layers.count(uid))
    dispose(layers[uid]);
  else if (bands.count(uid))
    dispose(bands[uid]);
#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)
  else if (groups.count(uid))
    dispose(groups[uid]);
  else if (arrays.count(uid))
    dispose(arrays[uid]);
  else if (dimensions.count(uid))
    dispose(dimensions[uid]);
  else if (attributes.count(uid))
    dispose(attributes[uid]);
#endif
  unlock();
}

} // namespace node_gdal