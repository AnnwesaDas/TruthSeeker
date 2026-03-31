require('dotenv').config();
const {
  extractEventInfo,
  getTrustedSourcesForClaim,
  verifyClaimWithEvidence,
} = require('../agents/gemini');

async function testAPIConnectivity() {
  try {
    const testClaim = 'A meteor struck Paris on February 15, 2026';
    const result = await extractEventInfo(testClaim);
    console.log('API connectivity ok:', Boolean(result));
    return true;
  } catch (err) {
    console.error('API connectivity failed:', err.message);
    return false;
  }
}

async function testExtractEventInfo() {
  try {
    const testClaim = 'The World Cup 2026 will be held in USA from June 15 to July 15';
    const result = await extractEventInfo(testClaim);
    console.log('Extract output:', result);
    return Boolean(result && result !== 'Unverified: Error during verification.');
  } catch (err) {
    console.error('Extract test failed:', err.message);
    return false;
  }
}

async function testGetTrustedSources() {
  try {
    const testClaim = 'Biden announces new climate policy';
    const sources = await getTrustedSourcesForClaim(testClaim);
    console.log('Sources count:', Array.isArray(sources) ? sources.length : 0);
    return Array.isArray(sources) && sources.length > 0;
  } catch (err) {
    console.error('Sources test failed:', err.message);
    return false;
  }
}

async function testVerifyClaim() {
  try {
    const claim = 'Paris hosted the 2024 Olympics';
    const evidence = {
      source: 'Reuters',
      content: 'Paris successfully hosted the 2024 Summer Olympics with record attendance',
    };

    const result = await verifyClaimWithEvidence(claim, evidence);
    console.log('Verification output:', result);
    return Boolean(result);
  } catch (err) {
    console.error('Verify test failed:', err.message);
    return false;
  }
}

async function runAllChecks() {
  const results = [];
  results.push(await testAPIConnectivity());
  results.push(await testExtractEventInfo());
  results.push(await testGetTrustedSources());
  results.push(await testVerifyClaim());

  const passed = results.filter(Boolean).length;
  console.log(`Checks passed: ${passed}/${results.length}`);
  if (passed !== results.length) {
    process.exitCode = 1;
  }
}

runAllChecks().catch((err) => {
  console.error('Fatal check error:', err);
  process.exit(1);
});
