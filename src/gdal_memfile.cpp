#include "gdal_memfile.hpp"

namespace node_gdal {

std::map<void *, Memfile *> Memfile::memfile_collection;

Memfile::Memfile(void *data, size_t len) : data(data), len(len) {
  char _filename[32];
  // The pointer makes for a perfect unique filename
  snprintf(_filename, sizeof(_filename), "/vsimem/%p", data);
  this->filename = _filename;
}

void Memfile::weakCallback(const Nan::WeakCallbackInfo<Memfile> &file) {
  Memfile *mem = file.GetParameter();
  memfile_collection.erase(mem->data);
  VSIUnlink(mem->filename.c_str());
  delete mem->weakHandle;
  delete mem;
}

Memfile *Memfile::get(Local<Object> buffer) {
  void *data = node::Buffer::Data(buffer);
  if (data == nullptr) {
    return nullptr;
  }
  if (memfile_collection.count(data)) return memfile_collection.find(data)->second;

  size_t len = node::Buffer::Length(buffer);
  Memfile *mem = new Memfile(data, len);

  VSILFILE *vsi = VSIFileFromMemBuffer(mem->filename.c_str(), (GByte *)data, len, 0);
  VSIFCloseL(vsi);

  mem->weakHandle = new Nan::Persistent<Object>(buffer);
  mem->weakHandle->SetWeak(mem, weakCallback, Nan::WeakCallbackType::kParameter);

  memfile_collection[data] = mem;
  return mem;
}

} // namespace node_gdal
