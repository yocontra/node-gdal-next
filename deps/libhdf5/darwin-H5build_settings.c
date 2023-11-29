/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Copyright by The HDF Group.                                               *
 * All rights reserved.                                                      *
 *                                                                           *
 * This file is part of HDF5.  The full HDF5 copyright notice, including     *
 * terms governing use, modification, and redistribution, is contained in    *
 * the COPYING file, which can be found at the root of the source code       *
 * distribution tree, or in https://www.hdfgroup.org/licenses.               *
 * If you do not have access to either file, you may request a copy from     *
 * help@hdfgroup.org.                                                        *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

#include "H5private.h"

H5_GCC_DIAG_OFF("larger-than=")
H5_CLANG_DIAG_OFF("overlength-strings")

/* clang-format off */
const char H5build_settings[]=
    "        SUMMARY OF THE HDF5 CONFIGURATION\n"
    "        =================================\n"
    "\n"
    "General Information:\n"
    "-------------------\n"
    "                   HDF5 Version: 1.14.3\n"
    "                  Configured on: Wed Nov 29 16:42:14 CET 2023\n"
    "                  Configured by: mmom@mmom-macbook\n"
    "                    Host system: x86_64-apple-darwin20.6.0\n"
    "              Uname information: Darwin mmom-macbook 20.6.0 Darwin Kernel Version 20.6.0: Thu Jul  6 22:12:47 PDT 2023; root:xnu-7195.141.49.702.12~1/RELEASE_X86_64 x86_64\n"
    "                       Byte sex: little-endian\n"
    "             Installation point: /Users/mmom/src/hdf5-hdf5-1_14_3/hdf5\n"
    "\n"
    "Compiling Options:\n"
    "------------------\n"
    "                     Build Mode: production\n"
    "              Debugging Symbols: no\n"
    "                        Asserts: no\n"
    "                      Profiling: no\n"
    "             Optimization Level: high\n"
    "\n"
    "Linking Options:\n"
    "----------------\n"
    "                      Libraries: static, shared\n"
    "  Statically Linked Executables: \n"
    "                        LDFLAGS: \n"
    "                     H5_LDFLAGS: \n"
    "                     AM_LDFLAGS: \n"
    "                Extra libraries: -lpthread -lsz -lz -ldl -lm \n"
    "                       Archiver: ar\n"
    "                       AR_FLAGS: cr\n"
    "                         Ranlib: ranlib\n"
    "\n"
    "Languages:\n"
    "----------\n"
    "                              C: yes\n"
    "                     C Compiler: /usr/bin/clang ( Apple clang version 13.0.0 )\n"
    "                       CPPFLAGS: \n"
    "                    H5_CPPFLAGS:   -DNDEBUG -UH5_DEBUG_API -I/Users/mmom/src/hdf5-hdf5-1_14_3/src/H5FDsubfiling\n"
    "                    AM_CPPFLAGS: \n"
    "                        C Flags: \n"
    "                     H5 C Flags:  -std=c99  -Wall -Warray-bounds -Wcast-qual -Wconversion -Wdouble-promotion -Wextra -Wformat=2 -Wframe-larger-than=16384 -Wimplicit-fallthrough -Wnull-dereference -Wunused-const-variable -Wwrite-strings -Wpedantic -Wvolatile-register-var -Wno-c++-compat     -Wbad-function-cast -Wimplicit-function-declaration -Wincompatible-pointer-types -Wmissing-declarations -Wpacked -Wshadow -Wswitch -Wno-error=incompatible-pointer-types-discards-qualifiers -Wunused-function -Wunused-variable -Wunused-parameter -Wcast-align -Wformat -Wno-missing-noreturn -O3\n"
    "                     AM C Flags: \n"
    "               Shared C Library: yes\n"
    "               Static C Library: yes\n"
    "\n"
    "\n"
    "                        Fortran: no\n"
    "\n"
    "                            C++: no\n"
    "\n"
    "                           Java: no\n"
    "\n"
    "\n"
    "Features:\n"
    "---------\n"
    "                     Parallel HDF5: no\n"
    "  Parallel Filtered Dataset Writes: no\n"
    "                Large Parallel I/O: no\n"
    "                High-level library: yes\n"
    "Dimension scales w/ new references: no\n"
    "                  Build HDF5 Tests: yes\n"
    "                  Build HDF5 Tools: yes\n"
    "                   Build GIF Tools: no\n"
    "                      Threadsafety: yes\n"
    "               Default API mapping: v114\n"
    "    With deprecated public symbols: yes\n"
    "            I/O filters (external): deflate(zlib),szip(encoder)\n"
    "                     Map (H5M) API: no\n"
    "                        Direct VFD: no\n"
    "                        Mirror VFD: no\n"
    "                     Subfiling VFD: no\n"
    "                (Read-Only) S3 VFD: no\n"
    "              (Read-Only) HDFS VFD: no\n"
    "    Packages w/ extra debug output: none\n"
    "                       API tracing: no\n"
    "              Using memory checker: no\n"
    "            Function stack tracing: no\n"
    "                  Use file locking: best-effort\n"
    "         Strict file format checks: no\n"
    "      Optimization instrumentation: no\n"
;
/* clang-format on */

H5_GCC_DIAG_ON("larger-than=")
H5_CLANG_DIAG_OFF("overlength-strings")
