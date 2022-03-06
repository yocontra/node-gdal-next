#ifndef NODE_GDAL_H
#define NODE_GDAL_H

#define NODE_GDAL_CAPI_MAGIC 0xC0DEDF0BEEF

#include <gdal_priv.h>
#include <string>
#include <map>

#ifdef __cplusplus
namespace node_gdal {
extern "C" {
#endif

#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 5)
inline void ParseCSLConstList(CSLConstList constList, std::map<std::string, std::string> &dict) {
  if (constList == nullptr) return;
  const char *const *item = constList;
  while (*item != nullptr) {
    const char *sep = strchr(*item, '=');
    if (*item == nullptr) sep = strchr(*item, ':');
    std::string key = sep != nullptr ? std::string(*item, sep - *item) : *item;
    std::string value = sep != nullptr ? std::string(sep + 1) : "";
    dict.emplace(std::move(key), std::move(value));
    item++;
  }
}

struct pixel_func {
  uint64_t magic;
  GDALDerivedPixelFuncWithArgs fn;
  const char *metadata;
};
#endif

#ifdef __cplusplus
} // extern "C"
} // namespace node_gdal
#endif

#endif
