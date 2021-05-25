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
						"_WINDOWS"
					],
					"defines!": [
						"NOGDI=1"
					],
					"sources": [
						"settings-win.c",
						"numeric-types-win.c"
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
						"DARWIN"
					],
					"sources": [
						"settings-darwin.c",
						"numeric-types-darwin.c"
					]
				}]
			],
			"msvs_settings": {
				"VCCLCompilerTool": {
					"AdditionalOptions": [
						"/W3",
						"/EHsc"
					],
				},
			},
			"direct_dependent_settings": {
				"include_dirs": [
					"./hdf5/src"
				]
			}
		}
	]
}
