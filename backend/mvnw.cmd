@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM ----------------------------------------------------------------------------

@IF "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@setlocal

@set ERROR_CODE=0

@REM To isolate internal variables from possible side effects, we use a prefix "MAVEN_"
@set MAVEN_PROJECTBASEDIR=%~dp0
@if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

@REM Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current working directory if not found.

@set MAVEN_W_DIR=%MAVEN_PROJECTBASEDIR%
:findBaseDir
@if exist "%MAVEN_W_DIR%\.mvn" goto baseDirFound
@set MAVEN_W_POM=%MAVEN_W_DIR%\pom.xml
@if exist "%MAVEN_W_POM%" goto baseDirFound
@set MAVEN_W_DIR_TMP=%MAVEN_W_DIR%
@for /f "delims=" %%i in ("%MAVEN_W_DIR%") do @set MAVEN_W_DIR=%%~dpi
@set MAVEN_W_DIR=%MAVEN_W_DIR:~0,-1%
@if "%MAVEN_W_DIR%"=="%MAVEN_W_DIR_TMP%" goto baseDirNotFound
@goto findBaseDir

:baseDirFound
@set MAVEN_PROJECTBASEDIR=%MAVEN_W_DIR%
goto endFindBaseDir

:baseDirNotFound
@set MAVEN_PROJECTBASEDIR=%~dp0
@if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

:endFindBaseDir

@IF NOT "%JAVA_HOME%" == "" goto OkJHome

@FOR %%i IN (java.exe) DO @SET "JAVACMD=%%~$PATH:i"
@IF NOT "%JAVACMD%" == "" goto OkJCmd

@echo.
@echo Error: JAVA_HOME is not defined correctly.
@echo   We cannot execute %JAVACMD%
@echo.
@goto error

:OkJHome
@set "JAVACMD=%JAVA_HOME%\bin\java.exe"

:OkJCmd
@if exist "%JAVACMD%" goto checkJre

@echo.
@echo Error: JAVA_HOME is set to an invalid directory.
@echo   JAVA_HOME = "%JAVA_HOME%"
@echo   Please set the JAVA_HOME variable in your environment to match the
@echo   location of your Java installation.
@echo.
@goto error

:checkJre
@if exist "%JAVACMD%" goto init

@echo.
@echo Error: JAVA_HOME is not defined correctly.
@echo   We cannot execute %JAVACMD%
@echo.
@goto error

:init

@set MAVEN_WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar
@set MAVEN_WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties
@set MAVEN_WRAPPER_MAIN_CLASS=org.apache.maven.wrapper.MavenWrapperMain

@REM Extension to allow automatically downloading the maven-wrapper.jar from the web
@IF EXIST "%MAVEN_WRAPPER_JAR%" goto run

@echo .mvn/wrapper/maven-wrapper.jar not found, downloading it...

@set DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

@FOR /F "tokens=1,2 delims==" %%A IN (%MAVEN_WRAPPER_PROPERTIES%) DO @IF "%%A"=="wrapperUrl" SET DOWNLOAD_URL=%%B

@powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $webclient = New-Object System.Net.WebClient; if ($env:MAVEN_WRAPPER_USERNAME -and $env:MAVEN_WRAPPER_PASSWORD) { $WebClient.Credentials = New-Object System.Net.NetworkCredential($env:MAVEN_WRAPPER_USERNAME, $env:MAVEN_WRAPPER_PASSWORD) }; $webclient.DownloadFile('%DOWNLOAD_URL%', '%MAVEN_WRAPPER_JAR%')"
@if NOT %ERRORLEVEL% == 0 goto error

:run
@set CLASSPATH=%MAVEN_WRAPPER_JAR%

@REM Start MAVEN
"%JAVACMD%" %MAVEN_OPTS% -classpath "%CLASSPATH%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %MAVEN_WRAPPER_MAIN_CLASS% %*

@if ERRORLEVEL 1 goto error
@goto end

:error
@set ERROR_CODE=1

:end
@setlocal & exit /B %ERROR_CODE%
