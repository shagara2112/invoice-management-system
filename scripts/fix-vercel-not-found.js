// 🔧 Fix Vercel NOT_FOUND Error Script
// This script will help fix the NOT_FOUND error on your Vercel deployment

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

function updateNextConfig() {
  log('⚙️ Updating Next.js configuration...', 'blue');
  
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@supabase/supabase-js'],
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Ensure trailingSlash is properly handled
  trailingSlash: false,
  // Ensure proper output handling
  output: 'standalone',
  // Ensure proper asset handling
  assetPrefix: undefined,
  // Ensure proper handling of dynamic routes
  experimental: {
    // Enable any experimental features needed for Next.js 15
  },
};

module.exports = nextConfig;`;
  
  fs.writeFileSync('next.config.js', nextConfig);
  log('✓ next.config.js updated', 'green');
}

function updateVercelConfig() {
  log('🔧 Updating Vercel configuration...', 'blue');
  
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/next"
      }
    ],
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "/api/$1"
      },
      {
        "src": "/(.*)",
        "dest": "/$1"
      }
    ],
    "env": {
      "NODE_ENV": "production"
    },
    "headers": [
      {
        "source": "/api/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-store, must-revalidate"
          }
        ]
      }
    ]
  };
  
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  log('✓ vercel.json updated', 'green');
}

function createHomePage() {
  log('🏠 Creating simple home page...', 'blue');
  
  if (checkFileExists('src/app/page.tsx')) {
    // Backup the existing page
    fs.copyFileSync('src/app/page.tsx', 'src/app/page.tsx.backup');
    log('✓ Backed up existing page.tsx', 'green');
  }
  
  const homePage = `import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to debug page to diagnose issues
  redirect('/debug');
}`;
  
  fs.writeFileSync('src/app/page.tsx', homePage);
  log('✓ Simple home page created', 'green');
}

function updatePackageJson() {
  log('📦 Updating package.json...', 'blue');
  
  const packageJson = JSON.parse(readFileContent('package.json'));
  
  // Ensure build script is correct
  packageJson.scripts.build = "prisma generate && next build";
  
  // Ensure postinstall script is present
  packageJson.scripts.postinstall = "prisma generate";
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  log('✓ package.json updated', 'green');
}

function createBuildScript() {
  log('🔨 Creating build script...', 'blue');
  
  const buildScript = `#!/bin/bash

echo "🔨 Building application..."

# Generate Prisma client
echo "📊 Generating Prisma client..."
npx prisma generate

# Build Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"`;
  
  fs.writeFileSync('scripts/build.sh', buildScript);
  
  // Make the script executable
  try {
    execSync('chmod +x scripts/build.sh');
  } catch (error) {
    // Ignore error on Windows
  }
  
  log('✓ Build script created', 'green');
}

