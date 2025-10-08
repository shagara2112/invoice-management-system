// 🔧 Fix Vercel 404 Error Script
// This script will help fix the 404 error on your Vercel deployment

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

function createVercelJson() {
  log('🔧 Creating vercel.json...', 'blue');
  
  const vercelConfig = {
    "version": 2,
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
  log('✓ vercel.json created', 'green');
}

function createDebugPage() {
  log('🔍 Creating debug page...', 'blue');
  
  const debugPage = `'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState({});
  const [apiStatus, setApiStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEnvironment();
    checkApiStatus();
  }, []);

  const checkEnvironment = () => {
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
    });
  };

  const checkApiStatus = async () => {
    const status = {};
    
    try {
      const response = await fetch('/api/health');
      status.health = response.ok ? 'OK' : 'Error';
    } catch (error) {
      status.health = 'Error';
    }
    
    try {
      const response = await fetch('/api/auth/me');
      status.auth = response.status === 401 ? 'Working (401)' : 'Error';
    } catch (error) {
      status.auth = 'Error';
    }
    
    try {
      const response = await fetch('/api/invoices');
      status.invoices = response.ok ? 'OK' : 'Error';
    } catch (error) {
      status.invoices = 'Error';
    }
    
    setApiStatus(status);
    setLoading(false);
  };

  const refresh = () => {
    setLoading(true);
    checkEnvironment();
    checkApiStatus();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Invoice Management System - Debug Page</CardTitle>
          <CardDescription>
            This page helps diagnose issues with your deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refresh} className="mb-4">Refresh</Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex justify-between mb-2">
                    <span>{key}:</span>
                    <Badge variant={value === 'Set' ? 'default' : 'destructive'}>
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Status</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Checking API status...</p>
                ) : (
                  Object.entries(apiStatus).map(([key, value]) => (
                    <div key={key} className="flex justify-between mb-2">
                      <span>/api/{key}:</span>
                      <Badge variant={value === 'OK' || value.includes('401') ? 'default' : 'destructive'}>
                        {value}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;
  
  if (!fs.existsSync('src/app/debug')) {
    fs.mkdirSync('src/app/debug', { recursive: true });
  }
  
  fs.writeFileSync('src/app/debug/page.tsx', debugPage);
  log('✓ Debug page created at /debug', 'green');
}

function createHealthApi() {
  log('🏥 Creating health API...', 'blue');
  
  if (!fs.existsSync('src/app/api/health')) {
    fs.mkdirSync('src/app/api/health', { recursive: true });
  }
  
  const healthApi = `import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if we can connect to the database
    const { db } = await import('@/lib/db');
    await db.$queryRaw\`SELECT 1\`;
    
    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'Error',
        timestamp: new Date().toISOString(),
        database: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}`;
  
  fs.writeFileSync('src/app/api/health/route.ts', healthApi);
  log('✓ Health API created at /api/health', 'green');
}

function createErrorPage() {
  log('❌ Creating error page...', 'blue');
  
  const errorPage = `'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Something went wrong!</CardTitle>
          <CardDescription>
            An error occurred while loading this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm font-mono">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" onClick={() => router.push('/debug')}>
              Debug
            </Button>
            <Button variant="outline" onClick={() => router.push('/login')}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;
  
  fs.writeFileSync('src/app/error.tsx', errorPage);
  log('✓ Error page created', 'green');
}

function createNotFoundPage() {
  log('🔍 Creating 404 page...', 'blue');
  
  const notFoundPage = `'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">404 - Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => router.push('/')}>Home</Button>
            <Button variant="outline" onClick={() => router.push('/debug')}>
              Debug
            </Button>
            <Button variant="outline" onClick={() => router.push('/login')}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;
  
  fs.writeFileSync('src/app/not-found.tsx', notFoundPage);
  log('✓ 404 page created', 'green');
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel 404 Error Instructions

## Common Causes and Solutions:

### 1. Environment Variables Not Set in Vercel
- **Problem**: Environment variables are set locally but not in Vercel
- **Solution**: 
  1. Go to Vercel Dashboard → Settings → Environment Variables
  2. Add all the required environment variables from your .env.local file

### 2. Build Process Issues
- **Problem**: Build process fails or doesn't generate the correct output
- **Solution**: 
  1. Check your build logs in Vercel Dashboard
  2. Ensure \`prisma generate\` is included in your build script
  3. Make sure all dependencies are installed

### 3. API Route Errors
- **Problem**: API routes are not working correctly
- **Solution**: 
  1. Check the Function Logs in Vercel Dashboard
  2. Ensure database connection is working
  3. Verify all environment variables are set

### 4. Client-side Navigation Issues
- **Problem**: Client-side navigation is not working correctly
- **Solution**: 
  1. Check for JavaScript errors in the browser console
  2. Ensure all components are properly imported
  3. Verify that all routes are correctly defined

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

1. **Add Environment Variables to Vercel**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all the required environment variables

2. **Redeploy**:
   - Run \`vercel --prod\`
   - Or trigger a new deployment from Vercel Dashboard

3. **Check Debug Page**:
   - Visit \`https://invoice-management-system-six.vercel.app/debug\`
   - Check if all environment variables are set
   - Test API endpoints

4. **Check Login Page**:
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
`;

  fs.writeFileSync('VERCEL-404-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel 404 Error Script', 'bright');
  log('=================================', 'bright');
  log('');
  
  log('🔍 Creating debugging tools...', 'blue');
  
  // Create debugging tools
  createVercelJson();
  createDebugPage();
  createHealthApi();
  createErrorPage();
  createNotFoundPage();
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ Debugging tools created successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Redeploy your application: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('5. Check VERCEL-404-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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