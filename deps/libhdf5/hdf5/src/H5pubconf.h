#ifndef H5_CONFIG_H_
#define H5_CONFIG_H_

#define H5_PACKAGE "hdf5"
#define H5_PACKAGE_BUGREPORT "help@hdfgroup.org"
#define H5_PACKAGE_NAME "HDF5"
#define H5_PACKAGE_STRING "HDF5 1.12.0"
#define H5_PACKAGE_TARNAME "hdf5"
#define H5_PACKAGE_URL ""
#define H5_PACKAGE_VERSION "1.12.0"

#ifdef LINUX
#define H5_DEFAULT_PLUGINDIR "node_modules/gdal-async/hdf5/lib/plugin"
#define H5_DEV_T_IS_SCALAR 1
#define H5_EXAMPLESDIR ""
#define H5_HAVE_ALARM 1
#define H5_HAVE_ASPRINTF 1
#define H5_HAVE_ATTRIBUTE 1
#define H5_HAVE_C99_DESIGNATED_INITIALIZER 1
#define H5_HAVE_C99_FUNC 1
#define H5_HAVE_CLOCK_GETTIME 1
#define H5_HAVE_DIFFTIME 1
#define H5_HAVE_DIRENT_H 1
#define H5_HAVE_DLFCN_H 1
#define H5_HAVE_EMBEDDED_LIBINFO 1
#define H5_HAVE_FCNTL 1
#define H5_HAVE_FEATURES_H 1
#define H5_HAVE_FILTER_DEFLATE 1
#define H5_HAVE_FLOAT128 1
#define H5_HAVE_FLOCK 1
#define H5_HAVE_FORK 1
#define H5_HAVE_FREXPF 1
#define H5_HAVE_FREXPL 1
#define H5_HAVE_FUNCTION 1
#define H5_HAVE_GETHOSTNAME 1
#define H5_HAVE_GETPWUID 1
#define H5_HAVE_GETRUSAGE 1
#define H5_HAVE_GETTIMEOFDAY 1
#define H5_HAVE_INLINE 1
#define H5_HAVE_INTTYPES_H 1
#define H5_HAVE_IOCTL 1
#define H5_HAVE_LIBDL 1
#define H5_HAVE_LIBM 1
#define H5_HAVE_LIBZ 1
#define H5_HAVE_LLROUND 1
#define H5_HAVE_LLROUNDF 1
#define H5_HAVE_LONGJMP 1
#define H5_HAVE_LROUND 1
#define H5_HAVE_LROUNDF 1
#define H5_HAVE_LSTAT 1
#define H5_HAVE_MEMORY_H 1
#define H5_HAVE_PREADWRITE 1
#define H5_HAVE_QUADMATH_H 1
#define H5_HAVE_RANDOM 1
#define H5_HAVE_RAND_R 1
#define H5_HAVE_ROUND 1
#define H5_HAVE_ROUNDF 1
#define H5_HAVE_SETJMP 1
#define H5_HAVE_SETJMP_H 1
#define H5_HAVE_SIGLONGJMP 1
#define H5_HAVE_SIGNAL 1
#define H5_HAVE_SIGPROCMASK 1
#define H5_HAVE_SNPRINTF 1
#define H5_HAVE_SRANDOM 1
#define H5_HAVE_STDBOOL_H 1
#define H5_HAVE_STDDEF_H 1
#define H5_HAVE_STDINT_H 1
#define H5_HAVE_STDLIB_H 1
#define H5_HAVE_STRDUP 1
#define H5_HAVE_STRINGS_H 1
#define H5_HAVE_STRING_H 1
#define H5_HAVE_STRTOLL 1
#define H5_HAVE_STRTOULL 1
#define H5_HAVE_SYMLINK 1
#define H5_HAVE_SYSTEM 1
#define H5_HAVE_SYS_FILE_H 1
#define H5_HAVE_SYS_IOCTL_H 1
#define H5_HAVE_SYS_RESOURCE_H 1
#define H5_HAVE_SYS_SOCKET_H 1
#define H5_HAVE_SYS_STAT_H 1
#define H5_HAVE_SYS_TIMEB_H 1
#define H5_HAVE_SYS_TIME_H 1
#define H5_HAVE_SYS_TYPES_H 1
#define H5_HAVE_TIMEZONE 1
#define H5_HAVE_TIOCGETD 1
#define H5_HAVE_TIOCGWINSZ 1
#define H5_HAVE_TMPFILE 1
#define H5_HAVE_TM_GMTOFF 1
#define H5_HAVE_UNISTD_H 1
#define H5_HAVE_VASPRINTF 1
#define H5_HAVE_VSNPRINTF 1
#define H5_HAVE_WAITPID 1
#define H5_HAVE_ZLIB_H 1
#define H5_HAVE___INLINE 1
#define H5_HAVE___INLINE__ 1
#define H5_INCLUDE_HL 1
#define H5_LDOUBLE_TO_LLONG_ACCURATE 1
#define H5_LLONG_TO_LDOUBLE_CORRECT 1
#define H5_LT_OBJDIR ".libs/"
#define H5_NO_ALIGNMENT_RESTRICTIONS 1
#define H5_PAC_C_MAX_REAL_PRECISION 33
#define H5_PRINTF_LL_WIDTH "l"
#define H5_SIZEOF_BOOL 1
#define H5_SIZEOF_CHAR 1
#define H5_SIZEOF_DOUBLE 8
#define H5_SIZEOF_FLOAT 4
#define H5_SIZEOF_INT 4
#define H5_SIZEOF_INT16_T 2
#define H5_SIZEOF_INT32_T 4
#define H5_SIZEOF_INT64_T 8
#define H5_SIZEOF_INT8_T 1
#define H5_SIZEOF_INT_FAST16_T 8
#define H5_SIZEOF_INT_FAST32_T 8
#define H5_SIZEOF_INT_FAST64_T 8
#define H5_SIZEOF_INT_FAST8_T 1
#define H5_SIZEOF_INT_LEAST16_T 2
#define H5_SIZEOF_INT_LEAST32_T 4
#define H5_SIZEOF_INT_LEAST64_T 8
#define H5_SIZEOF_INT_LEAST8_T 1
#define H5_SIZEOF_LONG 8
#define H5_SIZEOF_LONG_DOUBLE 16
#define H5_SIZEOF_LONG_LONG 8
#define H5_SIZEOF_OFF_T 8
#define H5_SIZEOF_PTRDIFF_T 8
#define H5_SIZEOF_SHORT 2
#define H5_SIZEOF_SIZE_T 8
#define H5_SIZEOF_SSIZE_T 8
#define H5_SIZEOF_TIME_T 8
#define H5_SIZEOF_UINT16_T 2
#define H5_SIZEOF_UINT32_T 4
#define H5_SIZEOF_UINT64_T 8
#define H5_SIZEOF_UINT8_T 1
#define H5_SIZEOF_UINT_FAST16_T 8
#define H5_SIZEOF_UINT_FAST32_T 8
#define H5_SIZEOF_UINT_FAST64_T 8
#define H5_SIZEOF_UINT_FAST8_T 1
#define H5_SIZEOF_UINT_LEAST16_T 2
#define H5_SIZEOF_UINT_LEAST32_T 4
#define H5_SIZEOF_UINT_LEAST64_T 8
#define H5_SIZEOF_UINT_LEAST8_T 1
#define H5_SIZEOF_UNSIGNED 4
#define H5_SIZEOF__QUAD 0
#define H5_SIZEOF___FLOAT128 16
#define H5_SIZEOF___INT64 0
#define H5_STDC_HEADERS 1
#define H5_TIME_WITH_SYS_TIME 1
#define H5_USE_112_API_DEFAULT 1
#define H5_VERSION "1.12.0"
#define H5_WANT_DATA_ACCURACY 1
#define H5_WANT_DCONV_EXCEPTION 1
#endif // LINUX

