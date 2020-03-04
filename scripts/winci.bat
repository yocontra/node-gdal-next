:: bat helper script for building node c++ addons on appveyor

@ECHO OFF
SETLOCAL
SET EL=0

ECHO =========== %~f0 ===========

:: default to VS2015
IF /I "%msvs_toolset%"=="" SET msvs_toolset=14
IF /I "%msvs_toolset%"=="14" SET MSVSVERSION=2015
IF /I "%msvs_toolset%"=="12" SET MSVSVERSION=2013

ECHO msvs_toolset^: %msvs_toolset%
ECHO MSVSVERSION^: %MSVSVERSION%

IF /I "%APPVEYOR%"=="True" powershell Install-Product node %nodejs_version% %PLATFORM%
IF %ERRORLEVEL% NEQ 0 ECHO could not install requested node version && GOTO ERROR

:: use 64 bit python if platform is 64 bit
IF /I "%PLATFORM%"=="x64" set PATH=C:\Python27-x64;%PATH%

ECHO activating VS command prompt
:: NOTE this call makes the x64 -> X64
IF /I "%platform%"=="x64" ECHO x64 && CALL "C:\Program Files (x86)\Microsoft Visual Studio %msvs_toolset%.0\VC\vcvarsall.bat" amd64
IF /I "%platform%"=="x86" ECHO x86 && CALL "C:\Program Files (x86)\Microsoft Visual Studio %msvs_toolset%.0\VC\vcvarsall.bat" x86
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO using compiler^: && CALL cl
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO using MSBuild^: && CALL msbuild /version && ECHO.
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

powershell Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO available node.exe^:
where node
node -v
node -e "console.log(process.argv,process.execPath)"
ECHO available npm^:
where npm
CALL npm -v
ECHO building ...
:: --msvs_version=2015 is passed along to node-gyp here
CALL npm install --build-from-source --msvs_version=%MSVSVERSION% --loglevel=http --node_shared=true
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
CALL npm test
:: comment next line to allow build to work even if tests do not pass
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
ECHO APPVEYOR_REPO_COMMIT_MESSAGE^: %APPVEYOR_REPO_COMMIT_MESSAGE%
SET CM=%APPVEYOR_REPO_COMMIT_MESSAGE%
ECHO packaging ...
CALL node_modules\.bin\node-pre-gyp package
IF %ERRORLEVEL% NEQ 0 ECHO error during packaging && GOTO ERROR
IF NOT "%CM%" == "%CM:[publish binary]=%" (ECHO publishing... && CALL node_modules\.bin\node-pre-gyp publish) ELSE (ECHO not publishing)
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
IF NOT "%CM%" == "%CM:[republish binary]=%" (ECHO republishing ... && CALL node_modules\.bin\node-pre-gyp unpublish publish) ELSE (ECHO not republishing)
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
GOTO DONE
:ERROR
ECHO =========== ERROR %~f0 ===========
ECHO ERRORLEVEL^: %ERRORLEVEL%
SET EL=%ERRORLEVEL%
:DONE
ECHO =========== DONE %~f0 ===========
EXIT /b %EL%
