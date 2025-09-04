#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Google Fit Integration Setup\n');

// Check if server directory exists
const serverDir = path.join(__dirname, 'server');
if (!fs.existsSync(serverDir)) {
  console.log('❌ Server directory not found. Please ensure you have the complete project structure.');
  process.exit(1);
}

// Create .env file for server
const serverEnvPath = path.join(serverDir, '.env');
const serverEnvTemplate = `# Google Fit API Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret for session management
JWT_SECRET=your_secure_jwt_secret_here

# CORS Configuration
FRONTEND_URL=http://localhost:5173
`;

if (!fs.existsSync(serverEnvPath)) {
  fs.writeFileSync(serverEnvPath, serverEnvTemplate);
  console.log('✅ Created server/.env file');
} else {
  console.log('ℹ️  server/.env file already exists');
}

// Create .env.local file for frontend
const frontendEnvPath = path.join(__dirname, '.env.local');
const frontendEnvTemplate = `VITE_API_BASE_URL=http://localhost:3001
VITE_GEMINI_API_KEY=AIzaSyC122G3uWGBZwugIhVxLeiUoWaUFe82G8s
`;

if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(frontendEnvPath, frontendEnvTemplate);
  console.log('✅ Created .env.local file');
} else {
  console.log('ℹ️  .env.local file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Google Fit API');
console.log('4. Create OAuth 2.0 credentials');
console.log('5. Add redirect URI: http://localhost:3001/auth/google/callback');
console.log('6. Update server/.env with your Google credentials');
console.log('7. Run: cd server && npm install');
console.log('8. Run: npm install (in root directory)');
console.log('9. Start backend: cd server && npm run dev');
console.log('10. Start frontend: npm run dev');
console.log('\n📖 For detailed instructions, see GOOGLE_FIT_SETUP.md');


