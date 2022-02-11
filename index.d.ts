import * as stream from 'stream';

export type CalcOptions = {
	convertNoData?: boolean;
}

export type Color = {
	c1: number;
	c2: number;
	c3: number;
	c4: number;
}

export type ContourOptions = {
	src: RasterBand;
	dst: Layer;
	offset?: number;
	interval?: number;
	fixedLevels?: number[];
	nodata?: number;
	idField?: number;
	elevField?: number;
	progress_cb?: ProgressCb;
}

export type CreateOptions = {
	progress_cb?: ProgressCb;
}

export type FillOptions = {
	src: RasterBand;
	mask?: RasterBand;
	searchDist: number;
	smoothingIterations?: number;
}

export type MDArrayOptions = {
	origin: number[];
	span: number[];
	stride?: number[];
	data_type?: string;
	data?: TypedArray;
	_offset?: number;
}

export type PolygonizeOptions = {
	src: RasterBand;
	dst: Layer;
	mask?: RasterBand;
	pixValField: number;
	connectedness?: number;
	useFloats?: boolean;
	progress_cb?: ProgressCb;
}

export type ProgressCb = ( complete: number, msg: string ) => void

export type ProgressOptions = {
	progress_cb: ProgressCb;
}

export type ReadOptions = {
	buffer_width?: number;
	buffer_height?: number;
	type?: string;
	pixel_space?: number;
	line_space?: number;
	resampling?: string;
	progress_cb?: ProgressCb;
	offset?: number;
}

export type ReprojectOptions = {
	src: Dataset;
	dst: Dataset;
	s_srs: SpatialReference;
	t_srs: SpatialReference;
	resampling?: string;
	cutline?: Geometry;
	srcBands?: number[];
	dstBands?: number[];
	srcAlphaBand?: number;
	dstAlphaBand?: number;
	srcNodata?: number;
	dstNodata?: number;
	blend?: number;
	memoryLimit?: number;
	maxError?: number;
	multi?: boolean;
	options?: object;
	progress_cb?: ProgressCb;
}

export type SieveOptions = {
	src: RasterBand;
	dst: RasterBand;
	mask?: RasterBand;
	threshold: number;
	connectedness?: number;
	progress_cb?: ProgressCb;
}

export type TypedArray = Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array

export type UtilOptions = {
	progress_cb?: ProgressCb;
}

export type VSIStat = {
	dev: number;
	mode: number;
	nlink: number;
	uid: number;
	gid: number;
	rdev: number;
	blksize: number;
	ino: number;
	size: number;
	blocks: number;
	atime: Date;
	mtime: Date;
	ctime: Date;
}

export type VSIStat64 = {
	dev: BigInt;
	mode: BigInt;
	nlink: BigInt;
	uid: BigInt;
	gid: BigInt;
	rdev: BigInt;
	blksize: BigInt;
	ino: BigInt;
	size: BigInt;
	blocks: BigInt;
	atime: Date;
	mtime: Date;
	ctime: Date;
}

export type WarpOptions = {
	src: Dataset;
	s_srs: SpatialReference;
	t_srs: SpatialReference;
	maxError?: number;
}

export type WarpOutput = {
	rasterSize: xyz;
	geoTransform: number[];
}

export type WriteOptions = {
	buffer_width?: number;
	buffer_height?: number;
	pixel_space?: number;
	line_space?: number;
	progress_cb?: ProgressCb;
	offset?: number;
}

export type callback<T> = (err: Error, obj: T) => void

export type forEachCb<T> = (obj: T, idx: number) => boolean|void

export type mapCb<T,U> = (obj: T, index: number) => U

export type stats = {
	min: number;
	max: number;
	mean: number;
	std_dev: number;
}

export type units = {
	units: string;
	value: number;
}

export interface RasterReadableOptions extends stream.ReadableOptions {
	blockOptimize?: boolean;
	convertNoData?: boolean;
	type?: new (len: number) => TypedArray;
}

export interface RasterTransformOptions extends stream.TransformOptions {
	fn: Function;
	type: new (len: number) => TypedArray;
}

export interface RasterWritableOptions extends stream.WritableOptions {
	blockOptimize?: boolean;
	convertNoData?: boolean;
}

export interface xyz {
	x: number;
	y: number;
	z?: number;
}


  /**
   * Error level: Debug
   *
   * @final
   * @constant
   * @name CE_Debug
   * @type {number}
   */
  export const CE_Debug: number

  /**
   * Error level: Failure
   *
   * @final
   * @constant
   * @name CE_Failure
   * @type {number}
   */
  export const CE_Failure: number

  /**
   * Error level: Fatal
   *
   * @final
   * @constant
   * @name CE_Fatal
   * @type {number}
   */
  export const CE_Fatal: number

  /**
   * Error level: (no error)
   *
   * @final
   * @constant
   * @name CE_None
   * @type {number}
   */
  export const CE_None: number

  /**
   * Error level: Warning
   *
   * @final
   * @constant
   * @name CE_Warning
   * @type {number}
   */
  export const CE_Warning: number

  /**
   * @final
   * @constant
   * @name CPLE_AppDefined
   * @type {number}
   */
  export const CPLE_AppDefined: number

  /**
   * @final
   * @constant
   * @name CPLE_AssertionFailed
   * @type {number}
   */
  export const CPLE_AssertionFailed: number

  /**
   * @final
   * @constant
   * @name CPLE_FileIO
   * @type {number}
   */
  export const CPLE_FileIO: number

  /**
   * @final
   * @constant
   * @name CPLE_IllegalArg
   * @type {number}
   */
  export const CPLE_IllegalArg: number

  /**
   * @final
   * @constant
   * @name CPLE_NoWriteAccess
   * @type {number}
   */
  export const CPLE_NoWriteAccess: number

  /**
   * @final
   * @constant
   * @name CPLE_None
   * @type {number}
   */
  export const CPLE_None: number

  /**
   * @final
   * @constant
   * @name CPLE_NotSupported
   * @type {number}
   */
  export const CPLE_NotSupported: number

  /**
   * @final
   * @constant
   * @name CPLE_OpenFailed
   * @type {number}
   */
  export const CPLE_OpenFailed: number

  /**
   * @final
   * @constant
   * @name CPLE_OutOfMemory
   * @type {number}
   */
  export const CPLE_OutOfMemory: number

  /**
   * @final
   * @constant
   * @name CPLE_UserInterrupt
   * @type {number}
   */
  export const CPLE_UserInterrupt: number

  /**
   * @final
   * @constant
   * @name CPLE_objectNull
   * @type {number}
   */
  export const CPLE_objectNull: number

  /**
   * @final
   * @constant
   * @name DCAP_CREATE
   * @type {string}
   */
  export const DCAP_CREATE: string

  /**
   * @final
   * @constant
   * @name DCAP_CREATECOPY
   * @type {string}
   */
  export const DCAP_CREATECOPY: string

  /**
   * @final
   * @constant
   * @name DCAP_VIRTUALIO
   * @type {string}
   */
  export const DCAP_VIRTUALIO: string

  /**
   * @final
   * @constant
   * @name DIM_HORIZONTAL_X
   * @type {string}
   */
  export const DIM_HORIZONTAL_X: string

  /**
   * @final
   * @constant
   * @name DIM_HORIZONTAL_Y
   * @type {string}
   */
  export const DIM_HORIZONTAL_Y: string

  /**
   * @final
   * @constant
   * @name DIM_PARAMETRIC
   * @type {string}
   */
  export const DIM_PARAMETRIC: string

  /**
   * @final
   * @constant
   * @name DIM_TEMPORAL
   * @type {string}
   */
  export const DIM_TEMPORAL: string

  /**
   * @final
   * @constant
   * @name DIM_VERTICAL
   * @type {string}
   */
  export const DIM_VERTICAL: string

  /**
   * @final
   * @constant
   * @name DIR_DOWN
   * @type {string}
   */
  export const DIR_DOWN: string

  /**
   * @final
   * @constant
   * @name DIR_EAST
   * @type {string}
   */
  export const DIR_EAST: string

  /**
   * @final
   * @constant
   * @name DIR_FUTURE
   * @type {string}
   */
  export const DIR_FUTURE: string

  /**
   * @final
   * @constant
   * @name DIR_NORTH
   * @type {string}
   */
  export const DIR_NORTH: string

  /**
   * @final
   * @constant
   * @name DIR_PAST
   * @type {string}
   */
  export const DIR_PAST: string

  /**
   * @final
   * @constant
   * @name DIR_SOUTH
   * @type {string}
   */
  export const DIR_SOUTH: string

  /**
   * @final
   * @constant
   * @name DIR_UP
   * @type {string}
   */
  export const DIR_UP: string

  /**
   * @final
   * @constant
   * @name DIR_WEST
   * @type {string}
   */
  export const DIR_WEST: string

  /**
   * @final
   * @constant
   * @name DMD_CREATIONDATATYPES
   * @type {string}
   */
  export const DMD_CREATIONDATATYPES: string

  /**
   * @final
   * @constant
   * @name DMD_CREATIONOPTIONLIST
   * @type {string}
   */
  export const DMD_CREATIONOPTIONLIST: string

  /**
   * @final
   * @constant
   * @name DMD_EXTENSION
   * @type {string}
   */
  export const DMD_EXTENSION: string

  /**
   * @final
   * @constant
   * @name DMD_HELPTOPIC
   * @type {string}
   */
  export const DMD_HELPTOPIC: string

  /**
   * @final
   * @constant
   * @type {string}
   * @name DMD_LONGNAME
   */
  export const DMD_LONGNAME: string

  /**
   * @final
   * @constant
   * @name DMD_MIMETYPE
   * @type {string}
   */
  export const DMD_MIMETYPE: string

  /**
   * @final
   * @constant
   * @name GA_Readonly
   * @type {number}
   */
  export const GA_Readonly: number

  /**
   * @final
   * @constant
   * @name GA_Update
   * @type {number}
   */
  export const GA_Update: number

  /**
   * @final
   * @constant
   * @name GCI_AlphaBand
   * @type {string}
   */
  export const GCI_AlphaBand: string

  /**
   * @final
   * @constant
   * @name GCI_BlackBand
   * @type {string}
   */
  export const GCI_BlackBand: string

  /**
   * @final
   * @constant
   * @name GCI_BlueBand
   * @type {string}
   */
  export const GCI_BlueBand: string

  /**
   * @final
   * @constant
   * @name GCI_CyanBand
   * @type {string}
   */
  export const GCI_CyanBand: string

  /**
   * @final
   * @constant
   * @name GCI_GrayIndex
   * @type {string}
   */
  export const GCI_GrayIndex: string

  /**
   * @final
   * @constant
   * @name GCI_GreenBand
   * @type {string}
   */
  export const GCI_GreenBand: string

  /**
   * @final
   * @constant
   * @name GCI_HueBand
   * @type {string}
   */
  export const GCI_HueBand: string

  /**
   * @final
   * @constant
   * @name GCI_LightnessBand
   * @type {string}
   */
  export const GCI_LightnessBand: string

  /**
   * @final
   * @constant
   * @name GCI_MagentaBand
   * @type {string}
   */
  export const GCI_MagentaBand: string

  /**
   * @final
   * @constant
   * @name GCI_PaletteIndex
   * @type {string}
   */
  export const GCI_PaletteIndex: string

  /**
   * @final
   * @constant
   * @name GCI_RedBand
   * @type {string}
   */
  export const GCI_RedBand: string

  /**
   * @final
   * @constant
   * @name GCI_SaturationBand
   * @type {string}
   */
  export const GCI_SaturationBand: string

  /**
   * @final
   * @constant
   * @name GCI_Undefined
   * @type {string}
   */
  export const GCI_Undefined: string

  /**
   * @final
   * @constant
   * @name GCI_YCbCr_CbBand
   * @type {string}
   */
  export const GCI_YCbCr_CbBand: string

  /**
   * @final
   * @constant
   * @name GCI_YCbCr_CrBand
   * @type {string}
   */
  export const GCI_YCbCr_CrBand: string

  /**
   * @final
   * @constant
   * @name GCI_YCbCr_YBand
   * @type {string}
   */
  export const GCI_YCbCr_YBand: string

  /**
   * @final
   * @constant
   * @name GCI_YellowBand
   * @type {string}
   */
  export const GCI_YellowBand: string

  /**
   * Eight bit unsigned integer
   * @final
   * @constant
   * @name GDT_Byte
   * @type {string}
   */
  export const GDT_Byte: string

  /**
   * Complex Float32
   * @final
   * @constant
   * @name GDT_CFloat32
   * @type {string}
   */
  export const GDT_CFloat32: string

  /**
   * Complex Float64
   * @final
   * @constant
   * @name GDT_CFloat64
   * @type {string}
   */
  export const GDT_CFloat64: string

  /**
   * Complex Int16
   * @final
   * @constant
   * @name GDT_CInt16
   * @type {string}
   */
  export const GDT_CInt16: string

  /**
   * Complex Int32
   * @final
   * @constant
   * @name GDT_CInt32
   * @type {string}
   */
  export const GDT_CInt32: string

  /**
   * Thirty two bit floating point
   * @final
   * @constant
   * @name GDT_Float32
   * @type {string}
   */
  export const GDT_Float32: string

  /**
   * Sixty four bit floating point
   * @final
   * @constant
   * @name GDT_Float64
   * @type {string}
   */
  export const GDT_Float64: string

  /**
   * Sixteen bit signed integer
   * @final
   * @constant
   * @name GDT_Int16
   * @type {string}
   */
  export const GDT_Int16: string

  /**
   * Thirty two bit signed integer
   * @final
   * @constant
   * @name GDT_Int32
   * @type {string}
   */
  export const GDT_Int32: string

  /**
   * Sixteen bit unsigned integer
   * @final
   * @constant
   * @name GDT_UInt16
   * @type {string}
   */
  export const GDT_UInt16: string

  /**
   * Thirty two bit unsigned integer
   * @final
   * @constant
   * @name GDT_UInt32
   * @type {string}
   */
  export const GDT_UInt32: string

  /**
   * Unknown or unspecified type
   * @final
   * @constant
   * @name GDT_Unknown
   * @type {string}
   */
  export const GDT_Unknown: string

  /**
   * String extended type for MDArrays (GDAL >= 3.1)
   * @final
   * @constant
   * @name GEDTC_Compound
   * @type {string}
   */
  export const GEDTC_Compound: string

  /**
   * String extended type for MDArrays (GDAL >= 3.1)
   * @final
   * @constant
   * @name GEDTC_String
   * @type {string}
   */
  export const GEDTC_String: string

  /**
   * @final
   * @constant
   * @name GF_Read
   * @type {number}
   */
  export const GF_Read: number

  /**
   * @final
   * @constant
   * @name GF_Write
   * @type {number}
   */
  export const GF_Write: number

  /**
   * CMYK
   * @final
   * @constant
   * @name GPI_CMYK
   * @type {string}
   */
  export const GPI_CMYK: string

  /**
   * Grayscale, only c1 defined
   * @final
   * @constant
   * @name GPI_Gray
   * @type {string}
   */
  export const GPI_Gray: string

  /**
   * HLS, c4 is not defined
   * @final
   * @constant
   * @name GPI_HLS
   * @type {string}
   */
  export const GPI_HLS: string

  /**
   * RGBA, alpha in c4
   * @final
   * @constant
   * @name GPI_RGB
   * @type {string}
   */
  export const GPI_RGB: string

  /**
   * @final
   * @constant
   * @name GRA_Average
   * @type {string}
   */
  export const GRA_Average: string

  /**
   * @final
   * @constant
   * @name GRA_Bilinear
   * @type {string}
   */
  export const GRA_Bilinear: string

  /**
   * @final
   * @constant
   * @name GRA_Cubic
   * @type {string}
   */
  export const GRA_Cubic: string

  /**
   * @final
   * @constant
   * @name GRA_CubicSpline
   * @type {string}
   */
  export const GRA_CubicSpline: string

  /**
   * @final
   * @constant
   * @name GRA_Lanczos
   * @type {string}
   */
  export const GRA_Lanczos: string

  /**
   * @final
   * @constant
   * @name GRA_Mode
   * @type {string}
   */
  export const GRA_Mode: string

  /**
   * @final
   * @constant
   * @name GRA_NearestNeighbor
   * @type {string}
   */
  export const GRA_NearestNeighbor: string

  /**
   * @final
   * @constant
   * @name ODrCCreateDataSource
   * @type {string}
   */
  export const ODrCCreateDataSource: string

  /**
   * @final
   * @constant
   * @name ODrCDeleteDataSource
   * @type {string}
   */
  export const ODrCDeleteDataSource: string

  /**
   * @final
   * @constant
   * @name ODsCCreateGeomFieldAfterCreateLayer
   * @type {string}
   */
  export const ODsCCreateGeomFieldAfterCreateLayer: string

  /**
   * @final
   * @constant
   * @name ODsCCreateLayer
   * @type {string}
   */
  export const ODsCCreateLayer: string

  /**
   * @final
   * @constant
   * @name ODsCDeleteLayer
   * @type {string}
   */
  export const ODsCDeleteLayer: string

  /**
   * @final
   * @constant
   * @name OFTBinary
   * @type {string}
   */
  export const OFTBinary: string

  /**
   * @final
   * @constant
   * @name OFTDate
   * @type {string}
   */
  export const OFTDate: string

  /**
   * @final
   * @constant
   * @name OFTDateTime
   * @type {string}
   */
  export const OFTDateTime: string

  /**
   * @final
   * @constant
   * @name OFTInteger
   * @type {string}
   */
  export const OFTInteger: string

  /**
   * @final
   * @constant
   * @name OFTInteger64
   * @type {string}
   */
  export const OFTInteger64: string

  /**
   * @final
   * @constant
   * @name OFTInteger64List
   * @type {string}
   */
  export const OFTInteger64List: string

  /**
   * @final
   * @constant
   * @name OFTIntegerList
   * @type {string}
   */
  export const OFTIntegerList: string

  /**
   * @final
   * @constant
   * @name OFTReal
   * @type {string}
   */
  export const OFTReal: string

  /**
   * @final
   * @constant
   * @name OFTRealList
   * @type {string}
   */
  export const OFTRealList: string

  /**
   * @final
   * @constant
   * @name OFTString
   * @type {string}
   */
  export const OFTString: string

  /**
   * @final
   * @constant
   * @name OFTStringList
   * @type {string}
   */
  export const OFTStringList: string

  /**
   * @final
   * @constant
   * @name OFTTime
   * @type {string}
   */
  export const OFTTime: string

  /**
   * @final
   * @constant
   * @name OFTWideString
   * @type {string}
   */
  export const OFTWideString: string

  /**
   * @final
   * @constant
   * @name OFTWideStringList
   * @type {string}
   */
  export const OFTWideStringList: string

  /**
   * @final
   * @constant
   * @name OJLeft
   * @type {string}
   */
  export const OJLeft: string

  /**
   * @final
   * @constant
   * @name OJRight
   * @type {string}
   */
  export const OJRight: string

  /**
   * @final
   * @constant
   * @name OJUndefined
   * @type {string}
   */
  export const OJUndefined: string

  /**
   * @final
   * @constant
   * @name OLCAlterFieldDefn
   * @type {string}
   */
  export const OLCAlterFieldDefn: string

  /**
   * @final
   * @constant
   * @name OLCCreateField
   * @type {string}
   */
  export const OLCCreateField: string

  /**
   * @final
   * @constant
   * @name OLCCreateGeomField
   * @type {string}
   */
  export const OLCCreateGeomField: string

  /**
   * @final
   * @constant
   * @name OLCDeleteFeature
   * @type {string}
   */
  export const OLCDeleteFeature: string

  /**
   * @final
   * @constant
   * @name OLCDeleteField
   * @type {string}
   */
  export const OLCDeleteField: string

  /**
   * @final
   * @constant
   * @name OLCFastFeatureCount
   * @type {string}
   */
  export const OLCFastFeatureCount: string

  /**
   * @final
   * @constant
   * @name OLCFastGetExtent
   * @type {string}
   */
  export const OLCFastGetExtent: string

  /**
   * @final
   * @constant
   * @name OLCFastSetNextByIndex
   * @type {string}
   */
  export const OLCFastSetNextByIndex: string

  /**
   * @final
   * @constant
   * @name OLCFastSpatialFilter
   * @type {string}
   */
  export const OLCFastSpatialFilter: string

  /**
   * @final
   * @constant
   * @name OLCIgnoreFields
   * @type {string}
   */
  export const OLCIgnoreFields: string

  /**
   * @final
   * @constant
   * @name OLCRandomRead
   * @type {string}
   */
  export const OLCRandomRead: string

  /**
   * @final
   * @constant
   * @name OLCRandomWrite
   * @type {string}
   */
  export const OLCRandomWrite: string

  /**
   * @final
   * @constant
   * @name OLCReorderFields
   * @type {string}
   */
  export const OLCReorderFields: string

  /**
   * @final
   * @constant
   * @name OLCSequentialWrite
   * @type {string}
   */
  export const OLCSequentialWrite: string

  /**
   * @final
   * @constant
   * @name OLCStringsAsUTF8
   * @type {string}
   */
  export const OLCStringsAsUTF8: string

  /**
   * @final
   * @constant
   * @name OLCTransactions
   * @type {string}
   */
  export const OLCTransactions: string

  /**
   * GDAL library - system library (false) or bundled (true)
   *
   * @final
   * @constant {boolean} bundled
   */
  export const bundled: boolean

  /**
   * The collection of all drivers registered with GDAL
   *
   * @readonly
   * @static
   * @constant
   * @name drivers
   * @type {GDALDrivers}
   */
  export const drivers: GDALDrivers

  /**
   * Should a warning be emitted to stderr when a synchronous operation
   * is blocking the event loop, can be safely disabled unless
   * the user application needs to remain responsive at all times
   * Use `(gdal as any).eventLoopWarning = false` to set the value from TypeScript
   *
   * @var {boolean} eventLoopWarning
   */
  export let eventLoopWarning: unknown

  /**
   * Details about the last error that occurred. The property
   * will be null or an object containing three properties: "number",
   * "message", and "type".
   *
   * @var {object} lastError
   */
  export let lastError: unknown

  /**
   * GDAL version (not the binding version)
   *
   * @final
   * @constant {string} version
   */
  export const version: string

  /**
   * @final
   *
   * The `wkb25DBit` constant can be used to convert between 2D types to 2.5D
   * types
   *
   * @example
   *
   * // 2 -> 2.5D
   * wkbPoint25D = gdal.wkbPoint | gdal.wkb25DBit
   *
   * // 2.5D -> 2D (same as wkbFlatten())
   * wkbPoint = gdal.wkbPoint25D & (~gdal.wkb25DBit)
   *
   * @constant
   * @name wkb25DBit
   * @type {number}
   */
  export const wkb25DBit: number

  /**
   * @final
   * @constant
   * @name wkbCircularString
   * @type {number}
   */
  export const wkbCircularString: number

  /**
   * @final
   * @constant
   * @name wkbCompoundCurve
   * @type {number}
   */
  export const wkbCompoundCurve: number

  /**
   * @final
   * @constant
   * @name wkbGeometryCollection
   * @type {number}
   */
  export const wkbGeometryCollection: number

  /**
   * @final
   * @constant
   * @name wkbGeometryCollection25D
   * @type {number}
   */
  export const wkbGeometryCollection25D: number

  /**
   * @final
   * @constant
   * @name wkbLineString
   * @type {number}
   */
  export const wkbLineString: number

  /**
   * @final
   * @constant
   * @name wkbLineString25D
   * @type {number}
   */
  export const wkbLineString25D: number

  /**
   * @final
   * @constant
   * @name wkbLinearRing
   * @type {string}
   */
  export const wkbLinearRing: string

  /**
   * @final
   * @constant
   * @name wkbLinearRing25D
   * @type {number}
   */
  export const wkbLinearRing25D: number

  /**
   * @final
   * @constant
   * @name wkbMultiCurve
   * @type {number}
   */
  export const wkbMultiCurve: number

  /**
   * @final
   * @constant
   * @name wkbMultiLineString
   * @type {number}
   */
  export const wkbMultiLineString: number

  /**
   * @final
   * @constant
   * @name wkbMultiLineString25D
   * @type {number}
   */
  export const wkbMultiLineString25D: number

  /**
   * @final
   * @constant
   * @name wkbMultiPoint
   * @type {number}
   */
  export const wkbMultiPoint: number

  /**
   * @final
   * @constant
   * @name wkbMultiPoint25D
   * @type {number}
   */
  export const wkbMultiPoint25D: number

  /**
   * @final
   * @constant
   * @name wkbMultiPolygon
   * @type {number}
   */
  export const wkbMultiPolygon: number

  /**
   * @final
   * @constant
   * @name wkbMultiPolygon25D
   * @type {number}
   */
  export const wkbMultiPolygon25D: number

  /**
   * @final
   * @constant
   * @name wkbNDR
   * @type {string}
   */
  export const wkbNDR: string

  /**
   * @final
   * @constant
   * @name wkbNone
   * @type {number}
   */
  export const wkbNone: number

  /**
   * @final
   * @constant
   * @name wkbPoint
   * @type {number}
   */
  export const wkbPoint: number

  /**
   * @final
   * @constant
   * @name wkbPoint25D
   * @type {number}
   */
  export const wkbPoint25D: number

  /**
   * @final
   * @constant
   * @name wkbPolygon
   * @type {number}
   */
  export const wkbPolygon: number

  /**
   * @final
   * @constant
   * @name wkbPolygon25D
   * @type {number}
   */
  export const wkbPolygon25D: number

  /**
   * @final
   * @constant
   * @name wkbUnknown
   * @type {number}
   */
  export const wkbUnknown: number

  /**
   * SFSQL 1.2 and ISO SQL/MM Part 3 extended dimension (Z&M) WKB types.
   *
   * @final
   * @constant
   * @name wkbVariantIso
   * @type {string}
   */
  export const wkbVariantIso: string

  /**
   * Old-style 99-402 extended dimension (Z) WKB types.
   * Synonymous with 'wkbVariantOldOgc' (gdal >= 2.0)
   *
   * @final
   * @constant
   * @name wkbVariantOgc
   * @type {string}
   */
  export const wkbVariantOgc: string

  /**
   * Old-style 99-402 extended dimension (Z) WKB types.
   * Synonymous with 'wkbVariantOgc' (gdal < 2.0)
   *
   * @final
   * @constant
   * @name wkbVariantOldOgc
   * @type {string}
   */
  export const wkbVariantOldOgc: string

  /**
   * @final
   * @constant
   * @name wkbXDR
   * @type {string}
   */
  export const wkbXDR: string

  /**
 * Compute a new output band as a pixel-wise function of given input bands
 *
 * This is an alternative implementation of `gdal_calc.py`
 *
 * It is fully async and reading and decoding of input and output bands happen
 * in separate background threads for each band as long as they are in separate datasets.
 *
 * The main bottleneck is the passed function `fn` which must always run on the main Node.js/V8 thread.
 * This is a fundamental Node.js/V8 limitation that is impossible to overcome.
 *
 * This function is not to be used in server code that must remain responsive at all times.
 * It does not directly block the event loop, but it is very CPU-heavy and cannot
 * run parallel to other instances of itself. If multiple instances run in parallel, they
 * will all compete for the main thread, executing `fn` on the incoming data chunks on turn by turn basis.
 *
 * It internally uses a {@link RasterTransform} which can also be used directly for
 * a finer-grained control over the transformation.
 *
 * There is no sync version
 *
 * @function calcAsync
 * @param {Record<string, RasterBand>} inputs An object containing all the input bands
 * @param {RasterBand} output Output raster band
 * @param {(...args: number[]) => number} fn Function to apply on all pixels, it must have the same number of arguments as there are input bands
 * @param {CalcOptions} [options] Options
 * @param {boolean} [options.convertNoData=false] Input bands will have their NoData pixels converted to NaN and a NaN output value of the given function will be converted to a NoData pixel, provided that the output raster band has its `RasterBand.noDataValue` set
 * @return {Promise<void>}
 * @static
 *
 * @example
 *
 * const T2m = await gdal.openAsync('TEMP_2M.tiff'));
 * const D2m = await gdal.openAsync('DEWPOINT_2M.tiff'));
 * const size = await T2m.rasterSizeAsync
 * const cloudBase = await gdal.openAsync('CLOUDBASE.tiff', 'w', 'GTiff',
 *    size.x, size.y, 1, gdal.GDT_Float64);
 *
 * (await cloudBase.bands.getAsync(1)).noDataValue = -1e38
 * // Espy's estimation for cloud base height
 * const espyFn = (t, td) => 125 * (t - td);
 *
 * await calcAsync({
 *  t: await T2m.bands.getAsync(1),
 *  td: await D2m.bands.getAsync(1)
 * }, cloudBase.bands.getAsync(1), espyFn, { convertNoData: true });
 */
  export function calcAsync(inputs: Record<string, RasterBand>, output: RasterBand, fn: (...args: number[]) => number, options?: CalcOptions): Promise<void>

  /**
 * Compute checksum for image region.
 *
 * @throws Error
 * @method checksumImage
 * @static
 * @param {RasterBand} src
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [w=src.width]
 * @param {number} [h=src.height]
 * @return {number}
 */
  export function checksumImage(src: RasterBand, x?: number, y?: number, w?: number, h?: number): number

  /**
 * Compute checksum for image region.
 *
 * @throws Error
 * @method checksumImageAsync
 * @static
 * @param {RasterBand} src
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [w=src.width]
 * @param {number} [h=src.height]
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {number}
 * @return {Promise<number>}
 */
  export function checksumImageAsync(src: RasterBand, x?: number, y?: number, w?: number, h?: number, callback?: callback<number>): Promise<number>

  /**
 * Create vector contours from raster DEM.
 *
 * This algorithm will generate contour vectors for the input raster band on the
 * requested set of contour levels. The vector contours are written to the
 * passed in vector layer. Also, a NODATA value may be specified to identify
 * pixels that should not be considered in contour line generation.
 *
 * @throws Error
 * @method contourGenerate
 * @static
 * @param {ContourOptions} options
 * @param {RasterBand} options.src
 * @param {Layer} options.dst
 * @param {number} [options.offset=0] The "offset" relative to which contour intervals are applied. This is normally zero, but could be different. To generate 10m contours at 5, 15, 25, ... the offset would be 5.
 * @param {number} [options.interval=100] The elevation interval between contours generated.
 * @param {number[]} [options.fixedLevels] A list of fixed contour levels at which contours should be generated. Overrides interval/base options if set.
 * @param {number} [options.nodata] The value to use as a "nodata" value. That is, a pixel value which should be ignored in generating contours as if the value of the pixel were not known.
 * @param {number} [options.idField] A field index to indicate where a unique id should be written for each feature (contour) written.
 * @param {number} [options.elevField] A field index to indicate where the elevation value of the contour should be written.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
*/
  export function contourGenerate(options: ContourOptions): void

  /**
 * Create vector contours from raster DEM.
 * {{{async}}}
 *
 * This algorithm will generate contour vectors for the input raster band on the
 * requested set of contour levels. The vector contours are written to the
 * passed in vector layer. Also, a NODATA value may be specified to identify
 * pixels that should not be considered in contour line generation.
 *
 * @throws Error
 * @method contourGenerateAsync
 * @static
 * @param {ContourOptions} options
 * @param {RasterBand} options.src
 * @param {Layer} options.dst
 * @param {number} [options.offset=0] The "offset" relative to which contour intervals are applied. This is normally zero, but could be different. To generate 10m contours at 5, 15, 25, ... the offset would be 5.
 * @param {number} [options.interval=100] The elevation interval between contours generated.
 * @param {number[]} [options.fixedLevels] A list of fixed contour levels at which contours should be generated. Overrides interval/base options if set.
 * @param {number} [options.nodata] The value to use as a "nodata" value. That is, a pixel value which should be ignored in generating contours as if the value of the pixel were not known.
 * @param {number} [options.idField] A field index to indicate where a unique id should be written for each feature (contour) written.
 * @param {number} [options.elevField] A field index to indicate where the elevation value of the contour should be written.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  export function contourGenerateAsync(options: ContourOptions, callback?: callback<void>): Promise<void>

  /**
 * Convert decimal degrees to degrees, minutes, and seconds string
 *
 * @static
 * @method decToDMS
 * @param {number} angle
 * @param {string} axis `"lat"` or `"long"`
 * @param {number} [precision=2]
 * @return {string} A string nndnn'nn.nn'"L where n is a number and L is either
 * N or E
 */
  export function decToDMS(angle: number, axis: string, precision?: number): string

  /**
 * Fill raster regions by interpolation from edges.
 *
 * @throws Error
 * @method fillNodata
 * @static
 * @param {FillOptions} options
 * @param {RasterBand} options.src This band to be updated in-place.
 * @param {RasterBand} [options.mask] Mask band
 * @param {number} options.searchDist The maximum distance (in pixels) that the algorithm will search out for values to interpolate.
 * @param {number} [options.smoothingIterations=0] The number of 3x3 average filter smoothing iterations to run after the interpolation to dampen artifacts.
 */
  export function fillNodata(options: FillOptions): void

  /**
 * Fill raster regions by interpolation from edges.
 * {{{async}}}
 *
 * @throws Error
 * @method fillNodataAsync
 * @static
 * @param {FillOptions} options
 * @param {RasterBand} options.src This band to be updated in-place.
 * @param {RasterBand} [options.mask] Mask band
 * @param {number} options.searchDist The maximum distance (in pixels) that the algorithm will search out for values to interpolate.
 * @param {number} [options.smoothingIterations=0] The number of 3x3 average filter smoothing iterations to run after the interpolation to dampen artifacts.
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  export function fillNodataAsync(options: FillOptions, callback?: callback<void>): Promise<void>

  /**
 * Returns a TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) constructor from a GDAL data type
 *
 * @example
 *
 * const array = new (gdal.fromDataType(band.dataType))(band.size.x * band.size.y)
 * `
 *
 * @method fromDataType
 * @throws TypeError
 * @param {string|null} dataType
 * @return {new (len: number) => TypedArray}
 */
  export function fromDataType(dataType: string|null): new (len: number) => TypedArray

  /**
 * Library version of gdalinfo.
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const output = gdal.info('/vsimem/temp.tif')
 *
 * @throws Error
 * @method info
 * @instance
 * @static
 * @param {Dataset} dataset
 * @param {string[]} [args] array of CLI options for gdalinfo
 * @return {string}
 */
  export function info(dataset: Dataset, args?: string[]): string

  /**
 * Library version of gdalinfo.
 * {{{async}}}
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const output = gdal.info('/vsimem/temp.tif')
 * @throws Error
 *
 * @method infoAsync
 * @instance
 * @static
 * @param {Dataset} dataset
 * @param {string[]} [args] array of CLI options for gdalinfo
 * @param {callback<string>} [callback=undefined] {{{cb}}}
 * @return {Promise<string>}
 */
  export function infoAsync(dataset: Dataset, args?: string[], callback?: callback<string>): Promise<string>

  /**
 * Creates or opens a dataset. Dataset should be explicitly closed with `dataset.close()` method if opened in `"w"` mode to flush any changes. Otherwise, datasets are closed when (and if) node decides to garbage collect them.
 *
 * @example
 *
 * var dataset = gdal.open('./data.shp');
 *
 * @example
 *
 * var dataset = gdal.open(fs.readFileSync('./data.shp'));
 *
 * @throws Error
 * @method open
 * @static
 * @param {string|Buffer} path Path to dataset or in-memory Buffer to open
 * @param {string} [mode="r"] The mode to use to open the file: `"r"`, `"r+"`, or `"w"`
 * @param {string|string[]} [drivers] Driver name, or list of driver names to attempt to use.
 *
 * @param {number} [x_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {number} [y_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {number} [band_count] Used when creating a raster dataset with the `"w"` mode.
 * @param {string} [data_type] Used when creating a raster dataset with the `"w"` mode.
 * @param {string[]|object} [creation_options] Used when creating a dataset with the `"w"` mode.
 *
 * @return {Dataset}
 */
  export function open(path: string|Buffer, mode?: string, drivers?: string|string[], x_size?: number, y_size?: number, band_count?: number, data_type?: string, creation_options?: string[]|object): Dataset

  /**
 * TypeScript shorthand version with callback and no optional arguments
 *
 * @method openAsync
 * @static
 * @param {string|Buffer} path Path to dataset or in-memory Buffer to open
 * @param {callback<Dataset>} callback {{{cb}}}
 * @return {void}
 */
  export function openAsync(path: string|Buffer, callback: callback<Dataset>): void

  /**
 * Asynchronously creates or opens a dataset. Dataset should be explicitly closed with `dataset.close()` method if opened in `"w"` mode to flush any changes. Otherwise, datasets are closed when (and if) node decides to garbage collect them.
 * If the last parameter is a callback, then this callback is called on completion and undefined is returned. Otherwise the function returns a Promise resolved with the result.
 *
 * @example
 *
 * var dataset = await gdal.openAsync('./data.shp');
 *
 * @example
 *
 * var dataset = await gdal.openAsync(await fd.readFile('./data.shp'));
 *
 * @example
 *
 * gdal.openAsync('./data.shp', (err, ds) => {...});
 *
 * @method openAsync
 * @static
 * @param {string|Buffer} path Path to dataset or in-memory Buffer to open
 * @param {string} [mode="r"] The mode to use to open the file: `"r"`, `"r+"`, or `"w"`
 * @param {string|string[]} [drivers] Driver name, or list of driver names to attempt to use.
 *
 * @param {number} [x_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {number} [y_size] Used when creating a raster dataset with the `"w"` mode.
 * @param {number} [band_count] Used when creating a raster dataset with the `"w"` mode.
 * @param {string} [data_type] Used when creating a raster dataset with the `"w"` mode.
 * @param {string[]|object} [creation_options] Used when creating a dataset with the `"w"` mode.
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 */
  export function openAsync(path: string|Buffer, mode?: string, drivers?: string|string[], x_size?: number, y_size?: number, band_count?: number, data_type?: string, creation_options?: string[]|object, callback?: callback<Dataset>): Promise<Dataset>

  /**
 * Creates vector polygons for all connected regions of pixels in the raster
 * sharing a common pixel value. Each polygon is created with an attribute
 * indicating the pixel value of that polygon. A raster mask may also be
 * provided to determine which pixels are eligible for processing.
 *
 * @throws Error
 * @method polygonize
 * @static
 * @param {PolygonizeOptions} options
 * @param {RasterBand} options.src
 * @param {Layer} options.dst
 * @param {RasterBand} [options.mask]
 * @param {number} options.pixValField The attribute field index indicating the feature attribute into which the pixel value of the polygon should be written.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {boolean} [options.useFloats=false] Use floating point buffers instead of int buffers.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 */
  export function polygonize(options: PolygonizeOptions): void

  /**
 * Creates vector polygons for all connected regions of pixels in the raster
 * sharing a common pixel value. Each polygon is created with an attribute
 * indicating the pixel value of that polygon. A raster mask may also be
 * provided to determine which pixels are eligible for processing.
 * {{{async}}}
 *
 * @throws Error
 * @method polygonizeAsync
 * @static
 * @param {PolygonizeOptions} options
 * @param {RasterBand} options.src
 * @param {Layer} options.dst
 * @param {RasterBand} [options.mask]
 * @param {number} options.pixValField The attribute field index indicating the feature attribute into which the pixel value of the polygon should be written.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {boolean} [options.useFloats=false] Use floating point buffers instead of int buffers.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  export function polygonizeAsync(options: PolygonizeOptions, callback?: callback<void>): Promise<void>

  /**
   * Disables all output.
   *
   * @static
   * @method quiet
   */
  export function quiet(): void

  /**
 * Reprojects a dataset.
 *
 * @throws Error
 * @method reprojectImage
 * @static
 * @param {ReprojectOptions} options
 * @param {Dataset} options.src
 * @param {Dataset} options.dst
 * @param {SpatialReference} options.s_srs
 * @param {SpatialReference} options.t_srs
 * @param {string} [options.resampling] Resampling algorithm ({@link GRA|available options})
 * @param {Geometry} [options.cutline] Must be in src dataset pixel coordinates. Use CoordinateTransformation to convert between georeferenced coordinates and pixel coordinates
 * @param {number[]} [options.srcBands]
 * @param {number[]} [options.dstBands]
 * @param {number} [options.srcAlphaBand]
 * @param {number} [options.dstAlphaBand]
 * @param {number} [options.srcNodata]
 * @param {number} [options.dstNodata]
 * @param {number} [options.memoryLimit]
 * @param {number} [options.maxError]
 * @param {boolean} [options.multi]
 * @param {string[]|object} [options.options] Warp options (see: [reference](https://org/doxygen/structGDALWarpOptions.html))
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 */
  export function reprojectImage(options: ReprojectOptions): void

  /**
 * Reprojects a dataset.
 * {{{async}}}
 *
 * @throws Error
 * @method reprojectImageAsync
 * @static
 * @param {ReprojectOptions} options
 * @param {Dataset} options.src
 * @param {Dataset} options.dst
 * @param {SpatialReference} options.s_srs
 * @param {SpatialReference} options.t_srs
 * @param {string} [options.resampling] Resampling algorithm ({@link GRA|available options})
 * @param {Geometry} [options.cutline] Must be in src dataset pixel coordinates. Use CoordinateTransformation to convert between georeferenced coordinates and pixel coordinates
 * @param {number[]} [options.srcBands]
 * @param {number[]} [options.dstBands]
 * @param {number} [options.srcAlphaBand]
 * @param {number} [options.dstAlphaBand]
 * @param {number} [options.srcNodata]
 * @param {number} [options.dstNodata]
 * @param {number} [options.memoryLimit]
 * @param {number} [options.maxError]
 * @param {boolean} [options.multi]
 * @param {string[]|object} [options.options] Warp options (see:[reference](https://org/doxygen/structGDALWarpOptions.html)
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  export function reprojectImageAsync(options: ReprojectOptions, callback?: callback<void>): Promise<void>

  /**
 * Set paths where proj will search it data.
 *
 * @static
 * @method setPROJSearchPaths
 * @param {string} path `c:\ProjData`
 */
  export function setPROJSearchPaths(path: string): void

  /**
 * Removes small raster polygons.
 *
 * @throws Error
 * @method sieveFilter
 * @static
 * @param {SieveOptions} options
 * @param {RasterBand} options.src
 * @param {RasterBand} options.dst Output raster band. It may be the same as src band to update the source in place.
 * @param {RasterBand} [options.mask] All pixels in the mask band with a value other than zero will be considered suitable for inclusion in polygons.
 * @param {number} options.threshold Raster polygons with sizes smaller than this will be merged into their largest neighbour.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 */
  export function sieveFilter(options: SieveOptions): void

  /**
 * Removes small raster polygons.
 * {{{async}}}
 *
 * @throws Error
 * @method sieveFilterAsync
 * @static
 * @param {SieveOptions} options
 * @param {RasterBand} options.src
 * @param {RasterBand} options.dst Output raster band. It may be the same as src band to update the source in place.
 * @param {RasterBand} [options.mask] All pixels in the mask band with a value other than zero will be considered suitable for inclusion in polygons.
 * @param {number} options.threshold Raster polygons with sizes smaller than this will be merged into their largest neighbour.
 * @param {number} [options.connectedness=4] Either 4 indicating that diagonal pixels are not considered directly adjacent for polygon membership purposes or 8 indicating they are.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  export function sieveFilterAsync(options: SieveOptions, callback?: callback<void>): Promise<void>

  /**
 * Used to determine the bounds and resolution of the output virtual file which
 * should be large enough to include all the input image.
 *
 * @throws Error
 * @method suggestedWarpOutput
 * @static
 * @param {WarpOptions} options Warp options
 * @param {Dataset} options.src
 * @param {SpatialReference} options.s_srs
 * @param {SpatialReference} options.t_srs
 * @param {number} [options.maxError=0]
 * @return {WarpOutput} An object containing `"rasterSize"` and `"geoTransform"`
 * properties.
 */
  export function suggestedWarpOutput(options: WarpOptions): WarpOutput

  /**
 * Used to determine the bounds and resolution of the output virtual file which
 * should be large enough to include all the input image.
 * {{{async}}}
 *
 * @throws Error
 * @method suggestedWarpOutputAsync
 * @static
 * @param {WarpOptions} options Warp options
 * @param {Dataset} options.src
 * @param {SpatialReference} options.s_srs
 * @param {SpatialReference} options.t_srs
 * @param {number} [options.maxError=0]
 * @param {callback<WarpOutput>} [callback=undefined] {{{cb}}}
 * @return {Promise<WarpOutput>}
 */
  export function suggestedWarpOutputAsync(options: WarpOptions, callback?: callback<WarpOutput>): Promise<WarpOutput>

  /**
 * Returns a GDAL data type from a TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses)
 *
 * @example
 *
 * const dataType = gdal.fromDataType(array)
 * `
 *
 * @method toDataType
 * @throws TypeError
 * @param {TypedArray} array
 * @return {string}
 */
  export function toDataType(array: TypedArray): string

  /**
 * Library version of gdal_translate.
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const out = gdal.translate('/vsimem/temp.tif', ds, [ '-b', '1' ])
 *
 * @throws Error
 * @method translate
 * @instance
 * @static
 * @param {string} destination destination filename
 * @param {Dataset} source source dataset
 * @param {string[]} [args] array of CLI options for gdal_translate
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @return {Dataset}
 */
  export function translate(destination: string, source: Dataset, args?: string[], options?: UtilOptions): Dataset

  /**
 * Library version of gdal_translate.
 * {{{async}}}
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const out = gdal.translate('/vsimem/temp.tif', ds, [ '-b', '1' ])
 * @throws Error
 *
 * @method translateAsync
 * @instance
 * @static
 * @param {string} destination destination filename
 * @param {Dataset} source source dataset
 * @param {string[]} [args] array of CLI options for gdal_translate
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 */
  export function translateAsync(destination: string, source: Dataset, args?: string[], options?: UtilOptions, callback?: callback<Dataset>): Promise<Dataset>

  /**
 * Library version of ogr2ogr.
 *
 * @example
 * const ds = gdal.open('input.geojson')
 * const out = gdal.vectorTranslate('/vsimem/temp.gpkg', [ '-of', 'GPKG' ], ds)
 *
 * @throws Error
 * @method vectorTranslate
 * @instance
 * @static
 * @param {string|Dataset} destination destination
 * @param {Dataset} source source dataset
 * @param {string[]} [args] array of CLI options for ogr2ogr
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @return {Dataset}
 */
  export function vectorTranslate(destination: string|Dataset, source: Dataset, args?: string[], options?: UtilOptions): Dataset

  /**
 * Library version of ogr2ogr.
 * {{{async}}}
 *
 * @example
 * const ds = gdal.open('input.geojson')
 * const out = gdal.vectorTranslate('/vsimem/temp.gpkg', [ '-of', 'GPKG' ], ds)
 * @throws Error
 *
 * @method vectorTranslateAsync
 * @instance
 * @static
 * @param {string|Dataset} destination destination
 * @param {Dataset} source source dataset
 * @param {string[]} [args] array of CLI options for ogr2ogr
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 */
  export function vectorTranslateAsync(destination: string|Dataset, source: Dataset, args?: string[], options?: UtilOptions, callback?: callback<Dataset>): Promise<Dataset>

  /**
   * Displays extra debugging information from GDAL.
   *
   * @static
   * @method verbose
   */
  export function verbose(): void

  /**
 * Library version of gdalwarp.
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const output = gdal.warp('/vsimem/temp.tif')
 *
 * @throws Error
 * @method warp
 * @instance
 * @static
 * @param {string|null} dst_path destination path, null for an in-memory operation
 * @param {Dataset|null} dst_ds destination dataset, null for a new dataset
 * @param {Dataset[]} src_ds array of source datasets
 * @param {string[]} [args] array of CLI options for gdalwarp
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @return {Dataset}
 */
  export function warp(dst_path: string|null, dst_ds: Dataset|null, src_ds: Dataset[], args?: string[], options?: UtilOptions): Dataset

  /**
 * Library version of gdalinfo.
 * {{{async}}}
 *
 * @example
 * const ds = gdal.open('input.tif')
 * const output = gdal.warp('/vsimem/temp.tif')
 * @throws Error
 *
 * @method warpAsync
 * @instance
 * @static
 * @param {string|null} dst_path destination path, null for an in-memory operation
 * @param {Dataset|null} dst_ds destination dataset, null for a new dataset
 * @param {Dataset[]} src_ds array of source datasets
 * @param {string[]} [args] array of CLI options for gdalwarp
 * @param {UtilOptions} [options] additional options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 */
  export function warpAsync(dst_path: string|null, dst_ds: Dataset|null, src_ds: Dataset[], args?: string[], options?: UtilOptions, callback?: callback<Dataset>): Promise<Dataset>
