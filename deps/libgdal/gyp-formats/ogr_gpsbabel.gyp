{
	"includes": [
		"../common.gypi"
	],
	"targets": [
		{
			"target_name": "libgdal_ogr_gpsbabel_frmt",
			"type": "static_library",
			"sources": [
				"../gdal/ogr/ogrsf_frmts/gpsbabel/ogrgpsbabeldatasource.cpp",
				"../gdal/ogr/ogrsf_frmts/gpsbabel/ogrgpsbabelwritedatasource.cpp",
				"../gdal/ogr/ogrsf_frmts/gpsbabel/ogrgpsbabeldriver.cpp"
			],
			"include_dirs": [
				"../gdal/ogr/ogrsf_frmts/gpsbabel"
			]
		}
	]
}
