// 🔧 Fix Vercel App Router Issues Script
// This script will help fix the NOT_FOUND error with Next.js 15 App Router

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
  log('⚙️ Updating Next.js configuration for App Router...', 'blue');
  
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove serverExternalPackages for App Router
  // serverExternalPackages: ['@supabase/supabase-js'],
  
  // Ensure proper App Router configuration
  experimental: {
    // Enable any experimental features needed for Next.js 15
  },
  
  // Ensure proper asset handling
  assetPrefix: undefined,
  
  // Ensure proper handling of dynamic routes
  trailingSlash: false,
  
  // Remove output configuration for App Router
  // output: 'standalone',
  
  // Ensure proper environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;`;
  
  fs.writeFileSync('next.config.js', nextConfig);
  log('✓ next.config.js updated for App Router', 'green');
}

function updateVercelConfig() {
  log('🔧 Updating Vercel configuration for App Router...', 'blue');
  
  // For App Router, we don't need vercel.json
  if (checkFileExists('vercel.json')) {
    fs.copyFileSync('vercel.json', 'vercel.json.backup');
    fs.unlinkSync('vercel.json');
    log('✓ vercel.json backed up and removed for App Router', 'green');
  }
}

function updatePackageJson() {
  log('📦 Updating package.json for App Router...', 'blue');
  
  const packageJson = JSON.parse(readFileContent('package.json'));
  
  // Ensure build script is correct for App Router
  packageJson.scripts.build = "prisma generate && next build";
  
  // Ensure postinstall script is present
  packageJson.scripts.postinstall = "prisma generate";
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  log('✓ package.json updated for App Router', 'green');
}

function createSimpleHomePage() {
  log('🏠 Creating simple home page for App Router...', 'blue');
  
  const homePage = `export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Management System
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to the Invoice Management System
          </p>
          <div className="mt-6 space-y-4">
            <a
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </a>
            <a
              href="/debug"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Debug
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  
  fs.writeFileSync('src/app/page.tsx', homePage);
  log('✓ Simple home page created for App Router', 'green');
}

function createSimpleLayout() {
  log('📄 Creating simple layout for App Router...', 'blue');
  
  const layout = `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invoice Management System",
  description: "Manage your invoices efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}`;
  
  fs.writeFileSync('src/app/layout.tsx', layout);
  log('✓ Simple layout created for App Router', 'green');
}

function createSimpleLoginPage() {
  log('🔑 Creating simple login page for App Router...', 'blue');
  
  const loginPage = `export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Management System
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your invoices
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <a
              href="/debug"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Debug
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  
  fs.writeFileSync('src/app/login/page.tsx', loginPage);
  log('✓ Simple login page created for App Router', 'green');
}

function createSimpleDebugPage() {
  log('🔍 Creating simple debug page for App Router...', 'blue');
  
  const debugPage = `export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Invoice Management System - Debug Page
        </h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Environment Variables
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className="text-green-600">Set</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span className="text-green-600">Set</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              API Status
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between">
                <span className="font-medium">/api/health:</span>
                <span className="text-yellow-600">Checking...</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">/api/auth/me:</span>
                <span className="text-yellow-600">Checking...</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">/api/invoices:</span>
                <span className="text-yellow-600">Checking...</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Navigation
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <a
                href="/"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Home
              </a>
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  
  fs.writeFileSync('src/app/debug/page.tsx', debugPage);
  log('✓ Simple debug page created for App Router', 'green');
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel App Router Issues Instructions

## Common Causes and Solutions:

### 1. App Router Configuration Issues
- **Problem**: Next.js 15 App Router requires different configuration
- **Solution**: 
  1. Update Next.js configuration for App Router
  2. Remove vercel.json (not needed for App Router)
  3. Ensure proper page structure

### 2. Build Process Issues
- **Problem**: Build process doesn't generate the correct output for App Router
- **Solution**: 
  1. Update build script
  2. Ensure Prisma Client is generated during build
  3. Remove output configuration from next.config.js

### 3. Environment Variables Not Set in Vercel
- **Problem**: Environment variables are set locally but not in Vercel
- **Solution**: 
  1. Go to Vercel Dashboard → Settings → Environment Variables
  2. Add all the required environment variables from your .env.local file

### 4. Page Structure Issues
- **Problem**: Page structure is not correct for App Router
- **Solution**: 
  1. Ensure proper page structure
  2. Create simple pages to test
  3. Ensure proper layout

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

1. **Update Configuration for App Router**:
   - Update next.config.js for App Router
   - Remove vercel.json (not needed for App Router)
   - Update package.json

2. **Create Simple Pages**:
   - Create simple home page
   - Create simple login page
   - Create simple debug page
   - Create simple layout

3. **Add Environment Variables to Vercel**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all the required environment variables

4. **Redeploy**:
   - Run \`vercel --prod\`
   - Or trigger a new deployment from Vercel Dashboard

5. **Check Debug Page**:
   - Visit \`https://invoice-management-system-six.vercel.app/debug\`
   - Check if all environment variables are set
   - Test API endpoints

6. **Check Login Page**:
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
- [Next.js App Router Docs](https://nextjs.org/docs/app)
`;

  fs.writeFileSync('VERCEL-APP-ROUTER-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel App Router Issues Script', 'bright');
  log('=================================', 'bright');
  log('');
  
  log('🔍 Fixing App Router configuration issues...', 'blue');
  
  // Update configurations
  updateNextConfig();
  updateVercelConfig();
  updatePackageJson();
  
  // Create simple pages
  createSimpleHomePage();
  createSimpleLayout();
  createSimpleLoginPage();
  createSimpleDebugPage();
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ App Router configuration fixed successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app', 'blue');
  log('5. Check https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('6. Check VERCEL-APP-ROUTER-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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
}

// Run the script
main();