export class ArrayAttributes implements Iterable<Attribute>, AsyncIterable<Attribute> {
/**
 * An encapsulation of a {@link Array}
 * descendant attributes.
 *
 * @class ArrayAttributes
 */
  constructor()

  /**
 * Attributes' names
 *
 * @readonly
 * @kind member
 * @name names
 * @instance
 * @memberof ArrayAttributes
 * @type {string[]}
 */
  readonly names: string[]

  /**
 * Parent dataset
 *
 * @readonly
 * @name ds
 * @kind member
 * @instance
 * @memberof ArrayAttributes
 */
  readonly ds: unknown
  [Symbol.iterator](): Iterator<Attribute>
  [Symbol.asyncIterator](): AsyncIterator<Attribute>

  /**
 * Returns the attribute with the given name/index.
 *
 * @method get
 * @instance
 * @memberof ArrayAttributes
 * @param {string|number} attribute
 * @return {Attribute}
 */
  get(attribute: string|number): Attribute

  /**
 * Returns the attribute with the given name/index.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof ArrayAttributes
 * @param {string|number} attribute
 * @param {callback<Attribute>} [callback=undefined] {{{cb}}}
 * @return {Promise<Attribute>}
 */
  getAsync(attribute: string|number, callback?: callback<Attribute>): Promise<Attribute>

  /**
 * Returns the number of attributes in the collection.
 *
 * @method count
 * @instance
 * @memberof ArrayAttributes
 * @return {number}
 */
  count(): number

  /**
 * Returns the number of attributes in the collection.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof ArrayAttributes
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  countAsync(callback?: callback<number>): Promise<number>

  /**
 * Iterates through all attributes using a callback function.
 *
 * @example
 *
 * array.attributes.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof ArrayAttributes
 * @param {forEachCb<Attribute>} callback The callback to be called with each {@link Attribute}
 */
  forEach(callback: forEachCb<Attribute>): void

  /**
 * Iterates through attributes using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = array.attributes.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof ArrayAttributes
 * @param {mapCb<Attribute,U>} callback The callback to be called with each {@link Attribute}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Attribute,U>): U[]
}

export class ArrayDimensions implements Iterable<Dimension>, AsyncIterable<Dimension> {
/**
 * An encapsulation of a {@link MDArray}
 * descendant dimensions.
 *
 * @example
 * const dimensions = group.dimensions;
 *
 * @class ArrayDimensions
 */
  constructor()

  /**
 * Dimensions' names
 *
 * @readonly
 * @kind member
 * @instance
 * @memberof ArrayDimensions
 * @name names
 * @type {string[]}
 */
  readonly names: string[]

  /**
 * Parent group
 *
 * @readonly
 * @kind member
 * @instance
 * @memberof ArrayDimensions
 * @name parent
 * @type {Group}
 */
  readonly parent: Group

  /**
 * Parent dataset
 *
 * @readonly
 * @kind member
 * @instance
 * @memberof ArrayDimensions
 * @name ds
 * @type {Dataset}
 */
  readonly ds: Dataset
  [Symbol.iterator](): Iterator<Dimension>
  [Symbol.asyncIterator](): AsyncIterator<Dimension>

  /**
 * Returns the array with the given name/index.
 *
 * @method get
 * @instance
 * @memberof ArrayDimensions
 * @param {string|number} array
 * @return {Dimension}
 */
  get(array: string|number): Dimension

  /**
 * Returns the array with the given name/index.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof ArrayDimensions
 * @param {string|number} array
 * @param {callback<Dimension>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dimension>}
 */
  getAsync(array: string|number, callback?: callback<Dimension>): Promise<Dimension>

  /**
 * Returns the number of dimensions in the collection.
 *
 * @method count
 * @instance
 * @memberof ArrayDimensions
* @return {number}
 */
  count(): number

  /**
 * Returns the number of dimensions in the collection.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof ArrayDimensions
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  countAsync(callback?: callback<number>): Promise<number>

  /**
 * Iterates through all dimensions using a callback function.
 *
 * @example
 *
 * array.dimensions.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof ArrayDimensions
 * @param {forEachCb<Dimension>} callback The callback to be called with each {@link Dimension}
 */
  forEach(callback: forEachCb<Dimension>): void

  /**
 * Iterates through dimensions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = array.dimensions.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof ArrayDimensions
 * @param {mapCb<Dimension,U>} callback The callback to be called with each {@link Dimension}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Dimension,U>): U[]
}

export class Attribute {
/**
 * A representation of a group with access methods.
 *
 * @class Attribute
 */
  constructor()

  /**
 * Complex GDAL data types introduced in 3.1 are not yet supported
 * @readonly
 * @kind member
 * @name value
 * @instance
 * @memberof Attribute
 * @throws Error
 * @type {string|number}
 */
  readonly value: string|number

  /**
 * @readonly
 * @kind member
 * @name dataType
 * @instance
 * @memberof Attribute
 * @type {string}
 */
  readonly dataType: string
}

export class CircularString extends SimpleCurve {
/**
 * Concrete representation of an arc.
 *
 * @example
 *
 * var CircularString = new gdal.CircularString();
 * CircularString.points.add(new gdal.Point(0,0));
 * CircularString.points.add(new gdal.Point(0,10));
 *
 * @constructor
 * @class CircularString
 * @extends SimpleCurve
 */
  constructor()
}

export class ColorTable implements Iterable<Color> {
/**
 * An encapsulation of a {@link RasterBand}
 * color table.
 *
 * @example
 * var colorTable = band.colorTable;
 *
 * band.colorTable = new gdal.ColorTable(gdal.GPI_RGB);
 *
 * @class ColorTable
 * @param {string} interpretation palette interpretation
 */
  constructor(interpretation: string)

