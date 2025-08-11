const axios = require('axios');

// Test AI signal generation and execution
async function testAISignals() {
  console.log('🤖 Testing AI Trading Signals...\n');

  try {
    // Test 1: Send AI signal to backend
    console.log('1. Sending AI signal to backend...');
    const signalData = {
      action: 'BUY',
      symbol: 'AAPL',
      amount: 1000,
      confidence: 85,
      reason: 'Strong technical indicators suggest upward momentum'
    };

    const response = await axios.post('http://localhost:3001/api/ai/signals', signalData);
    console.log('✅ AI signal sent successfully:', response.data);

    // Test 2: Get all AI signals
    console.log('\n2. Fetching all AI signals...');
    const signalsResponse = await axios.get('http://localhost:3001/api/ai/signals');
    console.log('✅ AI signals retrieved:', signalsResponse.data);

    // Test 3: Test Alpaca order placement (simulated)
    console.log('\n3. Testing order placement...');
    const orderData = {
      symbol: 'AAPL',
      qty: 5,
      side: 'buy',
      type: 'market',
      time_in_force: 'day',
      client_order_id: `test-ai-${Date.now()}`
    };

    const orderResponse = await axios.post('http://localhost:3001/api/alpaca/orders', orderData);
    console.log('✅ Order placed successfully:', orderResponse.data);

    console.log('\n🎉 All AI signal tests passed!');
    console.log('\n📋 Workflow Summary:');
    console.log('1. AI generates signal (BUY/SELL + Symbol + Amount)');
    console.log('2. Signal sent to backend API');
    console.log('3. User can review and execute signal');
    console.log('4. Order placed on Alpaca');
    console.log('5. Trade executed in user\'s account');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Test different AI signals
async function testMultipleSignals() {
  console.log('\n🔄 Testing multiple AI signals...\n');

  const testSignals = [
    {
      action: 'BUY',
      symbol: 'TSLA',
      amount: 2000,
      confidence: 78,
      reason: 'Earnings beat expectations'
    },
    {
      action: 'SELL',
      symbol: 'MSFT',
      amount: 1500,
      confidence: 65,
      reason: 'Overbought conditions'
    },
    {
      action: 'BUY',
      symbol: 'GOOGL',
      amount: 3000,
      confidence: 92,
      reason: 'Strong fundamentals and growth'
    }
  ];

  for (let i = 0; i < testSignals.length; i++) {
    const signal = testSignals[i];
    console.log(`${i + 1}. Testing signal: ${signal.action} ${signal.symbol} $${signal.amount}`);
    
    try {
      const response = await axios.post('http://localhost:3001/api/ai/signals', signal);
      console.log(`   ✅ Signal ${i + 1} sent successfully`);
    } catch (error) {
      console.log(`   ❌ Signal ${i + 1} failed:`, error.response?.data?.error || error.message);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 AI Trading Signal Testing Suite\n');
  console.log('Make sure your backend server is running on port 3001\n');
  
  await testAISignals();
  await testMultipleSignals();
  
  console.log('\n📝 Next Steps:');
  console.log('1. Integrate with your AI model');
  console.log('2. Add signal storage in DynamoDB');
  console.log('3. Add real-time notifications');
  console.log('4. Add signal approval workflow');
  console.log('5. Add risk management rules');
}

runTests(); 