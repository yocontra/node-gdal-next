const { fragment } = require('xmlbuilder2')

/**
 * @typedef {object} VRTBandDescriptor
 * @property {string} [pixelFunc] Pixel function to be applied when reading data,
 * must be a GDAL builtin function or a registered user function
 * @property {Record<string, string|number>} [pixelFuncArgs] Additional arguments for the pixel function
 * @property {string} [type] Data type to convert the pixels to
 * @property {string} [sourceTransferType] Data type to be used as input of the pixel function
 * when reading from the source
 */


/**
 * @typedef {object} VRTDescriptor
 * @property {VRTBandDescriptor[]} [bands]
 */

/**
 * Produces a VRT Dataset from a regular Dataset.
 *
 * Supports applying pixel functions.
 *
 * @example
 * const ds = gdal.open(gdal.wrapVRT(gdal.open('test/data/sample.tif'), {
 *     bands: [
 *       {
 *        pixelFunc: 'inv',
 *        pixelFuncArgs: { k: 3 },
 *        sourceTransferType: gdal.GDT_Float32
 *       }
 *     ]
 * })
 *
 * @param {Dataset} ds Dataset
 * @param {VRTDescriptor} [opts] Optional band descriptors
 * @method wrapVRT
 * @returns {string}
 */

function wrapVRT(ds, _opt) {
  const opt = _opt || {}
  const root = fragment().ele('VRTDataset', {
    rasterXSize: ds.rasterSize.x,
    rasterYSize: ds.rasterSize.y
  })

  if (ds.srs) {
    const authName = ds.srs.getAuthorityName()
    const authCode = ds.srs.getAuthorityCode()
    if (authName && authCode) {
      root.ele('SRS').txt(`${authName}:${authCode}`)
    } else {
      root.ele('SRS').txt(ds.srs.toWKT())
    }
  }

  if (ds.geoTransform) {
    root.ele('GeoTransform').txt(ds.geoTransform.join(', '))
  }

  const md = ds.getMetadata()
  if (Object.keys(md).length > 0) {
    const xml = root.ele('Metadata')
    Object.keys(md).map((key) => xml.ele('MDI', { key }).txt(md[key]))
  }

  let bandIdx = 0
  for (const band of ds.bands) {
    if (opt.bands && !opt.bands[bandIdx]) continue
    const desc = opt.bands && opt.bands[bandIdx] || {}
    const description = desc.description || band.description

    const xml = root.ele('VRTRasterBand', {
      dataType: desc.type || band.dataType,
      band: band.id,
      subClass: desc.pixelFunc && 'VRTDerivedRasterBand'
    })
    if (description) xml.ele('Description').txt(description)
    if (desc.pixelFunc) xml.ele('PixelFunctionType').txt(desc.pixelFunc)

    if (desc.pixelFuncArgs) {
      xml.ele('PixelFunctionArguments', desc.pixelFuncArgs)
    }

    if (desc.sourceTransferType) {
      xml.ele('SourceTransferType').txt(desc.sourceTransferType)
    }

    const md = band.getMetadata()
    if (Object.keys(md).length > 0) {
      const frag = xml.ele('Metadata')
      Object.keys(md).map((key) => frag.ele('MDI', { key }).txt(md[key]))
    }

    xml.ele('SimpleSource')
      .ele('SourceFilename', { relativeToVRT: 0 }).txt(ds.description).up()
      .ele('SourceBand').txt(band.id)

    bandIdx++
  }

  return root.end({ prettyPrint: true })
}

module.exports = wrapVRT
