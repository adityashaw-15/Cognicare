@echo off
title Launching CogniCare Platform...
echo ========================================================
echo               Starting CogniCare Platform
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Backend API Server (Port 8080)...
start "CogniCare Backend API" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"

echo [2/3] Starting Frontend Dev Server (Port 5173)...
start "CogniCare Frontend Web" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Opening CogniCare in your default browser...
start http://127.0.0.1:5173/

echo.
echo ========================================================
echo CogniCare is now active! Keep the terminal windows open.
echo ========================================================
