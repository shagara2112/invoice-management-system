// 🚀 Fix Vercel Deployment Script
// This script will help diagnose and fix common Vercel deployment issues

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

function checkPackageJson() {
  log('📦 Checking package.json...', 'blue');
  
  if (!checkFileExists('package.json')) {
    log('❌ package.json not found', 'red');
    return false;
  }
  
  const packageJson = JSON.parse(readFileContent('package.json'));
  
  // Check if Next.js is in dependencies
  if (!packageJson.dependencies || !packageJson.dependencies.next) {
    log('❌ Next.js not found in dependencies', 'red');
    return false;
  }
  
  log('✓ Next.js found in dependencies', 'green');
  
  // Check build script
  if (!packageJson.scripts || !packageJson.scripts.build) {
    log('❌ Build script not found in package.json', 'red');
    return false;
  }
  
  log('✓ Build script found in package.json', 'green');
  
  return true;
}

function checkNextConfig() {
  log('⚙️ Checking Next.js configuration...', 'blue');
  
  // Check for next.config.js or next.config.mjs
  if (checkFileExists('next.config.js')) {
    log('✓ next.config.js found', 'green');
    return true;
  } else if (checkFileExists('next.config.mjs')) {
    log('✓ next.config.mjs found', 'green');
    return true;
  } else {
    log('⚠️ Next.js configuration file not found', 'yellow');
    return false;
  }
}

function checkVercelConfig() {
  log('🔧 Checking Vercel configuration...', 'blue');
  
  if (!checkFileExists('vercel.json')) {
    log('⚠️ vercel.json not found', 'yellow');
    return false;
  }
  
  const vercelConfig = JSON.parse(readFileContent('vercel.json'));
  
  // Check if functions configuration is correct
  if (vercelConfig.functions) {
    log('✓ Functions configuration found', 'green');
    
    // Check for deprecated patterns
    if (vercelConfig.functions['src/pages/api/**/*.js']) {
      log('❌ Deprecated pattern found: src/pages/api/**/*.js', 'red');
      log('This pattern is for Pages Router, but you are using App Router', 'yellow');
      return false;
    }
    
    if (vercelConfig.functions['src/app/api/**/*.ts']) {
      log('✓ App Router pattern found: src/app/api/**/*.ts', 'green');
    }
  }
  
  // Check for builds configuration (deprecated)
  if (vercelConfig.builds) {
    log('❌ Builds configuration found (deprecated)', 'red');
    log('Builds configuration is deprecated and may cause deployment issues', 'yellow');
    return false;
  }
  
  return true;
}

function checkPrismaSchema() {
  log('🗄️ Checking Prisma schema...', 'blue');
  
  if (!checkFileExists('prisma/schema.prisma')) {
    log('❌ Prisma schema not found', 'red');
    return false;
  }
  
  const schema = readFileContent('prisma/schema.prisma');
  
  // Check if database URL is configured
  if (!schema.includes('env("DATABASE_URL")')) {
    log('❌ DATABASE_URL not configured in Prisma schema', 'red');
    return false;
  }
  
  log('✓ DATABASE_URL configured in Prisma schema', 'green');
  
  return true;
}

function checkEnvironmentVariables() {
  log('🔑 Checking environment variables...', 'blue');
  
  if (!checkFileExists('.env.local')) {
    log('❌ .env.local not found', 'red');
    return false;
  }
  
  const envLocal = readFileContent('.env.local');
  
  // Check required environment variables
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXTAUTH_SECRET'
  ];
  
  let allVarsPresent = true;
  
  for (const varName of requiredVars) {
    if (!envLocal.includes(`${varName}=`)) {
      log(`❌ ${varName} not found in .env.local`, 'red');
      allVarsPresent = false;
    } else {
      log(`✓ ${varName} found in .env.local`, 'green');
    }
  }
  
  return allVarsPresent;
}

function fixVercelConfig() {
  log('🔧 Fixing Vercel configuration...', 'blue');
  
  // Read current vercel.json
  if (!checkFileExists('vercel.json')) {
    log('⚠️ vercel.json not found, creating a new one...', 'yellow');
    
    const defaultVercelConfig = {
      version: 2,
      env: {
        NODE_ENV: "production"
      },
      functions: {
        "src/app/api/**/*.ts": {
          maxDuration: 30
        }
      },
      headers: [
        {
          source: "/api/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, must-revalidate"
            }
          ]
        },
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Frame-Options",
              value: "DENY"
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff"
            },
            {
              key: "Referrer-Policy",
              value: "origin-when-cross-origin"
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block"
            }
          ]
        }
      ],
      redirects: [
        {
          source: "/home",
          destination: "/",
          permanent: true
        }
      ]
    };
    
    fs.writeFileSync('vercel.json', JSON.stringify(defaultVercelConfig, null, 2));
    log('✓ Default vercel.json created', 'green');
    return true;
  }
  
  const vercelConfig = JSON.parse(readFileContent('vercel.json'));
  
  // Fix common issues
  let needsUpdate = false;
  
  // Remove builds configuration (deprecated)
  if (vercelConfig.builds) {
    log('🔧 Removing deprecated builds configuration...', 'yellow');
    delete vercelConfig.builds;
    needsUpdate = true;
  }
  
  // Remove deprecated functions pattern
  if (vercelConfig.functions && vercelConfig.functions['src/pages/api/**/*.js']) {
    log('🔧 Removing deprecated functions pattern...', 'yellow');
    delete vercelConfig.functions['src/pages/api/**/*.js'];
    needsUpdate = true;
  }
  
  // Add App Router functions pattern if not present
  if (!vercelConfig.functions || !vercelConfig.functions['src/app/api/**/*.ts']) {
    log('🔧 Adding App Router functions pattern...', 'yellow');
    
    if (!vercelConfig.functions) {
      vercelConfig.functions = {};
    }
    
    vercelConfig.functions['src/app/api/**/*.ts'] = {
      maxDuration: 30
    };
    
    needsUpdate = true;
  }
  
  if (needsUpdate) {
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    log('✓ vercel.json fixed', 'green');
  } else {
    log('✓ vercel.json is already correct', 'green');
  }
  
  return true;
}

