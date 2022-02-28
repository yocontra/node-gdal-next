#ifndef NODE_GDAL_H
#define NODE_GDAL_H

#define NODE_GDAL_CAPI_MAGIC 0xC0DEDF0BEEF

#include <gdal_priv.h>

#ifdef __cplusplus
namespace node_gdal {
extern "C" {
#endif

#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 5)
inline const char *GDALFetchNameValue(CSLConstList papszStrList, const char *pszName) {
  if (papszStrList == nullptr || pszName == nullptr) return nullptr;

  const size_t nLen = strlen(pszName);
  while (*papszStrList != nullptr) {
    if (EQUALN(*papszStrList, pszName, nLen) && ((*papszStrList)[nLen] == '=' || (*papszStrList)[nLen] == ':')) {
      return (*papszStrList) + nLen + 1;
    }
    ++papszStrList;
  }
  return nullptr;
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
