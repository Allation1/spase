@echo off
taskkill /f /im node.exe >nul 2>&1
cd /d "%~dp0"
node server.js
pause