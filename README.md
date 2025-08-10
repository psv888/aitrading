# AI Trading Application

A comprehensive AI-powered trading platform built with React frontend and Node.js backend, featuring real-time market data, portfolio management, and AI trading signals.

## 🚀 Features

### Frontend (React)
- **Modern Dashboard**: Real-time portfolio overview with interactive charts
- **AI Trading Signals**: Intelligent trading recommendations powered by AI
- **Portfolio Management**: Track holdings, performance, and asset allocation
- **Market News**: Real-time financial news and market updates
- **Watchlist**: Custom watchlists for favorite stocks
- **Buy/Sell Widget**: Quick trading interface
- **Theme Toggle**: Dark/Light mode support
- **Responsive Design**: Mobile-friendly interface

### Backend (Node.js)
- **Alpaca Integration**: Real-time market data and trading capabilities
- **User Authentication**: Secure user management with bcrypt
- **AWS Integration**: Cloud services for scalability
- **WebSocket Support**: Real-time data streaming
- **RESTful API**: Clean API endpoints for frontend communication

## 🛠️ Tech Stack

### Frontend
- React 19.1.0
- React Router DOM
- Styled Components
- Dynamic Labs (Ethereum integration)
- Viem (Ethereum library)

### Backend
- Node.js
- Express.js
- WebSocket (ws)
- AWS SDK
- Axios
- bcryptjs
- CORS

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Alpaca API credentials
- AWS credentials (optional)

### Backend Setup
```bash
cd ai-trading-app/backend
npm install
```

Create a `.env` file in the backend directory:
```env
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_SECRET_KEY=your_alpaca_secret_key
ALPACA_BASE_URL=https://paper-api.alpaca.markets
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
```

### Frontend Setup
```bash
cd ai-trading-app/frontend
npm install
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend Server**:
```bash
cd ai-trading-app/backend
npm start
```
The backend will run on `http://localhost:3001`

2. **Start Frontend Development Server**:
```bash
cd ai-trading-app/frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Using the Provided Scripts

You can also use the provided batch/PowerShell scripts:

**Windows (PowerShell)**:
```powershell
./start-servers.ps1
```

**Windows (Batch)**:
```batch
start-servers.bat
```

## 📁 Project Structure

```
ai-trading-app/
├── backend/
│   ├── controllers/
│   │   └── onboardingController.js
│   ├── models/
│   │   └── onboardingService.js
│   ├── routes/
│   │   └── onboardingRoutes.js
│   ├── alpaca-realtime.js
│   ├── aws-config.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   └── onboarding/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
├── backend-clean/
└── README.md
```

## 🔧 Configuration

### Alpaca API Setup
1. Sign up for an Alpaca account at [alpaca.markets](https://alpaca.markets)
2. Get your API key and secret from the dashboard
3. Update the `.env` file with your credentials

### AWS Configuration (Optional)
If using AWS services:
1. Create an AWS account
2. Generate access keys
3. Update the `.env` file with your AWS credentials

## 📊 Features Overview

### Dashboard
- Real-time portfolio value tracking
- Asset allocation visualization
- Performance metrics
- Recent transactions

### AI Trading Signals
- Machine learning-based trading recommendations
- Risk assessment
- Market sentiment analysis

### Portfolio Management
- Holdings overview
- Performance tracking
- Asset diversification analysis

### Market Data
- Real-time stock quotes
- Historical price charts
- Market news integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## ⚠️ Disclaimer

This application is for educational and demonstration purposes. Trading involves risk, and past performance does not guarantee future results. Always do your own research and consider consulting with a financial advisor before making investment decisions.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the documentation in the respective directories
- Review the setup guides in `ALPACA_SETUP.md` and `ALPACA_FIX.md`

---

**Built with ❤️ using React and Node.js**
