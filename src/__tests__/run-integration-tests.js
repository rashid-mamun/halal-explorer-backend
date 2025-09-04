const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Integration Tests for Halal Explorer Backend\n');

const testFiles = [
  'src/__tests__/integration/auth.integration.test.js',
  'src/__tests__/integration/hotel.integration.test.js',
  'src/__tests__/integration/activity.integration.test.js',
  'src/__tests__/integration/system.integration.test.js',
  'src/__tests__/integration/cruise.integration.test.js',
  'src/__tests__/integration/holiday.integration.test.js'
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function runTests() {
  console.log('📋 Test Files to Run:');
  testFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  console.log('');

  for (const testFile of testFiles) {
    console.log(`\n🔍 Running: ${testFile}`);
    console.log('='.repeat(60));
    
    try {
      const result = execSync(`npx jest ${testFile} --verbose --detectOpenHandles`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(result);
      
      // Parse test results
      const match = result.match(/(\d+) tests? passed, (\d+) tests? failed/);
      if (match) {
        const passed = parseInt(match[1]);
        const failed = parseInt(match[2]);
        passedTests += passed;
        failedTests += failed;
        totalTests += passed + failed;
      }
      
    } catch (error) {
      console.log('❌ Test execution failed:');
      console.log(error.stdout || error.message);
      
      // Try to parse failed test results
      const output = error.stdout || '';
      const match = output.match(/(\d+) tests? passed, (\d+) tests? failed/);
      if (match) {
        const passed = parseInt(match[1]);
        const failed = parseInt(match[2]);
        passedTests += passed;
        failedTests += failed;
        totalTests += passed + failed;
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 INTEGRATION TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Total: ${totalTests}`);
  console.log(`🎯 Success Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 ALL INTEGRATION TESTS PASSED!');
    console.log('🚀 The system is working perfectly!');
  } else {
    console.log(`\n⚠️  ${failedTests} test(s) failed. Please review the issues above.`);
  }
  
  console.log('\n🏁 Integration test run completed.');
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
