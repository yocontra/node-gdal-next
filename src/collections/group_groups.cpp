#include <memory>
#include "group_groups.hpp"
#include "../gdal_common.hpp"
#include "../gdal_dataset.hpp"
#include "../gdal_group.hpp"
#include "../utils/string_list.hpp"

namespace node_gdal {

#if GDAL_VERSION_MAJOR > 3 || (GDAL_VERSION_MAJOR == 3 && GDAL_VERSION_MINOR >= 1)

Nan::Persistent<FunctionTemplate> GroupGroups::constructor;

std::shared_ptr<GDALGroup> GroupGroups::__get(std::shared_ptr<GDALGroup> parent, std::string const &name) {
  return parent->OpenGroup(name);
}

std::shared_ptr<GDALGroup> GroupGroups::__get(std::shared_ptr<GDALGroup> parent, size_t idx) {
  std::vector<std::string> groups = parent->GetGroupNames();
  if (idx >= groups.size()) return nullptr;
  return parent->OpenGroup(groups[idx]);
}

std::vector<std::string> GroupGroups::__getNames(std::shared_ptr<GDALGroup> parent) {
  return parent->GetGroupNames();
}

int GroupGroups::__count(std::shared_ptr<GDALGroup> parent) {
  int r = parent->GetGroupNames().size();
  return r;
}

/**
 * An encapsulation of a {{#crossLink "gdal.Group"}}Group{{/crossLink}}'s
 * descendant groups.
 *
 *
 * @class GroupGroups
 * @memberof gdal
 */

/**
 * Returns the group with the given name/index.
 *
 * @method get
 * @instance
 * @memberof gdal.GroupGroups
 * @param {string|number} group
 * @return {gdal.Group}
 */

/**
 * Returns the group with the given name/index.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof gdal.GroupGroups
 *
 * @param {string|number} group
 * @param {callback<gdal.Group>} [callback=undefined] {{{cb}}}
 * @return {Promise<gdal.Group>}
 */

/**
 * Returns the number of groups in the collection.
 *
 * @method count
 * @instance
 * @memberof gdal.GroupGroups
 * @return {number}
 */

/**
 * Returns the number of groups in the collection.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof gdal.GroupGroups
 *
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */

/**
 * @readonly
 * @kind member
 * @name names
 * @instance
 * @memberof gdal.GroupGroups
 * @type {string[]}
 */

/**
 * Parent dataset
 *
 * @readonly
 * @kind member
 * @name ds
 * @instance
 * @memberof gdal.GroupGroups
 * @type {gdal.Dataset}
 */
#endif
} // namespace node_gdal
