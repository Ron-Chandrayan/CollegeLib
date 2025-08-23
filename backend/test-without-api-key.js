/**
 * Test script for the library attendance service without API key
 * 
 * This script tests the library attendance service with API key verification disabled.
 */

const libraryService = require('./services/libraryAttendanceService');

// Test function
async function runTests() {
  console.log('🧪 Testing Library Attendance Service (No API Key)...\n');
  
  try {/*
    // Test 1: Health check
    console.log('Test 1: Health Check');
    const health = libraryService.getHealth();
    console.log(JSON.stringify(health, null, 2));
    console.log('✅ Health check successful\n');
    
    // Test 2: Get last entry
    console.log('Test 2: Get Last Entry');
    try {
      // Pass any value as API key since verification is disabled
      const lastEntry = await libraryService.getLastEntry('dummy-key');
      console.log(JSON.stringify(lastEntry, null, 2));
      console.log('✅ Last entry test successful\n');
    } catch (error) {
      console.log('❌ Last entry test failed:', error.message, '\n');
    }
    
    // Test 3: List all students
    console.log('Test 3: List All Students');
    try {
      const allStudents = await libraryService.listAllStudents('dummy-key');
      console.log(`Found ${allStudents.students?.length || 0} students`);
      console.log(JSON.stringify(allStudents, null, 2));
      console.log('✅ List all students test successful\n');
    } catch (error) {
      console.log('❌ List all students test failed:', error.message, '\n');
    }
    
    // Test 4: Get today's footfall
    console.log('Test 4: Today\'s Footfall');
    try {
      const todaysFootfall = await libraryService.getTodaysFootfall('dummy-key');
      console.log(JSON.stringify(todaysFootfall, null, 2));
      console.log('✅ Today\'s footfall test successful\n');
    } catch (error) {
      console.log('❌ Today\'s footfall test failed:', error.message, '\n');
    }
    
    // Test 5: Get total footfall
    console.log('Test 5: Total Footfall');
    try {
      const totalFootfall = await libraryService.getTotalFootfall('dummy-key');
      console.log(JSON.stringify(totalFootfall, null, 2));
      console.log('✅ Total footfall test successful\n');
    } catch (error) {
      console.log('❌ Total footfall test failed:', error.message, '\n');
    }
    
    // Test 6: Get dashboard
    console.log('Test 6: Dashboard');
    try {
      const dashboard = await libraryService.getDashboard('dummy-key');
      console.log('Dashboard data received with keys:', Object.keys(dashboard));
      console.log(JSON.stringify(dashboard, null, 2));
      console.log('✅ Dashboard test successful\n');
    } catch (error) {
      console.log('❌ Dashboard test failed:', error.message, '\n');
    }
    
    // Test 7: Clear cache
    console.log('Test 7: Clear Cache');
    const cacheResult = libraryService.clearCache();
    console.log(JSON.stringify(cacheResult, null, 2));
    console.log('✅ Clear cache test successful\n');
    */
         // First, let's get current students to see who's in the library
     console.log('Getting current students...');
     try {
       //const currentStudents = await libraryService.listAllStudents('dummy-key');
       //console.log(`Currently ${currentStudents.students?.length || 0} students in library`);
       
       // Test with a PRN that's NOT in the library (try a made-up one)
       const testPRN = '124A1031'; // Test PRN that shouldn't exist
       const testPurpose = 'HapiHapiHapi';
       
       console.log(`\nTest 8: IN/OUT Action`);
       console.log(`Testing IN/OUT action for PRN: ${testPRN}, Purpose: ${testPurpose}`);
       
       const inOutResult = await libraryService.inOutAction('dummy-key', testPRN, testPurpose);
       console.log('Result:', JSON.stringify(inOutResult, null, 2));
       console.log('✅ IN/OUT action test completed\n');
     } catch (error) {
       console.log('❌ IN/OUT action test failed:', error.message, '\n');
     }
    
    console.log('🎉 All tests completed!');
  } catch (error) {
    console.error('❌ Test suite error:', error);
  }
}

// Run the tests
runTests();
