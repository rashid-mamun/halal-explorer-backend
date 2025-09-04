const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running All Tests for Halal Explorer Backend\n');

const unitTestFiles = [
  'src/__tests__/unit/auth/authService.test.js',
  'src/__tests__/unit/hotel/hotelService.test.js',
  'src/__tests__/unit/middleware/auth.test.js',
  'src/__tests__/unit/utils/validators.test.js'
];

const integrationTestFiles = [
  'src/__tests__/integration/auth.integration.test.js',
  'src/__tests__/integration/hotel.integration.test.js',
  'src/__tests__/integration/activity.integration.test.js',
  'src/__tests__/integration/system.integration.test.js'
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let unitTestResults = { passed: 0, failed: 0, total: 0 };
let integrationTestResults = { passed: 0, failed: 0, total: 0 };

async function runTestSuite(testFiles, suiteName) {
  console.log(`\n🔍 Running ${suiteName} Tests`);
  console.log('='.repeat(60));
  
  let suitePassed = 0;
  let suiteFailed = 0;
  let suiteTotal = 0;

  for (const testFile of testFiles) {
    console.log(`\n📋 Running: ${testFile}`);
    console.log('-'.repeat(40));
    
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
        suitePassed += passed;
        suiteFailed += failed;
        suiteTotal += passed + failed;
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
        suitePassed += passed;
        suiteFailed += failed;
        suiteTotal += passed + failed;
        passedTests += passed;
        failedTests += failed;
        totalTests += passed + failed;
      }
    }
  }

  return { passed: suitePassed, failed: suiteFailed, total: suiteTotal };
}

async function runAllTests() {
  console.log('📋 Test Suites to Run:');
  console.log('\n🔧 Unit Tests:');
  unitTestFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });
  
  console.log('\n🌐 Integration Tests:');
  integrationTestFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });
  console.log('');

  // Run Unit Tests
  unitTestResults = await runTestSuite(unitTestFiles, 'Unit');

  // Run Integration Tests
  integrationTestResults = await runTestSuite(integrationTestFiles, 'Integration');

  // Final Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE TEST SUMMARY');
  console.log('='.repeat(80));
  
  console.log('\n🔧 Unit Tests:');
  console.log(`  ✅ Passed: ${unitTestResults.passed}`);
  console.log(`  ❌ Failed: ${unitTestResults.failed}`);
  console.log(`  📈 Total: ${unitTestResults.total}`);
  console.log(`  🎯 Success Rate: ${unitTestResults.total > 0 ? ((unitTestResults.passed / unitTestResults.total) * 100).toFixed(1) : 0}%`);
  
  console.log('\n🌐 Integration Tests:');
  console.log(`  ✅ Passed: ${integrationTestResults.passed}`);
  console.log(`  ❌ Failed: ${integrationTestResults.failed}`);
  console.log(`  📈 Total: ${integrationTestResults.total}`);
  console.log(`  🎯 Success Rate: ${integrationTestResults.total > 0 ? ((integrationTestResults.passed / integrationTestResults.total) * 100).toFixed(1) : 0}%`);
  
  console.log('\n📊 Overall Results:');
  console.log(`  ✅ Passed: ${passedTests}`);
  console.log(`  ❌ Failed: ${failedTests}`);
  console.log(`  📈 Total: ${totalTests}`);
  console.log(`  🎯 Success Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('🚀 The system is working perfectly!');
    console.log('✨ Both unit and integration tests are successful!');
  } else {
    console.log(`\n⚠️  ${failedTests} test(s) failed. Please review the issues above.`);
    
    if (unitTestResults.failed > 0) {
      console.log(`   - ${unitTestResults.failed} unit test(s) failed`);
    }
    
    if (integrationTestResults.failed > 0) {
      console.log(`   - ${integrationTestResults.failed} integration test(s) failed`);
    }
  }
  
  console.log('\n🏁 All tests completed.');
  
  // Return exit code
  return failedTests === 0 ? 0 : 1;
}

// Run all tests
runAllTests()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
