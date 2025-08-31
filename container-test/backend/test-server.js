// Simple test to verify the server can start
// This will help catch any immediate startup issues

const { spawn } = require('child_process');

console.log('🧪 Testing server startup...');

// Try to start the server
const server = spawn('node', ['dist/index.js'], {
  stdio: 'pipe',
  env: { ...process.env, NODE_ENV: 'test' }
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
  console.log('✅ Server output:', data.toString().trim());
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('❌ Server error:', data.toString().trim());
});

server.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Server test completed successfully');
  } else {
    console.log(`❌ Server test failed with code ${code}`);
    if (errorOutput) {
      console.log('Error details:', errorOutput);
    }
  }
});

// Kill the server after 5 seconds
setTimeout(() => {
  server.kill();
  console.log('🛑 Test completed');
}, 5000); 