{
	"includes": [
		"../common.gypi"
	],
	"targets": [
		{
			"target_name": "libgdal_fit_frmt",
			"type": "static_library",
			"sources": [
				"../gdal/frmts/fit/fitdataset.cpp",
				"../gdal/frmts/fit/fit.cpp"
			],
			"include_dirs": [
				"../gdal/frmts/fit"
			]
		}
	]
}