function createDeploymentScript() {
  log('🚀 Creating deployment script...', 'blue');
  
  const deployScript = `#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Build the application
echo "🔨 Building application..."
./scripts/build.sh

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment completed successfully!"`;
  
  fs.writeFileSync('scripts/deploy.sh', deployScript);
  
  // Make the script executable
  try {
    execSync('chmod +x scripts/deploy.sh');
  } catch (error) {
    // Ignore error on Windows
  }
  
  log('✓ Deployment script created', 'green');
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel NOT_FOUND Error Instructions

## Common Causes and Solutions:

### 1. Build Process Issues
- **Problem**: Build process doesn't generate the correct output
- **Solution**: 
  1. Update Next.js configuration
  2. Update Vercel configuration
  3. Ensure Prisma Client is generated during build

### 2. Environment Variables Not Set in Vercel
- **Problem**: Environment variables are set locally but not in Vercel
- **Solution**: 
  1. Go to Vercel Dashboard → Settings → Environment Variables
  2. Add all the required environment variables from your .env.local file

### 3. Routing Issues
- **Problem**: Next.js 15 routing is not working correctly
- **Solution**: 
  1. Update Next.js configuration
  2. Update Vercel configuration
  3. Ensure proper routing setup

### 4. Output Configuration Issues
- **Problem**: Output configuration is not set correctly
- **Solution**: 
  1. Set output to 'standalone' in next.config.js
  2. Ensure proper build script

## Debugging Steps:

### 1. Check the Debug Page
Visit \`https://invoice-management-system-six.vercel.app/debug\` to:
- Check if environment variables are set
- Test API endpoints
- View error messages

### 2. Check Environment Variables
Make sure all these variables are set in Vercel Dashboard:
- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- \`SUPABASE_SERVICE_ROLE_KEY\`
- \`DATABASE_URL\`
- \`JWT_SECRET\`
- \`NEXTAUTH_SECRET\`
- \`NEXTAUTH_URL\`

### 3. Check Build Logs
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check for any build errors

### 4. Check Function Logs
1. Go to Vercel Dashboard → Functions
2. Check for any runtime errors
3. Look for database connection errors

### 5. Test API Endpoints
- \`/api/health\` - Check if the application is running
- \`/api/auth/me\` - Check if authentication is working
- \`/api/invoices\` - Check if database connection is working

## Required Environment Variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://vzavjwkspqmqshmcwdyj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMjEsImV4cCI6MjA3NTQ2NzEyMX0.YOFjpw21w-BfDmmSG33M_vuyKR1lH1cVTCMjsGE5yPo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5MTEyMSwiZXhwIjoyMDc1NDY3MTIxfQ.tRx2-ayPdn0yotTqobS16uNY8h5KbAtmJ-bsZ_KG9r8
DATABASE_URL=postgresql://postgres:2112Danpei2112@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres
JWT_SECRET=i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA==
NEXTAUTH_SECRET=i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA==
NEXTAUTH_URL=https://invoice-management-system-six.vercel.app
\`\`\`

## Quick Fix:

1. **Update Configuration**:
   - Update next.config.js with proper configuration
   - Update vercel.json with proper configuration

2. **Add Environment Variables to Vercel**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all the required environment variables

3. **Redeploy**:
   - Run \`./scripts/deploy.sh\`
   - Or trigger a new deployment from Vercel Dashboard

4. **Check Debug Page**:
   - Visit \`https://invoice-management-system-six.vercel.app/debug\`
   - Check if all environment variables are set
   - Test API endpoints

5. **Check Login Page**:
   - Visit \`https://invoice-management-system-six.vercel.app/login\`
   - Try to login with the test credentials

## Test Credentials:

- **Email**: admin@invoice-app.com
- **Password**: admin123
- **Role**: SUPER_ADMIN

## Additional Resources:

- [Vercel Deployment Docs](https://vercel.com/docs/concepts/deployments)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Prisma Deployment Docs](https://www.prisma.io/docs/guides/deployment)
- [Next.js 15 Migration Guide](https://nextjs.org/docs/messages/next-upgrade)
`;

  fs.writeFileSync('VERCEL-NOT-FOUND-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel NOT_FOUND Error Script', 'bright');
  log('=================================', 'bright');
  log('');
  
  log('🔍 Fixing configuration issues...', 'blue');
  
  // Update configurations
  updateNextConfig();
  updateVercelConfig();
  updatePackageJson();
  
  // Create simple home page
  createHomePage();
  
  // Create scripts
  createBuildScript();
  createDeploymentScript();
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ Configuration fixed successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy using the deployment script: ./scripts/deploy.sh', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('5. Check VERCEL-NOT-FOUND-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
  log('', 'reset');
  
  log('🔑 Required Environment Variables:', 'yellow');
  log('- NEXT_PUBLIC_SUPABASE_URL', 'yellow');
  log('- NEXT_PUBLIC_SUPABASE_ANON_KEY', 'yellow');
  log('- SUPABASE_SERVICE_ROLE_KEY', 'yellow');
  log('- DATABASE_URL', 'yellow');
  log('- JWT_SECRET', 'yellow');
  log('- NEXTAUTH_SECRET', 'yellow');
  log('- NEXTAUTH_URL', 'yellow');
  log('', 'reset');
  
  log('🧪 Test Credentials:', 'cyan');
  log('- Email: admin@invoice-app.com', 'cyan');
  log('- Password: admin123', 'cyan');
  log('- Role: SUPER_ADMIN', 'cyan');
  log('', 'reset');
  
  log('🚀 Deployment Commands:', 'magenta');
  log('- Build: ./scripts/build.sh', 'magenta');
  log('- Deploy: ./scripts/deploy.sh', 'magenta');
  log('- Manual: vercel --prod', 'magenta');
}

// Run the script
main();