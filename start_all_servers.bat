@echo off
echo Starting Main Backend API (Port 4000)...
start cmd /k "cd /d ""%~dp0"" && node server.js"

echo Starting AI Backend (Port 5000)...
start cmd /k "cd /d ""%~dp0..\backend AI"" && node server.js"

echo Both backend servers have been started in new windows!
pause
