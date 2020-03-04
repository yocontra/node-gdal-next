{
	"includes": [
		"../common.gypi"
	],
	"targets": [
		{
			"target_name": "libgdal_e00grid_frmt",
			"type": "static_library",
			"sources": [
				"../gdal/frmts/e00grid/e00read.c",
				"../gdal/frmts/e00grid/e00griddataset.cpp"
			],
			"include_dirs": [
				"../gdal/frmts/e00grid"
			]
		}
	]
}
