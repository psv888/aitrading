@echo off
echo Starting AI Trading App Servers...
echo.

echo Starting Backend API Server (port 3001)...
cd backend
start "Backend API Server" cmd /k "npm start"
cd ..

echo.
echo Starting WebSocket Server (port 4001)...
cd backend
start "WebSocket Server" cmd /k "node alpaca-realtime.js"
cd ..

echo.
echo Starting Frontend Server (port 3000)...
cd frontend
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo All servers are starting...
echo Backend API: http://localhost:3001
echo WebSocket Server: ws://localhost:4001
echo Frontend: http://localhost:3000
echo.
echo The WebSocket server handles real-time market data.
echo If you see WebSocket connection errors, make sure all 3 servers are running.
echo.
echo Press any key to exit this window...
pause > nul 