  /**
 * Color interpretation of the palette
 *
 * @readonly
 * @kind member
 * @name interpretation
 * @instance
 * @memberof ColorTable
 * @type {string}
 */
  readonly interpretation: string

  /**
 * Parent band
 *
 * @readonly
 * @kind member
 * @name band
 * @instance
 * @memberof ColorTable
 * @type {RasterBand|undefined}
 */
  readonly band: RasterBand|undefined
  [Symbol.iterator](): Iterator<Color>

  /**
 * Clones the instance.
 * The newly created ColorTable is not owned by any RasterBand.
 *
 * @method clone
 * @instance
 * @memberof ColorTable
 * @return {ColorTable}
 */
  clone(): ColorTable

  /**
 * Compares two ColorTable objects for equality
 *
 * @method isSame
 * @instance
 * @memberof ColorTable
 * @param {ColorTable} other
 * @throws Error
 * @return {boolean}
 */
  isSame(other: ColorTable): boolean

  /**
 * Returns the color with the given ID.
 *
 * @method get
 * @instance
 * @memberof ColorTable
 * @param {number} index
 * @throws Error
 * @return {Color}
 */
  get(index: number): Color

  /**
 * Sets the color entry with the given ID.
 *
 * @method set
 * @instance
 * @memberof ColorTable
 * @throws Error
 * @param {number} index
 * @param {Color} color
 * @return {void}
 */
  set(index: number, color: Color): void

  /**
 * Creates a color ramp from one color entry to another.
 *
 * @method ramp
 * @instance
 * @memberof ColorTable
 * @throws Error
 * @param {number} start_index
 * @param {Color} start_color
 * @param {number} end_index
 * @param {Color} end_color
 * @return {number} total number of color entries
 */
  ramp(start_index: number, start_color: Color, end_index: number, end_color: Color): number

  /**
 * Returns the number of color entries.
 *
 * @method count
 * @instance
 * @memberof ColorTable
 * @return {number}
 */
  count(): number

  /**
 * Iterates through all color entries using a callback function.
 *
 * @example
 *
 * band.colorTable.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof ColorTable
 * @param {forEachCb<Color>} callback The callback to be called with each {@link Color}
 */
  forEach(callback: forEachCb<Color>): void

  /**
 * Iterates through color entries using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = band.colorTable.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof ColorTable
 * @param {mapCb<Color,U>} callback The callback to be called with each {@link Color}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Color,U>): U[]
}

export class CompoundCurve extends Geometry {
/**
 * Concrete representation of a compound contionuos curve.
 *
 * @example
 *
 * var CompoundCurve = new gdal.CompoundCurve();
 * CompoundCurve.points.add(new gdal.Point(0,0));
 * CompoundCurve.points.add(new gdal.Point(0,10));
 *
 * @constructor
 * @class CompoundCurve
 * @extends Geometry
 */
  constructor()

  /**
 * Points that make up the compound curve.
 *
 * @kind member
 * @name curves
 * @instance
 * @memberof CompoundCurve
 * @type {CompoundCurveCurves}
 */
  curves: CompoundCurveCurves
}

export class CompoundCurveCurves implements Iterable<SimpleCurve>, AsyncIterable<SimpleCurve> {
/**
 * A collection of connected curves, used by {@link CompoundCurve}
 *
 * @class CompoundCurveCurves
 */
  constructor()
  [Symbol.iterator](): Iterator<SimpleCurve>
  [Symbol.asyncIterator](): AsyncIterator<SimpleCurve>

  /**
 * Returns the number of curves that exist in the collection.
 *
 * @method count
 * @instance
 * @memberof CompoundCurveCurves
 * @return {number}
 */
  count(): number

  /**
 * Returns the curve at the specified index.
 *
 * @example
 *
 * var curve0 = compound.curves.get(0);
 * var curve1 = compound.curves.get(1);
 *
 * @method get
 * @instance
 * @memberof CompoundCurveCurves
 * @param {number} index
 * @throws Error
 * @return {gdal.CompoundCurve|SimpleCurve}
 */
  get(index: number): gdal.CompoundCurve|SimpleCurve

  /**
 * Adds a curve to the collection.
 *
 * @example
 *
 * var ring1 = new gdal.CircularString();
 * ring1.points.add(0,0);
 * ring1.points.add(1,0);
 * ring1.points.add(1,1);
 * ring1.points.add(0,1);
 * ring1.points.add(0,0);
 *
 * // one at a time:
 * compound.curves.add(ring1);
 *
 * // many at once:
 * compound.curves.add([ring1, ...]);
 *
 * @method add
 * @instance
 * @memberof CompoundCurveCurves
 * @param {gdal.SimpleCurve|SimpleCurve[]} curves
 */
  add(curves: gdal.SimpleCurve|SimpleCurve[]): void

  /**
 * Iterates through all curves using a callback function.
 *
 * @example
 *
 * compoundCurves.curves.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof CompoundCurveCurves
 * @param {forEachCb<SimpleCurve>} callback The callback to be called with each {@link SimpleCurve}
 */
  forEach(callback: forEachCb<SimpleCurve>): void

  /**
 * Iterates through curves using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = compoundCurves.curves.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof CompoundCurveCurves
 * @param {mapCb<SimpleCurve,U>} callback The callback to be called with each {@link SimpleCurve}
 * @return {U[]}
 */
  map<U>(callback: mapCb<SimpleCurve,U>): U[]

  /**
 * Outputs all curves as a regular javascript array.
 *
 * @method
 * @name toArray
 * @instance
 * @memberof CompoundCurveCurves
 * @return {SimpleCurve[]} List of {@link SimpleCurve|SimpleCurve instances}
 */
  toArray(): SimpleCurve[]
}

export class CoordinateTransformation {
/**
 * Object for transforming between coordinate systems.
 *
 * @throws Error
 * @constructor
 * @class CoordinateTransformation
 * @param {SpatialReference} source
 * @param {gdal.SpatialReference|Dataset} target If a raster Dataset, the
 * conversion will represent a conversion to pixel coordinates.
 */
  constructor(source: SpatialReference, target: gdal.SpatialReference|Dataset)

  /**
 * Transform point from source to destination space.
 *
 * @example
 *
 * pt = transform.transformPoint(0, 0, 0);
 *
 * @method transformPoint
 * @instance
 * @memberof CoordinateTransformation
 * @param {number} x
 * @param {number} y
 * @param {number} [z]
 * @return {xyz} A regular object containing `x`, `y`, `z` properties.
 */
  transformPoint(x: number, y: number, z?: number): xyz

  /**
 * Transform point from source to destination space.
 *
 * @example
 *
 * pt = transform.transformPoint({x: 0, y: 0, z: 0});
 *
 * @method transformPoint
 * @instance
 * @memberof CoordinateTransformation
 * @param {xyz} point
 * @return {xyz} A regular object containing `x`, `y`, `z` properties.
 */
  transformPoint(point: xyz): xyz
}

export class Dataset {
/**
 * A set of associated raster bands and/or vector layers, usually from one file.
 *
 * @example
 * // raster dataset:
 * dataset = gdal.open('file.tif');
 * bands = dataset.bands;
 *
 * // vector dataset:
 * dataset = gdal.open('file.shp');
 * layers = dataset.layers;
 *
 * @class Dataset
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name description
 * @instance
 * @memberof Dataset
 * @type {string}
 */
  readonly description: string

  /**
 * Raster dimensions. An object containing `x` and `y` properties.
 *
 * @readonly
 * @kind member
 * @name rasterSize
 * @instance
 * @memberof Dataset
 * @type {xyz}
 */
  readonly rasterSize: xyz

  /**
 * Raster dimensions. An object containing `x` and `y` properties.
 * {{async_getter}}
 *
 * @readonly
 * @kind member
 * @name rasterSizeAsync
 * @instance
 * @memberof Dataset
 * @type {Promise<xyz>}
 */
  readonly rasterSizeAsync: Promise<xyz>

  /**
 * Spatial reference associated with raster dataset
 *
 * @throws Error
 * @kind member
 * @name srs
 * @instance
 * @memberof Dataset
 * @type {SpatialReference|null}
 */
  srs: SpatialReference|null

  /**
 * Spatial reference associated with raster dataset
 * {{async_getter}}
 *
 * @throws Error
 * @kind member
 * @name srsAsync
 * @instance
 * @memberof Dataset
 * @readonly
 * @type {Promise<SpatialReference|null>}
 */
  readonly srsAsync: Promise<SpatialReference|null>

  /**
 * An affine transform which maps pixel/line coordinates into georeferenced
 * space using the following relationship:
 *
 * @example
 *
 * var GT = dataset.geoTransform;
 * var Xgeo = GT[0] + Xpixel*GT[1] + Yline*GT[2];
 * var Ygeo = GT[3] + Xpixel*GT[4] + Yline*GT[5];
 *
 * @kind member
 * @name geoTransform
 * @instance
 * @memberof Dataset
 * @type {number[]|null}
 */
  geoTransform: number[]|null

  /**
 * An affine transform which maps pixel/line coordinates into georeferenced
 * space using the following relationship:
 *
 * @example
 *
 * var GT = dataset.geoTransform;
 * var Xgeo = GT[0] + Xpixel*GT[1] + Yline*GT[2];
 * var Ygeo = GT[3] + Xpixel*GT[4] + Yline*GT[5];
 *
 * {{async_getter}}
 * @readonly
 * @kind member
 * @name geoTransformAsync
 * @instance
 * @memberof Dataset
 * @type {Promise<number[]|null>}
 */
  readonly geoTransformAsync: Promise<number[]|null>

  /**
 * @readonly
 * @kind member
 * @name driver
 * @instance
 * @memberof Dataset
 * @type {Driver}
 */
  readonly driver: Driver

  /**
 * @readonly
 * @kind member
 * @name bands
 * @instance
 * @memberof Dataset
 * @type {DatasetBands}
 */
  readonly bands: DatasetBands

  /**
 * @readonly
 * @kind member
 * @name layers
 * @instance
 * @memberof Dataset
 * @type {DatasetLayers}
 */
  readonly layers: DatasetLayers

  /**
 * @readonly
 * @kind member
 * @name root
 * @instance
 * @memberof Dataset
 * @type {Group}
 */
  readonly root: Group

  /**
 * Fetch metadata.
 *
 * @method getMetadata
 * @instance
 * @memberof Dataset
 * @param {string} [domain]
 * @return {any}
 */
  getMetadata(domain?: string): any

  /**
 * Fetch metadata.
 * {{{async}}}
 *
 * @method getMetadataAsync
 * @instance
 * @memberof Dataset
 * @param {string} [domain]
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<any>}
 */
  getMetadataAsync(domain?: string, callback?: callback<void>): Promise<any>

  /**
 * Set metadata. Can return a warning (false) for formats not supporting persistent metadata.
 *
 * @method setMetadata
 * @instance
 * @memberof Dataset
 * @param {object|string[]} metadata
 * @param {string} [domain]
 * @return {boolean}
 */
  setMetadata(metadata: object|string[], domain?: string): boolean

  /**
 * Set metadata. Can return a warning (false) for formats not supporting persistent metadata.
 * {{{async}}}
 *
 * @method setMetadataAsync
 * @instance
 * @memberof Dataset
 * @param {object|string[]} metadata
 * @param {string} [domain]
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  setMetadataAsync(metadata: object|string[], domain?: string, callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the dataset supports the indicated operation.
 *
 * @method testCapability
 * @instance
 * @memberof Dataset
 * @param {string} capability {@link ODsC|capability list}
 * @return {boolean}
 */
  testCapability(capability: string): boolean

  /**
 * Get output projection for GCPs.
 *
 * @method getGCPProjection
 * @instance
 * @memberof Dataset
 * @return {string}
 */
  getGCPProjection(): string

  /**
 * Closes the dataset to further operations. It releases all memory and ressources held
 * by the dataset.
 * This is normally an instantenous atomic operation that won't block the event loop
 * except if there is an operation running on this dataset in asynchronous context - in this case
 * this call will block until that operation finishes.
 *
 * If this could potentially be the case and blocking the event loop is not possible (server code),
 * then the best option is to simply dereference it (ds = null) and leave
 * the garbage collector to expire it.
 *
 * Implementing an asynchronous delete is difficult since all V8 object creation/deletion
 * must take place on the main thread.
 *
 * flush[Async]() ensures that, when writing, all data has been written.
 *
 * @method close
 * @instance
 * @memberof Dataset
 */
  close(): void

  /**
 * Flushes all changes to disk.
 *
 * @throws Error
 * @method flush
 * @instance
 * @memberof Dataset
 */
  flush(): void

  /**
 * Flushes all changes to disk.
 * {{{async}}}
 *
 * @method flushAsync
 * @instance
 * @memberof Dataset
 * @throws Error
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  flushAsync(callback?: callback<void>): Promise<void>

  /**
 * Execute an SQL statement against the data store.
 *
 * @throws Error
 * @method executeSQL
 * @instance
 * @memberof Dataset
 * @param {string} statement SQL statement to execute.
 * @param {Geometry} [spatial_filter=null] Geometry which represents a
 * spatial filter.
 * @param {string} [dialect=null] Allows control of the statement dialect. If
 * set to `null`, the OGR SQL engine will be used, except for RDBMS drivers that
 * will use their dedicated SQL engine, unless `"OGRSQL"` is explicitely passed
 * as the dialect. Starting with OGR 1.10, the `"SQLITE"` dialect can also be
 * used.
 * @return {Layer}
 */
  executeSQL(statement: string, spatial_filter?: Geometry, dialect?: string): Layer

  /**
 * Execute an SQL statement against the data store.
 * {{{async}}}
 *
 * @throws Error
 * @method executeSQLAsync
 * @instance
 * @memberof Dataset
 * @param {string} statement SQL statement to execute.
 * @param {Geometry} [spatial_filter=null] Geometry which represents a
 * spatial filter.
 * @param {string} [dialect=null] Allows control of the statement dialect. If
 * set to `null`, the OGR SQL engine will be used, except for RDBMS drivers that
 * will use their dedicated SQL engine, unless `"OGRSQL"` is explicitely passed
 * as the dialect. Starting with OGR 1.10, the `"SQLITE"` dialect can also be
 * used.
 * @param {callback<Layer>} [callback=undefined] {{{cb}}}
 * @return {Promise<Layer>}
 */
  executeSQLAsync(statement: string, spatial_filter?: Geometry, dialect?: string, callback?: callback<Layer>): Promise<Layer>

  /**
 * Fetch files forming dataset.
 *
 * Returns a list of files believed to be part of this dataset. If it returns an
 * empty list of files it means there is believed to be no local file system
 * files associated with the dataset (for instance a virtual dataset).
 *
 * Returns an empty array for vector datasets if GDAL version is below 2.0
 *
 * @method getFileList
 * @instance
 * @memberof Dataset
 * @return {string[]}
 */
  getFileList(): string[]

  /**
 * Fetches GCPs.
 *
 * @method getGCPs
 * @instance
 * @memberof Dataset
 * @return {any[]}
 */
  getGCPs(): any[]

  /**
 * Sets GCPs.
 *
 * @throws Error
 * @method setGCPs
 * @instance
 * @memberof Dataset
 * @param {object[]} gcps
 * @param {string} [projection]
 */
  setGCPs(gcps: object[], projection?: string): void

  /**
 * Builds dataset overviews.
 *
 * @throws Error
 * @method buildOverviews
 * @instance
 * @memberof Dataset
 * @param {string} resampling `"NEAREST"`, `"GAUSS"`, `"CUBIC"`, `"AVERAGE"`,
 * `"MODE"`, `"AVERAGE_MAGPHASE"` or `"NONE"`
 * @param {number[]} overviews
 * @param {number[]} [bands] Note: Generation of overviews in external TIFF currently only supported when operating on all bands.
 * @param {ProgressOptions} [options] options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 */
  buildOverviews(resampling: string, overviews: number[], bands?: number[], options?: ProgressOptions): void

  /**
 * Builds dataset overviews.
 * {{{async}}}
 *
 * @throws Error
 * @method buildOverviewsAsync
 * @instance
 * @memberof Dataset
 * @param {string} resampling `"NEAREST"`, `"GAUSS"`, `"CUBIC"`, `"AVERAGE"`,
 * `"MODE"`, `"AVERAGE_MAGPHASE"` or `"NONE"`
 * @param {number[]} overviews
 * @param {number[]} [bands] Note: Generation of overviews in external TIFF currently only supported when operating on all bands.
 * @param {ProgressOptions} [options] options
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  buildOverviewsAsync(resampling: string, overviews: number[], bands?: number[], options?: ProgressOptions, callback?: callback<void>): Promise<void>
}

export class DatasetBands implements Iterable<RasterBand>, AsyncIterable<RasterBand> {
/**
 * An encapsulation of a {@link Dataset}
 * raster bands.
 *
 * @example
 * var bands = dataset.bands;
 *
 * @class DatasetBands
 */
  constructor()

  /**
 * Parent dataset
 *
 * @readonly
 * @kind member
 * @name ds
 * @instance
 * @memberof DatasetBands
 * @type {Dataset}
 */
  readonly ds: Dataset
  [Symbol.iterator](): Iterator<RasterBand>
  [Symbol.asyncIterator](): AsyncIterator<RasterBand>

  /**
 * Returns the band with the given ID.
 *
 * @method get
 * @instance
 * @memberof DatasetBands
 * @param {number} id
 * @throws Error
 * @return {RasterBand}
 */
  get(id: number): RasterBand

  /**
 * Returns the band with the given ID.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof DatasetBands
 *
 * @param {number} id
 * @param {callback<RasterBand>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<RasterBand>}
 */
  getAsync(id: number, callback?: callback<RasterBand>): Promise<RasterBand>

  /**
 * Adds a new band.
 *
 * @method create
 * @instance
 * @memberof DatasetBands
 * @throws Error
 * @param {string} dataType Type of band ({@link GDT|see GDT constants})
 * @param {object|string[]} [options] Creation options
 * @return {RasterBand}
 */
  create(dataType: string, options?: object|string[]): RasterBand

  /**
 * Adds a new band.
 * {{{async}}}
 *
 * @method createAsync
 * @instance
 * @memberof DatasetBands
 * @throws Error
 * @param {string} dataType Type of band ({@link GDT|see GDT constants})
 * @param {object|string[]} [options] Creation options
 * @param {callback<RasterBand>} [callback=undefined] {{{cb}}}
 * @return {Promise<RasterBand>}
 */
  createAsync(dataType: string, options?: object|string[], callback?: callback<RasterBand>): Promise<RasterBand>

  /**
 * Returns the number of bands.
 *
 * @method count
 * @instance
 * @memberof DatasetBands
 * @return {number}
 */
  count(): number

  /**
 *
 * Returns the number of bands.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof DatasetBands
 *
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  countAsync(callback?: callback<number>): Promise<number>

  /**
 * Iterates through raster bands using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = dataset.bands.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof DatasetBands
 * @param {mapCb<RasterBand,U>} callback The callback to be called with each {@link RasterBand}
 * @return {U[]}
 */
  map<U>(callback: mapCb<RasterBand,U>): U[]

  /**
 * Returns a {@link Envelope|Envelope object for the raster bands}
 *
 * @example
 *
 * const extent = dataset.getEnvelope()
 * `
 *
 * @memberof DatasetBands
 * @method getEnvelope
 * @return {Envelope}
 */
  getEnvelope(): Envelope

  /**
 * Iterates through all bands using a callback function.
 * Note: GDAL band indexes start at 1, not 0.
 *
 * @example
 *
 * dataset.bands.forEach(function(band, i) { ... });
 *
 * @memberof DatasetBands
 * @method forEach
 * @param {forEachCb<RasterBand>} callback The callback to be called with each {@link RasterBand}
 */
  forEach(callback: forEachCb<RasterBand>): void
}

export class DatasetLayers implements Iterable<Layer>, AsyncIterable<Layer> {
/**
 * An encapsulation of a {@link Dataset}
 * vector layers.
 *
 * @example
 * var layers = dataset.layers;
 *
 * @class DatasetLayers
 */
  constructor()

  /**
 * Parent dataset
 *
 * @readonly
 * @kind member
 * @name ds
 * @instance
 * @memberof DatasetLayers
 * @type {Dataset}
 */
  readonly ds: Dataset
  [Symbol.iterator](): Iterator<Layer>
  [Symbol.asyncIterator](): AsyncIterator<Layer>

  /**
 * Returns the layer with the given name or identifier.
 *
 * @method get
 * @instance
 * @memberof DatasetLayers
 * @param {string|number} key Layer name or ID.
 * @throws Error
 * @return {Layer}
 */
  get(key: string|number): Layer

  /**
 * Returns the layer with the given name or identifier.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof DatasetLayers
 * @param {string|number} key Layer name or ID.
 * @param {callback<Layer>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Layer>}
 */
  getAsync(key: string|number, callback?: callback<Layer>): Promise<Layer>

  /**
 * Adds a new layer.
 *
 * @example
 *
 * dataset.layers.create('layername', null, gdal.Point);
 *
 *
 * @method create
 * @instance
 * @memberof DatasetLayers
 * @throws Error
 * @param {string} name Layer name
 * @param {SpatialReference|null} [srs=null] Layer projection
 * @param {number|Function|null} [geomType=null] Geometry type or constructor ({@link wkbGeometryType|see geometry types})
 * @param {string[]|object} [creation_options] driver-specific layer creation
 * options
 * @return {Layer}
 */
  create(name: string, srs?: SpatialReference|null, geomType?: number|Function|null, creation_options?: string[]|object): Layer

  /**
 * Adds a new layer.
 * {{{async}}}
 *
 * @example
 *
 * await dataset.layers.createAsync('layername', null, gdal.Point);
 * dataset.layers.createAsync('layername', null, gdal.Point, (e, r) => console.log(e, r));
 *
 *
 * @method createAsync
 * @instance
 * @memberof DatasetLayers
 * @throws Error
 * @param {string} name Layer name
 * @param {SpatialReference|null} [srs=null] Layer projection
 * @param {number|Function|null} [geomType=null] Geometry type or constructor ({@link wkbGeometryType|see geometry types})
 * @param {string[]|object} [creation_options] driver-specific layer creation
 * options
 * @param {callback<Layer>} [callback=undefined] {{{cb}}}
 * @return {Promise<Layer>}
 */
  createAsync(name: string, srs?: SpatialReference|null, geomType?: number|Function|null, creation_options?: string[]|object, callback?: callback<Layer>): Promise<Layer>

  /**
 * Returns the number of layers.
 *
 * @method count
 * @instance
 * @memberof DatasetLayers
 * @return {number}
 */
  count(): number

  /**
 * Returns the number of layers.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof DatasetLayers
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  countAsync(callback?: callback<number>): Promise<number>

  /**
 * Copies a layer.
 *
 * @method copy
 * @instance
 * @memberof DatasetLayers
 * @param {Layer} src_lyr_name
 * @param {string} dst_lyr_name
 * @param {object|string[]} [options=null] layer creation options
 * @return {Layer}
 */
  copy(src_lyr_name: Layer, dst_lyr_name: string, options?: object|string[]): Layer

  /**
 * Copies a layer.
 * {{{async}}}
 *
 * @method copyAsync
 * @instance
 * @memberof DatasetLayers
 * @param {Layer} src_lyr_name
 * @param {string} dst_lyr_name
 * @param {object|string[]} [options=null] layer creation options
 * @param {callback<Layer>} [callback=undefined] {{{cb}}}
 * @return {Promise<Layer>}
 */
  copyAsync(src_lyr_name: Layer, dst_lyr_name: string, options?: object|string[], callback?: callback<Layer>): Promise<Layer>

  /**
 * Removes a layer.
 *
 * @method remove
 * @instance
 * @memberof DatasetLayers
 * @throws Error
 * @param {number} index
 */
  remove(index: number): void

  /**
 * Removes a layer.
 * {{{async}}}
 *
 * @method removeAsync
 * @instance
 * @memberof DatasetLayers
 * @throws Error
 * @param {number} index
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  removeAsync(index: number, callback?: callback<void>): Promise<void>

  /**
 * Iterates through all layers using a callback function.
 *
 * @example
 *
 * dataset.layers.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof DatasetLayers
 * @param {forEachCb<Layer>} callback The callback to be called with each {@link Layer}
 */
  forEach(callback: forEachCb<Layer>): void

  /**
 * Iterates through layers using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = dataset.layers.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof DatasetLayers
 * @param {mapCb<Layer,U>} callback The callback to be called with each {@link Layer}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Layer,U>): U[]
}

export class Dimension {
/**
 * A representation of a group with access methods.
 *
 * @class Dimension
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name size
 * @instance
 * @memberof Dimension
 * @type {number}
 */
  readonly size: number

  /**
 * @readonly
 * @kind member
 * @name description
 * @instance
 * @memberof Dimension
 * @type {string}
 */
  readonly description: string

  /**
 * @readonly
 * @kind member
 * @name direction
 * @instance
 * @memberof Dimension
 * @type {string}
 */
  readonly direction: string

  /**
 * @readonly
 * @kind member
 * @name type
 * @instance
 * @memberof Dimension
 * @type {string}
 */
  readonly type: string
}

export class Driver {
/**
 * Format specific driver.
 *
 * An instance of this class is created for each supported format, and
 * manages information about the format.
 *
 * This roughly corresponds to a file format, though some drivers may
 * be gateways to many formats through a secondary multi-library.
 *
 * @class Driver
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name description
 * @instance
 * @memberof Driver
 * @type {string}
 */
  readonly description: string

  /**
 * @throws Error
 * @method deleteDataset
 * @instance
 * @memberof Driver
 * @param {string} filename
 */
  deleteDataset(filename: string): void

  /**
 * Create a new dataset with this driver.
 *
 * @throws Error
 * @method create
 * @instance
 * @memberof Driver
 * @param {string} filename
 * @param {number} [x_size=0] raster width in pixels (ignored for vector
 * datasets)
 * @param {number} [y_size=0] raster height in pixels (ignored for vector
 * datasets)
 * @param {number} [band_count=0]
 * @param {number} [data_type=GDT_Byte] pixel data type (ignored for
 * vector datasets) (see {@link GDT|data types}
 * @param {string[]|object} [creation_options] An array or object containing
 * driver-specific dataset creation options
 * @throws
 * @return {Dataset}
 */
  create(filename: string, x_size?: number, y_size?: number, band_count?: number, data_type?: number, creation_options?: string[]|object): Dataset

  /**
 * Asynchronously create a new dataset with this driver.
 *
 * @throws Error
 * @method createAsync
 * @instance
 * @memberof Driver
 * @param {string} filename
 * @param {number} [x_size=0] raster width in pixels (ignored for vector
 * datasets)
 * @param {number} [y_size=0] raster height in pixels (ignored for vector
 * datasets)
 * @param {number} [band_count=0]
 * @param {number} [data_type=GDT_Byte] pixel data type (ignored for
 * vector datasets) (see {@link GDT|data types}
 * @param {string[]|object} [creation_options] An array or object containing
 * driver-specific dataset creation options
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @throws
 * @return {Promise<Dataset>}
 */
  createAsync(filename: string, x_size?: number, y_size?: number, band_count?: number, data_type?: number, creation_options?: string[]|object, callback?: callback<Dataset>): Promise<Dataset>

