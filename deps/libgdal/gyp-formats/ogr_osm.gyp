{
	"includes": [
		"../common.gypi"
	],
	"targets": [
		{
			"target_name": "libgdal_ogr_osm_frmt",
			"type": "static_library",
			"sources": [
				"../gdal/ogr/ogrsf_frmts/osm/ogrosmdriver.cpp",
				"../gdal/ogr/ogrsf_frmts/osm/ogrosmdatasource.cpp",
				"../gdal/ogr/ogrsf_frmts/osm/osm_parser.cpp",
				"../gdal/ogr/ogrsf_frmts/osm/ogrosmlayer.cpp"
			],
			"include_dirs": [
				"../gdal/ogr/ogrsf_frmts/sqlite",
				"../gdal/ogr/ogrsf_frmts/osm"
			]
		}
	]
}
