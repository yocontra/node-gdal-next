#include <memory>
#include "array_attributes.hpp"
#include "../gdal_common.hpp"
#include "../gdal_dataset.hpp"
#include "../gdal_group.hpp"
#include "../gdal_mdarray.hpp"
#include "../utils/string_list.hpp"

namespace node_gdal {

#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)

Nan::Persistent<FunctionTemplate> ArrayAttributes::constructor;

std::shared_ptr<GDALAttribute> ArrayAttributes::__get(std::shared_ptr<GDALMDArray> parent, std::string const &name) {
  return parent->GetAttribute(name);
}

std::shared_ptr<GDALAttribute> ArrayAttributes::__get(std::shared_ptr<GDALMDArray> parent, size_t idx) {
  std::vector<std::shared_ptr<GDALAttribute>> attrs = parent->GetAttributes();
  if (idx >= attrs.size()) return nullptr;
  return attrs[idx];
}

std::vector<std::string> ArrayAttributes::__getNames(std::shared_ptr<GDALMDArray> parent) {
  std::vector<std::shared_ptr<GDALAttribute>> attrs = parent->GetAttributes();
  std::vector<std::string> r;
  for (const std::shared_ptr<GDALAttribute> &d : attrs) r.push_back(d->GetName());
  return r;
}

int ArrayAttributes::__count(std::shared_ptr<GDALMDArray> parent) {
  int r = parent->GetAttributes().size();
  return r;
}

/**
 * An encapsulation of a {{#crossLink "gdal.Group"}}Array{{/crossLink}}'s
 * descendant attributes.
 *
 * @class ArrayAttributes
 * @memberof gdal
 */

/** @lends gdal.ArrayAttributes */

/**
 * Returns the attribute with the given name/index.
 *
 * @method get
 * @instance
 * @memberof gdal.ArrayAttributes
 * @param {string|number} attribute
 * @return {gdal.Attribute}
 */

/**
 * Returns the attribute with the given name/index.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof gdal.ArrayAttributes
 * @param {string|number} attribute
 * @param {callback<gdal.Attribute>} [callback=undefined] {{{cb}}}
 * @return {Promise<gdal.Attribute>}
 */

/**
 * Returns the number of attributes in the collection.
 *
 * @method count
 * @instance
 * @memberof gdal.ArrayAttributes
 * @return {number}
 */

/**
 * Returns the number of attributes in the collection.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof gdal.ArrayAttributes
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */

/**
 * Attributes' names
 *
 * @readonly
 * @property
 * @name names
 * @instance
 * @memberof gdal.ArrayAttributes
 * @type {string[]}
 */

/**
 * Parent dataset
 *
 * @readonly
 * @name ds
 * @property
 * @instance
 * @memberof gdal.ArrayAttributes
 */
#endif

} // namespace node_gdal
