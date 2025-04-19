const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Create uploads directory in dist if it doesn't exist
if (!fs.existsSync('dist/uploads')) {
  fs.mkdirSync('dist/uploads');
}

// Compile TypeScript files
exec('tsc --noEmitOnError false', (error, stdout, stderr) => {
  if (error) {
    console.error(`TypeScript compilation warning (continuing anyway): ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`TypeScript compilation stderr: ${stderr}`);
    return;
  }
  console.log(`TypeScript compilation successful: ${stdout}`);
});