#ifdef WIN32
#define H5_HAVE_WINDOWS 1
#define H5_HAVE_WIN32_API 1
#define H5_HAVE_VISUAL_STUDIO 1
#define H5_DEFAULT_PLUGINDIR "%ALLUSERSPROFILE%\\hdf5\\lib\\plugin"
#define H5_FC_FUNC(name, NAME) name##_
#define H5_FC_FUNC_(name, NAME) name##_
#define H5_FORTRAN_C_LONG_DOUBLE_IS_UNIQUE
#define H5_FORTRAN_HAVE_C_LONG_DOUBLE
#define H5_Fortran_COMPILER_ID
#define H5_HAVE_DIFFTIME 1
#define H5_HAVE_EMBEDDED_LIBINFO 1
#define H5_HAVE_FUNCTION 1
#define H5_HAVE_GETCONSOLESCREENBUFFERINFO 1
#define H5_HAVE_GETHOSTNAME 1
#define H5_HAVE_GETTIMEOFDAY 1
#define H5_HAVE_FILTER_DEFLATE 1
#define H5_HAVE_INLINE 1
#define H5_HAVE_INTTYPES_H 1
#define H5_HAVE_IO_H 1
#define H5_HAVE_LIBM 1
#define H5_HAVE_LIBWS2_32 1
#define H5_HAVE_LIBZ
#define H5_HAVE_LLROUND 1
#define H5_HAVE_LLROUNDF 1
#define H5_HAVE_LONGJMP 1
#define H5_HAVE_LROUND 1
#define H5_HAVE_LROUNDF 1
#define H5_HAVE_MEMORY_H 1
#define H5_HAVE_ROUND 1
#define H5_HAVE_ROUNDF 1
#define H5_HAVE_SETJMP 1
#define H5_HAVE_SETJMP_H 1
#define H5_HAVE_SIGNAL 1
#define H5_HAVE_STDBOOL_H 1
#define H5_HAVE_STDDEF_H 1
#define H5_HAVE_STDINT_H 1
#define H5_HAVE_STDINT_H_CXX 1
#define H5_HAVE_STDLIB_H 1
#define H5_HAVE_STRDUP 1
#define H5_HAVE_STRING_H 1
#define H5_HAVE_STRTOLL 1
#define H5_HAVE_STRTOULL 1
#define H5_HAVE_SYSTEM 1
#define H5_HAVE_SYS_STAT_H 1
#define H5_HAVE_SYS_TIMEB_H 1
#define H5_HAVE_SYS_TYPES_H 1
/* Define if we have thread safe support */
/* #undef H5_HAVE_THREADSAFE */
#define H5_HAVE_TIMEZONE 1
#define H5_HAVE_TMPFILE 1
#define H5_HAVE_WINDOW_PATH 1
#define H5_HAVE_WINSOCK2_H 1
#define H5_HAVE_ZLIB_H 1
#define H5_HAVE___INLINE 1
#define H5_INCLUDE_HL 1
#define H5_LDOUBLE_TO_LLONG_ACCURATE 1
#define H5_LLONG_TO_LDOUBLE_CORRECT 1
#define H5_NO_ALIGNMENT_RESTRICTIONS 1
#define H5_PRINTF_LL_WIDTH "I64"
#define H5_SIZEOF_BOOL 1
#define H5_SIZEOF_CHAR 1
#define H5_SIZEOF_DOUBLE 8
#define H5_SIZEOF_FLOAT 4
#define H5_SIZEOF_INT 4
#define H5_SIZEOF_INT16_T 2
#define H5_SIZEOF_INT32_T 4
#define H5_SIZEOF_INT64_T 8
#define H5_SIZEOF_INT8_T 1
#define H5_SIZEOF_INT_FAST16_T 4
#define H5_SIZEOF_INT_FAST32_T 4
#define H5_SIZEOF_INT_FAST64_T 8
#define H5_SIZEOF_INT_FAST8_T 1
#define H5_SIZEOF_INT_LEAST16_T 2
#define H5_SIZEOF_INT_LEAST32_T 4
#define H5_SIZEOF_INT_LEAST64_T 8
#define H5_SIZEOF_INT_LEAST8_T 1
#define H5_SIZEOF_SIZE_T 8
#define H5_SIZEOF_LONG 4
#define H5_SIZEOF_LONG_DOUBLE 8
#define H5_SIZEOF_LONG_LONG 8
#define H5_SIZEOF_OFF_T 4
#define H5_SIZEOF_SHORT 2
#define H5_SIZEOF_TIME_T 8
#define H5_SIZEOF_UINT16_T 2
#define H5_SIZEOF_UINT32_T 4
#define H5_SIZEOF_UINT64_T 8
#define H5_SIZEOF_UINT8_T 1
#define H5_SIZEOF_UINT_FAST16_T 4
#define H5_SIZEOF_UINT_FAST32_T 4
#define H5_SIZEOF_UINT_FAST64_T 8
#define H5_SIZEOF_UINT_FAST8_T 1
#define H5_SIZEOF_UINT_LEAST16_T 2
#define H5_SIZEOF_UINT_LEAST32_T 4
#define H5_SIZEOF_UINT_LEAST64_T 8
#define H5_SIZEOF_UINT_LEAST8_T 1
#define H5_SIZEOF_UNSIGNED 4
#define H5_SIZEOF__QUAD
#define H5_SIZEOF___FLOAT128 0
#define H5_SIZEOF___INT64 8
#define H5_STDC_HEADERS 1
#define H5_USE_112_API_DEFAULT 1
#define H5_WANT_DATA_ACCURACY 1
#define H5_WANT_DCONV_EXCEPTION 1
#endif // WIN32

#endif