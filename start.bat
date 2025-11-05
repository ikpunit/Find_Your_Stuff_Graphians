@echo off
REM 
echo Starting backend server...
cd server
start cmd /k "npm run dev"
cd ..

REM 
echo Starting frontend client...
cd client
start cmd /k "npm start"
cd ..

echo Both server and client are starting...
pause