  /**
 * Create a copy of a dataset.
 *
 * @throws Error
 * @method createCopy
 * @instance
 * @memberof Driver
 * @param {string} filename
 * @param {Dataset} src
 * @param {string[]|object} [options=null] An array or object containing driver-specific dataset creation options
 * @param {boolean} [strict=false] strict mode
 * @param {CreateOptions} [jsoptions] additional options
 * @param {ProgressCb} [jsoptions.progress_cb] {{{progress_cb}}}
 * @return {Dataset}
 */
  createCopy(filename: string, src: Dataset, options?: string[]|object, strict?: boolean, jsoptions?: CreateOptions): Dataset

  /**
 * Asynchronously create a copy of a dataset.
 *
 * @throws Error
 * @method createCopyAsync
 * @instance
 * @memberof Driver
 * @param {string} filename
 * @param {Dataset} src
 * @param {string[]|object} [options=null] An array or object containing driver-specific dataset creation options
 * @param {boolean} [strict=false] strict mode
 * @param {CreateOptions} [jsoptions] additional options
 * @param {ProgressCb} [jsoptions.progress_cb] {{{progress_cb}}}
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 */
  createCopyAsync(filename: string, src: Dataset, options?: string[]|object, strict?: boolean, jsoptions?: CreateOptions, callback?: callback<Dataset>): Promise<Dataset>

  /**
 * Copy the files of a dataset.
 *
 * @throws Error
 * @method copyFiles
 * @instance
 * @memberof Driver
 * @param {string} name_old New name for the dataset.
 * @param {string} name_new Old name of the dataset.
 */
  copyFiles(name_old: string, name_new: string): void

  /**
 * Renames the dataset.
 *
 * @throws Error
 * @method rename
 * @instance
 * @memberof Driver
 * @param {string} new_name New name for the dataset.
 * @param {string} old_name Old name of the dataset.
 */
  rename(new_name: string, old_name: string): void

  /**
 * Returns metadata about the driver.
 *
 * @throws Error
 * @method getMetadata
 * @instance
 * @memberof Driver
 * @param {string} [domain]
 * @return {any}
 */
  getMetadata(domain?: string): any

  /**
 * Opens a dataset.
 *
 * @throws Error
 * @method open
 * @instance
 * @memberof Driver
 * @param {string} path
 * @param {string} [mode="r"] The mode to use to open the file: `"r"` or
 * `"r+"`
 * @return {Dataset}
 */
  open(path: string, mode?: string): Dataset

  /**
 * Opens a dataset.
 *
 * @throws Error
 * @method openAsync
 * @instance
 * @memberof Driver
 * @param {string} path
 * @param {string} [mode="r"] The mode to use to open the file: `"r"` or
 * `"r+"`
 * @param {callback<Dataset>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dataset>}
 */
  openAsync(path: string, mode?: string, callback?: callback<Dataset>): Promise<Dataset>
}

export class Envelope {
/**
   * A 2D bounding box. For 3D envelopes, see {@link Envelope3D}
   *
   * (Pure-javascript implementation of [OGREnvelope](https://gdal.org/doxygen/classOGREnvelope.html))
   *
   * @constructor
   * @class Envelope
   * @param {object} [bounds] An object containing `minX`, `maxX`, `minY`, and `maxY` values.
   * @property {number} minX
   * @property {number} maxX
   * @property {number} minY
   * @property {number} maxY
   */
  constructor(bounds?: object)

  
  minX: number

  
  maxX: number

  
  minY: number

  
  maxY: number

  /**
   * Determines if the envelope has not been set yet.
   *
   * @function isEmpty
   * @memberof Envelope
   * @return {boolean}
   */
  isEmpty(): boolean

  /**
   * Unions the provided envelope with the current envelope.
   *
   * @function merge
   * @memberof Envelope
   * @param {Envelope} envelope
   * @return {void}
   */
  merge(envelope: Envelope): void

  /**
   * Unions the provided envelope with the x/y coordinates provided.
   *
   * @function merge
   * @memberof Envelope
   * @param {number} x
   * @param {number} y
   * @return {void}
   */
  merge(x: number, y: number): void

  /**
   * Determines if the provided envelope touches it.
   *
   * @function intersects
   * @memberof Envelope
   * @param {Envelope} envelope
   * @return {boolean}
   */
  intersects(envelope: Envelope): boolean

  /**
   * Updates the envelope to the intersection of the two envelopes.
   *
   * @function intersect
   * @memberof Envelope
   * @param {Envelope} envelope
   * @return {void}
   */
  intersect(envelope: Envelope): void

  /**
   * Determines if the provided envelope is wholly-contained by the current envelope.
   *
   * @function contains
   * @memberof Envelope
   * @param {Envelope} envelope
   * @return {boolean}
   */
  contains(envelope: Envelope): boolean

  /**
   * Converts the envelope to a polygon.
   *
   * @function toPolygon
   * @memberof Envelope
   * @return {Polygon}
   */
  toPolygon(): Polygon
}

export class Envelope3D {
/**
   * A 3D bounding box. For 2D envelopes, see {@link Envelope}
   *
   * (Pure-javascript implementation of [OGREnvelope3D](http://www.gdal.org/classOGREnvelope3D.html))
   *
   * @constructor
   * @class Envelope3D
   * @param {object} [bounds] An object containing `minX`, `maxX`, `minY`, `maxY`, `minZ`, and `maxZ` values.
   * @property {number} minX
   * @property {number} maxX
   * @property {number} minY
   * @property {number} maxY
   * @property {number} minZ
   * @property {number} maxZ
   */
  constructor(bounds?: object)

  
  minX: number

  
  maxX: number

  
  minY: number

  
  maxY: number

  
  minZ: number

  
  maxZ: number

  /**
   * Determines if the envelope has not been set yet.
   *
   * @function isEmpty
   * @memberof Envelope3D
   * @return {boolean}
   */
  isEmpty(): boolean

  /**
   * Unions the provided envelope with the current envelope.
   *
   * @function merge
   * @memberof Envelope3D
   * @param {Envelope3D} envelope
   * @return {void}
   */
  merge(envelope: Envelope3D): void

  /**
   * Unions the provided envelope with the x/y/z coordinates provided.
   *
   * @function merge
   * @memberof Envelope3D
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {void}
   */
  merge(x: number, y: number, z: number): void

  /**
   * Determines if the provided envelope touches it.
   *
   * @function intersects
   * @memberof Envelope3D
   * @param {Envelope3D} envelope
   * @return {boolean}
   */
  intersects(envelope: Envelope3D): boolean

  /**
   * Updates the envelope to the intersection of the two envelopes.
   *
   * @function intersect
   * @memberof Envelope3D
   * @param {Envelope3D} envelope
   * @return {void}
   */
  intersect(envelope: Envelope3D): void

  /**
   * Determines if the provided envelope is wholly-contained by the current envelope.
   *
   * @function contains
   * @memberof Envelope3D
   * @param {Envelope3D} envelope
   * @return {boolean}
   */
  contains(envelope: Envelope3D): boolean
}

export class Feature {
/**
 * A simple feature, including geometry and attributes. Its fields and geometry
 * type is defined by the given definition.
 *
 * @example
 * //create layer and specify geometry type
 * var layer = dataset.layers.create('mylayer', null, gdal.Point);
 *
 * //setup fields for the given layer
 * layer.fields.add(new gdal.FieldDefn('elevation', gdal.OFTInteger));
 * layer.fields.add(new gdal.FieldDefn('name', gdal.OFTString));
 *
 * //create feature using layer definition and then add it to the layer
 * var feature = new gdal.Feature(layer);
 * feature.fields.set('elevation', 13775);
 * feature.fields.set('name', 'Grand Teton');
 * feature.setGeometry(new gdal.Point(43.741208, -110.802414));
 * layer.features.add(feature);
 *
 * @constructor
 * @class Feature
 * @param {gdal.Layer|FeatureDefn} definition
 */
  constructor(definition: gdal.Layer|FeatureDefn)

  /**
 * @readonly
 * @kind member
 * @name fields
 * @instance
 * @memberof Feature
 * @type {FeatureFields}
 */
  readonly fields: FeatureFields

  /**
 * @kind member
 * @name fid
 * @instance
 * @memberof Feature
 * @type {number}
 */
  fid: number

  /**
 * @readonly
 * @kind member
 * @name defn
 * @instance
 * @memberof Feature
 * @type {FeatureDefn}
 */
  readonly defn: FeatureDefn

  /**
 * Returns the geometry of the feature.
 *
 * @method getGeometry
 * @instance
 * @memberof Feature
 * @return {Geometry}
 */
  getGeometry(): Geometry

  /**
 * Sets the feature's geometry.
 *
 * @throws Error
 * @method setGeometry
 * @instance
 * @memberof Feature
 * @param {Geometry|null} geometry new geometry or null to clear the field
 */
  setGeometry(geometry: Geometry|null): void

  /**
 * Determines if the features are the same.
 *
 * @method equals
 * @instance
 * @memberof Feature
 * @param {Feature} feature
 * @return {boolean} `true` if the features are the same, `false` if different
 */
  equals(feature: Feature): boolean

  /**
 * Clones the feature.
 *
 * @method clone
 * @instance
 * @memberof Feature
 * @return {Feature}
 */
  clone(): Feature

  /**
 * Releases the feature from memory.
 *
 * @method destroy
 * @instance
 * @memberof Feature
 */
  destroy(): void

  /**
 * Set one feature from another. Overwrites the contents of this feature
 * from the geometry and attributes of another.
 *
 * @example
 *
 * var feature1 = new gdal.Feature(defn);
 * var feature2 = new gdal.Feature(defn);
 * feature1.setGeometry(new gdal.Point(5, 10));
 * feature1.fields.set([5, 'test', 3.14]);
 * feature2.setFrom(feature1);
 *
 * @throws Error
 * @method setFrom
 * @instance
 * @memberof Feature
 * @param {Feature} feature
 * @param {number[]} [index_map] Array mapping each field from the source feature
 * to the given index in the destination feature. -1 ignores the source field.
 * The field types must still match otherwise the behavior is undefined.
 * @param {boolean} [forgiving=true] `true` if the operation should continue
 * despite lacking output fields matching some of the source fields.
 */
  setFrom(feature: Feature, index_map?: number[], forgiving?: boolean): void
}

export class FeatureDefn {
/**
 * Definition of a feature class or feature layer.
 *
 * @constructor
 * @class FeatureDefn
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name name
 * @instance
 * @memberof FeatureDefn
 * @type {string}
 */
  readonly name: string

  /**
 * WKB geometry type ({@link wkbGeometryType|see table}
 *
 * @kind member
 * @name geomType
 * @instance
 * @memberof FeatureDefn
 * @type {number}
 */
  geomType: number

  /**
 * @kind member
 * @name geomIgnored
 * @instance
 * @memberof FeatureDefn
 * @type {boolean}
 */
  geomIgnored: boolean

  /**
 * @kind member
 * @name styleIgnored
 * @instance
 * @memberof FeatureDefn
 * @type {boolean}
 */
  styleIgnored: boolean

  /**
 * @readonly
 * @kind member
 * @name fields
 * @instance
 * @memberof FeatureDefn
 * @type {FeatureDefnFields}
 */
  readonly fields: FeatureDefnFields

  /**
 * Clones the feature definition.
 *
 * @method clone
 * @instance
 * @memberof FeatureDefn
 * @return {FeatureDefn}
 */
  clone(): FeatureDefn
}

export class FeatureDefnFields implements Iterable<FieldDefn>, AsyncIterable<FieldDefn> {
/**
 * An encapsulation of a {@link FeatureDefn}'s fields.
 *
 * @class FeatureDefnFields
 */
  constructor()

  /**
 * Parent feature definition.
 *
 * @readonly
 * @kind member
 * @name featureDefn
 * @instance
 * @memberof FeatureDefnFields
 * @type {FeatureDefn}
 */
  readonly featureDefn: FeatureDefn
  [Symbol.iterator](): Iterator<FieldDefn>
  [Symbol.asyncIterator](): AsyncIterator<FieldDefn>

  /**
 * Returns the number of fields.
 *
 * @method count
 * @instance
 * @memberof FeatureDefnFields
 * @return {number}
 */
  count(): number

  /**
 * Returns the index of field definition.
 *
 * @method indexOf
 * @instance
 * @memberof FeatureDefnFields
 * @param {string} name
 * @return {number} Index or `-1` if not found.
 */
  indexOf(name: string): number

  /**
 * Returns a field definition.
 *
 * @method get
 * @instance
 * @memberof FeatureDefnFields
 * @param {string|number} key Field name or index
 * @throws Error
 * @return {FieldDefn}
 */
  get(key: string|number): FieldDefn

  /**
 * Returns a list of field names.
 *
 * @method getNames
 * @instance
 * @memberof FeatureDefnFields
 * @return {string[]} List of field names.
 */
  getNames(): string[]

  /**
 * Removes a field definition.
 *
 * @method remove
 * @instance
 * @memberof FeatureDefnFields
 * @throws Error
 * @param {string|number} key Field name or index
 */
  remove(key: string|number): void

  /**
 * Adds field definition(s).
 *
 * @method add
 * @instance
 * @memberof FeatureDefnFields
 * @throws Error
 * @param {gdal.FieldDefn|FieldDefn[]} fields
 */
  add(fields: gdal.FieldDefn|FieldDefn[]): void

  /**
 * Reorders the fields.
 *
 * @example
 *
 * // reverse fields:
 * featureDef.fields.reorder([2, 1, 0]);
 *
 * @method reorder
 * @instance
 * @memberof FeatureDefnFields
 * @throws Error
 * @param {number[]} map An array representing the new field order.
 */
  reorder(map: number[]): void

  /**
 * Iterates through all field definitions using a callback function.
 *
 * @example
 *
 * featureDefn.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof FeatureDefnFields
 * @param {forEachCb<FieldDefn>} callback The callback to be called with each {@link FieldDefn}
 */
  forEach(callback: forEachCb<FieldDefn>): void

  /**
 * Iterates through field definitions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = featureDefn.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof FeatureDefnFields
 * @param {mapCb<FieldDefn,U>} callback The callback to be called with each {@link FieldDefn}
 * @return {U[]}
 */
  map<U>(callback: mapCb<FieldDefn,U>): U[]
}

export class FeatureFields {
/**
 * An encapsulation of all field data that makes up a {@link Feature}.
 *
 * @class FeatureFields
 */
  constructor()

  /**
 * Parent feature
 *
 * @readonly
 * @kind member
 * @name feature
 * @instance
 * @memberof FeatureFields
 * @type {Feature}
 */
  readonly feature: Feature

  /**
 * Sets feature field(s).
 *
 * @example
 *
 * // most-efficient, least flexible. requires you to know the ordering of the
 * fields: feature.fields.set(['Something']); feature.fields.set(0,
 * 'Something');
 *
 * // most flexible.
 * feature.fields.set({name: 'Something'});
 * feature.fields.set('name', 'Something');
 *
 *
 * @method set
 * @instance
 * @memberof FeatureFields
 * @throws Error
 * @param {string|number} key Field name or index
 * @param {any} value
 */
  set(key: string|number, value: any): void

  /**
 * @method set
 * @instance
 * @memberof FeatureFields
 * @throws Error
 * @param {object} fields
 */
  set(fields: object): void

  /**
 * Resets all fields.
 *
 * @example
 *
 * feature.fields.reset();
 *
 * @method reset
 * @instance
 * @memberof FeatureFields
 * @throws Error
 * @param {object} [values]
 * @return {void}
 */
  reset(values?: object): void

  /**
 * Returns the number of fields.
 *
 * @example
 *
 * feature.fields.count();
 *
 * @method count
 * @instance
 * @memberof FeatureFields
 * @return {number}
 */
  count(): number

  /**
 * Returns the index of a field, given its name.
 *
 * @example
 *
 * var index = feature.fields.indexOf('field');
 *
 * @method indexOf
 * @instance
 * @memberof FeatureFields
 * @param {string} name
 * @return {number} Index or, `-1` if it cannot be found.
 */
  indexOf(name: string): number

  /**
 * Outputs the field data as a pure JS object.
 *
 * @throws Error
 * @method toObject
 * @instance
 * @memberof FeatureFields
 * @return {any}
 */
  toObject(): any

  /**
 * Outputs the field values as a pure JS array.
 *
 * @throws Error
 * @method toArray
 * @instance
 * @memberof FeatureFields
 * @return {any[]}
 */
  toArray(): any[]

  /**
 * Returns a field's value.
 *
 * @example
 *
 * value = feature.fields.get(0);
 * value = feature.fields.get('field');
 *
 * @method get
 * @instance
 * @memberof FeatureFields
 * @param {string|number} key Feature name or index.
 * @throws Error
 * @return {any}
 */
  get(key: string|number): any

  /**
 * Returns a list of field name.
 *
 * @method getNames
 * @instance
 * @memberof FeatureFields
 * @throws Error
 * @return {string[]} List of field names.
 */
  getNames(): string[]

  /**
 * Iterates through field definitions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = layer.features.get(0).fields.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof FeatureFields
 * @param {mapCb<any,U>} callback The callback to be called with each {@link any}
 * @return {U[]}
 */
  map<U>(callback: mapCb<any,U>): U[]

  /**
 * Iterates through all fields using a callback function.
 *
 * @example
 *
 * layer.features.get(0).fields.forEach(function(value, key) { ... });
 *
 * @memberof FeatureFields
 * @method forEach
 * @param {forEachCb<any>} callback The callback to be called with each feature `value` and `key`.
 */
  forEach(callback: forEachCb<any>): void

  /**
 * Outputs the fields as a serialized JSON string.
 *
 * @memberof FeatureFields
 * @method toJSON
 * @return {string} Serialized JSON
 */
  toJSON(): string
}

export class FieldDefn {
/**
 * @constructor
 * @class FieldDefn
 * @param {string} name Field name
 * @param {string} type Data type (see {@link Constants (OFT)|OFT}
 */
  constructor(name: string, type: string)

  /**
 * @kind member
 * @name name
 * @instance
 * @memberof FieldDefn
 * @type {string}
 */
  name: string

  /**
 * Data type (see {@link OFT|OFT constants}
 *
 * @kind member
 * @name type
 * @instance
 * @memberof FieldDefn
 * @type {string}
 */
  type: string

  /**
 * @kind member
 * @name ignored
 * @instance
 * @memberof FieldDefn
 * @type {boolean}
 */
  ignored: boolean

  /**
 * Field justification (see {@link OJ|OJ constants})
 *
 * @kind member
 * @name justification
 * @instance
 * @memberof FieldDefn
 * @type {string}
 */
  justification: string

  /**
 * @kind member
 * @name width
 * @instance
 * @memberof FieldDefn
 * @type {number}
 */
  width: number

  /**
 * @kind member
 * @name precision
 * @instance
 * @memberof FieldDefn
 * @type {number}
 */
  precision: number
}

export class GDALDrivers implements Iterable<Driver> {
/**
 * An collection of all {@link Driver}
 * registered with GDAL.
 *
 * @class GDALDrivers
 */
  constructor()
  [Symbol.iterator](): Iterator<Driver>

  /**
 * Returns a driver with the specified name.
 *
 * Note: Prior to GDAL2.x there is a separate driver for vector VRTs and raster
 * VRTs. Use `"VRT:vector"` to fetch the vector VRT driver and `"VRT:raster"` to
 * fetch the raster VRT driver.
 *
 * @method get
 * @instance
 * @memberof GDALDrivers
 * @param {number|string} index 0-based index or driver name
 * @throws Error
 * @return {Driver}
 */
  get(index: number|string): Driver

  /**
 * Returns an array with the names of all the drivers registered with GDAL.
 *
 * @method getNames
 * @instance
 * @memberof GDALDrivers
 * @return {string[]}
 */
  getNames(): string[]

  /**
 * Returns the number of drivers registered with GDAL.
 *
 * @method count
 * @instance
 * @memberof GDALDrivers
 * @return {number}
 */
  count(): number

  /**
 * Iterates through all drivers using a callback function.
 *
 * @example
 *
 * gdal.drivers.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof GDALDrivers
 * @param {forEachCb<Driver>} callback The callback to be called with each {@link Driver}
 */
  forEach(callback: forEachCb<Driver>): void

  /**
 * Iterates through drivers using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = gdal.drivers.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof GDALDrivers
 * @param {mapCb<Driver,U>} callback The callback to be called with each {@link Driver}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Driver,U>): U[]
}

export class Geometry {
/**
 * Abstract base class for all geometry classes.
 *
 * @class Geometry
 */
  constructor()

  /**
 * @kind member
 * @name srs
 * @instance
 * @memberof Geometry
 * @type {SpatialReference|null}
 */
  srs: SpatialReference|null

  /**
 * @readonly
 * @kind member
 * @name name
 * @instance
 * @memberof Geometry
 * @type {string}
 */
  readonly name: string

  /**
 * See {@link wkbGeometryType}.
 * @readonly
 * @kind member
 * @name wkbType
 * @static
 * @memberof Geometry
 * @type {number}
 */
  static readonly wkbType: number

  /**
 * See {@link wkbGeometryType}.
 * @readonly
 * @kind member
 * @name wkbType
 * @instance
 * @memberof Geometry
 * @type {number}
 */
  readonly wkbType: number

  /**
 * @readonly
 * @kind member
 * @name wkbSize
 * @instance
 * @memberof Geometry
 * @type {number}
 */
  readonly wkbSize: number

  /**
 * @readonly
 * @kind member
 * @name dimension
 * @instance
 * @memberof Geometry
 * @type {number}
 */
  readonly dimension: number

  /**
 * @kind member
 * @name coordinateDimension
 * @instance
 * @memberof Geometry
 * @type {number}
 */
  coordinateDimension: number

  /**
 * The points that make up the SimpleCurve geometry.
 *
 * @kind member
 * @name points
 * @instance
 * @memberof Geometry
 * @type {LineStringPoints}
 */
  points: LineStringPoints

  /**
 * Closes any un-closed rings.
 *
 * @method closeRings
 * @instance
 * @memberof Geometry
 */
  closeRings(): void

  /**
 * Closes any un-closed rings.
 * {{{async}}}
 *
 * @method closeRingsAsync
 * @instance
 * @memberof Geometry
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  closeRingsAsync(callback?: callback<void>): Promise<void>

  /**
 * Clears the geometry.
 *
 * @method empty
 * @instance
 * @memberof Geometry
 */
  empty(): void

  /**
 * Clears the geometry.
 * {{{async}}}
 *
 * @method emptyAsync
 * @instance
 * @memberof Geometry
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  emptyAsync(callback?: callback<void>): Promise<void>

  /**
 * Swaps x, y coordinates.
 *
 * @method swapXY
 * @instance
 * @memberof Geometry
 */
  swapXY(): void

  /**
 * Swaps x, y coordinates.
 * {{{async}}}
 *
 * @method swapXYAsync
 * @instance
 * @memberof Geometry
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  swapXYAsync(callback?: callback<void>): Promise<void>

  /**
 * Determines if the geometry is empty.
 *
 * @method isEmpty
 * @instance
 * @memberof Geometry
 * @return {boolean}
 */
  isEmpty(): boolean

  /**
 * Determines if the geometry is empty.
 * {{{async}}}
 *
 * @method isEmptyAsync
 * @instance
 * @memberof Geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  isEmptyAsync(callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the geometry is valid.
 *
 * @method isValid
 * @instance
 * @memberof Geometry
 * @return {boolean}
 */
  isValid(): boolean

  /**
 * Determines if the geometry is valid.
 * {{{async}}}
 *
 * @method isValidAsync
 * @instance
 * @memberof Geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  isValidAsync(callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the geometry is simple.
 *
 * @method isSimple
 * @instance
 * @memberof Geometry
 * @return {boolean}
 */
  isSimple(): boolean

  /**
 * Determines if the geometry is simple.
 * {{{async}}}
 *
 * @method isSimpleAsync
 * @instance
 * @memberof Geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  isSimpleAsync(callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the geometry is a ring.
 *
 * @method isRing
 * @instance
 * @memberof Geometry
 * @return {boolean}
 */
  isRing(): boolean

  /**
 * Determines if the geometry is a ring.
 * {{{async}}}
 *
 * @method isRingAsync
 * @instance
 * @memberof Geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  isRingAsync(callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the two geometries intersect.
 *
 * @method intersects
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @return {boolean}
 */
  intersects(geometry: Geometry): boolean

  /**
 * Determines if the two geometries intersect.
 * {{{async}}}
 *
 * @method intersectsAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  intersectsAsync(geometry: Geometry, callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the two geometries equal each other.
 *
 * @method equals
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @return {boolean}
 */
  equals(geometry: Geometry): boolean

  /**
 * Determines if the two geometries equal each other.
 * {{{async}}}
 *
 * @method equalsAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  equalsAsync(geometry: Geometry, callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the two geometries are disjoint.
 *
 * @method disjoint
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @return {boolean}
 */
  disjoint(geometry: Geometry): boolean

  /**
 * Determines if the two geometries are disjoint.
 * {{{async}}}
 *
 * @method disjointAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  disjointAsync(geometry: Geometry, callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the two geometries touch.
 *
 * @method touches
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @return {boolean}
 */
  touches(geometry: Geometry): boolean

  /**
 * Determines if the two geometries touch.
 * {{{async}}}
 *
 * @method touchesAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  touchesAsync(geometry: Geometry, callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the two geometries cross.
 *
 * @method crosses
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @return {boolean}
 */
  crosses(geometry: Geometry): boolean

  /**
 * Determines if the two geometries cross.
 * {{{async}}}
 *
 * @method crossesAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  crossesAsync(geometry: Geometry, callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the current geometry is within the provided geometry.
 *
 * @method within
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @return {boolean}
 */
  within(geometry: Geometry): boolean

  /**
 * Determines if the current geometry is within the provided geometry.
 * {{{async}}}
 *
 * @method withinAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  withinAsync(geometry: Geometry, callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the current geometry contains the provided geometry.
 *
 * @method contains
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @return {boolean}
 */
  contains(geometry: Geometry): boolean

  /**
 * Determines if the current geometry contains the provided geometry.
 * {{{async}}}
 *
 * @method containsAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  containsAsync(geometry: Geometry, callback?: callback<boolean>): Promise<boolean>

  /**
 * Determines if the current geometry overlaps the provided geometry.
 *
 * @method overlaps
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @return {boolean}
 */
  overlaps(geometry: Geometry): boolean

  /**
 * Determines if the current geometry overlaps the provided geometry.
 * {{{async}}}
 *
 * @method overlapsAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  overlapsAsync(geometry: Geometry, callback?: callback<boolean>): Promise<boolean>

  /**
 * Computes the distance between the two geometries.
 *
 * @method distance
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @return {number}
 */
  distance(geometry: Geometry): number

  /**
 * Computes the distance between the two geometries.
 * {{{async}}}
 *
 * @method distanceAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  distanceAsync(geometry: Geometry, callback?: callback<number>): Promise<number>

  /**
 * Modify the geometry such it has no segment longer then the given distance.
 *
 * @method segmentize
 * @instance
 * @memberof Geometry
 * @param {number} segment_length
 * @return {void}
 */
  segmentize(segment_length: number): void

