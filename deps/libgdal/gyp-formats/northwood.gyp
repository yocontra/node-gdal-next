{
	"includes": [
		"../common.gypi"
	],
	"targets": [
		{
			"target_name": "libgdal_northwood_frmt",
			"type": "static_library",
			"sources": [
				"../gdal/frmts/northwood/northwood.cpp",
				"../gdal/frmts/northwood/grcdataset.cpp",
				"../gdal/frmts/northwood/grddataset.cpp"
			],
			"include_dirs": [
				"../gdal/frmts/northwood"
			]
		}
	]
}
