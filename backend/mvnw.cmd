@echo off
setlocal
set MAVEN_VERSION=3.9.9
set BASE_DIR=%~dp0
set WRAPPER_DIR=%BASE_DIR%.mvn\wrapper
set MAVEN_HOME=%WRAPPER_DIR%\apache-maven-%MAVEN_VERSION%
set MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd

if not exist "%MAVEN_CMD%" (
  echo Maven %MAVEN_VERSION% not found locally. Downloading to %WRAPPER_DIR%...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "New-Item -ItemType Directory -Force '%WRAPPER_DIR%' | Out-Null; $zip = Join-Path '%WRAPPER_DIR%' 'apache-maven.zip'; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile $zip; Expand-Archive -Force $zip '%WRAPPER_DIR%'; Remove-Item -Force $zip"
  if errorlevel 1 exit /b 1
)

call "%MAVEN_CMD%" %*

