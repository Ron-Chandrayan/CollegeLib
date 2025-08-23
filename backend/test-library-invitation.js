/**
 * Test file for Library Invitation Email Feature
 * 
 * This file demonstrates how to use the new library invitation email functionality
 * without modifying existing routes.
 */

const { checkAndSendLibraryInvitation } = require('./services/emailService');

// Test function
async function testLibraryInvitation() {
  console.log('🧪 Testing Library Invitation Email Feature...\n');
  
  // Test with a sample PRN (replace with actual PRN from your database)
  const testPRN = '2020BTEIT00001'; // Replace with actual PRN
  
  try {
    console.log(`📧 Attempting to send invitation email for PRN: ${testPRN}`);
    
    const result = await checkAndSendLibraryInvitation(testPRN);
    
    console.log('\n📊 Result:');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.success) {
      console.log('✅ Invitation email sent successfully!');
    } else {
      console.log('❌ Invitation email not sent. Reason:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testLibraryInvitation();
}

module.exports = { testLibraryInvitation };
