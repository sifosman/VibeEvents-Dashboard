#!/usr/bin/env node
const { execSync } = require('child_process');

// Run the drizzle-kit push command and automatically select the first option
try {
  const result = execSync('echo "1" | npm run db:push', { stdio: 'inherit' });
  console.log('Database schema pushed successfully');
} catch (error) {
  console.error('Error pushing schema:', error.message);
  process.exit(1);
}
