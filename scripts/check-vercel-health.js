// 🔍 Vercel Health Check Script
// This script will help diagnose issues with your Vercel deployment

const { execSync } = require('child_process');
const https = require('https');
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

function checkPackageJson() {
  log('📦 Checking package.json...', 'blue');
  
  if (!checkFileExists('package.json')) {
    log('❌ package.json not found', 'red');
    return false;
  }
  
  const packageJson = JSON.parse(readFileContent('package.json'));
  
  // Check if postinstall script is present
  if (!packageJson.scripts || !packageJson.scripts.postinstall) {
    log('❌ postinstall script not found in package.json', 'red');
    return false;
  }
  
  log('✓ postinstall script found in package.json', 'green');
  
  // Check if build script includes prisma generate
  if (!packageJson.scripts || !packageJson.scripts.build.includes('prisma generate')) {
    log('❌ build script does not include prisma generate', 'red');
    return false;
  }
  
  log('✓ build script includes prisma generate', 'green');
  
  return true;
}

function checkNextConfig() {
  log('⚙️ Checking Next.js configuration...', 'blue');
  
  if (!checkFileExists('next.config.js')) {
    log('❌ next.config.js not found', 'red');
    return false;
  }
  
  const nextConfig = readFileContent('next.config.js');
  
  // Check if serverExternalPackages is configured
  if (!nextConfig.includes('serverExternalPackages')) {
    log('❌ serverExternalPackages not configured in next.config.js', 'red');
    return false;
  }
  
  log('✓ serverExternalPackages configured in next.config.js', 'green');
  
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

function checkVercelConfig() {
  log('🔧 Checking Vercel configuration...', 'blue');
  
  if (!checkFileExists('vercel.json')) {
    log('⚠️ vercel.json not found', 'yellow');
    return true; // This is optional
  }
  
  const vercelConfig = JSON.parse(readFileContent('vercel.json'));
  
  // Check for functions configuration (should not be present for App Router)
  if (vercelConfig.functions) {
    log('❌ Functions configuration found in vercel.json (not needed for App Router)', 'red');
    return false;
  }
  
  log('✓ No unnecessary functions configuration in vercel.json', 'green');
  
  return true;
}

function checkApiRoutes() {
  log('🔌 Checking API routes...', 'blue');
  
  const apiRoutes = [
    'src/app/api/auth/me/route.ts',
    'src/app/api/auth/login/route.ts',
    'src/app/api/auth/logout/route.ts',
    'src/app/api/invoices/route.ts'
  ];
  
  let allRoutesPresent = true;
  
  for (const route of apiRoutes) {
    if (!checkFileExists(route)) {
      log(`❌ API route not found: ${route}`, 'red');
      allRoutesPresent = false;
    } else {
      log(`✓ API route found: ${route}`, 'green');
    }
  }
  
  return allRoutesPresent;
}

function checkPageRoutes() {
  log('📄 Checking page routes...', 'blue');
  
  const pageRoutes = [
    'src/app/page.tsx',
    'src/app/login/page.tsx',
    'src/app/layout.tsx'
  ];
  
  let allRoutesPresent = true;
  
  for (const route of pageRoutes) {
    if (!checkFileExists(route)) {
      log(`❌ Page route not found: ${route}`, 'red');
      allRoutesPresent = false;
    } else {
      log(`✓ Page route found: ${route}`, 'green');
    }
  }
  
  return allRoutesPresent;
}

function checkVercelHealth(url) {
  return new Promise((resolve) => {
    log(`🌐 Checking Vercel deployment at ${url}...`, 'blue');
    
    const req = https.get(url, (res) => {
      log(`✓ Response status: ${res.statusCode}`, res.statusCode === 200 ? 'green' : 'yellow');
      
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      log(`❌ Error checking Vercel deployment: ${error.message}`, 'red');
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      log('❌ Timeout checking Vercel deployment', 'red');
      req.destroy();
      resolve(false);
    });
  });
}

function createHealthCheckInstructions() {
  const instructions = `
# 🔍 Vercel Health Check Instructions

## Common Issues and Solutions:

### 1. 404 Error on Deployment
- **Cause**: Missing or incorrect page routes
- **Solution**: Ensure you have a valid page.tsx in src/app/

### 2. API Route Errors
- **Cause**: Missing or incorrect API routes
- **Solution**: Ensure all API routes are properly defined in src/app/api/

### 3. Database Connection Errors
- **Cause**: Incorrect environment variables or database configuration
- **Solution**: 
  - Check that all environment variables are set in Vercel Dashboard
  - Verify DATABASE_URL is correct
  - Ensure Prisma Client is generated during build

### 4. Prisma Client Initialization Error
- **Cause**: Prisma Client not generated during build
- **Solution**: 
  - Add "postinstall": "prisma generate" to package.json
  - Add "prisma generate &&" to the beginning of your build script

### 5. Authentication Errors
- **Cause**: JWT_SECRET not set or incorrect
- **Solution**: Ensure JWT_SECRET is set in Vercel Dashboard

## Debugging Steps:

1. **Check Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure all required variables are set

2. **Check Build Logs**:
   - Go to Vercel Dashboard → Deployments → Latest Deployment
   - Check for any build errors

3. **Check Function Logs**:
   - Go to Vercel Dashboard → Functions
   - Check for any runtime errors

4. **Local Testing**:
   - Run \`npm run build\` locally to check for build errors
   - Run \`npm start\` locally to test the production build

5. **Database Connection**:
   - Test database connection locally
   - Verify DATABASE_URL is correct

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
`;

  fs.writeFileSync('VERCEL-HEALTH-CHECK-INSTRUCTIONS.md', instructions);
  log('✓ Vercel health check instructions created', 'green');
}

async function main() {
  log('🔍 Vercel Health Check Script', 'bright');
  log('=================================', 'bright');
  log('');
  
  let issuesFound = false;
  
  // Check for common issues
  if (!checkEnvironmentVariables()) {
    issuesFound = true;
  }
  
  if (!checkPackageJson()) {
    issuesFound = true;
  }
  
  if (!checkNextConfig()) {
    issuesFound = true;
  }
  
  if (!checkPrismaSchema()) {
    issuesFound = true;
  }
  
  if (!checkVercelConfig()) {
    issuesFound = true;
  }
  
  if (!checkApiRoutes()) {
    issuesFound = true;
  }
  
  if (!checkPageRoutes()) {
    issuesFound = true;
  }
  
  // Check Vercel deployment
  const isHealthy = await checkVercelHealth('https://invoice-management-system-six.vercel.app');
  
  if (!isHealthy) {
    issuesFound = true;
  }
  
  // Create health check instructions
  createHealthCheckInstructions();
  
  log('', 'reset');
  
  if (issuesFound) {
    log('❌ Issues found, please check the logs above', 'red');
    log('📋 Check VERCEL-HEALTH-CHECK-INSTRUCTIONS.md for detailed solutions', 'blue');
  } else {
    log('✅ No issues found, your deployment looks healthy', 'green');
  }
  
  log('', 'reset');
  log('🎯 Next Steps:', 'blue');
  log('1. Configure environment variables in Vercel Dashboard', 'blue');
  log('2. Redeploy your application: vercel --prod', 'blue');
  log('3. Check VERCEL-HEALTH-CHECK-INSTRUCTIONS.md for more details', 'blue');
}

// Run the script
main();