{
	"includes": [
		"../../common.gypi"
	],
	"targets": [
		{
			"target_name": "libhdf5",
			"type": "static_library",
			"sources": [
				'<!@(python ../glob-files.py "hdf5/src/*.c")'
			],
			"include_dirs": [
				"./hdf5/src"
			],
			"defines": [
			],
			"conditions": [
				["OS == 'win'", {
					"defines": [
					]
				}],
				["OS == 'linux'", {
					"defines": [
						"_GNU_SOURCE=1"
					],
					"sources": [
						"settings-linux.c",
						"numeric-types-linux.c"
					]
				}],
				["OS == 'mac'", {
					"defines": [
					]
				}]
			],
			"direct_dependent_settings": {
				"include_dirs": [
					"./hdf5/src"
				]
			}
		}
	]
}
