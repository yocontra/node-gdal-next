{
	"includes": [
		"../common.gypi"
	],
	"targets": [
		{
			"target_name": "libgdal_r_frmt",
			"type": "static_library",
			"sources": [
				"../gdal/frmts/r/rdataset.cpp",
				"../gdal/frmts/r/rcreatecopy.cpp"
			],
			"include_dirs": [
				"../gdal/frmts/r"
			]
		}
	]
}
