#include "gdal_memfile.hpp"

namespace node_gdal {

/**
 * @for gdal
 * @property vsimem
 * @type {vsimem}
 */

/**
 * @class vsimem
 * Operations on in-memory /vsimem/ files
 */

std::map<void *, Memfile *> Memfile::memfile_collection;

Memfile::Memfile(void *data, const std::string &filename) : data(data), filename(filename) {
}

Memfile::Memfile(void *data) : data(data) {
  char _filename[32];
  // The pointer makes for a perfect unique filename
  snprintf(_filename, sizeof(_filename), "/vsimem/%p", data);
  this->filename = _filename;
}

Memfile::~Memfile() {
  delete persistent;
}

void Memfile::weakCallback(const Nan::WeakCallbackInfo<Memfile> &file) {
  Memfile *mem = file.GetParameter();
  memfile_collection.erase(mem->data);
  VSIUnlink(mem->filename.c_str());
  delete mem;
}

void Memfile::Initialize(Local<Object> target) {
  Local<Object> vsimem = Nan::New<Object>();
  Nan::Set(target, Nan::New("vsimem").ToLocalChecked(), vsimem);
  Nan::SetMethod(vsimem, "_anonymous", Memfile::vsimemAnonymous); // not a public API
  Nan::SetMethod(vsimem, "set", Memfile::vsimemSet);
  Nan::SetMethod(vsimem, "release", Memfile::vsimemRelease);
}

// Anonymous buffers are handled by the GC
// Whenever the JS buffer goes out of scope, the file is deleted
Memfile *Memfile::get(Local<Object> buffer) {
  if (!Buffer::HasInstance(buffer)) return nullptr;
  void *data = Buffer::Data(buffer);
  if (data == nullptr) return nullptr;
  if (memfile_collection.count(data)) return memfile_collection.find(data)->second;

  size_t len = Buffer::Length(buffer);
  Memfile *mem = nullptr;
  mem = new Memfile(data);

  VSILFILE *vsi = VSIFileFromMemBuffer(mem->filename.c_str(), (GByte *)data, len, 0);
  if (vsi == nullptr) return nullptr;
  VSIFCloseL(vsi);

  mem->persistent = new Nan::Persistent<Object>(buffer);
  mem->persistent->SetWeak(mem, weakCallback, Nan::WeakCallbackType::kParameter);
  memfile_collection[data] = mem;
  return mem;
}

// Named buffers are protected from the GC and are owned by Node
Memfile *Memfile::get(Local<Object> buffer, const std::string &filename) {
  if (!Buffer::HasInstance(buffer)) return nullptr;
  void *data = node::Buffer::Data(buffer);
  if (data == nullptr) { return nullptr; }

  size_t len = node::Buffer::Length(buffer);
  Memfile *mem = nullptr;
  mem = new Memfile(data, filename);

  VSILFILE *vsi = VSIFileFromMemBuffer(mem->filename.c_str(), (GByte *)data, len, 0);
  if (vsi == nullptr) return nullptr;
  VSIFCloseL(vsi);

  mem->persistent = new Nan::Persistent<Object>(buffer);
  memfile_collection[data] = mem;
  return mem;
}

/**
 * Create an in-memory /vsimem/ file from a Buffer.
 * This is a zero-copy operation - GDAL will read from the Buffer which will be
 * protected by the GC even if it goes out of scope.
 * The file will stay in memory until it is deleted with gdal.vsimem.release.
 *
 * @static
 * @method set
 * @param {Buffer} data A binary buffer containing the file data
 * @param {string} filename A file name beginning with /vsimem/
 */
NAN_METHOD(Memfile::vsimemSet) {
  Nan::HandleScope scope;
  Local<Object> buffer;
  std::string filename;

  NODE_ARG_OBJECT(0, "buffer", buffer);
  NODE_ARG_STR(1, "filename", filename);

  Memfile *memfile = Memfile::get(buffer, filename);
  if (memfile == nullptr) Nan::ThrowError("Failed creating in-memory file");
}

/*
 * This creates an anonymous vsimem file from a Buffer
 * It is automatically deleted when the Buffer goes out of scope
 * This is not a public method as it is not always safe
 */
NAN_METHOD(Memfile::vsimemAnonymous) {
  Nan::HandleScope scope;
  Local<Object> buffer;

  NODE_ARG_OBJECT(0, "buffer", buffer);

  Memfile *memfile = Memfile::get(buffer);
  if (memfile == nullptr)
    Nan::ThrowError("Failed creating in-memory file");
  else
    info.GetReturnValue().Set(Nan::New<String>(memfile->filename).ToLocalChecked());
}

/**
 * Delete and retrieve the contents of an in-memory /vsimem/ file.
 * This is a very fast zero-copy operation.
 * It does not block the event loop.
 * The file must not be open.
 * If the file was created by vsimem.set, it will return a reference
 * to the same Buffer that was used to create it.
 * Otherwise it will construct a new Buffer object with the GDAL
 * allocated buffer as its backing store.
 *
 * @static
 * @method release
 * @param {string} filename A file name beginning with /vsimem/
 * @throws
 * @return {Buffer} A binary buffer containing all the data
 */
NAN_METHOD(Memfile::vsimemRelease) {
  vsi_l_offset len;
  std::string filename;
  NODE_ARG_STR(0, "filename", filename);

  CPLErrorReset();
  void *data = VSIGetMemFileBuffer(filename.c_str(), &len, false);
  if (data == nullptr) {
    NODE_THROW_LAST_CPLERR;
    return;
  }

  // Two cases:
  if (memfile_collection.count(data)) {
    // the file comes from a named buffer and the buffer is owned by Node
    // -> a reference to the existing buffer is returned
    Memfile *mem = memfile_collection.find(data)->second;
    memfile_collection.erase(mem->data);
    VSIUnlink(mem->filename.c_str());
    info.GetReturnValue().Set(Nan::New(*mem->persistent));
    delete mem;
  } else {
    // the file has been created by GDAL and the buffer is owned by GDAL
    // -> a new Buffer is constructed and GDAL has to relinquish control
    VSIGetMemFileBuffer(filename.c_str(), &len, true);
    info.GetReturnValue().Set(Nan::NewBuffer(static_cast<char *>(data), static_cast<uint32_t>(len)).ToLocalChecked());
  }
}

} // namespace node_gdal
