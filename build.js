import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Create dist folder if it doesn't exist
if (!existsSync('dist')) {
  mkdirSync('dist');
}

// Build the frontend
console.log('Building frontend...');
execSync('npm run build', { stdio: 'inherit' });

// Copy server files to dist for Netlify functions
console.log('Preparing backend for deployment...');

// Create functions directory if it doesn't exist
if (!existsSync('netlify/functions')) {
  mkdirSync('netlify/functions', { recursive: true });
}

console.log('Build completed successfully!');