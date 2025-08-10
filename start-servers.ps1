Write-Host "Starting AI Trading App Servers..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Start Backend API Server
Write-Host "Starting Backend API Server (port 3001)..." -ForegroundColor Cyan
Set-Location "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal
Set-Location ".."

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start WebSocket Server for Real-time Data
Write-Host "Starting WebSocket Server (port 4001)..." -ForegroundColor Cyan
Set-Location "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node alpaca-realtime.js" -WindowStyle Normal
Set-Location ".."

# Wait a moment for WebSocket server to start
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "Starting Frontend Server (port 3000)..." -ForegroundColor Cyan
Set-Location "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal
Set-Location ".."

Write-Host ""
Write-Host "All servers are starting..." -ForegroundColor Green
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Yellow
Write-Host "WebSocket Server: ws://localhost:4001" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: It may take a few moments for all servers to fully start." -ForegroundColor Gray
Write-Host "Check the terminal windows for any error messages." -ForegroundColor Gray
Write-Host ""
Write-Host "The WebSocket server handles real-time market data." -ForegroundColor Gray
Write-Host "If you see WebSocket connection errors, make sure all 3 servers are running." -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit this window" 