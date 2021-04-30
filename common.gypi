{
	"variables": {
		"deps_dir": "./deps"
	},
	"target_defaults": {
		"default_configuration": "Release",
		"cflags_cc!": ["-fno-rtti", "-fno-exceptions"],
		"cflags!": ["-fno-rtti", "-fno-exceptions"],
		"variables": {
			"debug_extra_ccflags_cc%": "",
			"debug_extra_ldflags%" : "",
		},
		"defines": [
			"NOGDI=1",
			"HAVE_LIBZ"
		],
		"xcode_settings": {
			"GCC_ENABLE_CPP_EXCEPTIONS": "YES",
      "CLANG_CXX_LIBRARY": "libc++",
      "MACOSX_DEPLOYMENT_TARGET": "10.7",
			"OTHER_CFLAGS": [
				"-Wno-deprecated-register",
				"-Wno-unused-const-variable"
			],
			"OTHER_CPLUSPLUSFLAGS": [
				"-Wno-deprecated-register",
				"-Wno-unused-const-variable"
			]
		},
		"conditions": [
			["OS == 'win'", {
				"defines": [ "NOMINMAX", "WIN32" ]
			}]
		],
		"link_settings": {
			"ldflags": [
				"-Wl,-z,now"
			]
		},
		"configurations": {
			"Debug": {
				"cflags_cc!": [ "-O3", "-Os" ],
				"cflags_cc": [ "<@(debug_extra_ccflags_cc)" ],
				"ldflags": [ "<@(debug_extra_ldflags)" ],
				"defines": [ "DEBUG" ],
				"defines!": [ "NDEBUG" ],
				"xcode_settings": {
					"GCC_OPTIMIZATION_LEVEL": "0",
					"GCC_GENERATE_DEBUGGING_SYMBOLS": "YES",
					"GCC_ENABLE_CPP_RTTI": "YES"
				},
				"msvs_settings": {
					"VCCLCompilerTool": {
						"ExceptionHandling": 1,
						"RuntimeTypeInfo": "true"
					}
				}
			},
			"Release": {
				"defines": [ "NDEBUG" ],
				"defines!": [ "DEBUG" ],
				"xcode_settings": {
					"GCC_OPTIMIZATION_LEVEL": "s",
					"GCC_GENERATE_DEBUGGING_SYMBOLS": "NO",
					"DEAD_CODE_STRIPPING": "YES",
					"GCC_INLINES_ARE_PRIVATE_EXTERN": "YES"
				},
				"ldflags": [
					"-Wl,-s"
				],
				"msvs_settings": {
					"VCCLCompilerTool": {
						#"Optimization": 0, # 0:/Od disable, 1:/O1 min size, 2:/O2 max speed, 3:/Ox full optimization
						#"InlineFunctionExpansion": 0, #0:/Ob0: disable, 1:/Ob1 inline only marked funtions, 2:/Ob2 inline anything eligible
						"AdditionalOptions": [
							"/MP", # compile across multiple CPUs
						],
						"ExceptionHandling": 1,
						"RuntimeTypeInfo": "true",
						"DebugInformationFormat": "0",
					},
					"VCLinkerTool": {
						"GenerateDebugInformation": "false",
					}
				}
			}
		}
	}
}