function fixNextConfig() {
  log('⚙️ Fixing Next.js configuration...', 'blue');
  
  let needsUpdate = false;
  let nextConfigPath = null;
  
  if (checkFileExists('next.config.js')) {
    nextConfigPath = 'next.config.js';
  } else if (checkFileExists('next.config.mjs')) {
    nextConfigPath = 'next.config.mjs';
  }
  
  if (!nextConfigPath) {
    log('⚠️ Next.js configuration file not found, creating next.config.js...', 'yellow');
    
    const defaultNextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
`;
    
    fs.writeFileSync('next.config.js', defaultNextConfig);
    log('✓ Default next.config.js created', 'green');
    return true;
  }
  
  const nextConfig = readFileContent(nextConfigPath);
  
  // Check for common issues
  if (!nextConfig.includes('experimental')) {
    log('🔧 Adding experimental configuration...', 'yellow');
    
    const updatedConfig = nextConfig.replace(
      /(const nextConfig = \{)/,
      `$1
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },`
    );
    
    fs.writeFileSync(nextConfigPath, updatedConfig);
    needsUpdate = true;
  }
  
  if (needsUpdate) {
    log('✓ Next.js configuration fixed', 'green');
  } else {
    log('✓ Next.js configuration is already correct', 'green');
  }
  
  return true;
}

function createDeploymentInstructions() {
  const instructions = `
# 🚀 Vercel Deployment Instructions

## 🔧 Common Issues and Fixes:

### 1. Environment Variables
Make sure all required environment variables are set in Vercel Dashboard:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://vzavjwkspqmqshmcwdyj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMjEsImV4cCI6MjA3NTQ2NzEyMX0.YOFjpw21w-BfDmmSG33M_vuyKR1lH1cVTCMjsGE5yPo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5MTEyMSwiZXhwIjoyMDc1NDY3MTIxfQ.tRx2-ayPdn0yotTqobS16uNY8h5KbAtmJ-bsZ_KG9r8
DATABASE_URL=postgresql://postgres:2112Danpei2112@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres
JWT_SECRET=i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA==
NEXTAUTH_SECRET=i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA==
NEXTAUTH_URL=https://invoice-management-system-six.vercel.app
\`\`\`

### 2. Build Issues
If you encounter build issues, try:

1. Clear build cache:
   \`\`\`bash
   rm -rf .next
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Build locally to test:
   \`\`\`bash
   npm run build
   \`\`\`

### 3. Database Connection Issues
If you encounter database connection issues:

1. Check DATABASE_URL format
2. Verify Supabase project is active
3. Check if password is correct

### 4. API Routes Issues
If you encounter API routes issues:

1. Check vercel.json configuration
2. Make sure API routes are in src/app/api/
3. Check if file extensions are correct (.ts)

## 🚀 Deployment Steps:

1. Configure environment variables in Vercel Dashboard
2. Deploy to Vercel:
   \`\`\`bash
   vercel --prod
   \`\`\`
3. Test the application
4. Check logs if issues occur

## 🔍 Debugging:

Check Vercel Function Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. Check logs for errors

Check Build Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Deployments tab
4. Click on the latest deployment
5. Check Build logs for errors
`;

  fs.writeFileSync('VERCEL-DEPLOYMENT-INSTRUCTIONS.md', instructions);
  log('✓ Vercel deployment instructions created', 'green');
}

function main() {
  log('🚀 Fix Vercel Deployment Script', 'bright');
  log('=================================', 'bright');
  log('');
  
  let issuesFound = false;
  
  // Check for common issues
  if (!checkPackageJson()) {
    issuesFound = true;
  }
  
  if (!checkNextConfig()) {
    issuesFound = true;
  }
  
  if (!checkVercelConfig()) {
    issuesFound = true;
  }
  
  if (!checkPrismaSchema()) {
    issuesFound = true;
  }
  
  if (!checkEnvironmentVariables()) {
    issuesFound = true;
  }
  
  if (issuesFound) {
    log('', 'reset');
    log('❌ Issues found, attempting to fix...', 'red');
    log('', 'reset');
    
    // Try to fix issues
    fixVercelConfig();
    fixNextConfig();
    
    log('', 'reset');
    log('✅ Issues fixed, please try deploying again', 'green');
  } else {
    log('', 'reset');
    log('✅ No issues found, your configuration looks good', 'green');
  }
  
  // Create deployment instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('📋 Next Steps:', 'blue');
  log('1. Configure environment variables in Vercel Dashboard', 'blue');
  log('2. Deploy to Vercel: vercel --prod', 'blue');
  log('3. Check VERCEL-DEPLOYMENT-INSTRUCTIONS.md for more details', 'blue');
}

// Run the script
main();