  /**
 * Apply arbitrary coordinate transformation to the geometry.
 *
 * This method will transform the coordinates of a geometry from their current
 * spatial reference system to a new target spatial reference system. Normally
 * this means reprojecting the vectors, but it could include datum shifts,
 * and changes of units.
 *
 * Note that this method does not require that the geometry already have a
 * spatial reference system. It will be assumed that they can be treated as
 * having the source spatial reference system of the {@link CoordinateTransformation}
 * object, and the actual SRS of the geometry will be ignored.
 *
 * @throws Error
 * @method transform
 * @instance
 * @memberof Geometry
 * @param {CoordinateTransformation} transformation
 */
  transform(transformation: CoordinateTransformation): void

  /**
 * Apply arbitrary coordinate transformation to the geometry.
 * {{{async}}}
 *
 * @throws Error
 * @method transformAsync
 * @instance
 * @memberof Geometry
 * @param {CoordinateTransformation} transformation
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  transformAsync(transformation: CoordinateTransformation, callback?: callback<void>): Promise<void>

  /**
 * Transforms the geometry to match the provided {@link SpatialReference}
 *
 * @throws Error
 * @method transformTo
 * @instance
 * @memberof Geometry
 * @param {SpatialReference} srs
 */
  transformTo(srs: SpatialReference): void

  /**
 * Transforms the geometry to match the provided {@link SpatialReference}
 * {{{async}}}
 *
 * @throws Error
 * @method transformToAsync
 * @instance
 * @memberof Geometry
 * @param {SpatialReference} srs
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  transformToAsync(srs: SpatialReference, callback?: callback<void>): Promise<void>

  /**
 * Clones the instance.
 *
 * @method clone
 * @instance
 * @memberof Geometry
 * @return {Geometry}
 */
  clone(): Geometry

  /**
 * Compute convex hull.
 *
 * @method convexHull
 * @instance
 * @memberof Geometry
 * @throws Error
 * @return {Geometry}
 */
  convexHull(): Geometry

