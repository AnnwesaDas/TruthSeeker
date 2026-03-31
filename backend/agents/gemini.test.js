require('dotenv').config();
const {
  extractEventInfo,
  getTrustedSourcesForClaim,
  verifyClaimWithEvidence,
} = require('./gemini');

// Test 1: Simple API Connectivity Test
async function testAPIConnectivity() {
  console.log('\n========================================');
  console.log('TEST 1: API Connectivity');
  console.log('========================================');
  try {
    const testClaim = "A meteor struck Paris on February 15, 2026";
    console.log(`Testing with claim: "${testClaim}"`);
    
    const result = await extractEventInfo(testClaim);
    console.log('✅ API Connection Successful!');
    console.log('Response:', result);
    return true;
  } catch (err) {
    console.error('❌ API Connection Failed!');
    console.error('Error:', err.message);
    return false;
  }
}

// Test 2: Extract Event Info
async function testExtractEventInfo() {
  console.log('\n========================================');
  console.log('TEST 2: Extract Event Info');
  console.log('========================================');
  try {
    const testClaim = "The World Cup 2026 will be held in USA from June 15 to July 15";
    console.log(`Input: "${testClaim}"`);
    
    const result = await extractEventInfo(testClaim);
    console.log('Output:', result);
    
    if (result && result !== 'Unverified: Error during verification.') {
      console.log('✅ Event extraction successful');
      return true;
    } else {
      console.log('⚠️ Event extraction returned error');
      return false;
    }
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

// Test 3: Get Trusted Sources
async function testGetTrustedSources() {
  console.log('\n========================================');
  console.log('TEST 3: Get Trusted Sources');
  console.log('========================================');
  try {
    const testClaim = "Biden announces new climate policy";
    console.log(`Input: "${testClaim}"`);
    
    const sources = await getTrustedSourcesForClaim(testClaim);
    console.log('Output:', sources);
    
    if (Array.isArray(sources) && sources.length > 0) {
      console.log('✅ Successfully retrieved trusted sources');
      return true;
    } else {
      console.log('⚠️ No sources returned');
      return false;
    }
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

// Test 4: Verify Claim with Evidence
async function testVerifyClaim() {
  console.log('\n========================================');
  console.log('TEST 4: Verify Claim with Evidence');
  console.log('========================================');
  try {
    const claim = "Paris hosted the 2024 Olympics";
    const evidence = {
      source: "Reuters",
      content: "Paris successfully hosted the 2024 Summer Olympics with record attendance"
    };
    
    console.log(`Claim: "${claim}"`);
    console.log('Evidence:', JSON.stringify(evidence, null, 2));
    
    const result = await verifyClaimWithEvidence(claim, evidence);
    console.log('Verification Result:', result);
    console.log('✅ Claim verification complete');
    return true;
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n🚀 STARTING GEMINI API TESTS...\n');
  
  const results = [];
  
  results.push(await testAPIConnectivity());
  results.push(await testExtractEventInfo());
  results.push(await testGetTrustedSources());
  results.push(await testVerifyClaim());
  
  console.log('\n========================================');
  console.log('TEST SUMMARY');
  console.log('========================================');
  const passed = results.filter(r => r).length;
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(passed === results.length ? '✅ All tests passed!' : '⚠️ Some tests failed');
}

// Execute tests
runAllTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
