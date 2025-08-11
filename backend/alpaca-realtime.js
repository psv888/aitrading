// Backend WebSocket proxy for Alpaca real-time data
const WebSocket = require('ws');

const ALPACA_KEY = process.env.ALPACA_API_KEY || 'PKZ0MDDHJ0T33HUH6I1M';
const ALPACA_SECRET = process.env.ALPACA_API_SECRET || 'fdIVAnylLN2axC51clLsxVtOd0EhRyj4u44nrlci';
const ALPACA_WS_URL = 'wss://stream.data.alpaca.markets/v1beta3/crypto/us'; // Updated crypto stream endpoint

// WebSocket server for frontend clients
const server = new WebSocket.Server({ port: 4001 });

server.on('connection', (client) => {
  console.log('Frontend client connected to WebSocket server');
  
  // Connect to Alpaca WebSocket
  const alpaca = new WebSocket(ALPACA_WS_URL);

  alpaca.on('open', () => {
    console.log('Connected to Alpaca WebSocket, authenticating...');
    
    // Authenticate
    const authMessage = {
      action: 'auth',
      key: ALPACA_KEY,
      secret: ALPACA_SECRET,
    };
    console.log('Sending auth message:', JSON.stringify(authMessage));
    alpaca.send(JSON.stringify(authMessage));
  });

  alpaca.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Alpaca message:', message);
      
      // Check if authentication was successful
      if (message.T === 'success' && message.msg === 'connected') {
        console.log('Authentication successful, subscribing to trades...');
        // Subscribe to BTC/USD and ETH/USD trades
        const subscribeMessage = {
          action: 'subscribe',
          trades: ['BTC/USD', 'ETH/USD'],
        };
        alpaca.send(JSON.stringify(subscribeMessage));
      } else if (message.T === 'error') {
        console.error('Alpaca authentication error:', message);
        // Don't close the connection, just log the error
      } else {
        // Relay trade data to frontend client
        client.send(data);
      }
    } catch (error) {
      console.error('Error parsing Alpaca message:', error);
    }
  });

  alpaca.on('close', () => {
    console.log('Alpaca WebSocket connection closed');
    client.close();
  });

  alpaca.on('error', (err) => {
    console.error('Alpaca WS error:', err);
    client.close();
  });

  client.on('close', () => {
    console.log('Frontend client disconnected');
    alpaca.close();
  });
});

console.log('Alpaca real-time WebSocket proxy running on ws://localhost:4001'); 