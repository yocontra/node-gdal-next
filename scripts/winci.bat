:: mostly from https://github.com/mapbox/node-sqlite3/blob/master/scripts/build-appveyor.bat
@ECHO OFF
SETLOCAL
SET EL=0

ECHO ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ %~f0 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

IF /I "%msvs_version%"=="" ECHO msvs_version unset, defaulting to 2017 && SET msvs_version=2017

SET PATH=%CD%;%PATH%
IF NOT "%NODE_RUNTIME%"=="" SET "TOOLSET_ARGS=%TOOLSET_ARGS% --runtime=%NODE_RUNTIME%"
IF NOT "%NODE_RUNTIME_VERSION%"=="" SET "TOOLSET_ARGS=%TOOLSET_ARGS% --target=%NODE_RUNTIME_VERSION%"

ECHO APPVEYOR^: %APPVEYOR%
ECHO nodejs_version^: %nodejs_version%
ECHO platform^: %platform%
ECHO msvs_version^: %msvs_version%
ECHO TOOLSET_ARGS^: %TOOLSET_ARGS%

ECHO activating VS command prompt
:: NOTE this call makes the x64 -> X64
IF /I "%platform%"=="x64" ECHO x64 && CALL "C:\Program Files (x86)\Microsoft Visual Studio\%msvs_version%\Community\VC\Auxiliary\Build\vcvarsall.bat" amd64
IF /I "%platform%"=="x86" ECHO x86 && CALL "C:\Program Files (x86)\Microsoft Visual Studio\%msvs_version%\Community\VC\Auxiliary\Build\vcvarsall.bat" x86
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO using compiler^: && CALL cl
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO using MSBuild^: && CALL msbuild /version && ECHO.
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO downloading/installing node
powershell Update-NodeJsInstallation (Get-NodeJsLatestBuild $env:nodejs_version) $env:PLATFORM
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO available node.exe^:
call where node
ECHO available npm^:
call where npm

ECHO node^: && call node -v
call node -e "console.log('  - arch:',process.arch,'\n  - argv:',process.argv,'\n  - execPath:',process.execPath)"
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO npm^: && CALL npm -v
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO ===== where npm puts stuff START ============
ECHO npm root && CALL npm root
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
ECHO npm root -g && CALL npm root -g
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO npm bin && CALL npm bin
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
ECHO npm bin -g && CALL npm bin -g
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

SET NPM_BIN_DIR=
FOR /F "tokens=*" %%i in ('CALL npm bin -g') DO SET NPM_BIN_DIR=%%i
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
IF /I "%NPM_BIN_DIR%"=="%CD%" ECHO ERROR npm bin -g equals local directory && SET ERRORLEVEL=1 && GOTO ERROR
ECHO ===== where npm puts stuff END ============

ECHO building ...
CALL npm install --build-from-source --msvs_version=%msvs_version% %TOOLSET_ARGS% --loglevel=http
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

FOR /F "tokens=*" %%i in ('"CALL node_modules\.bin\node-pre-gyp reveal module %TOOLSET_ARGS% --silent"') DO SET MODULE=%%i
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
FOR /F "tokens=*" %%i in ('node -e "console.log(process.execPath)"') DO SET NODE_EXE=%%i
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

dumpbin /DEPENDENTS "%NODE_EXE%"
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
dumpbin /DEPENDENTS "%MODULE%"
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

CALL npm test
:: comment next line to allow build to work even if tests do not pass
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
ECHO APPVEYOR_REPO_COMMIT_MESSAGE^: %APPVEYOR_REPO_COMMIT_MESSAGE%
SET CM=%APPVEYOR_REPO_COMMIT_MESSAGE%
ECHO packaging ...
CALL node_modules\.bin\node-pre-gyp package %TOOLSET_ARGS%
IF %ERRORLEVEL% NEQ 0 ECHO error during packaging && GOTO ERROR
IF NOT "%CM%" == "%CM:[publish binary]=%" (ECHO publishing... && CALL node_modules\.bin\node-pre-gyp --msvs_version=%msvs_version% publish %TOOLSET_ARGS%) ELSE (ECHO not publishing)
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
IF NOT "%CM%" == "%CM:[republish binary]=%" (ECHO republishing ... && CALL node_modules\.bin\node-pre-gyp --msvs_version=%msvs_version% unpublish publish %TOOLSET_ARGS%) ELSE (ECHO not republishing)
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
GOTO DONE
:ERROR
ECHO =========== ERROR %~f0 ===========
ECHO ERRORLEVEL^: %ERRORLEVEL%
SET EL=%ERRORLEVEL%
:DONE
ECHO =========== DONE %~f0 ===========
EXIT /b %EL%
