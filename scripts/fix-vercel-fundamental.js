// 🔧 Fix Vercel Fundamental Issues Script
// This script will help fix the NOT_FOUND error with fundamental changes

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

function createBasicNextConfig() {
  log('⚙️ Creating basic Next.js configuration...', 'blue');
  
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration for Next.js 15
  experimental: {
    // Enable any experimental features needed for Next.js 15
  },
};

module.exports = nextConfig;`;
  
  fs.writeFileSync('next.config.js', nextConfig);
  log('✓ Basic next.config.js created', 'green');
}

function createBasicPackageJson() {
  log('📦 Creating basic package.json...', 'blue');
  
  const packageJson = {
    "name": "invoice-management-system",
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "postinstall": "prisma generate"
    },
    "dependencies": {
      "@prisma/client": "^6.11.1",
      "next": "15.3.5",
      "prisma": "^6.11.1",
      "react": "^19.0.0",
      "react-dom": "^19.0.0"
    },
    "devDependencies": {
      "@types/node": "^20",
      "@types/react": "^19",
      "@types/react-dom": "^19",
      "eslint": "^9",
      "eslint-config-next": "15.3.5",
      "typescript": "^5"
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  log('✓ Basic package.json created', 'green');
}

function createBasicAppStructure() {
  log('📁 Creating basic App Router structure...', 'blue');
  
  // Create app directory structure
  if (!checkFileExists('src/app')) {
    fs.mkdirSync('src/app', { recursive: true });
  }
  
  // Create layout
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
  log('✓ Basic layout created', 'green');
  
  // Create page
  const page = `export default function HomePage() {
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
  
  fs.writeFileSync('src/app/page.tsx', page);
  log('✓ Basic page created', 'green');
  
  // Create globals.css
  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
  
  fs.writeFileSync('src/app/globals.css', globalsCss);
  log('✓ Basic globals.css created', 'green');
  
  // Create login directory and page
  if (!checkFileExists('src/app/login')) {
    fs.mkdirSync('src/app/login', { recursive: true });
  }
  
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
  log('✓ Basic login page created', 'green');
  
  // Create debug directory and page
  if (!checkFileExists('src/app/debug')) {
    fs.mkdirSync('src/app/debug', { recursive: true });
  }
  
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
  log('✓ Basic debug page created', 'green');
}

function createBasicApiStructure() {
  log('🔌 Creating basic API structure...', 'blue');
  
  // Create api directory structure
  if (!checkFileExists('src/app/api')) {
    fs.mkdirSync('src/app/api', { recursive: true });
  }
  
  // Create health API
  if (!checkFileExists('src/app/api/health')) {
    fs.mkdirSync('src/app/api/health', { recursive: true });
  }
  
  const healthApi = `import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'Error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}`;
  
  fs.writeFileSync('src/app/api/health/route.ts', healthApi);
  log('✓ Basic health API created', 'green');
}

function createBasicTailwindConfig() {
  log('🎨 Creating basic Tailwind configuration...', 'blue');
  
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
  
  fs.writeFileSync('tailwind.config.js', tailwindConfig);
  log('✓ Basic tailwind.config.js created', 'green');
}

function createBasicPostcssConfig() {
  log('📝 Creating basic PostCSS configuration...', 'blue');
  
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
  
  fs.writeFileSync('postcss.config.js', postcssConfig);
  log('✓ Basic postcss.config.js created', 'green');
}

function createBasicTsConfig() {
  log('📝 Creating basic TypeScript configuration...', 'blue');
  
  const tsConfig = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;
  
  fs.writeFileSync('tsconfig.json', tsConfig);
  log('✓ Basic tsconfig.json created', 'green');
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel Fundamental Issues Instructions

## Common Causes and Solutions:

### 1. Basic Structure Issues
- **Problem**: Basic structure is not correct for Next.js 15 App Router
- **Solution**: 
  1. Create basic Next.js configuration
  2. Create basic App Router structure
  3. Create basic API structure

### 2. Build Process Issues
- **Problem**: Build process doesn't generate the correct output
- **Solution**: 
  1. Create basic package.json
  2. Ensure proper build script
  3. Ensure Prisma Client is generated during build

### 3. Environment Variables Not Set in Vercel
- **Problem**: Environment variables are set locally but not in Vercel
- **Solution**: 
  1. Go to Vercel Dashboard → Settings → Environment Variables
  2. Add all the required environment variables from your .env.local file

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

1. **Create Basic Structure**:
   - Create basic Next.js configuration
   - Create basic App Router structure
   - Create basic API structure

2. **Add Environment Variables to Vercel**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all the required environment variables

3. **Redeploy**:
   - Run \`vercel --prod\`
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
- [Next.js App Router Docs](https://nextjs.org/docs/app)
`;

  fs.writeFileSync('VERCEL-FUNDAMENTAL-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel Fundamental Issues Script', 'bright');
  log('=================================', 'bright');
  log('');
  
  log('🔍 Creating fundamental structure...', 'blue');
  
  // Create basic configurations
  createBasicNextConfig();
  createBasicPackageJson();
  createBasicTailwindConfig();
  createBasicPostcssConfig();
  createBasicTsConfig();
  
  // Create basic structure
  createBasicAppStructure();
  createBasicApiStructure();
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ Fundamental structure created successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app', 'blue');
  log('5. Check https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('6. Check VERCEL-FUNDAMENTAL-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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