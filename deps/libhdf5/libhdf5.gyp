{
	"includes": [
		"../../common.gypi"
	],
	"targets": [
		{
			"target_name": "libhdf5",
			"type": "static_library",
			"sources": [
				"hdf5/src/H5.c",
				"hdf5/src/H5checksum.c",
				"hdf5/src/H5dbg.c",
				"hdf5/src/H5system.c",
				"hdf5/src/H5timer.c",
				"hdf5/src/H5trace.c",
				"hdf5/src/H5A.c",
				"hdf5/src/H5Abtree2.c",
				"hdf5/src/H5Adense.c",
				"hdf5/src/H5Adeprec.c",
				"hdf5/src/H5Aint.c",
				"hdf5/src/H5Atest.c",
				"hdf5/src/H5AC.c",
				"hdf5/src/H5ACdbg.c",
				"hdf5/src/H5ACproxy_entry.c",
				"hdf5/src/H5B.c",
				"hdf5/src/H5Bcache.c",
				"hdf5/src/H5Bdbg.c",
				"hdf5/src/H5B2.c",
				"hdf5/src/H5B2cache.c",
				"hdf5/src/H5B2dbg.c",
				"hdf5/src/H5B2hdr.c",
				"hdf5/src/H5B2int.c",
				"hdf5/src/H5B2internal.c",
				"hdf5/src/H5B2leaf.c",
				"hdf5/src/H5B2stat.c",
				"hdf5/src/H5B2test.c",
				"hdf5/src/H5C.c",
				"hdf5/src/H5Cdbg.c",
				"hdf5/src/H5Cepoch.c",
				"hdf5/src/H5Cimage.c",
				"hdf5/src/H5Clog.c",
				"hdf5/src/H5Clog_json.c",
				"hdf5/src/H5Clog_trace.c",
				"hdf5/src/H5Cprefetched.c",
				"hdf5/src/H5Cquery.c",
				"hdf5/src/H5Ctag.c",
				"hdf5/src/H5Ctest.c",
				"hdf5/src/H5CS.c",
				"hdf5/src/H5CX.c",
				"hdf5/src/H5D.c",
				"hdf5/src/H5Dbtree.c",
				"hdf5/src/H5Dbtree2.c",
				"hdf5/src/H5Dchunk.c",
				"hdf5/src/H5Dcompact.c",
				"hdf5/src/H5Dcontig.c",
				"hdf5/src/H5Ddbg.c",
				"hdf5/src/H5Ddeprec.c",
				"hdf5/src/H5Dearray.c",
				"hdf5/src/H5Defl.c",
				"hdf5/src/H5Dfarray.c",
				"hdf5/src/H5Dfill.c",
				"hdf5/src/H5Dint.c",
				"hdf5/src/H5Dio.c",
				"hdf5/src/H5Dlayout.c",
				"hdf5/src/H5Dnone.c",
				"hdf5/src/H5Doh.c",
				"hdf5/src/H5Dscatgath.c",
				"hdf5/src/H5Dselect.c",
				"hdf5/src/H5Dsingle.c",
				"hdf5/src/H5Dtest.c",
				"hdf5/src/H5Dvirtual.c",
				"hdf5/src/H5E.c",
				"hdf5/src/H5Edeprec.c",
				"hdf5/src/H5Eint.c",
				"hdf5/src/H5EA.c",
				"hdf5/src/H5EAcache.c",
				"hdf5/src/H5EAdbg.c",
				"hdf5/src/H5EAdblkpage.c",
				"hdf5/src/H5EAdblock.c",
				"hdf5/src/H5EAhdr.c",
				"hdf5/src/H5EAiblock.c",
				"hdf5/src/H5EAint.c",
				"hdf5/src/H5EAsblock.c",
				"hdf5/src/H5EAstat.c",
				"hdf5/src/H5EAtest.c",
				"hdf5/src/H5F.c",
				"hdf5/src/H5Faccum.c",
				"hdf5/src/H5Fcwfs.c",
				"hdf5/src/H5Fdbg.c",
				"hdf5/src/H5Fdeprec.c",
				"hdf5/src/H5Fefc.c",
				"hdf5/src/H5Ffake.c",
				"hdf5/src/H5Fint.c",
				"hdf5/src/H5Fio.c",
				"hdf5/src/H5Fmount.c",
				"hdf5/src/H5Fquery.c",
				"hdf5/src/H5Fsfile.c",
				"hdf5/src/H5Fspace.c",
				"hdf5/src/H5Fsuper.c",
				"hdf5/src/H5Fsuper_cache.c",
				"hdf5/src/H5Ftest.c",
				"hdf5/src/H5FA.c",
				"hdf5/src/H5FAcache.c",
				"hdf5/src/H5FAdbg.c",
				"hdf5/src/H5FAdblock.c",
				"hdf5/src/H5FAdblkpage.c",
				"hdf5/src/H5FAhdr.c",
				"hdf5/src/H5FAint.c",
				"hdf5/src/H5FAstat.c",
				"hdf5/src/H5FAtest.c",
				"hdf5/src/H5FD.c",
				"hdf5/src/H5FDcore.c",
				"hdf5/src/H5FDfamily.c",
				"hdf5/src/H5FDhdfs.c",
				"hdf5/src/H5FDint.c",
				"hdf5/src/H5FDlog.c",
				"hdf5/src/H5FDmulti.c",
				"hdf5/src/H5FDsec2.c",
				"hdf5/src/H5FDspace.c",
				"hdf5/src/H5FDstdio.c",
				"hdf5/src/H5FDtest.c",
				"hdf5/src/H5FL.c",
				"hdf5/src/H5FO.c",
				"hdf5/src/H5FS.c",
				"hdf5/src/H5FScache.c",
				"hdf5/src/H5FSdbg.c",
				"hdf5/src/H5FSint.c",
				"hdf5/src/H5FSsection.c",
				"hdf5/src/H5FSstat.c",
				"hdf5/src/H5FStest.c",
				"hdf5/src/H5G.c",
				"hdf5/src/H5Gbtree2.c",
				"hdf5/src/H5Gcache.c",
				"hdf5/src/H5Gcompact.c",
				"hdf5/src/H5Gdense.c",
				"hdf5/src/H5Gdeprec.c",
				"hdf5/src/H5Gent.c",
				"hdf5/src/H5Gint.c",
				"hdf5/src/H5Glink.c",
				"hdf5/src/H5Gloc.c",
				"hdf5/src/H5Gname.c",
				"hdf5/src/H5Gnode.c",
				"hdf5/src/H5Gobj.c",
				"hdf5/src/H5Goh.c",
				"hdf5/src/H5Groot.c",
				"hdf5/src/H5Gstab.c",
				"hdf5/src/H5Gtest.c",
				"hdf5/src/H5Gtraverse.c",
				"hdf5/src/H5HF.c",
				"hdf5/src/H5HFbtree2.c",
				"hdf5/src/H5HFcache.c",
				"hdf5/src/H5HFdbg.c",
				"hdf5/src/H5HFdblock.c",
				"hdf5/src/H5HFdtable.c",
				"hdf5/src/H5HFhdr.c",
				"hdf5/src/H5HFhuge.c",
				"hdf5/src/H5HFiblock.c",
				"hdf5/src/H5HFiter.c",
				"hdf5/src/H5HFman.c",
				"hdf5/src/H5HFsection.c",
				"hdf5/src/H5HFspace.c",
				"hdf5/src/H5HFstat.c",
				"hdf5/src/H5HFtest.c",
				"hdf5/src/H5HFtiny.c",
				"hdf5/src/H5HG.c",
				"hdf5/src/H5HGcache.c",
				"hdf5/src/H5HGdbg.c",
				"hdf5/src/H5HGquery.c",
				"hdf5/src/H5HL.c",
				"hdf5/src/H5HLcache.c",
				"hdf5/src/H5HLdbg.c",
				"hdf5/src/H5HLint.c",
				"hdf5/src/H5HLprfx.c",
				"hdf5/src/H5HLdblk.c",
				"hdf5/src/H5I.c",
				"hdf5/src/H5Iint.c",
				"hdf5/src/H5Itest.c",
				"hdf5/src/H5L.c",
				"hdf5/src/H5Ldeprec.c",
				"hdf5/src/H5Lexternal.c",
				"hdf5/src/H5M.c",
				"hdf5/src/H5MF.c",
				"hdf5/src/H5MFaggr.c",
				"hdf5/src/H5MFdbg.c",
				"hdf5/src/H5MFsection.c",
				"hdf5/src/H5MM.c",
				"hdf5/src/H5O.c",
				"hdf5/src/H5Odeprec.c",
				"hdf5/src/H5Oainfo.c",
				"hdf5/src/H5Oalloc.c",
				"hdf5/src/H5Oattr.c",
				"hdf5/src/H5Oattribute.c",
				"hdf5/src/H5Obogus.c",
				"hdf5/src/H5Obtreek.c",
				"hdf5/src/H5Ocache.c",
				"hdf5/src/H5Ocache_image.c",
				"hdf5/src/H5Ochunk.c",
				"hdf5/src/H5Ocont.c",
				"hdf5/src/H5Ocopy.c",
				"hdf5/src/H5Ocopy_ref.c",
				"hdf5/src/H5Odbg.c",
				"hdf5/src/H5Odrvinfo.c",
				"hdf5/src/H5Odtype.c",
				"hdf5/src/H5Oefl.c",
				"hdf5/src/H5Ofill.c",
				"hdf5/src/H5Oflush.c",
				"hdf5/src/H5Ofsinfo.c",
				"hdf5/src/H5Oginfo.c",
				"hdf5/src/H5Oint.c",
				"hdf5/src/H5Olayout.c",
				"hdf5/src/H5Olinfo.c",
				"hdf5/src/H5Olink.c",
				"hdf5/src/H5Omessage.c",
				"hdf5/src/H5Omtime.c",
				"hdf5/src/H5Oname.c",
				"hdf5/src/H5Onull.c",
				"hdf5/src/H5Opline.c",
				"hdf5/src/H5Orefcount.c",
				"hdf5/src/H5Osdspace.c",
				"hdf5/src/H5Oshared.c",
				"hdf5/src/H5Oshmesg.c",
				"hdf5/src/H5Ostab.c",
				"hdf5/src/H5Otest.c",
				"hdf5/src/H5Ounknown.c",
				"hdf5/src/H5P.c",
				"hdf5/src/H5Pacpl.c",
				"hdf5/src/H5Pdapl.c",
				"hdf5/src/H5Pdcpl.c",
				"hdf5/src/H5Pdeprec.c",
				"hdf5/src/H5Pdxpl.c",
				"hdf5/src/H5Pencdec.c",
				"hdf5/src/H5Pfapl.c",
				"hdf5/src/H5Pfcpl.c",
				"hdf5/src/H5Pfmpl.c",
				"hdf5/src/H5Pgcpl.c",
				"hdf5/src/H5Pint.c",
				"hdf5/src/H5Plapl.c",
				"hdf5/src/H5Plcpl.c",
				"hdf5/src/H5Pmapl.c",
				"hdf5/src/H5Pmcpl.c",
				"hdf5/src/H5Pocpl.c",
				"hdf5/src/H5Pocpypl.c",
				"hdf5/src/H5Pstrcpl.c",
				"hdf5/src/H5Ptest.c",
				"hdf5/src/H5PB.c",
				"hdf5/src/H5PL.c",
				"hdf5/src/H5PLint.c",
				"hdf5/src/H5PLpath.c",
				"hdf5/src/H5PLplugin_cache.c",
				"hdf5/src/H5R.c",
				"hdf5/src/H5Rdeprec.c",
				"hdf5/src/H5Rint.c",
				"hdf5/src/H5UC.c",
				"hdf5/src/H5RS.c",
				"hdf5/src/H5S.c",
				"hdf5/src/H5Sall.c",
				"hdf5/src/H5Sdbg.c",
				"hdf5/src/H5Sdeprec.c",
				"hdf5/src/H5Shyper.c",
				"hdf5/src/H5Snone.c",
				"hdf5/src/H5Spoint.c",
				"hdf5/src/H5Sselect.c",
				"hdf5/src/H5Stest.c",
				"hdf5/src/H5SL.c",
				"hdf5/src/H5SM.c",
				"hdf5/src/H5SMbtree2.c",
				"hdf5/src/H5SMcache.c",
				"hdf5/src/H5SMmessage.c",
				"hdf5/src/H5SMtest.c",
				"hdf5/src/H5I.c",
				"hdf5/src/H5T.c",
				"hdf5/src/H5Tarray.c",
				"hdf5/src/H5Tbit.c",
				"hdf5/src/H5Tcommit.c",
				"hdf5/src/H5Tcompound.c",
				"hdf5/src/H5Tconv.c",
				"hdf5/src/H5Tcset.c",
				"hdf5/src/H5Tdbg.c",
				"hdf5/src/H5Tdeprec.c",
				"hdf5/src/H5Tenum.c",
				"hdf5/src/H5Tfields.c",
				"hdf5/src/H5Tfixed.c",
				"hdf5/src/H5Tfloat.c",
				"hdf5/src/H5Tnative.c",
				"hdf5/src/H5Toffset.c",
				"hdf5/src/H5Toh.c",
				"hdf5/src/H5Topaque.c",
				"hdf5/src/H5Torder.c",
				"hdf5/src/H5Tref.c",
				"hdf5/src/H5Tpad.c",
				"hdf5/src/H5Tprecis.c",
				"hdf5/src/H5Tstrpad.c",
				"hdf5/src/H5Tvisit.c",
				"hdf5/src/H5Tvlen.c",
				"hdf5/src/H5TS.c",
				"hdf5/src/H5VL.c",
				"hdf5/src/H5VLcallback.c",
				"hdf5/src/H5VLint.c",
				"hdf5/src/H5VLnative.c",
				"hdf5/src/H5VLnative_attr.c",
				"hdf5/src/H5VLnative_blob.c",
				"hdf5/src/H5VLnative_dataset.c",
				"hdf5/src/H5VLnative_datatype.c",
				"hdf5/src/H5VLnative_file.c",
				"hdf5/src/H5VLnative_group.c",
				"hdf5/src/H5VLnative_link.c",
				"hdf5/src/H5VLnative_introspect.c",
				"hdf5/src/H5VLnative_object.c",
				"hdf5/src/H5VLnative_token.c",
				"hdf5/src/H5VLpassthru.c",
				"hdf5/src/H5VM.c",
				"hdf5/src/H5WB.c",
				"hdf5/src/H5Z.c",
				"hdf5/src/H5Zdeflate.c",
				"hdf5/src/H5Zfletcher32.c",
				"hdf5/src/H5Znbit.c",
				"hdf5/src/H5Zshuffle.c",
				"hdf5/src/H5Zscaleoffset.c",
				"hdf5/src/H5Zszip.c",
				"hdf5/src/H5Ztrans.c",
				"hdf5/src/H5mpi.c",
				"hdf5/src/H5ACmpio.c",
				"hdf5/src/H5Cmpio.c",
				"hdf5/src/H5Dmpio.c",
				"hdf5/src/H5Fmpi.c",
				"hdf5/src/H5FDmpi.c",
				"hdf5/src/H5FDmpio.c",
				"hdf5/src/H5Smpio.c",
				"hdf5/src/H5FDdirect.c",
				"hdf5/src/H5FDros3.c",
				"hdf5/src/H5FDs3comms.c",
				"hdf5/hl/src/H5DO.c",
				"hdf5/hl/src/H5DS.c",
				"hdf5/hl/src/H5IM.c",
				"hdf5/hl/src/H5LT.c",
				"hdf5/hl/src/H5LTanalyze.c",
				"hdf5/hl/src/H5LTparse.c",
				"hdf5/hl/src/H5PT.c",
				"hdf5/hl/src/H5TB.c",
				"hdf5/hl/src/H5LD.c",
        "hdf5/src/H5ESint.c",
        "hdf5/src/H5ESevent.c",
        "hdf5/src/H5ESlist.c",
        "hdf5/src/H5Lint.c",
        "hdf5/src/H5FDsplitter.c",
        "hdf5/src/H5Cint.c",
        "hdf5/src/H5Centry.c",
        "hdf5/src/H5VLdyn_ops.c",
        "hdf5/src/H5Tinit_float.c",
        "hdf5/src/H5FDperform.c"
			],
			"include_dirs": [
				"./hdf5/src",
        "./hdf5/src/H5FDsubfiling"
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
						"windows-H5build_settings.c"
					]
				}],
				["OS == 'linux'", {
					"defines": [
						"_GNU_SOURCE=1"
					],
					"sources": [
						"linux-H5build_settings.c"
					]
				}],
				["OS == 'mac'", {
					"defines": [
						"DARWIN"
					],
					"sources": [
						"darwin-H5build_settings.c"
					]
				}]
			],
			"direct_dependent_settings": {
				"include_dirs": [
					"./hdf5/src",
					"./hdf5/hl/src",
          "./hdf5/src/H5FDsubfiling"
				]
			}
		}
	]
}
