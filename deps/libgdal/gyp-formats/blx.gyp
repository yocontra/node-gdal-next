{
	"includes": [
		"../common.gypi"
	],
	"targets": [
		{
			"target_name": "libgdal_blx_frmt",
			"type": "static_library",
			"sources": [
				"../gdal/frmts/blx/blxdataset.cpp",
				"../gdal/frmts/blx/blx.c"
			],
			"include_dirs": [
				"../gdal/frmts/blx"
			]
		}
	]
}
