const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const API_KEY = 'TereIshqDaJaamHaseen';

async function quickTest() {
  console.log('🔐 Testing API Authentication\n');

  // Test 1: Without API key (should fail)
  console.log('1️⃣ Testing WITHOUT API key...');
  try {
    const response = await axios.post(`${BASE_URL}/api/library/in_out`, {
      PRN: '123456789',
      purpose: 'Study'
    });
    console.log('❌ FAILED: Should have been rejected');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ PASSED: Correctly rejected (401)');
      console.log('   Message:', error.response.data.error);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }

  // Test 2: With valid API key (should succeed)
  console.log('\n2️⃣ Testing WITH valid API key...');
  try {
    const response = await axios.post(`${BASE_URL}/api/library/in_out`, {
      PRN: '123456789',
      purpose: 'Study'
    }, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    console.log('✅ PASSED: Success! Status:', response.status);
    console.log('   Response:', response.data);
  } catch (error) {
    console.log('❌ FAILED:', error.response ? error.response.data : error.message);
  }

  console.log('\n🎉 Test Complete!');
}

quickTest().catch(console.error);
