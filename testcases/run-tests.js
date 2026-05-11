const { execSync } = require('child_process');

console.log('🧪 Running Test Suite for At-Home Healthcare Project\n');

try {
  console.log('📋 Running basic setup tests...');
  execSync('npm test -- --testPathPattern=simple.test.tsx --watchAll=false', { stdio: 'inherit' });
  
  console.log('\n✅ Basic tests completed successfully!');
  
  console.log('\n📊 Running all tests with coverage...');
  execSync('npm test -- --coverage --watchAll=false', { stdio: 'inherit' });
  
  console.log('\n🎉 All tests completed successfully!');
  console.log('\n📁 Test Files Created:');
  console.log('  - src/__tests__/simple.test.tsx (Basic functionality)');
  console.log('  - src/__tests__/basic.test.tsx (Setup verification)');
  console.log('  - testcases/components/services/services.test.tsx (Services component)');
  console.log('  - testcases/components/doctor-detail/doctor-detail.test.tsx (DoctorDetail component)');
  
} catch (error) {
  console.error('\n❌ Tests failed:', error.message);
  process.exit(1);
}