  /**
 * Compute convex hull.
 * {{{async}}}
 *
 * @method convexHullAsync
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @return {Promise<Geometry>}
 */
  convexHullAsync(callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Compute boundary.
 *
 * @method boundary
 * @instance
 * @memberof Geometry
 * @throws Error
 * @return {Geometry}
 */
  boundary(): Geometry

  /**
 * Compute boundary.
 * {{{async}}}
 *
 * @method boundaryAsync
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @return {Promise<Geometry>}
 */
  boundaryAsync(callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Compute intersection with another geometry.
 *
 * @method intersection
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @throws Error
 * @return {Geometry}
 */
  intersection(geometry: Geometry): Geometry

  /**
 * Compute intersection with another geometry.
 * {{{async}}}
 *
 * @method intersectionAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Geometry>}
 */
  intersectionAsync(geometry: Geometry, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Compute the union of this geometry with another.
 *
 * @method union
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @throws Error
 * @return {Geometry}
 */
  union(geometry: Geometry): Geometry

  /**
 * Compute the union of this geometry with another.
 * {{{async}}}
 *
 * @method unionAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Geometry>}
 */
  unionAsync(geometry: Geometry, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Compute the difference of this geometry with another.
 *
 * @method difference
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @throws Error
 * @return {Geometry}
 */
  difference(geometry: Geometry): Geometry

  /**
 * Compute the difference of this geometry with another.
 * {{{async}}}
 *
 * @method differenceAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Geometry>}
 */
  differenceAsync(geometry: Geometry, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Computes the symmetric difference of this geometry and the second geometry.
 *
 * @method symDifference
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @throws Error
 * @return {Geometry}
 */
  symDifference(geometry: Geometry): Geometry

  /**
 * Computes the symmetric difference of this geometry and the second geometry.
 * {{{async}}}
 *
 * @method symDifferenceAsync
 * @instance
 * @memberof Geometry
 * @param {Geometry} geometry
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Geometry>}
 */
  symDifferenceAsync(geometry: Geometry, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Reduces the geometry complexity.
 *
 * @method simplify
 * @instance
 * @memberof Geometry
 * @param {number} tolerance
 * @throws Error
 * @return {Geometry}
 */
  simplify(tolerance: number): Geometry

  /**
 * Reduces the geometry complexity.
 * {{{async}}}
 *
 * @method simplifyAsync
 * @instance
 * @memberof Geometry
 * @param {number} tolerance
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Geometry>}
 */
  simplifyAsync(tolerance: number, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Reduces the geometry complexity while preserving the topology.
 *
 * @method simplifyPreserveTopology
 * @instance
 * @memberof Geometry
 * @param {number} tolerance
 * @throws Error
 * @return {Geometry}
 */
  simplifyPreserveTopology(tolerance: number): Geometry

  /**
 * Reduces the geometry complexity while preserving the topology.
 * {{{async}}}
 *
 * @method simplifyPreserveTopologyAsync
 * @instance
 * @memberof Geometry
 * @param {number} tolerance
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Geometry>}
 */
  simplifyPreserveTopologyAsync(tolerance: number, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Buffers the geometry by the given distance.
 *
 * @method buffer
 * @instance
 * @memberof Geometry
 * @param {number} distance
 * @param {number} segments
 * @throws Error
 * @return {Geometry}
 */
  buffer(distance: number, segments: number): Geometry

  /**
 * Buffers the geometry by the given distance.
 * {{{async}}}
 *
 * @method bufferAsync
 * @instance
 * @memberof Geometry
 * @param {number} distance
 * @param {number} segments
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Geometry>}
 */
  bufferAsync(distance: number, segments: number, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Attempts to make an invalid geometry valid without losing vertices.
 * Requires GDAL 3.0
 *
 * @method makeValid
 * @instance
 * @memberof Geometry
 * @throws Error
 * @return {Geometry}
 */
  makeValid(): Geometry

  /**
 * Attempts to make an invalid geometry valid without losing vertices.
 * Requires GDAL 3.0
 * {{{async}}}
 *
 * @method makeValidAsync
 * @instance
 * @memberof Geometry
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @return {Promise<Geometry>}
 */
  makeValidAsync(callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Convert a geometry into well known text format.
 *
 * @method toWKT
 * @instance
 * @memberof Geometry
 * @throws Error
 * @return {string}
 */
  toWKT(): string

  /**
 * Convert a geometry into well known text format.
 * {{{async}}}
 *
 * @method toWKTAsync
 * @instance
 * @memberof Geometry
 * @param {callback<string>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<string>}
 */
  toWKTAsync(callback?: callback<string>): Promise<string>

  /**
 * Convert a geometry into well known binary format.
 *
 * @method toWKB
 * @instance
 * @memberof Geometry
 * @param {string} [byte_order="MSB"] {@link wkbByteOrder|see options}
 * @param {string} [variant="OGC"] ({@link wkbVariant|see options})
 * @throws Error
 * @return {Buffer}
 */
  toWKB(byte_order?: string, variant?: string): Buffer

  /**
 * Convert a geometry into well known binary format.
 * {{{async}}}
 *
 * @method toWKBAsync
 * @instance
 * @memberof Geometry
 * @param {string} [byte_order="MSB"] {@link wkbByteOrder|see options}
 * @param {string} [variant="OGC"] ({@link wkbVariant|see options})
 * @param {callback<Buffer>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Buffer>}
 */
  toWKBAsync(byte_order?: string, variant?: string, callback?: callback<Buffer>): Promise<Buffer>

  /**
 * Convert a geometry into KML format.
 *
 * @method toKML
 * @instance
 * @memberof Geometry
 * @throws Error
 * @return {string}
 */
  toKML(): string

  /**
 * Convert a geometry into KML format.
 * {{{async}}}
 *
 * @method toKMLAsync
 * @instance
 * @memberof Geometry
 * @param {callback<string>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<string>}
 */
  toKMLAsync(callback?: callback<string>): Promise<string>

  /**
 * Convert a geometry into GML format.
 *
 * @method toGML
 * @instance
 * @memberof Geometry
 * @throws Error
 * @return {string}
 */
  toGML(): string

  /**
 * Convert a geometry into GML format.
 * {{{async}}}
 *
 * @method toGMLAsync
 * @instance
 * @memberof Geometry
 * @param {callback<string>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<string>}
 */
  toGMLAsync(callback?: callback<string>): Promise<string>

  /**
 * Convert a geometry into JSON format.
 *
 * @method toJSON
 * @instance
 * @memberof Geometry
 * @throws Error
 * @return {string}
 */
  toJSON(): string

  /**
 * Convert a geometry into JSON format.
 * {{{async}}}
 *
 * @method toJSONAsync
 * @instance
 * @memberof Geometry
 * @param {callback<string>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<string>}
 */
  toJSONAsync(callback?: callback<string>): Promise<string>

  /**
 * Compute the centroid of the geometry.
 *
 * @method centroid
 * @instance
 * @memberof Geometry
 * @throws Error
 * @return {Point}
 */
  centroid(): Point

  /**
 * Compute the centroid of the geometry.
 * {{{async}}}
 *
 * @method centroidAsync
 * @instance
 * @memberof Geometry
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Geometry>}
 */
  centroidAsync(callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Computes the bounding box (envelope).
 *
 * @method getEnvelope
 * @instance
 * @memberof Geometry
 * @return {Envelope} Bounding envelope
 */
  getEnvelope(): Envelope

  /**
 * Computes the bounding box (envelope).
 * {{{async}}}
 *
 * @method getEnvelopeAsync
 * @instance
 * @memberof Geometry
 * @param {callback<Envelope>} [callback=undefined] {{{cb}}}
 * @return {Promise<Envelope>}
 */
  getEnvelopeAsync(callback?: callback<Envelope>): Promise<Envelope>

  /**
 * Computes the 3D bounding box (envelope).
 *
 * @method getEnvelope3D
 * @instance
 * @memberof Geometry
 * @return {Envelope3D} Bounding envelope
 */
  getEnvelope3D(): Envelope3D

  /**
 * Computes the 3D bounding box (envelope).
 * {{{async}}}
 *
 * @method getEnvelope3DAsync
 * @instance
 * @memberof Geometry
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @return {Promise<Geometry>}
 */
  getEnvelope3DAsync(callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Convert geometry to strictly 2D
 *
 * @method flattenTo2D
 * @instance
 * @memberof Geometry
 * @return {void}
 */
  flattenTo2D(): void

  /**
 * Convert geometry to strictly 2D
 * {{{async}}}
 *
 * @method flattenTo2DAsync
 * @instance
 * @memberof Geometry
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  flattenTo2DAsync(callback?: callback<void>): Promise<void>

  /**
 * Creates a Geometry from a WKT string.
 *
 * @static
 * @method fromWKT
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {string} wkt
 * @param {SpatialReference} [srs]
 * @return {Geometry}
 */
  static fromWKT(wkt: string, srs?: SpatialReference): Geometry

  /**
 * Creates a Geometry from a WKT string.
 * {{{async}}}
 *
 * @static
 * @method fromWKTAsync
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {string} wkt
 * @param {SpatialReference} [srs]
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @return {Promise<Geometry>}
 */
  static fromWKTAsync(wkt: string, srs?: SpatialReference, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Creates a Geometry from a WKB buffer.
 *
 * @static
 * @method fromWKB
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {Buffer} wkb
 * @param {SpatialReference} [srs]
 * @return {Geometry}
 */
  static fromWKB(wkb: Buffer, srs?: SpatialReference): Geometry

  /**
 * Creates a Geometry from a WKB buffer.
 * {{{async}}}
 *
 * @static
 * @method fromWKBAsync
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {Buffer} wkb
 * @param {SpatialReference} [srs]
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @return {Promise<Geometry>}
 */
  static fromWKBAsync(wkb: Buffer, srs?: SpatialReference, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Creates a Geometry from a GeoJSON object fragment.
 * The async version depends on V8 for object serialization and this part is not parallelizable.
 * V8 objects cannot be accessed outside of the main thread. This function should not be used
 * for importing objects of more than few tens of Kbytes when low latency is needed. If you need
 * to import very large GeoJSON geometries in server code, use the much faster and completely
 * parallel fromGeoJonBuffer(Async)
 *
 * @static
 * @method fromGeoJson
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {object} geojson
 * @return {Geometry}
 */
  static fromGeoJson(geojson: object): Geometry

  /**
 * Creates a Geometry from a GeoJSON object fragment.
 * The async version depends on V8 for object serialization and this part is not parallelizable.
 * V8 objects cannot be accessed outside of the main thread. This function should not be used
 * for importing objects of more than few tens of Kbytes when low latency is needed. If you need
 * to import very large GeoJSON geometries in server code, use the much faster and completely
 * parallel fromGeoJonBuffer(Async)
 * {{{async}}}
 *
 * @static
 * @method fromGeoJsonAsync
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {object} geojson
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @return {Promise<Geometry>}
 */
  static fromGeoJsonAsync(geojson: object, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Creates a Geometry from a buffer containing a GeoJSON fragment in UT8 format.
 *
 * @static
 * @method fromGeoJsonBuffer
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {Buffer} geojson
 * @return {Geometry}
 */
  static fromGeoJsonBuffer(geojson: Buffer): Geometry

  /**
 * Creates a Geometry from a buffer containing a GeoJSON fragment in UT8 format.
 * {{{async}}}
 *
 * @static
 * @method fromGeoJsonBufferAsync
 * @instance
 * @memberof Geometry
 * @throws Error
 * @param {Buffer} geojson
 * @param {callback<Geometry>} [callback=undefined] {{{cb}}}
 * @return {Promise<Geometry>}
 */
  static fromGeoJsonBufferAsync(geojson: Buffer, callback?: callback<Geometry>): Promise<Geometry>

  /**
 * Creates an empty Geometry from a WKB type.
 *
 * @static
 * @method create
 * @instance
 * @memberof Geometry
 * @param {number} type WKB geometry type {@link wkbGeometryType|available options}
 * @return {Geometry}
 */
  static create(type: number): Geometry

  /**
 * Returns the Geometry subclass that matches the
 * given WKB geometry type.
 *
 * @static
 * @method getConstructor
 * @instance
 * @memberof Geometry
 * @param {number} type WKB geometry type {@link wkbGeometryType|available options}
 * @return {Function}
 */
  static getConstructor(type: number): Function

  /**
 * Returns the Geometry subclass name that matches the
 * given WKB geometry type.
 *
 * @static
 * @method getName
 * @instance
 * @memberof Geometry
 * @param {number} type WKB geometry type {@link wkbGeometryType|available options}
 * @return {string}
 */
  static getName(type: number): string

  /**
 * Converts the geometry to a GeoJSON object representation.
 *
 * @memberof Geometry
 * @method toObject
 * @return {object} GeoJSON
 */
  toObject(): object
}

export class GeometryCollection extends Geometry {
/**
 * A collection of 1 or more geometry objects.
 *
 * @constructor
 * @class GeometryCollection
 * @extends Geometry
 */
  constructor()

  /**
 * All geometries represented by this collection.
 *
 * @kind member
 * @name children
 * @instance
 * @memberof GeometryCollection
 * @type {GeometryCollectionChildren}
 */
  children: GeometryCollectionChildren

  /**
 * Computes the combined area of the geometries.
 *
 * @method getArea
 * @instance
 * @memberof GeometryCollection
 * @return {number}
 */
  getArea(): number

  /**
 * Compute the length of a multicurve.
 *
 * @method getLength
 * @instance
 * @memberof GeometryCollection
 * @return {number}
 */
  getLength(): number
}

export class GeometryCollectionChildren implements Iterable<Geometry> {
/**
 * A collection of Geometries, used by {@link GeometryCollection}.
 *
 * @class GeometryCollectionChildren
 */
  constructor()
  [Symbol.iterator](): Iterator<Geometry>

  /**
 * Returns the number of items.
 *
 * @method count
 * @instance
 * @memberof GeometryCollectionChildren
 * @return {number}
 */
  count(): number

  /**
 * Returns the geometry at the specified index.
 *
 * @method get
 * @instance
 * @memberof GeometryCollectionChildren
 * @param {number} index 0-based index
 * @throws Error
 * @return {Geometry}
 */
  get(index: number): Geometry

  /**
 * Removes the geometry at the specified index.
 *
 * @method remove
 * @instance
 * @memberof GeometryCollectionChildren
 * @param {number} index 0-based index, -1 for all geometries
 */
  remove(index: number): void

  /**
 * Adds geometry(s) to the collection.
 *
 * @example
 *
 * // one at a time:
 * geometryCollection.children.add(new Point(0,0,0));
 *
 * // add many at once:
 * geometryCollection.children.add([
 *     new Point(1,0,0),
 *     new Point(1,0,0)
 * ]);
 *
 * @method add
 * @instance
 * @memberof GeometryCollectionChildren
 * @param {gdal.Geometry|Geometry[]} geometry
 */
  add(geometry: gdal.Geometry|Geometry[]): void

  /**
 * Iterates through all child geometries using a callback function.
 *
 * @example
 *
 * geometryCollection.children.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof GeometryCollectionChildren
 * @param {forEachCb<Geometry>} callback The callback to be called with each {@link Geometry}
 */
  forEach(callback: forEachCb<Geometry>): void

  /**
 * Iterates through child geometries using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = geometryCollection.children.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof GeometryCollectionChildren
 * @param {mapCb<Geometry,U>} callback The callback to be called with each {@link Geometry}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Geometry,U>): U[]
}

export class Group {
/**
 * A representation of a group with access methods.
 *
 * @class Group
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name description
 * @instance
 * @memberof Group
 * @type {string}
 */
  readonly description: string

  /**
 * @readonly
 * @kind member
 * @name groups
 * @instance
 * @memberof Group
 * @type {GroupGroups}
 */
  readonly groups: GroupGroups

  /**
 * @readonly
 * @kind member
 * @name arrays
 * @instance
 * @memberof Group
 * @type {GroupArrays}
 */
  readonly arrays: GroupArrays

  /**
 * @readonly
 * @kind member
 * @name dimensions
 * @instance
 * @memberof Group
 * @type {GroupDimensions}
 */
  readonly dimensions: GroupDimensions

  /**
 * @readonly
 * @kind member
 * @name attributes
 * @instance
 * @memberof Group
 * @type {GroupAttributes}
 */
  readonly attributes: GroupAttributes
}

export class GroupArrays implements Iterable<MDArray>, AsyncIterable<MDArray> {
/**
 * An encapsulation of a {@link Group}
 * descendant arrays.
 *
 * @class GroupArrays
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name names
 * @instance
 * @memberof GroupArrays
 * @type {string[]}
 */
  readonly names: string[]

  /**
 * Parent dataset
 *
 * @readonly
 * @kind member
 * @name ds
 * @instance
 * @memberof GroupArrays
 * @type {Dataset}
 */
  readonly ds: Dataset
  [Symbol.iterator](): Iterator<MDArray>
  [Symbol.asyncIterator](): AsyncIterator<MDArray>

  /**
 * Returns the array with the given name/index.
 *
 * @method get
 * @instance
 * @memberof GroupArrays
 * @param {string|number} array
 * @return {MDArray}
 */
  get(array: string|number): MDArray

  /**
 * Returns the array with the given name/index.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof GroupArrays
 *
 * @param {string|number} array
 * @param {callback<MDArray>} [callback=undefined] {{{cb}}}
 * @return {Promise<MDArray>}
 */
  getAsync(array: string|number, callback?: callback<MDArray>): Promise<MDArray>

  /**
 * Returns the number of arrays in the collection.
 *
 * @method count
 * @instance
 * @memberof GroupArrays
 * @return {number}
 */
  count(): number

  /**
 * Returns the number of arrays in the collection.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof GroupArrays
 *
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  countAsync(callback?: callback<number>): Promise<number>

  /**
 * Iterates through all arrays using a callback function.
 *
 * @example
 *
 * group.arrays.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof GroupArrays
 * @param {forEachCb<MDArray>} callback The callback to be called with each {@link MDArray}
 */
  forEach(callback: forEachCb<MDArray>): void

  /**
 * Iterates through arrays using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = group.arrays.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof GroupArrays
 * @param {mapCb<MDArray,U>} callback The callback to be called with each {@link MDArray}
 * @return {U[]}
 */
  map<U>(callback: mapCb<MDArray,U>): U[]
}

export class GroupAttributes implements Iterable<Attribute>, AsyncIterable<Attribute> {
/**
 * An encapsulation of a {@link Group}
 * descendant attributes.
 *
 * @class GroupAttributes
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name names
 * @instance
 * @memberof GroupAttributes
 * @type {string[]}
 */
  readonly names: string[]

  /**
 * Parent dataset
 *
 * @readonly
 * @kind member
 * @name ds
 * @instance
 * @memberof GroupAttributes
 * @type {Dataset}
 */
  readonly ds: Dataset
  [Symbol.iterator](): Iterator<Attribute>
  [Symbol.asyncIterator](): AsyncIterator<Attribute>

  /**
 * Returns the attribute with the given name/index.
 *
 * @method get
 * @instance
 * @memberof GroupAttributes
 * @param {string|number} attribute
 * @return {Attribute}
 */
  get(attribute: string|number): Attribute

  /**
 * Returns the attribute with the given name/index.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof GroupAttributes
 *
 * @param {string|number} attribute
 * @param {callback<Attribute>} [callback=undefined] {{{cb}}}
 * @return {Promise<Attribute>}
 */
  getAsync(attribute: string|number, callback?: callback<Attribute>): Promise<Attribute>

  /**
 * Returns the number of attributes in the collection.
 *
 * @method count
 * @instance
 * @memberof GroupAttributes
 * @return {number}
 */
  count(): number

  /**
 * Returns the number of attributes in the collection.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof GroupAttributes
 *
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  countAsync(callback?: callback<number>): Promise<number>

  /**
 * Iterates through all attributes using a callback function.
 *
 * @example
 *
 * group.attributes.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof GroupAttributes
 * @param {forEachCb<Attribute>} callback The callback to be called with each {@link Attribute}
 */
  forEach(callback: forEachCb<Attribute>): void

  /**
 * Iterates through attributes using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = group.attributes.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof GroupAttributes
 * @param {mapCb<Attribute,U>} callback The callback to be called with each {@link Attribute}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Attribute,U>): U[]
}

export class GroupDimensions implements Iterable<Dimension>, AsyncIterable<Dimension> {
/**
 * An encapsulation of a {@link Group}
 * descendant dimensions.
 *
 * @example
 * const dimensions = group.dimensions;
 *
 * @class GroupDimensions
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name names
 * @instance
 * @memberof GroupDimensions
 * @type {string[]}
 */
  readonly names: string[]

  /**
 * Parent dataset
 *
 * @readonly
 * @kind member
 * @name ds
 * @instance
 * @memberof GroupDimensions
 * @type {Dataset}
 */
  readonly ds: Dataset
  [Symbol.iterator](): Iterator<Dimension>
  [Symbol.asyncIterator](): AsyncIterator<Dimension>

  /**
 * Returns the array with the given name/index.
 *
 * @method get
 * @instance
 * @memberof GroupDimensions
 * @param {string|number} array
 * @return {Dimension}
 */
  get(array: string|number): Dimension

  /**
 * Returns the array with the given name/index.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof GroupDimensions
 *
 * @param {string|number} array
 * @param {callback<Dimension>} [callback=undefined] {{{cb}}}
 * @return {Promise<Dimension>}
 */
  getAsync(array: string|number, callback?: callback<Dimension>): Promise<Dimension>

  /**
 * Returns the number of dimensions in the collection.
 *
 * @method count
 * @instance
 * @memberof GroupDimensions
 * @return {number}
 */
  count(): number

  /**
 * Returns the number of dimensions in the collection.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof GroupDimensions
 *
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  countAsync(callback?: callback<number>): Promise<number>

  /**
 * Iterates through all dimensions using a callback function.
 *
 * @example
 *
 * group.dimensions.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof GroupDimensions
 * @param {forEachCb<Dimension>} callback The callback to be called with each {@link Dimension}
 */
  forEach(callback: forEachCb<Dimension>): void

  /**
 * Iterates through dimensions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = group.dimensions.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof GroupDimensions
 * @param {mapCb<Dimension,U>} callback The callback to be called with each {@link Dimension}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Dimension,U>): U[]
}

export class GroupGroups implements Iterable<Group>, AsyncIterable<Group> {
/**
 * An encapsulation of a {@link Group}
 * descendant groups.
 *
 *
 * @class GroupGroups
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name names
 * @instance
 * @memberof GroupGroups
 * @type {string[]}
 */
  readonly names: string[]

  /**
 * Parent dataset
 *
 * @readonly
 * @kind member
 * @name ds
 * @instance
 * @memberof GroupGroups
 * @type {Dataset}
 */
  readonly ds: Dataset
  [Symbol.iterator](): Iterator<Group>
  [Symbol.asyncIterator](): AsyncIterator<Group>

  /**
 * Returns the group with the given name/index.
 *
 * @method get
 * @instance
 * @memberof GroupGroups
 * @param {string|number} group
 * @return {Group}
 */
  get(group: string|number): Group

  /**
 * Returns the group with the given name/index.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof GroupGroups
 *
 * @param {string|number} group
 * @param {callback<Group>} [callback=undefined] {{{cb}}}
 * @return {Promise<Group>}
 */
  getAsync(group: string|number, callback?: callback<Group>): Promise<Group>

  /**
 * Returns the number of groups in the collection.
 *
 * @method count
 * @instance
 * @memberof GroupGroups
 * @return {number}
 */
  count(): number

  /**
 * Returns the number of groups in the collection.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof GroupGroups
 *
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  countAsync(callback?: callback<number>): Promise<number>

  /**
 * Iterates through all groups using a callback function.
 *
 * @example
 *
 * group.groups.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof GroupGroups
 * @param {forEachCb<Group>} callback The callback to be called with each {@link Group}
 */
  forEach(callback: forEachCb<Group>): void

  /**
 * Iterates through groups using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = group.groups.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof GroupGroups
 * @param {mapCb<Group,U>} callback The callback to be called with each {@link Group}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Group,U>): U[]
}

export class Layer {
/**
 * A representation of a layer of simple vector features, with access methods.
 *
 * @class Layer
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name ds
 * @instance
 * @memberof Layer
 * @type {Dataset}
 */
  readonly ds: Dataset

  /**
 * @readonly
 * @kind member
 * @name srs
 * @instance
 * @memberof Layer
 * @type {SpatialReference}
 */
  readonly srs: SpatialReference

  /**
 * @readonly
 * @kind member
 * @name name
 * @instance
 * @memberof Layer
 * @type {string}
 */
  readonly name: string

  /**
 * @readonly
 * @kind member
 * @name geomColumn
 * @instance
 * @memberof Layer
 * @type {string}
 */
  readonly geomColumn: string

  /**
 * @readonly
 * @kind member
 * @name fidColumn
 * @instance
 * @memberof Layer
 * @type {string}
 */
  readonly fidColumn: string

  /**
 * @readonly
 * @kind member
 * @name geomType
 * @instance
 * @memberof Layer
 * @type {number} (see {@link wkbGeometry|geometry types}
 */
  readonly geomType: number

  /**
 * @readonly
 * @kind member
 * @name features
 * @instance
 * @memberof Layer
 * @type {LayerFeatures}
 */
  readonly features: LayerFeatures

  /**
 * @readonly
 * @kind member
 * @name fields
 * @instance
 * @memberof Layer
 * @type {LayerFields}
 */
  readonly fields: LayerFields

  /**
 * Flush pending changes to disk.
 *
 * @throws Error
 * @method flush
 * @instance
 * @memberof Layer
 */
  flush(): void

  /**
 * Flush pending changes to disk.
 * {{{async}}}
 *
 * @throws Error
 * @method flushAsync
 * @instance
 * @memberof Layer
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 *
 */
  flushAsync(callback?: callback<void>): Promise<void>

  /**
 * Determines if the dataset supports the indicated operation.
 *
 * @method testCapability
 * @instance
 * @memberof Layer
 * @param {string} capability (see {@link OLC|capability list}
 * @return {boolean}
 */
  testCapability(capability: string): boolean

  /**
 * Fetch the extent of this layer.
 *
 * @throws Error
 * @method getExtent
 * @instance
 * @memberof Layer
 * @param {boolean} [force=true]
 * @return {Envelope} Bounding envelope
 */
  getExtent(force?: boolean): Envelope

  /**
 * This method returns the current spatial filter for this layer.
 *
 * @throws Error
 * @method getSpatialFilter
 * @instance
 * @memberof Layer
 * @return {Geometry}
 */
  getSpatialFilter(): Geometry

  /**
 * This method sets the geometry to be used as a spatial filter when fetching
 * features via the `layer.features.next()` method. Only features that
 * geometrically intersect the filter geometry will be returned.
 *
 * Alernatively you can pass it envelope bounds as individual arguments.
 *
 * @example
 *
 * layer.setSpatialFilter(geometry);
 *
 * @throws Error
 * @method setSpatialFilter
 * @instance
 * @memberof Layer
 * @param {Geometry|null} filter
 */
  setSpatialFilter(filter: Geometry|null): void

  /**
 * This method sets the geometry to be used as a spatial filter when fetching
 * features via the `layer.features.next()` method. Only features that
 * geometrically intersect the filter geometry will be returned.
 *
 * Alernatively you can pass it envelope bounds as individual arguments.
 *
 * @example
 *
 * layer.setSpatialFilter(minX, minY, maxX, maxY);
 *
 * @throws Error
 * @method setSpatialFilter
 * @instance
 * @memberof Layer
 * @param {number} minxX
 * @param {number} minyY
 * @param {number} maxX
 * @param {number} maxY
 */
  setSpatialFilter(minxX: number, minyY: number, maxX: number, maxY: number): void

  /**
 * Sets the attribute query string to be used when fetching features via the
 * `layer.features.next()` method. Only features for which the query evaluates
 * as `true` will be returned.
 *
 * The query string should be in the format of an SQL WHERE clause. For instance
 * "population > 1000000 and population < 5000000" where `population` is an
 * attribute in the layer. The query format is normally a restricted form of
 * SQL WHERE clause as described in the "WHERE" section of the [OGR SQL
 * tutorial](https://gdal.org/user/ogr_sql_dialect.html). In some cases (RDBMS backed
 * drivers) the native capabilities of the database may be used to interprete
 * the WHERE clause in which case the capabilities will be broader than those
 * of OGR SQL.
 *
 * @example
 *
 * layer.setAttributeFilter('population > 1000000 and population < 5000000');
 *
 * @throws Error
 * @method setAttributeFilter
 * @instance
 * @memberof Layer
 * @param {string|null} [filter=null]
 */
  setAttributeFilter(filter?: string|null): void
}

export class LayerFeatures implements Iterable<Feature>, AsyncIterable<Feature> {
/**
 * An encapsulation of a {@link Layer}
 * features.
 *
 * @class LayerFeatures
 */
  constructor()

  /**
 * Parent layer
 *
 * @kind member
 * @name layer
 * @instance
 * @memberof LayerFeatures
 * @type {Layer}
 */
  layer: Layer
  [Symbol.iterator](): Iterator<Feature>
  [Symbol.asyncIterator](): AsyncIterator<Feature>

  /**
 * Fetch a feature by its identifier.
 *
 * **Important:** The `id` argument is not an index. In most cases it will be
 * zero-based, but in some cases it will not. If iterating, it's best to use the
 * `next()` method.
 *
 * @method get
 * @instance
 * @memberof LayerFeatures
 * @param {number} id The feature ID of the feature to read.
 * @throws Error
 * @return {Feature}
 */
  get(id: number): Feature

  /**
 * Fetch a feature by its identifier.
 *
 * **Important:** The `id` argument is not an index. In most cases it will be
 * zero-based, but in some cases it will not. If iterating, it's best to use the
 * `next()` method.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof LayerFeatures
 * @param {number} id The feature ID of the feature to read.
 * @param {callback<Feature>} [callback=undefined] {{{cb}}}
 * @throws Error
 * @return {Promise<Feature>}
 */
  getAsync(id: number, callback?: callback<Feature>): Promise<Feature>

  /**
 * Resets the feature pointer used by `next()` and
 * returns the first feature in the layer.
 *
 * @method first
 * @instance
 * @memberof LayerFeatures
 * @return {Feature}
 */
  first(): Feature

  /**
 * Resets the feature pointer used by `next()` and
 * returns the first feature in the layer.
 * {{{async}}}
 *
 * @method firstAsync
 * @instance
 * @memberof LayerFeatures
 * @param {callback<Feature>} [callback=undefined] {{{cb}}}
 * @return {Promise<Feature>}
 */
  firstAsync(callback?: callback<Feature>): Promise<Feature>

  /**
 * Returns the next feature in the layer. Returns null if no more features.
 *
 * @example
 *
 * while (feature = layer.features.next()) { ... }
 *
 * @method next
 * @instance
 * @memberof LayerFeatures
 * @return {Feature}
 */
  next(): Feature

  /**
 * Returns the next feature in the layer. Returns null if no more features.
 * {{{async}}}
 *
 * @example
 *
 * while (feature = await layer.features.nextAsync()) { ... }
 *
 * @method nextAsync
 * @instance
 * @memberof LayerFeatures
 * @param {callback<Feature>} [callback=undefined] {{{cb}}}
 * @return {Promise<Feature>}
 */
  nextAsync(callback?: callback<Feature>): Promise<Feature>

  /**
 * Adds a feature to the layer. The feature should be created using the current
 * layer as the definition.
 *
 * @example
 *
 * var feature = new gdal.Feature(layer);
 * feature.setGeometry(new gdal.Point(0, 1));
 * feature.fields.set('name', 'somestring');
 * layer.features.add(feature);
 *
 * @method add
 * @instance
 * @memberof LayerFeatures
 * @throws Error
 * @param {Feature} feature
 */
  add(feature: Feature): void

  /**
 * Adds a feature to the layer. The feature should be created using the current
 * layer as the definition.
 * {{{async}}}
 *
 * @example
 *
 * var feature = new gdal.Feature(layer);
 * feature.setGeometry(new gdal.Point(0, 1));
 * feature.fields.set('name', 'somestring');
 * await layer.features.addAsync(feature);
 *
 * @method addAsync
 * @instance
 * @memberof LayerFeatures
 * @throws Error
 * @param {Feature} feature
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  addAsync(feature: Feature, callback?: callback<void>): Promise<void>

  /**
 * Returns the number of features in the layer.
 *
 * @method count
 * @instance
 * @memberof LayerFeatures
 * @param {boolean} [force=true]
 * @return {number} number of features in the layer.
 */
  count(force?: boolean): number

  /**
 * Returns the number of features in the layer.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof LayerFeatures
 * @param {boolean} [force=true]
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>} number of features in the layer.
 */
  countAsync(force?: boolean, callback?: callback<number>): Promise<number>

  /**
 * Sets a feature in the layer.
 *
 * @method set
 * @instance
 * @memberof LayerFeatures
 * @throws Error
 * @param {Feature} feature
 */
  set(feature: Feature): void

  /**
 * Sets a feature in the layer.
 *
 * @method set
 * @instance
 * @memberof LayerFeatures
 * @throws Error
 * @param {number} id
 * @param {Feature} feature
 */
  set(id: number, feature: Feature): void

  /**
 * Sets a feature in the layer.
 * {{{async}}}
 *
 * @method setAsync
 * @instance
 * @memberof LayerFeatures
 * @throws Error
 * @param {number} id
 * @param {Feature} feature
 * @param {callback<Feature>} [callback=undefined] {{{cb}}}
 * @return {Promise<Feature>}
 */
  setAsync(id: number, feature: Feature, callback?: callback<Feature>): Promise<Feature>

  /**
 * Removes a feature from the layer.
 *
 * @method remove
 * @instance
 * @memberof LayerFeatures
 * @throws Error
 * @param {number} id
 */
  remove(id: number): void

  /**
 * Removes a feature from the layer.
 * {{{async}}}
 *
 * @method removeAsync
 * @instance
 * @memberof LayerFeatures
 * @throws Error
 * @param {number} id
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  removeAsync(id: number, callback?: callback<void>): Promise<void>

  /**
 * Iterates through features using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = layer.features.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof LayerFeatures
 * @param {mapCb<Feature,U>} callback The callback to be called with each {@link Feature}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Feature,U>): U[]

  /**
 * Iterates through all features using a callback function.
 *
 * @example
 *
 * layer.features.forEach(function(feature, i) { ... });
 *
 * @memberof LayerFeatures
 * @method forEach
 * @param {forEachCb<Feature>} callback The callback to be called with each {@link Feature}
 */
  forEach(callback: forEachCb<Feature>): void
}

export class LayerFields implements Iterable<FieldDefn>, AsyncIterable<FieldDefn> {
/**
 * @class LayerFields
 */
  constructor()

  /**
 * Parent layer
 *
 * @readonly
 * @kind member
 * @name layer
 * @instance
 * @memberof LayerFields
 * @type {Layer}
 */
  readonly layer: Layer
  [Symbol.iterator](): Iterator<FieldDefn>
  [Symbol.asyncIterator](): AsyncIterator<FieldDefn>

  /**
 * Returns the number of fields.
 *
 * @method count
 * @instance
 * @memberof LayerFields
 * @return {number}
 */
  count(): number

  /**
 * Find the index of field in the layer.
 *
 * @method indexOf
 * @instance
 * @memberof LayerFields
 * @param {string} field
 * @return {number} Field index, or -1 if the field doesn't exist
 */
  indexOf(field: string): number

  /**
 * Returns a field definition.
 *
 * @throws Error
 * @method get
 * @instance
 * @memberof LayerFields
 * @param {string|number} field Field name or index (0-based)
 * @return {FieldDefn}
 */
  get(field: string|number): FieldDefn

  /**
 * Returns a list of field names.
 *
 * @throws Error
 * @method getNames
 * @instance
 * @memberof LayerFields
 * @return {string[]} List of strings.
 */
  getNames(): string[]

  /**
 * Removes a field.
 *
 * @throws Error
 * @method remove
 * @instance
 * @memberof LayerFields
 * @param {string|number} field Field name or index (0-based)
 */
  remove(field: string|number): void

  /**
 * Adds field(s).
 *
 * @throws Error
 * @method add
 * @instance
 * @memberof LayerFields
 * @param {gdal.FieldDefn|FieldDefn[]} defs A field definition, or array of field
 * definitions.
 * @param {boolean} [approx=true]
 */
  add(defs: gdal.FieldDefn|FieldDefn[], approx?: boolean): void

  /**
 * Reorders fields.
 *
 * @example
 *
 * // reverse field order
 * layer.fields.reorder([2,1,0]);
 *
 * @throws Error
 * @method reorder
 * @instance
 * @memberof LayerFields
 * @param {number[]} map An array of new indexes (integers)
 */
  reorder(map: number[]): void

  /**
 * Iterates through all field definitions using a callback function.
 *
 * @example
 *
 * layer.fields.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof LayerFields
 * @param {forEachCb<FieldDefn>} callback The callback to be called with each {@link FieldDefn}
 */
  forEach(callback: forEachCb<FieldDefn>): void

  /**
 * Iterates through field definitions using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = layer.fields.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof LayerFields
 * @param {mapCb<FieldDefn,U>} callback The callback to be called with each {@link FieldDefn}
 * @return {U[]}
 */
  map<U>(callback: mapCb<FieldDefn,U>): U[]

  /**
 * Creates a LayerFields instance from an object of keys and values.
 *
 * @method fromJSON
 * @memberof LayerFields
 * @param {object} object
 * @param {boolean} [approx_ok=false]
 */
  fromJSON(object: object, approx_ok?: boolean): void

  /**
 * Creates a LayerFields instance from an object of keys and values.
 *
 * @method fromObject
 * @memberof LayerFields
 * @param {Record<string, any>} object
 * @param {boolean} [approx_ok=false]
 */
  fromObject(object: Record<string, any>, approx_ok?: boolean): void
}

export class LineString extends SimpleCurve {
/**
 * Concrete representation of a multi-vertex line.
 *
 * @example
 *
 * var lineString = new gdal.LineString();
 * lineString.points.add(new gdal.Point(0,0));
 * lineString.points.add(new gdal.Point(0,10));
 *
 * @constructor
 * @class LineString
 * @extends SimpleCurve
 */
  constructor()
}

export class LineStringPoints implements Iterable<Point> {
/**
 * An encapsulation of a {@link LineString}'s points.
 *
 * @class LineStringPoints
 */
  constructor()
  [Symbol.iterator](): Iterator<Point>

  /**
 * Returns the number of points that are part of the line string.
 *
 * @method count
 * @instance
 * @memberof LineStringPoints
 * @return {number}
 */
  count(): number

  /**
 * Reverses the order of all the points.
 *
 * @method reverse
 * @instance
 * @memberof LineStringPoints
 */
  reverse(): void

  /**
 * Adjusts the number of points that make up the line string.
 *
 * @method resize
 * @instance
 * @memberof LineStringPoints
 * @param {number} count
 */
  resize(count: number): void

  /**
 * Returns the point at the specified index.
 *
 * @method get
 * @instance
 * @memberof LineStringPoints
 * @param {number} index 0-based index
 * @throws Error
 * @return {Point}
 */
  get(index: number): Point

  /**
 * Sets the point at the specified index.
 *
 * @example
 *
 * lineString.points.set(0, new gdal.Point(1, 2));
 *
 * @method set
 * @instance
 * @memberof LineStringPoints
 * @throws Error
 * @param {number} index 0-based index
 * @param {Point|xyz} point
 */
  set(index: number, point: Point|xyz): void

  /**
 * @method set
 * @instance
 * @memberof LineStringPoints
 * @throws Error
 * @param {number} index 0-based index
 * @param {number} x
 * @param {number} y
 * @param {number} [z]
 */
  set(index: number, x: number, y: number, z?: number): void

  /**
 * Adds point(s) to the line string. Also accepts any object with an x and y
 * property.
 *
 * @example
 *
 * lineString.points.add(new gdal.Point(1, 2));
 * lineString.points.add([
 *     new gdal.Point(1, 2)
 *     new gdal.Point(3, 4)
 * ]);
 *
 * @method add
 * @instance
 * @memberof LineStringPoints
 * @throws Error
 * @param {gdal.Point|xyz|(Point|xyz)[]} points
 */
  add(points: gdal.Point|xyz|(Point|xyz)[]): void

  /**
 *
 * @method add
 * @instance
 * @memberof LineStringPoints
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {number} [z]
 */
  add(x: number, y: number, z?: number): void

  /**
 * Iterates through all points using a callback function.
 *
 * @example
 *
 * lineString.points.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof LineStringPoints
 * @param {forEachCb<Point>} callback The callback to be called with each {@link Point}
 */
  forEach(callback: forEachCb<Point>): void

  /**
 * Iterates through points using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = lineString.points.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof LineStringPoints
 * @param {mapCb<Point,U>} callback The callback to be called with each {@link Point}
 * @return {U[]}
 */
  map<U>(callback: mapCb<Point,U>): U[]

  /**
 * Outputs all points as a regular javascript array.
 *
 * @method
 * @name toArray
 * @instance
 * @memberof LineStringPoints
 * @return {Point[]} List of {@link Point|Point instances}
 */
  toArray(): Point[]
}

export class LinearRing extends LineString {
/**
 * Concrete representation of a closed ring.
 *
 * @constructor
 * @class LinearRing
 * @extends LineString
 */
  constructor()

  /**
 * Computes the area enclosed by the ring.
 *
 * @method getArea
 * @instance
 * @memberof LinearRing
 * @return {number}
 */
  getArea(): number
}

export class MDArray {
/**
 * A representation of an array with access methods.
 *
 * @class MDArray
 */
  constructor()

  /**
 * Spatial reference associated with MDArray
 *
 * @throws Error
 * @kind member
 * @name srs
 * @instance
 * @memberof MDArray
 * @type {SpatialReference}
 */
  srs: SpatialReference

  /**
 * Raster value offset.
 *
 * @kind member
 * @name offset
 * @instance
 * @memberof MDArray
 * @type {number}
 */
  offset: number

  /**
 * Raster value scale.
 *
 * @kind member
 * @name scale
 * @instance
 * @memberof MDArray
 * @type {number}
 */
  scale: number

  /**
 * No data value for this array.
 *
 * @kind member
 * @name noDataValue
 * @instance
 * @memberof MDArray
 * @type {number|null}
 */
  noDataValue: number|null

  /**
 * Raster unit type (name for the units of this raster's values).
 * For instance, it might be `"m"` for an elevation model in meters,
 * or `"ft"` for feet. If no units are available, a value of `""`
 * will be returned.
 *
 * @kind member
 * @name unitType
 * @instance
 * @memberof MDArray
 * @type {string}
 */
  unitType: string

  /**
 * @readonly
 * @kind member
 * @name dataType
 * @instance
 * @memberof MDArray
 * @type {string}
 */
  readonly dataType: string

  /**
 * @readonly
 * @kind member
 * @name dimensions
 * @instance
 * @memberof MDArray
 * @type {GroupDimensions}
 */
  readonly dimensions: GroupDimensions

  /**
 * @readonly
 * @kind member
 * @name attributes
 * @instance
 * @memberof MDArray
 * @type {ArrayAttributes}
 */
  readonly attributes: ArrayAttributes

  /**
 * @readonly
 * @kind member
 * @name description
 * @instance
 * @memberof MDArray
 * @type {string}
 */
  readonly description: string

  /**
 * The flattened length of the array
 *
 * @readonly
 * @kind member
 * @name length
 * @instance
 * @memberof MDArray
 * @type {number}
 */
  readonly length: number

  /**
 * Read data from the MDArray
 *
 * This will extract the context of a (hyper-)rectangle from the array into a buffer.
 * If the buffer can be passed as an argument or it can be allocated by the function.
 * Generalized n-dimensional strides are supported.
 *
 * Although this method can be used in its raw form, it works best when used with the ndarray plugin.
 *
 * @method read
 * @instance
 * @memberof MDArray
 * @throws Error
 * @param {MDArrayOptions} options
 * @param {number[]} options.origin An array of the starting indices
 * @param {number[]} options.span An array specifying the number of elements to read in each dimension
 * @param {number[]} [options.stride] An array of strides for the output array, mandatory if the array is specified
 * @param {string} [options.data_type] See {@link GDT|GDT constants}
 * @param {TypedArray} [options.data] The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @return {TypedArray}
 */
  read(options: MDArrayOptions): TypedArray

  /**
 * Read data from the MDArray.
 * {{{async}}}
 *
 * This will extract the context of a (hyper-)rectangle from the array into a buffer.
 * If the buffer can be passed as an argument or it can be allocated by the function.
 * Generalized n-dimensional strides are supported.
 *
 * Although this method can be used in its raw form, it works best when used with the ndarray plugin.
 *
 * @method readAsync
 * @instance
 * @memberof MDArray
 * @throws Error
 * @param {MDArrayOptions} options
 * @param {number[]} options.origin An array of the starting indices
 * @param {number[]} options.span An array specifying the number of elements to read in each dimension
 * @param {number[]} [options.stride] An array of strides for the output array, mandatory if the array is specified
 * @param {string} [options.data_type] See {@link GDT|GDT constants}
 * @param {TypedArray} [options.data] The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<TypedArray>} [callback=undefined] {{{cb}}}
 * @return {Promise<TypedArray>} A TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values.
 */
  readAsync(options: MDArrayOptions, callback?: callback<TypedArray>): Promise<TypedArray>

  /**
 * Get a partial view of the MDArray
 *
 * The slice expression uses the same syntax as NumPy basic slicing and indexing. See (https://www.numpy.org/devdocs/reference/arrays.indexing.html#basic-slicing-and-indexing). Or it can use field access by name. See (https://www.numpy.org/devdocs/reference/arrays.indexing.html#field-access).
 *
 * @method getView
 * @instance
 * @memberof MDArray
 * @throws Error
 * @param {string} view
 * @return {MDArray}
 */
  getView(view: string): MDArray

  /**
 * Return an array that is a mask for the current array.
 *
 * This array will be of type Byte, with values set to 0 to indicate invalid pixels of the current array, and values set to 1 to indicate valid pixels.
 *
 * The generic implementation honours the NoDataValue, as well as various netCDF CF attributes: missing_value, _FillValue, valid_min, valid_max and valid_range.
 *
 * @method getMask
 * @instance
 * @memberof MDArray
 * @throws Error
 * @return {MDArray}
 */
  getMask(): MDArray

  /**
 * Return a view of this array as a gdal.Dataset (ie 2D)
 *
 * In the case of > 2D arrays, additional dimensions will be represented as raster bands.
 *
 * @method asDataset
 * @instance
 * @memberof MDArray
 * @param {number|string} x dimension to be used as X axis
 * @param {number|string} y dimension to be used as Y axis
 * @throws Error
 * @return {Dataset}
 */
  asDataset(x: number|string, y: number|string): Dataset
}

export class MultiCurve extends GeometryCollection {
/**
 * @constructor
 * @class MultiCurve
 * @extends GeometryCollection
 */
  constructor()

  /**
 * Converts it to a polygon.
 *
 * @method polygonize
 * @instance
 * @memberof MultiCurve
 * @return {Polygon}
 */
  polygonize(): Polygon
}

export class MultiLineString extends GeometryCollection {
/**
 * @constructor
 * @class MultiLineString
 * @extends GeometryCollection
 */
  constructor()

  /**
 * Converts it to a polygon.
 *
 * @method polygonize
 * @instance
 * @memberof MultiLineString
 * @return {Polygon}
 */
  polygonize(): Polygon
}

export class MultiPoint extends GeometryCollection {
/**
 * @constructor
 * @class MultiPoint
 * @extends GeometryCollection
 */
  constructor()
}

export class MultiPolygon extends GeometryCollection {
/**
 * @constructor
 * @class MultiPolygon
 * @extends GeometryCollection
 */
  constructor()

  /**
 * Unions all the geometries and returns the result.
 *
 * @method unionCascaded
 * @instance
 * @memberof MultiPolygon
 * @return {Geometry}
 */
  unionCascaded(): Geometry

  /**
 * Computes the combined area of the collection.
 *
 * @method getArea
 * @instance
 * @memberof MultiPolygon
 * @return {number}
 */
  getArea(): number
}

export class Point extends Geometry {
/**
 * Point class.
 *
 * @constructor
 * @class Point
 * @extends Geometry
 * @param {number} x
 * @param {number} y
 * @param {number} [z]
 */
  constructor(x: number, y: number, z?: number)

  /**
 * @kind member
 * @name x
 * @instance
 * @memberof Point
 * @type {number}
 */
  x: number

  /**
 * @kind member
 * @name y
 * @instance
 * @memberof Point
 * @type {number}
 */
  y: number

  /**
 * @kind member
 * @name z
 * @instance
 * @memberof Point
 * @type {number}
 */
  z: number
}

export class Polygon extends Geometry {
/**
 * Concrete class representing polygons.
 *
 * @constructor
 * @class Polygon
 * @extends Geometry
 */
  constructor()

  /**
 * The rings that make up the polygon geometry.
 *
 * @kind member
 * @name rings
 * @instance
 * @memberof Polygon
 * @type {PolygonRings}
 */
  rings: PolygonRings

  /**
 * Computes the area of the polygon.
 *
 * @method getArea
 * @instance
 * @memberof Polygon
 * @return {number}
 */
  getArea(): number
}

export class PolygonRings implements Iterable<LineString> {
/**
 * A collection of polygon rings, used by {@link Polygon}.
 *
 * @class PolygonRings
 */
  constructor()
  [Symbol.iterator](): Iterator<LineString>

  /**
 * Returns the number of rings that exist in the collection.
 *
 * @method count
 * @instance
 * @memberof PolygonRings
 * @return {number}
 */
  count(): number

  /**
 * Returns the ring at the specified index. The ring
 * at index `0` will always be the polygon's exterior ring.
 *
 * @example
 *
 * var exterior = polygon.rings.get(0);
 * var interior = polygon.rings.get(1);
 *
 * @method get
 * @instance
 * @memberof PolygonRings
 * @param {number} index
 * @throws Error
 * @return {LinearRing}
 */
  get(index: number): LinearRing

  /**
 * Adds a ring to the collection.
 *
 * @example
 *
 * var ring1 = new gdal.LinearRing();
 * ring1.points.add(0,0);
 * ring1.points.add(1,0);
 * ring1.points.add(1,1);
 * ring1.points.add(0,1);
 * ring1.points.add(0,0);
 *
 * // one at a time:
 * polygon.rings.add(ring1);
 *
 * // many at once:
 * polygon.rings.add([ring1, ...]);
 *
 * @method add
 * @instance
 * @memberof PolygonRings
 * @param {gdal.LinearRing|LinearRing[]} rings
 */
  add(rings: gdal.LinearRing|LinearRing[]): void

  /**
 * Iterates through all rings using a callback function.
 *
 * @example
 *
 * polygon.rings.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof PolygonRings
 * @param {forEachCb<LineString>} callback The callback to be called with each {@link LineString}
 */
  forEach(callback: forEachCb<LineString>): void

  /**
 * Iterates through rings using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = polygon.rings.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof PolygonRings
 * @param {mapCb<LineString,U>} callback The callback to be called with each {@link LineString}
 * @return {U[]}
 */
  map<U>(callback: mapCb<LineString,U>): U[]

  /**
 * Outputs all rings as a regular javascript array.
 *
 * @method
 * @name toArray
 * @instance
 * @memberof PolygonRings
 * @return {LineString[]} List of {@link LineString|LineString instances}
 */
  toArray(): LineString[]
}

export class RasterBand {
/**
 * A single raster band (or channel).
 *
 * @class RasterBand
 */
  constructor()

  /**
 * @readonly
 * @kind member
 * @name ds
 * @instance
 * @memberof RasterBand
 * @type {Dataset}
 */
  readonly ds: Dataset

  /**
 * @readonly
 * @kind member
 * @name overviews
 * @instance
 * @memberof RasterBand
 * @type {RasterBandOverviews}
 */
  readonly overviews: RasterBandOverviews

  /**
 * @readonly
 * @kind member
 * @name pixels
 * @instance
 * @memberof RasterBand
 * @type {RasterBandPixels}
 */
  readonly pixels: RasterBandPixels

  /**
 * @readonly
 * @kind member
 * @name id
 * @instance
 * @memberof RasterBand
 * @type {number|null}
 */
  readonly id: number|null

  /**
 * @readonly
 * @kind member
 * @name idAsync
 * @instance
 * @memberof RasterBand
 * @type {Promise<number|null>}
 * {{{async_getter}}}
 */
  readonly idAsync: Promise<number|null>

  /**
 * Name of of band.
 *
 * @readonly
 * @kind member
 * @name description
 * @instance
 * @memberof RasterBand
 * @type {string}
 */
  readonly description: string

  /**
 * Name of of band.
 * {{{async_getter}}}
 *
 * @readonly
 * @kind member
 * @name descriptionAsync
 * @instance
 * @memberof RasterBand
 * @type {Promise<string>}
 */
  readonly descriptionAsync: Promise<string>

  /**
 * Size object containing `"x"` and `"y"` properties.
 *
 * @readonly
 * @kind member
 * @name size
 * @instance
 * @memberof RasterBand
 * @type {xyz}
 */
  readonly size: xyz

  /**
 * Size object containing `"x"` and `"y"` properties.
 * {{{async_getter}}}
 *
 * @readonly
 * @kind member
 * @name sizeAsync
 * @instance
 * @memberof RasterBand
 * @type {Promise<xyz>}
 */
  readonly sizeAsync: Promise<xyz>

  /**
 * Size object containing `"x"` and `"y"` properties.
 *
 * @readonly
 * @kind member
 * @name blockSize
 * @instance
 * @memberof RasterBand
 * @type {xyz}
 */
  readonly blockSize: xyz

  /**
 * Size object containing `"x"` and `"y"` properties.
 * {{{async_getter}}}
 *
 * @readonly
 * @kind member
 * @name blockSizeAsync
 * @instance
 * @memberof RasterBand
 * @type {Promise<xyz>}
 */
  readonly blockSizeAsync: Promise<xyz>

  /**
 * Minimum value for this band.
 *
 * @readonly
 * @kind member
 * @name minimum
 * @instance
 * @memberof RasterBand
 * @type {number|null}
 */
  readonly minimum: number|null

  /**
 * Minimum value for this band.
 * {{{async_getter}}}
 *
 * @readonly
 * @kind member
 * @name minimumAsync
 * @instance
 * @memberof RasterBand
 * @type {Promise<number|null>}
 */
  readonly minimumAsync: Promise<number|null>

  /**
 * Maximum value for this band.
 *
 * @readonly
 * @kind member
 * @name maximum
 * @instance
 * @memberof RasterBand
 * @type {number|null}
 */
  readonly maximum: number|null

  /**
 * Maximum value for this band.
 * {{{async_getter}}}
 *
 * @readonly
 * @kind member
 * @name maximumAsync
 * @instance
 * @memberof RasterBand
 * @type {Promise<number|null>}
 */
  readonly maximumAsync: Promise<number|null>

  /**
 * Raster value offset.
 *
 * @kind member
 * @name offset
 * @instance
 * @memberof RasterBand
 * @type {number|null}
 */
  offset: number|null

  /**
 * Raster value offset.
 * {{{async_getter}}}
 *
 * @kind member
 * @name offsetAsync
 * @instance
 * @memberof RasterBand
 * @readonly
 * @type {Promise<number|null>}
 */
  readonly offsetAsync: Promise<number|null>

  /**
 * Raster value scale.
 *
 * @kind member
 * @name scale
 * @instance
 * @memberof RasterBand
 * @type {number|null}
 */
  scale: number|null

  /**
 * Raster value scale.
 * {{{async_getter}}}
 *
 * @kind member
 * @name scaleAsync
 * @instance
 * @memberof RasterBand
 * @readonly
 * @type {Promise<number|null>}
 */
  readonly scaleAsync: Promise<number|null>

  /**
 * No data value for this band.
 *
 * @kind member
 * @name noDataValue
 * @instance
 * @memberof RasterBand
 * @type {number|null}
 */
  noDataValue: number|null

  /**
 * No data value for this band.
 * {{{async_getter}}}
 *
 * @kind member
 * @name noDataValueAsync
 * @instance
 * @memberof RasterBand
 * @readonly
 * @type {Promise<number|null>}
 */
  readonly noDataValueAsync: Promise<number|null>

  /**
 * Raster unit type (name for the units of this raster's values).
 * For instance, it might be `"m"` for an elevation model in meters,
 * or `"ft"` for feet. If no units are available, a value of `""`
 * will be returned.
 *
 * @kind member
 * @name unitType
 * @instance
 * @memberof RasterBand
 * @type {string|null}
 */
  unitType: string|null

  /**
 * Raster unit type (name for the units of this raster's values).
 * For instance, it might be `"m"` for an elevation model in meters,
 * or `"ft"` for feet. If no units are available, a value of `""`
 * will be returned.
 * {{{async_getter}}}
 *
 * @kind member
 * @name unitTypeAsync
 * @instance
 * @memberof RasterBand
 * @readonly
 * @type {Promise<string|null>}
 */
  readonly unitTypeAsync: Promise<string|null>

  /**
 *
 * Pixel data type ({@link GDT|see GDT constants} used for this band.
 *
 * @readonly
 * @kind member
 * @name dataType
 * @instance
 * @memberof RasterBand
 * @type {string|null}
 */
  readonly dataType: string|null

  /**
 *
 * Pixel data type ({@link GDT|see GDT constants} used for this band.
 * {{{async_getter}}}
 *
 * @readonly
 * @kind member
 * @name dataTypeAsync
 * @instance
 * @memberof RasterBand
 * @type {Promise<string|null>}
 */
  readonly dataTypeAsync: Promise<string|null>

  /**
 * Indicates if the band is read-only.
 *
 * @readonly
 * @kind member
 * @name readOnly
 * @instance
 * @memberof RasterBand
 * @type {boolean}
 */
  readonly readOnly: boolean

  /**
 * Indicates if the band is read-only.
 * {{{async_getter}}}
 *
 * @readonly
 * @kind member
 * @name readOnlyAsync
 * @instance
 * @memberof RasterBand
 * @type {Promise<boolean>}
 */
  readonly readOnlyAsync: Promise<boolean>

  /**
 * An indicator if the underlying datastore can compute arbitrary overviews
 * efficiently, such as is the case with OGDI over a network. Datastores with
 * arbitrary overviews don't generally have any fixed overviews, but GDAL's
 * `RasterIO()` method can be used in downsampling mode to get overview
 * data efficiently.
 *
 * @readonly
 * @kind member
 * @name hasArbitraryOverviews
 * @instance
 * @memberof RasterBand
 * @type {boolean}
 */
  readonly hasArbitraryOverviews: boolean

  /**
 * An indicator if the underlying datastore can compute arbitrary overviews
 * efficiently, such as is the case with OGDI over a network. Datastores with
 * arbitrary overviews don't generally have any fixed overviews, but GDAL's
 * `RasterIO()` method can be used in downsampling mode to get overview
 * data efficiently.
 * {{{async_getter}}}
 *
 * @readonly
 * @kind member
 * @name hasArbitraryOverviewsAsync
 * @instance
 * @memberof RasterBand
 * @type {Promise<boolean>}
 */
  readonly hasArbitraryOverviewsAsync: Promise<boolean>

  /**
 * List of list of category names for this raster.
 *
 * @kind member
 * @name categoryNames
 * @instance
 * @memberof RasterBand
 * @type {string[]}
 */
  categoryNames: string[]

  /**
 * List of list of category names for this raster.
 * {{{async_getter}}}
 *
 * @kind member
 * @name categoryNamesAsync
 * @instance
 * @memberof RasterBand
 * @readonly
 * @type {Promise<string[]>}
 */
  readonly categoryNamesAsync: Promise<string[]>

  /**
 * Color interpretation mode ({@link GCI|see GCI constants})
 *
 * @kind member
 * @name colorInterpretation
 * @instance
 * @memberof RasterBand
 * @type {string|null}
 */
  colorInterpretation: string|null

  /**
 * Color interpretation mode ({@link GCI|see GCI constants})
 * {{{async_getter}}}
 *
 * @kind member
 * @name colorInterpretationAsync
 * @instance
 * @memberof RasterBand
 * @readonly
 * @type {Promise<string|null>}
 */
  readonly colorInterpretationAsync: Promise<string|null>

  /**
 * Color table ({@link ColorTable|see ColorTable})
 *
 * @kind member
 * @name colorTable
 * @instance
 * @memberof RasterBand
 * @type {ColorTable|null}
 */
  colorTable: ColorTable|null

  /**
 * Color table ({@link ColorTable|see ColorTable})
 * {{{async_getter}}}
 *
 * @kind member
 * @name colorTableAsync
 * @instance
 * @memberof RasterBand
 * @readonly
 * @type {Promise<ColorTable|null>}
 */
  readonly colorTableAsync: Promise<ColorTable|null>

  /**
 * Saves changes to disk.
 * @method flush
 * @instance
 * @memberof RasterBand
 */
  flush(): void

  /**
 * Saves changes to disk.
 * {{{async}}}
 *
 * @method flushAsync
 * @instance
 * @memberof RasterBand
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 *
 */
  flushAsync(callback?: callback<void>): Promise<void>

  /**
 * Return the status flags of the mask band associated with the band.
 *
 * The result will be a bitwise OR-ed set of status flags with the following
 * available definitions that may be extended in the future:
 *
 *   - `GMF_ALL_VALID` (`0x01`): There are no invalid pixels, all mask values
 * will be 255. When used this will normally be the only flag set.
 *   - `GMF_PER_DATASET` (`0x02`): The mask band is shared between all bands on
 * the dataset.
 *   - `GMF_ALPHA` (`0x04`): The mask band is actually an alpha band and may
 * have values other than 0 and 255.
 *   - `GMF_NODATA` (`0x08`): Indicates the mask is actually being generated
 * from nodata values. (mutually exclusive of `GMF_ALPHA`)
 *
 * @method getMaskFlags
 * @instance
 * @memberof RasterBand
 * @return {number} Mask flags
 */
  getMaskFlags(): number

  /**
 * Adds a mask band to the current band.
 *
 * @throws Error
 * @method createMaskBand
 * @instance
 * @memberof RasterBand

 * @param {number} flags Mask flags
 */
  createMaskBand(flags: number): void

  /**
 * Return the mask band associated with the band.
 *
 * @method getMaskBand
 * @instance
 * @memberof RasterBand
 * @return {RasterBand}
 */
  getMaskBand(): RasterBand

  /**
 * Fill this band with a constant value.
 *
 * @throws Error
 * @method fill
 * @instance
 * @memberof RasterBand
 * @throws Error
 * @param {number} real_value
 * @param {number} [imaginary_value]
 */
  fill(real_value: number, imaginary_value?: number): void

  /**
 * Fill this band with a constant value.
 * {{{async}}}
 *
 * @throws Error
 * @method fillAsync
 * @instance
 * @memberof RasterBand
 * @throws Error
 * @param {number} real_value
 * @param {number} [imaginary_value]
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  fillAsync(real_value: number, imaginary_value?: number, callback?: callback<void>): Promise<void>

  /**
 * Return a view of this raster band as a 2D multidimensional GDALMDArray.
 *
 * The band must be linked to a GDALDataset.
 *
 * If the dataset has a geotransform attached, the X and Y dimensions of the returned array will have an associated indexing variable.
 *
 * Requires GDAL>=3.3 with MDArray support, won't be defined otherwise
 *
 * @throws Error
 * @method asMDArray
 * @instance
 * @memberof RasterBand
 * @return {MDArray}
 */
  asMDArray(): MDArray

  /**
 * Fetch image statistics.
 *
 * Returns the minimum, maximum, mean and standard deviation of all pixel values
 * in this band. If approximate statistics are sufficient, the
 * `allow_approximation` argument can be set to `true` in which case overviews,
 * or a subset of image tiles may be used in computing the statistics.
 *
 * @throws Error
 * @method getStatistics
 * @instance
 * @memberof RasterBand
 * @param {boolean} allow_approximation If `true` statistics may be computed
 * based on overviews or a subset of all tiles.
 * @param {boolean} force If `false` statistics will only be returned if it can
 * be done without rescanning the image.
 * @return {object} Statistics containing `"min"`, `"max"`, `"mean"`,
 * `"std_dev"` properties.
 */
  getStatistics(allow_approximation: boolean, force: boolean): object

  /**
 * Computes image statistics.
 *
 * Returns the minimum, maximum, mean and standard deviation of all pixel values
 * in this band. If approximate statistics are sufficient, the
 * `allow_approximation` argument can be set to `true` in which case overviews,
 * or a subset of image tiles may be used in computing the statistics.
 *
 * @throws Error
 * @method computeStatistics
 * @instance
 * @memberof RasterBand

 * @param {boolean} allow_approximation If `true` statistics may be computed
 * based on overviews or a subset of all tiles.
 * @return {stats} Statistics containing `"min"`, `"max"`, `"mean"`,
 * `"std_dev"` properties.
 */
  computeStatistics(allow_approximation: boolean): stats

  /**
 * Computes image statistics.
 * {{async}}
 *
 * Returns the minimum, maximum, mean and standard deviation of all pixel values
 * in this band. If approximate statistics are sufficient, the
 * `allow_approximation` argument can be set to `true` in which case overviews,
 * or a subset of image tiles may be used in computing the statistics.
 *
 * @throws Error
 * @method computeStatisticsAsync
 * @instance
 * @memberof RasterBand
 * @param {boolean} allow_approximation If `true` statistics may be computed
 * based on overviews or a subset of all tiles.
 * @param {callback<stats>} [callback=undefined] {{{cb}}}
 * @return {Promise<stats>} Statistics containing `"min"`, `"max"`, `"mean"`,
 * `"std_dev"` properties.
 */
  computeStatisticsAsync(allow_approximation: boolean, callback?: callback<stats>): Promise<stats>

  /**
 * Set statistics on the band. This method can be used to store
 * min/max/mean/standard deviation statistics.
 *
 * @throws Error
 * @method setStatistics
 * @instance
 * @memberof RasterBand
 * @param {number} min
 * @param {number} max
 * @param {number} mean
 * @param {number} std_dev
 */
  setStatistics(min: number, max: number, mean: number, std_dev: number): void

  /**
 * Returns band metadata
 *
 * @method getMetadata
 * @instance
 * @memberof RasterBand
 * @param {string} [domain]
 * @return {any}
 */
  getMetadata(domain?: string): any

  /**
 * Returns band metadata.
 * {{{async}}}
 *
 * @method getMetadataAsync
 * @instance
 * @memberof RasterBand
 * @param {string} [domain]
 * @param {callback<any>} [callback=undefined] {{{cb}}}
 * @return {Promise<any>}
 */
  getMetadataAsync(domain?: string, callback?: callback<any>): Promise<any>

  /**
 * Set metadata. Can return a warning (false) for formats not supporting persistent metadata.
 *
 * @method setMetadata
 * @instance
 * @memberof RasterBand
 * @param {object|string[]} metadata
 * @param {string} [domain]
 * @return {boolean}
 */
  setMetadata(metadata: object|string[], domain?: string): boolean

  /**
 * Set metadata. Can return a warning (false) for formats not supporting persistent metadata.
 * {{{async}}}
 *
 * @method setMetadataAsync
 * @instance
 * @memberof RasterBand
 * @param {object|string[]} metadata
 * @param {string} [domain]
 * @param {callback<boolean>} [callback=undefined] {{{cb}}}
 * @return {Promise<boolean>}
 */
  setMetadataAsync(metadata: object|string[], domain?: string, callback?: callback<boolean>): Promise<boolean>
}

export class RasterBandOverviews implements Iterable<RasterBand>, AsyncIterable<RasterBand> {
/**
 * An encapsulation of a {@link RasterBand} overview functionality.
 *
 * @class RasterBandOverviews
 */
  constructor()
  [Symbol.iterator](): Iterator<RasterBand>
  [Symbol.asyncIterator](): AsyncIterator<RasterBand>

  /**
 * Fetches the overview at the provided index.
 *
 * @method get
 * @instance
 * @memberof RasterBandOverviews
 * @throws Error
 * @param {number} index 0-based index
 * @return {RasterBand}
 */
  get(index: number): RasterBand

  /**
 * Fetches the overview at the provided index.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof RasterBandOverviews
 * @throws Error
 * @param {number} index 0-based index
 * @param {callback<RasterBand>} [callback=undefined] {{{cb}}}
 * @return {Promise<RasterBand>}
 */
  getAsync(index: number, callback?: callback<RasterBand>): Promise<RasterBand>

  /**
 * Fetch best sampling overview.
 *
 * Returns the most reduced overview of the given band that still satisfies the
 * desired number of samples. This function can be used with zero as the number
 * of desired samples to fetch the most reduced overview. The same band as was
 * passed in will be returned if it has not overviews, or if none of the
 * overviews have enough samples.
 *
 * @method getBySampleCount
 * @instance
 * @memberof RasterBandOverviews
 * @param {number} samples
 * @return {RasterBand}
 */
  getBySampleCount(samples: number): RasterBand

  /**
 * Fetch best sampling overview.
 * {{{async}}}
 *
 * Returns the most reduced overview of the given band that still satisfies the
 * desired number of samples. This function can be used with zero as the number
 * of desired samples to fetch the most reduced overview. The same band as was
 * passed in will be returned if it has not overviews, or if none of the
 * overviews have enough samples.
 *
 * @method getBySampleCountAsync
 * @instance
 * @memberof RasterBandOverviews
 * @param {number} samples
 * @param {callback<RasterBand>} [callback=undefined] {{{cb}}}
 * @return {Promise<RasterBand>}
 */
  getBySampleCountAsync(samples: number, callback?: callback<RasterBand>): Promise<RasterBand>

  /**
 * Returns the number of overviews.
 *
 * @method count
 * @instance
 * @memberof RasterBandOverviews
 * @return {number}
 */
  count(): number

  /**
 * Returns the number of overviews.
 * {{{async}}}
 *
 * @method countAsync
 * @instance
 * @memberof RasterBandOverviews
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  countAsync(callback?: callback<number>): Promise<number>

  /**
 * Iterates through all overviews using a callback function.
 *
 * @example
 *
 * band.overviews.forEach(function(array, i) { ... });
 *
 * @method
 * @name forEach
 * @instance
 * @memberof RasterBandOverviews
 * @param {forEachCb<RasterBand>} callback The callback to be called with each {@link RasterBand}
 */
  forEach(callback: forEachCb<RasterBand>): void

  /**
 * Iterates through overviews using a callback function and builds
 * an array of the returned values.
 *
 * @example
 *
 * var result = band.overviews.map(function(array, i) {
 *     return value;
 * });
 *
 * @method
 * @name map<U>
 * @instance
 * @memberof RasterBandOverviews
 * @param {mapCb<RasterBand,U>} callback The callback to be called with each {@link RasterBand}
 * @return {U[]}
 */
  map<U>(callback: mapCb<RasterBand,U>): U[]
}

export class RasterBandPixels {
/**
 * A representation of a {@link RasterBand}'s pixels.
 *
 *
 * Note: Typed arrays should be created with an external ArrayBuffer for
 * versions of node >= 0.11
 *
 * @example
 * const n = 16*16;
 * const data = new Float32Array(new ArrayBuffer(n*4));
 * //read data into the existing array
 * band.pixels.read(0,0,16,16,data);
 *
 * @class RasterBandPixels
 */
  constructor()

  /**
 * Parent raster band
 *
 * @readonly
 * @kind member
 * @name band
 * @instance
 * @memberof RasterBandPixels
 * @type {RasterBand}
 */
  readonly band: RasterBand

  /**
 * Returns the value at the x, y coordinate.
 *
 * @method get
 * @instance
 * @memberof RasterBandPixels
 * @param {number} x
 * @param {number} y
 * @throws Error
 * @return {number}
 */
  get(x: number, y: number): number

  /**
 * Returns the value at the x, y coordinate.
 * {{{async}}}
 *
 * @method getAsync
 * @instance
 * @memberof RasterBandPixels
 * @param {number} x
 * @param {number} y
 * @param {callback<number>} [callback=undefined] {{{cb}}}
 * @return {Promise<number>}
 */
  getAsync(x: number, y: number, callback?: callback<number>): Promise<number>

  /**
 * Sets the value at the x, y coordinate.
 *
 * @method set
 * @instance
 * @memberof RasterBandPixels
 * @param {number} x
 * @param {number} y
 * @param {number} value
 */
  set(x: number, y: number, value: number): void

  /**
 * Sets the value at the x, y coordinate.
 * {{{async}}}
 *
 * @method setAsync
 * @instance
 * @memberof RasterBandPixels
 * @param {number} x
 * @param {number} y
 * @param {number} value
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  setAsync(x: number, y: number, value: number, callback?: callback<void>): Promise<void>

  /**
 * Reads a region of pixels.
 *
 * @method read
 * @instance
 * @memberof RasterBandPixels
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {TypedArray} [data] The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @param {ReadOptions} [options]
 * @param {number} [options.buffer_width=x_size]
 * @param {number} [options.buffer_height=y_size]
 * @param {string} [options.data_type] See {@link GDT|GDT constants}
 * @param {number} [options.pixel_space]
 * @param {number} [options.line_space]
 * @param {string} [options.resampling] Resampling algorithm ({@link GRA|available options})
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @return {TypedArray} A TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values.
 */
  read(x: number, y: number, width: number, height: number, data?: TypedArray, options?: ReadOptions): TypedArray

  /**
 * Asynchronously reads a region of pixels.
 * {{{async}}}
 *
 * @method readAsync
 * @instance
 * @memberof RasterBandPixels
 * @param {number} x
 * @param {number} y
 * @param {number} width the width
 * @param {number} height
 * @param {TypedArray} [data] The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @param {ReadOptions} [options]
 * @param {number} [options.buffer_width=x_size]
 * @param {number} [options.buffer_height=y_size]
 * @param {string} [options.data_type] See {@link GDT|GDT constants}
 * @param {number} [options.pixel_space]
 * @param {number} [options.line_space]
 * @param {string} [options.resampling] Resampling algorithm ({@link GRA|available options}
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<TypedArray>} [callback=undefined] {{{cb}}}
 * @return {Promise<TypedArray>} A TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values.
 */
  readAsync(x: number, y: number, width: number, height: number, data?: TypedArray, options?: ReadOptions, callback?: callback<TypedArray>): Promise<TypedArray>

  /**
 * Writes a region of pixels.
 *
 * @method write
 * @instance
 * @memberof RasterBandPixels
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {TypedArray} [data] The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to write to the band.
 * @param {WriteOptions} [options]
 * @param {number} [options.buffer_width=x_size]
 * @param {number} [options.buffer_height=y_size]
 * @param {number} [options.pixel_space]
 * @param {number} [options.line_space]
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 */
  write(x: number, y: number, width: number, height: number, data?: TypedArray, options?: WriteOptions): void

  /**
 * Asynchronously writes a region of pixels.
 * {{{async}}}
 *
 * @method writeAsync
 * @instance
 * @memberof RasterBandPixels
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {TypedArray} [data] The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to write to the band.
 * @param {WriteOptions} [options]
 * @param {number} [options.buffer_width=x_size]
 * @param {number} [options.buffer_height=y_size]
 * @param {number} [options.pixel_space]
 * @param {number} [options.line_space]
 * @param {ProgressCb} [options.progress_cb] {{{progress_cb}}}
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  writeAsync(x: number, y: number, width: number, height: number, data?: TypedArray, options?: WriteOptions, callback?: callback<void>): Promise<void>

  /**
 * Reads a block of pixels.
 *
 * @method readBlock
 * @instance
 * @memberof RasterBandPixels
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {TypedArray} [data] The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @return {TypedArray} A TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values.
 */
  readBlock(x: number, y: number, data?: TypedArray): TypedArray

  /**
 * Reads a block of pixels.
 * {{{async}}}
 *
 * @method readBlockAsync
 * @instance
 * @memberof RasterBandPixels
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {TypedArray} [data] The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) to put the data in. A new array is created if not given.
 * @param {callback<TypedArray>} [callback=undefined] {{{cb}}}
 * @return {Promise<TypedArray>} A TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values.
 */
  readBlockAsync(x: number, y: number, data?: TypedArray, callback?: callback<TypedArray>): Promise<TypedArray>

  /**
 * Writes a block of pixels.
 *
 * @method writeBlock
 * @instance
 * @memberof RasterBandPixels
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {TypedArray} data The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values to write to the band.
 */
  writeBlock(x: number, y: number, data: TypedArray): void

  /**
 * Writes a block of pixels.
 * {{{async}}}
 *
 * @method writeBlockAsync
 * @instance
 * @memberof RasterBandPixels
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {TypedArray} data The TypedArray (https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView#Typed_array_subclasses) of values to write to the band.
 * @param {callback<void>} [callback=undefined] {{{cb}}}
 * @return {Promise<void>}
 */
  writeBlockAsync(x: number, y: number, data: TypedArray, callback?: callback<void>): Promise<void>

  /**
 * Clamp the block size for a given block offset.
 * Handles partial blocks at the edges of the raster and returns the true number of pixels.
 *
 * @method clampBlock
 * @instance
 * @memberof RasterBandPixels
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @return {xyz} A size object.
 */
  clampBlock(x: number, y: number): xyz

  /**
 * Clamp the block size for a given block offset.
 * Handles partial blocks at the edges of the raster and returns the true number of pixels.
 * {{{async}}}
 *
 * @method clampBlockAsync
 * @instance
 * @memberof RasterBandPixels
 * @throws Error
 * @param {number} x
 * @param {number} y
 * @param {callback<xyz>} [callback=undefined] {{{cb}}}
 * @return {Promise<xyz>} A size object.
 */
  clampBlockAsync(x: number, y: number, callback?: callback<xyz>): Promise<xyz>

  /**
 * create a Readable stream from a raster band
 *
 * @memberof RasterBandPixels
 * @instance
 * @method createReadStream
 * @param {RasterReadableOptions} [options]
 * @param {boolean} [options.blockOptimize=true] Read by file blocks when possible (when `rasterSize.x == blockSize.x`)
 * @param {boolean} [options.convertNoData=true] Automatically convert `RasterBand.noDataValue` to `NaN`
 * @param {new (len: number) => TypedArray} [options.readAs=undefined] Data type to convert to, must be a `TypedArray` constructor
 * @returns {RasterReadStream}
 */
  createReadStream(options?: RasterReadableOptions): RasterReadStream

  /**
 * create a Writable stream from a raster band
 *
 * @memberof RasterBandPixels
 * @instance
 * @method createWriteStream
 * @param {RasterWritableOptions} [options]
 * @param {boolean} [options.blockOptimize=true] Write by file blocks when possible (when rasterSize.x == blockSize.x)
 * @param {boolean} [options.convertNoData=true] Automatically convert `NaN` to `RasterBand.noDataValue` if it is set
 * @returns {RasterWriteStream}
 */
  createWriteStream(options?: RasterWritableOptions): RasterWriteStream
}

export class RasterMuxStream extends stream.Readable {
/**
 * Multiplexer stream
 *
 * Reads multiple input {@link RasterReadStream} streams and outputs a single}
 * synchronized stream with multiple data elements.
 *
 * All the input streams must have the same length.
 *
 * Can be used with {@link RasterTransform}
 * which will automatically apply a function over the whole chunk.
 *
 * @example
 *
 *  const dsT2m = gdal.open('AROME_T2m_10.tiff'));
 *  const dsD2m = gdal.open('AROME_D2m_10.tiff'));
 *
 *  const dsCloudBase = gdal.open('CLOUDBASE.tiff', 'w', 'GTiff',
 *    dsT2m.rasterSize.x, dsT2m.rasterSize.y, 1, gdal.GDT_Float64);
 *
 *  const mux = new gdal.RasterMuxStream({
 *    T2m: dsT2m.bands.get(1).pixels.createReadStream(),
 *    D2m: dsD2m.bands.get(1).pixels.createReadStream()
 *  });
 *  const ws = dsCloudBase.bands.get(1).pixels.createWriteStream();
 *
 *  // Espy's estimation for cloud base height (lifted condensation level)
 *  // LCL = 125 * (T2m - Td2m)
 *  // where T2m is the temperature at 2m and Td2m is the dew point at 2m
 *  const espyEstimation = new Transform({
 *    objectMode: true,
 *    transform(chunk, _, cb) {
 *      const lcl = new Float64Array(chunk.T2m.length)
 *      for (let i = 0; i < chunk.T2m.length; i++) {
 *        lcl[i] = 125 * (chunk.T2m[i] - chunk.D2m[i])
 *      }
 *      cb(null, lcl)
 *    }
 *  })
 *
 *  mux.pipe(espyEstimation).pipe(ws);
 *
 *
 * @class RasterMuxStream
 * @extends stream.Readable
 * @constructor
 * @param {Record<string,RasterReadStream>} inputs Input streams
 * @param {RasterReadableOptions} [options]
 * @param {boolean} [options.blockOptimize=true] Read by file blocks when possible (when rasterSize.x == blockSize.x)
 */
  constructor(inputs: Record<string,RasterReadStream>, options?: RasterReadableOptions)
}

export class RasterReadStream extends stream.Readable {
/**
 * Class implementing {@link RasterBand} reading as a stream of pixels}
 *
 * Reading is buffered and it is aligned on the underlying
 * compression blocks for maximum efficiency when possible
 *
 * Pixels are streamed in row-major order
 *
 * @class RasterReadStream
 * @extends stream.Readable
 * @constructor
 * @param {RasterReadableOptions} [options]
 * @param {RasterBand} options.band RasterBand to use
 * @param {boolean} [options.blockOptimize=true] Read by file blocks when possible (when `rasterSize.x == blockSize.x`)
 * @param {boolean} [options.convertNoData=false] Automatically convert `RasterBand.noDataValue` to `NaN`, requires float data types
 * @param {new (len: number) => TypedArray} [options.type=undefined] Data type to convert to, must be a `TypedArray` constructor, default is the raster band data type
 */
  constructor(options?: RasterReadableOptions)
}

export class RasterTransform extends stream.Transform {
/**
 * A raster Transform stream
 *
 * Applies a function on all data elements.
 *
 * Input must be a {@link RasterMuxStream}
 *
 * {@link calcAsync} provides a higher-level interface for the same feature, while
 * an even lower-level API is available by manually extending `stream.Transform` as illustrated
 * in the {@link gdal.RasterMuxStream} example.
 *
 * @example
 *  const dsT2m = gdal.open('AROME_T2m_10.tiff'));
 *  const dsD2m = gdal.open('AROME_D2m_10.tiff'));
 *
 *  const dsCloudBase = gdal.open('CLOUDBASE.tiff', 'w', 'GTiff',
 *    dsT2m.rasterSize.x, dsT2m.rasterSize.y, 1, gdal.GDT_Float64);
 *
 *  const mux = new gdal.RasterMuxStream({
 *    T2m: dsT2m.bands.get(1).pixels.createReadStream(),
 *    D2m: dsD2m.bands.get(1).pixels.createReadStream()
 *  });
 *  const ws = dsCloudBase.bands.get(1).pixels.createWriteStream();
 *
 *  // Espy's estimation for cloud base height (lifted condensation level)
 *  // LCL = 125 * (T2m - Td2m)
 *  // where T2m is the temperature at 2m and Td2m is the dew point at 2m
 *  const fn = (t,td) => 125 * (t - td);
 *  const espyEstimation = new RasterTransform({ type: Float64Array, fn });
 *
 *  mux.pipe(espyEstimation).pipe(ws);
 *
 * @class RasterTransform
 * @extends stream.Transform
 * @constructor
 * @param {RasterTransformOptions} [options]
 * @param {Function} options.fn Function to be applied on all data
 * @param {new (len: number) => TypedArray} options.type Typed array constructor
 */
  constructor(options?: RasterTransformOptions)
}

export class RasterWriteStream extends stream.Writable {
/**
 * Class implementing {@link RasterBand}
 * writing as a stream of pixels
 *
 * Writing is buffered and it is aligned on the underlying
 * compression blocks for maximum efficiency when possible
 *
 * When piping between rasters using identical blocks,
 * the transfer is zero-copy
 *
 * The input stream must be in row-major order
 *
 * If the data type of the stream is different from the data type
 * of the file, GDAL will automatically convert. Mixing data types
 * across chunks is not supported, all chunks must have the same type.
 *
 * Writing is zero-copy when writing chunks that are exact
 * multiples of the underlying stream block size as returned
 * by `gdal.RasterBandPixels.blockSize`
 *
 * Block are written only when full, so the stream must
 * receive exactly `width * height` pixels to write the last block
 *
 * @class RasterWriteStream
 * @extends stream.Writable
 * @constructor
 * @param {RasterWritableOptions} [options]
 * @param {RasterBand} options.band RasterBand to use
 * @param {boolean} [options.blockOptimize=true] Write by file blocks when possible (when rasterSize.x == blockSize.x)
 * @param {boolean} [options.convertNoData=false] Automatically convert `NaN` to `RasterBand.noDataValue` if it is set when the stream is constructed
 */
  constructor(options?: RasterWritableOptions)
}

export class SimpleCurve extends Geometry {
/**
 * Abstract class representing all SimpleCurves.
 *
 * @constructor
 * @class SimpleCurve
 * @extends Geometry
 */
  constructor()

  /**
 * Returns the point at the specified distance along the SimpleCurve.
 *
 * @method value
 * @instance
 * @memberof SimpleCurve
 * @param {number} distance
 * @return {Point}
 */
  value(distance: number): Point

  /**
 * Compute the length of a multiSimpleCurve.
 *
 * @method getLength
 * @instance
 * @memberof SimpleCurve
 * @return {number}
 */
  getLength(): number

  /**
 * Add a segment of another LineString to this SimpleCurve subtype.
 *
 * Adds the request range of vertices to the end of this compound curve in an
 * efficient manner. If the start index is larger than the end index then the
 * vertices will be reversed as they are copied.
 *
 * @method addSubLineString
 * @instance
 * @memberof SimpleCurve
 * @param {LineString} LineString to be added
 * @param {number} [start=0] the first vertex to copy, defaults to 0 to start with
 * the first vertex in the other LineString
 * @param {number} [end=-1] the last vertex to copy, defaults to -1 indicating the
 * last vertex of the other LineString
 * @return {void}
 */
  addSubLineString(LineString: LineString, start?: number, end?: number): void
}

export class SpatialReference {
/**
 * This class respresents a OpenGIS Spatial Reference System, and contains
 * methods for converting between this object organization and well known text
 * (WKT) format.
 *
 * @constructor
 * @class SpatialReference
 * @param {string} [wkt]
 */
  constructor(wkt?: string)

  /**
 * Set a GeogCS based on well known name.
 *
 * @method setWellKnownGeogCS
 * @instance
 * @memberof SpatialReference
 * @param {string} name
 */
  setWellKnownGeogCS(name: string): void

  /**
 * Convert in place to ESRI WKT format.
 *
 * @throws Error
 * @method morphToESRI
 * @instance
 * @memberof SpatialReference
 */
  morphToESRI(): void

  /**
 * Convert in place from ESRI WKT format.
 *
 * @throws Error
 * @method morphFromESRI
 * @instance
 * @memberof SpatialReference
 */
  morphFromESRI(): void

  /**
 * This method returns `true` if EPSG feels this geographic coordinate system
 * should be treated as having lat/long coordinate ordering.
 *
 * Currently this returns `true` for all geographic coordinate systems with an
 * EPSG code set, and AXIS values set defining it as lat, long. Note that
 * coordinate systems with an EPSG code and no axis settings will be assumed
 * to not be lat/long.
 *
 * `false` will be returned for all coordinate systems that are not geographic,
 * or that do not have an EPSG code set.
 *
 * @method EPSGTreatsAsLatLong
 * @instance
 * @memberof SpatialReference
 * @return {boolean}
 */
  EPSGTreatsAsLatLong(): boolean

  /**
 * This method returns `true` if EPSG feels this projected coordinate system
 * should be treated as having northing/easting coordinate ordering.
 *
 * @method EPSGTreatsAsNorthingEasting
 * @instance
 * @memberof SpatialReference
 * @return {boolean}
 */
  EPSGTreatsAsNorthingEasting(): boolean

  /**
 * Check if geocentric coordinate system.
 *
 * @method isGeocentric
 * @instance
 * @memberof SpatialReference
 * @return {boolean}
 */
  isGeocentric(): boolean

  /**
 * Check if geographic coordinate system.
 *
 * @method isGeographic
 * @instance
 * @memberof SpatialReference
 * @return {boolean}
 */
  isGeographic(): boolean

  /**
 * Check if projected coordinate system.
 *
 * @method isProjected
 * @instance
 * @memberof SpatialReference
 * @return {boolean}
 */
  isProjected(): boolean

  /**
 * Check if local coordinate system.
 *
 * @method isLocal
 * @instance
 * @memberof SpatialReference
 * @return {boolean}
 */
  isLocal(): boolean

  /**
 * Check if vertical coordinate system.
 *
 * @method isVertical
 * @instance
 * @memberof SpatialReference
 * @return {boolean}
 */
  isVertical(): boolean

  /**
 * Check if compound coordinate system.
 *
 * @method isCompound
 * @instance
 * @memberof SpatialReference
 * @return {boolean}
 */
  isCompound(): boolean

  /**
 * Do the GeogCS'es match?
 *
 * @method isSameGeogCS
 * @instance
 * @memberof SpatialReference
 * @param {SpatialReference} srs
 * @return {boolean}
 */
  isSameGeogCS(srs: SpatialReference): boolean

  /**
 * Do the VertCS'es match?
 *
 * @method isSameVertCS
 * @instance
 * @memberof SpatialReference
 * @param {SpatialReference} srs
 * @return {boolean}
 */
  isSameVertCS(srs: SpatialReference): boolean

  /**
 * Do these two spatial references describe the same system?
 *
 * @method isSame
 * @instance
 * @memberof SpatialReference
 * @param {SpatialReference} srs
 * @return {boolean}
 */
  isSame(srs: SpatialReference): boolean

  /**
 * Set EPSG authority info if possible.
 *
 * @throws Error
 * @method autoIdentifyEPSG
 * @instance
 * @memberof SpatialReference
 */
  autoIdentifyEPSG(): void

  /**
 * Clones the spatial reference.
 *
 * @method clone
 * @instance
 * @memberof SpatialReference
 * @return {SpatialReference}
 */
  clone(): SpatialReference

  /**
 * Make a duplicate of the GEOGCS node of this OGRSpatialReference object.
 *
 * @method cloneGeogCS
 * @instance
 * @memberof SpatialReference
 * @return {SpatialReference}
 */
  cloneGeogCS(): SpatialReference

  /**
 * Get the authority name for a node. The most common authority is "EPSG".
 *
 * @method getAuthorityName
 * @instance
 * @memberof SpatialReference
 * @param {string|null} [target_key] The partial or complete path to the node to get an authority from. ie. `"PROJCS"`, `"GEOGCS"`, "`GEOGCS|UNIT"` or `null` to search for an authority node on the root element.
 * @return {string}
 */
  getAuthorityName(target_key?: string|null): string

  /**
 * Get the authority code for a node.
 *
 * @method getAuthorityCode
 * @instance
 * @memberof SpatialReference
 * @param {string|null} [target_key] The partial or complete path to the node to get an authority from. ie. `"PROJCS"`, `"GEOGCS"`, "`GEOGCS|UNIT"` or `null` to search for an authority node on the root element.
 * @return {string}
 */
  getAuthorityCode(target_key?: string|null): string

  /**
 * Convert this SRS into WKT format.
 *
 * @throws Error
 * @method toWKT
 * @instance
 * @memberof SpatialReference
 * @return {string}
 */
  toWKT(): string

  /**
 * Convert this SRS into a a nicely formatted WKT string for display to a
 * person.
 *
 * @throws Error
 * @method toPrettyWKT
 * @instance
 * @memberof SpatialReference
 * @param {boolean} [simplify=false]
 * @return {string}
 */
  toPrettyWKT(simplify?: boolean): string

  /**
 * Export coordinate system in PROJ.4 format.
 *
 * @throws Error
 * @method toProj4
 * @instance
 * @memberof SpatialReference
 * @return {string}
 */
  toProj4(): string

  /**
 * Export coordinate system in XML format.
 *
 * @throws Error
 * @method toXML
 * @instance
 * @memberof SpatialReference
 * @return {string}
 */
  toXML(): string

  /**
 * Fetch indicated attribute of named node.
 *
 * @method getAttrValue
 * @instance
 * @memberof SpatialReference
 * @param {string} node_name
 * @param {number} [attr_index=0]
 * @return {string}
 */
  getAttrValue(node_name: string, attr_index?: number): string

  /**
 * Creates a spatial reference from a WKT string.
 *
 * @static
 * @throws Error
 * @method fromWKT
 * @instance
 * @memberof SpatialReference
 * @param {string} wkt
 * @return {SpatialReference}
 */
  static fromWKT(wkt: string): SpatialReference

  /**
 * Creates a spatial reference from a Proj.4 string.
 *
 * @static
 * @throws Error
 * @method fromProj4
 * @instance
 * @memberof SpatialReference
 * @param {string} input
 * @return {SpatialReference}
 */
  static fromProj4(input: string): SpatialReference

  /**
 * Creates a spatial reference from a WMSAUTO string.
 *
 * Note that the WMS 1.3 specification does not include the units code, while
 * apparently earlier specs do. GDAL tries to guess around this.
 *
 * @example
 *
 * var wms = 'AUTO:42001,99,8888';
 * var ref = gdal.SpatialReference.fromWMSAUTO(wms);
 *
 * @static
 * @throws Error
 * @method fromWMSAUTO
 * @instance
 * @memberof SpatialReference
 * @param {string} input
 * @return {SpatialReference}
 */
  static fromWMSAUTO(input: string): SpatialReference

  /**
 * Import coordinate system from XML format (GML only currently).
 *
 * @static
 * @throws Error
 * @method fromXML
 * @instance
 * @memberof SpatialReference
 * @param {string} input
 * @return {SpatialReference}
 */
  static fromXML(input: string): SpatialReference

  /**
 * Initialize from OGC URN.
 *
 * The OGC URN should be prefixed with "urn:ogc:def:crs:" per recommendation
 * paper 06-023r1. Currently EPSG and OGC authority values are supported,
 * including OGC auto codes, but not including CRS1 or CRS88 (NAVD88).
 *
 * @static
 * @throws Error
 * @method fromURN
 * @instance
 * @memberof SpatialReference
 * @param {string} input
 * @return {SpatialReference}
 */
  static fromURN(input: string): SpatialReference

  /**
 * Initialize from OGC URL.
 *
 * The OGC URL should be prefixed with "http://opengis.net/def/crs" per best
 * practice paper 11-135. Currently EPSG and OGC authority values are supported,
 * including OGC auto codes, but not including CRS1 or CRS88 (NAVD88).
 *
 * @static
 * @throws Error
 * @method fromCRSURL
 * @instance
 * @memberof SpatialReference
 * @param {string} input
 * @return {SpatialReference}
 */
  static fromCRSURL(input: string): SpatialReference

  /**
 * Initialize from OGC URL.
 * {{{async}}}
 *
 * The OGC URL should be prefixed with "http://opengis.net/def/crs" per best
 * practice paper 11-135. Currently EPSG and OGC authority values are supported,
 * including OGC auto codes, but not including CRS1 or CRS88 (NAVD88).
 *
 * @static
 * @throws Error
 * @method fromCRSURLAsync
 * @instance
 * @memberof SpatialReference
 * @param {string} input
 * @param {callback<SpatialReference>} [callback=undefined] {{{cb}}}
 * @return {Promise<SpatialReference>}
 */
  static fromCRSURLAsync(input: string, callback?: callback<SpatialReference>): Promise<SpatialReference>

  /**
 * Initialize spatial reference from a URL.
 *
 * This method will download the spatial reference from the given URL.
 *
 * @static
 * @throws Error
 * @method fromURL
 * @instance
 * @memberof SpatialReference
 * @param {string} url
 * @return {SpatialReference}
 */
  static fromURL(url: string): SpatialReference

  /**
 * Initialize spatial reference from a URL.
 * {{async}}
 *
 * This method will download the spatial reference from the given URL.
 *
 * @static
 * @throws Error
 * @method fromURLAsync
 * @instance
 * @memberof SpatialReference
 * @param {string} url
 * @param {callback<SpatialReference>} [callback=undefined] {{{cb}}}
 * @return {Promise<SpatialReference>}
 */
  static fromURLAsync(url: string, callback?: callback<SpatialReference>): Promise<SpatialReference>

  /**
 * Initialize from a Mapinfo style CoordSys definition.
 *
 * @static
 * @throws Error
 * @method fromMICoordSys
 * @instance
 * @memberof SpatialReference
 * @param {string} input
 * @return {SpatialReference}
 */
  static fromMICoordSys(input: string): SpatialReference

  /**
 * Initialize from an arbitrary spatial reference string.
 *
 * This method will examine the provided input, and try to deduce the format,
 * and then use it to initialize the spatial reference system.
 *
 * @static
 * @throws Error
 * @method fromUserInput
 * @instance
 * @memberof SpatialReference
 * @param {string} input
 * @return {SpatialReference}
 */
  static fromUserInput(input: string): SpatialReference

  /**
 * Initialize from an arbitrary spatial reference string.
 *
 * This method will examine the provided input, and try to deduce the format,
 * and then use it to initialize the spatial reference system.
 * {{{async}}}
 *
 * @static
 * @throws Error
 * @method fromUserInputAsync
 * @instance
 * @memberof SpatialReference
 * @param {string} input
 * @param {callback<SpatialReference>} [callback=undefined] {{{cb}}}
 * @return {Promise<SpatialReference>}
 */
  static fromUserInputAsync(input: string, callback?: callback<SpatialReference>): Promise<SpatialReference>

  /**
 * Initialize from EPSG GCS or PCS code.
 *
 * @example
 *
 * var ref = gdal.SpatialReference.fromEPSGA(4326);
 *
 * @static
 * @throws Error
 * @method fromEPSG
 * @instance
 * @memberof SpatialReference
 * @param {number} input
 * @return {SpatialReference}
 */
  static fromEPSG(input: number): SpatialReference

  /**
 * Initialize from EPSG GCS or PCS code.
 *
 * This method is similar to `fromEPSG()` except that EPSG preferred axis
 * ordering *will* be applied for geographic and projected coordinate systems.
 * EPSG normally defines geographic coordinate systems to use lat/long, and also
 * there are also a few projected coordinate systems that use northing/easting
 * order contrary to typical GIS use).
 *
 * @example
 *
 * var ref = gdal.SpatialReference.fromEPSGA(26910);
 *
 * @static
 * @throws Error
 * @method fromEPSGA
 * @instance
 * @memberof SpatialReference
 * @param {number} input
 * @return {SpatialReference}
 */
  static fromEPSGA(input: number): SpatialReference

  /**
 * Import coordinate system from ESRI .prj format(s).
 *
 * This function will read the text loaded from an ESRI .prj file, and translate
 * it into an OGRSpatialReference definition. This should support many (but by
 * no means all) old style (Arc/Info 7.x) .prj files, as well as the newer
 * pseudo-OGC WKT .prj files. Note that new style .prj files are in OGC WKT
 * format, but require some manipulation to correct datum names, and units on
 * some projection parameters. This is addressed within importFromESRI() by an
 * automatical call to morphFromESRI().
 *
 * Currently only GEOGRAPHIC, UTM, STATEPLANE, GREATBRITIAN_GRID, ALBERS,
 * EQUIDISTANT_CONIC, TRANSVERSE (mercator), POLAR, MERCATOR and POLYCONIC
 * projections are supported from old style files.
 *
 * @static
 * @throws Error
 * @method fromESRI
 * @instance
 * @memberof SpatialReference
 * @param {object|string[]} input
 * @return {SpatialReference}
 */
  static fromESRI(input: object|string[]): SpatialReference

  /**
 * Fetch linear geographic coordinate system units.
 *
 * @method getLinearUnits
 * @instance
 * @memberof SpatialReference
 * @return {units} An object containing `value` and `unit` properties.
 */
  getLinearUnits(): units

  /**
 * Fetch angular geographic coordinate system units.
 *
 * @method getAngularUnits
 * @instance
 * @memberof SpatialReference
 * @return {units} An object containing `value` and `unit` properties.
 */
  getAngularUnits(): units

  /**
 * Validate SRS tokens.
 *
 * This method attempts to verify that the spatial reference system is well
 * formed, and consists of known tokens. The validation is not comprehensive.
 *
 * @method validate
 * @instance
 * @memberof SpatialReference
 * @return {string|null} `"corrupt"`, '"unsupported"', `null` (if fine)
 */
  validate(): string|null
}

export class config {

  constructor()

  /**
 * Gets a GDAL configuration setting.
 *
 * @example
 *
 * data_path = gdal.config.get('GDAL_DATA');
 *
 * @static
 * @method get
 * @memberof config
 * @param {string} key
 * @return {string|null}
 */
  static get(key: string): string|null

  /**
 * Sets a GDAL configuration setting.
 *
 * @example
 *
 * gdal.config.set('GDAL_DATA', data_path);
 *
 * @static
 * @method set
 * @memberof config
 * @param {string} key
 * @param {string|null} value
 * @return {void}
 */
  static set(key: string, value: string|null): void
}

export class fs {

  constructor()

  /**
 * Get VSI file info.
 *
 * @example
 *
 * const gdalStats = gdal.fs.stat('/vsis3/noaa-gfs-bdp-pds/gfs.20210918/06/atmos/gfs.t06z.pgrb2.0p25.f010')
 * if ((gdalStats.mode & fs.constants.S_IFREG) === fs.constants.S_IFREG) console.log('is regular file')
 *
 * // convert to Node.js fs.Stats
 * const fsStats = new (Function.prototype.bind.apply(fs.Stats, [null, ...Object.keys(s).map(k => s[k])]))
 * if (fsStats.isFile) console.log('is regular file')
 *
 * @static
 * @method stat
 * @memberof fs
 * @param {string} filename
 * @param {boolean} [bigint=false] Return BigInt numbers. JavaScript numbers are safe for integers up to 2^53.
 * @throws Error
 * @returns {VSIStat}
 */
  static stat(filename: string, bigint?: boolean): VSIStat

  /**
 * Get VSI file info.
 *
 * @static
 * @method stat
 * @memberof fs
 * @param {string} filename
 * @param {true} True Return BigInt numbers. JavaScript numbers are safe for integers up to 2^53.
 * @throws Error
 * @returns {VSIStat64}
 */
  static stat(filename: string, True: true): VSIStat64

  /**
 * Get VSI file info.
 * {{{async}}}
 *
 * @static
 * @method statAsync
 * @memberof fs
 * @param {string} filename
 * @param {boolean} [bigint=false] Return BigInt numbers. JavaScript numbers are safe for integers up to 2^53.
 * @throws Error
 * @param {callback<VSIStat>} [callback=undefined] {{{cb}}}
 * @returns {Promise<VSIStat>}
 */
  static statAsync(filename: string, bigint?: boolean, callback?: callback<VSIStat>): Promise<VSIStat>

  /**
 * Get VSI file info.
 * {{{async}}}
 *
 * @static
 * @method statAsync
 * @memberof fs
 * @param {string} filename
 * @param {true} True Return BigInt numbers. JavaScript numbers are safe for integers up to 2^53.
 * @throws Error
 * @param {callback<VSIStat>} [callback=undefined] {{{cb}}}
 * @returns {Promise<VSIStat>}
 */
  static statAsync(filename: string, True: true, callback?: callback<VSIStat>): Promise<VSIStat>

  /**
 * Read file names in a directory.
 *
 * @static
 * @method readDir
 * @memberof fs
 * @param {string} directory
 * @throws Error
 * @returns {string[]}
 */
  static readDir(directory: string): string[]

  /**
 * Read file names in a directory.
 * {{{async_}}}
 *
 * @static
 * @method readDirAsync
 * @memberof fs
 * @param {string} directory
 * @throws Error
 * @param {callback<string[]>} [callback=undefined] {{{cb}}}
 * @returns {Promise<string[]>}
 */
  static readDirAsync(directory: string, callback?: callback<string[]>): Promise<string[]>
}

export class vsimem {

  constructor()

  /**
 * Create an in-memory `/vsimem/` file from a `Buffer`.
 * This is a zero-copy operation - GDAL will read from the Buffer which will be
 * protected by the GC even if it goes out of scope.
 *
 * The file will stay in memory until it is deleted with `gdal.vsimem.release`.
 *
 * The file will be in read-write mode, but GDAL won't
 * be able to extend it as the allocated memory will be tied to the `Buffer` object.
 * Use `gdal.vsimem.copy` to create an extendable copy.
 *
 * @static
 * @method set
 * @instance
 * @memberof vsimem
 * @throws Error
 * @param {Buffer} data A binary buffer containing the file data
 * @param {string} filename A file name beginning with `/vsimem/`
 */
  static set(data: Buffer, filename: string): void

  /**
 * Create an in-memory `/vsimem/` file copying a `Buffer`.
 * This method copies the `Buffer` into GDAL's own memory heap
 * creating an in-memory file that can be freely extended by GDAL.
 * `gdal.vsimem.set` is the better choice unless the file needs to be extended.
 *
 * The file will stay in memory until it is deleted with `gdal.vsimem.release`.
 *
 * @static
 * @method copy
 * @instance
 * @memberof vsimem
 * @throws Error
 * @param {Buffer} data A binary buffer containing the file data
 * @param {string} filename A file name beginning with `/vsimem/`
 */
  static copy(data: Buffer, filename: string): void

  /**
 * Delete and retrieve the contents of an in-memory `/vsimem/` file.
 * This is a very fast zero-copy operation.
 * It does not block the event loop.
 * If the file was created by `vsimem.set`, it will return a reference
 * to the same `Buffer` that was used to create it.
 * Otherwise it will construct a new `Buffer` object with the GDAL
 * allocated buffer as its backing store.
 *
 * ***WARNING***!
 *
 * The file must not be open or random memory corruption is possible with GDAL <= 3.3.1.
 * GDAL >= 3.3.2 will gracefully fail further operations and this function will always be safe.
 *
 * @static
 * @method release
 * @instance
 * @memberof vsimem
 * @param {string} filename A file name beginning with `/vsimem/`
 * @throws Error
 * @return {Buffer} A binary buffer containing all the data
 */
  static release(filename: string): Buffer
}

