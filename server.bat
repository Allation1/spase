@echo off
taskkill /f /im node.exe >nul 2>&1
cd /d c:\Users\Геймер\OneDrive\Desktop\spase
node server.js
pause