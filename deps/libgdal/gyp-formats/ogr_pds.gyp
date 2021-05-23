{
	"includes": [
		"../common.gypi"
	],
	"targets": [
		{
			"target_name": "libgdal_ogr_pds_frmt",
			"type": "static_library",
			"sources": [
				"../gdal/ogr/ogrsf_frmts/pds/ogrpdslayer.cpp",
				"../gdal/ogr/ogrsf_frmts/pds/ogrpdsdatasource.cpp",
				"../gdal/ogr/ogrsf_frmts/pds/ogrpdsdriver.cpp"
			],
			"include_dirs": [
				"../gdal/ogr/ogrsf_frmts/pds",
				"../gdal/frmts/pds"
			]
		}
	]
}
