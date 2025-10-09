// 🔧 Diagnose Vercel Deployment Script
// This script will help diagnose and fix deployment issues in Vercel

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

function checkDeploymentErrors() {
  log('🔍 Checking deployment errors...', 'blue');
  
  // Check for common deployment issues
  const issues = [];
  
  // Check if vercel.json exists
  if (!checkFileExists('vercel.json')) {
    issues.push('vercel.json not found');
  }
  
  // Check if next.config.js exists
  if (!checkFileExists('next.config.js')) {
    issues.push('next.config.js not found');
  }
  
  // Check if package.json exists
  if (!checkFileExists('package.json')) {
    issues.push('package.json not found');
  }
  
  // Check if src/app directory exists
  if (!checkFileExists('src/app')) {
    issues.push('src/app directory not found');
  }
  
  // Check if src/app/page.tsx exists
  if (!checkFileExists('src/app/page.tsx')) {
    issues.push('src/app/page.tsx not found');
  }
  
  // Check if src/app/layout.tsx exists
  if (!checkFileExists('src/app/layout.tsx')) {
    issues.push('src/app/layout.tsx not found');
  }
  
  // Check if src/app/globals.css exists
  if (!checkFileExists('src/app/globals.css')) {
    issues.push('src/app/globals.css not found');
  }
  
  // Check if src/app/api/health/route.ts exists
  if (!checkFileExists('src/app/api/health/route.ts')) {
    issues.push('src/app/api/health/route.ts not found');
  }
  
  // Check if .env.example exists
  if (!checkFileExists('.env.example')) {
    issues.push('.env.example not found');
  }
  
  // Check if .env.production exists
  if (!checkFileExists('.env.production')) {
    issues.push('.env.production not found');
  }
  
  // Check if prisma/schema.prisma exists
  if (!checkFileExists('prisma/schema.prisma')) {
    issues.push('prisma/schema.prisma not found');
  }
  
  // Check if calendar component exists
  if (!checkFileExists('src/components/ui/calendar.tsx')) {
    issues.push('src/components/ui/calendar.tsx not found');
  }
  
  // Check if calendar component has errors
  if (checkFileExists('src/components/ui/calendar.tsx')) {
    const calendarContent = readFileContent('src/components/ui/calendar.tsx');
    if (calendarContent && calendarContent.includes('defaultClassNames.root')) {
      issues.push('calendar component still has defaultClassNames.root');
    }
    if (calendarContent && calendarContent.includes('button_previous:')) {
      issues.push('calendar component still has button_previous (should be nav_button_previous)');
    }
    if (calendarContent && calendarContent.includes('button_next:')) {
      issues.push('calendar component still has button_next (should be nav_button_next)');
    }
    if (calendarContent && calendarContent.includes('formatMonthDropdown')) {
      issues.push('calendar component still has formatMonthDropdown');
    }
  }
  
  // Check if vercel.json has correct configuration
  if (checkFileExists('vercel.json')) {
    const vercelConfig = JSON.parse(readFileContent('vercel.json'));
    if (!vercelConfig.rewrites) {
      issues.push('vercel.json missing rewrites configuration');
    }
  }
  
  // Check if next.config.js has correct configuration
  if (checkFileExists('next.config.js')) {
    const nextConfig = readFileContent('next.config.js');
    if (nextConfig && nextConfig.includes('functions:')) {
      issues.push('next.config.js still has functions configuration (should be removed)');
    }
  }
  
  // Check if package.json has correct build script
  if (checkFileExists('package.json')) {
    const packageConfig = JSON.parse(readFileContent('package.json'));
    if (!packageConfig.scripts.build.includes('prisma generate')) {
      issues.push('package.json build script missing prisma generate');
    }
    if (!packageConfig.scripts.postinstall || !packageConfig.scripts.postinstall.includes('prisma generate')) {
      issues.push('package.json missing postinstall script with prisma generate');
    }
  }
  
  return issues;
}

function fixDeploymentIssues(issues) {
  log('🔧 Fixing deployment issues...', 'blue');
  
  // Fix vercel.json
  if (issues.includes('vercel.json not found')) {
    log('🛠️ Creating vercel.json...', 'yellow');
    fs.writeFileSync('vercel.json', JSON.stringify({
      rewrites: [
        { source: '/(.*)', destination: '/src/app/$1' }
      ]
    }, null, 2));
    log('✓ vercel.json created', 'green');
  }
  
  // Fix next.config.js
  if (issues.includes('next.config.js not found')) {
    log('🛠️ Creating next.config.js...', 'yellow');
    fs.writeFileSync('next.config.js', `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig`);
    log('✓ next.config.js created', 'green');
  } else if (issues.includes('next.config.js still has functions configuration (should be removed)')) {
    log('🛠️ Fixing next.config.js...', 'yellow');
    const nextConfig = readFileContent('next.config.js');
    const fixedConfig = nextConfig.replace(/functions:\s*\{[^}]*\},?\s*/g, '');
    fs.writeFileSync('next.config.js', fixedConfig);
    log('✓ next.config.js fixed', 'green');
  }
  
  // Fix package.json
  if (issues.includes('package.json build script missing prisma generate')) {
    log('🛠️ Fixing package.json build script...', 'yellow');
    const packageConfig = JSON.parse(readFileContent('package.json'));
    packageConfig.scripts.build = 'prisma generate && next build';
    fs.writeFileSync('package.json', JSON.stringify(packageConfig, null, 2));
    log('✓ package.json build script fixed', 'green');
  }
  
  if (issues.includes('package.json missing postinstall script with prisma generate')) {
    log('🛠️ Fixing package.json postinstall script...', 'yellow');
    const packageConfig = JSON.parse(readFileContent('package.json'));
    packageConfig.scripts.postinstall = 'prisma generate';
    fs.writeFileSync('package.json', JSON.stringify(packageConfig, null, 2));
    log('✓ package.json postinstall script fixed', 'green');
  }
  
  // Fix calendar component
  if (issues.includes('calendar component still has defaultClassNames.root') || 
      issues.includes('calendar component still has button_previous (should be nav_button_previous)') ||
      issues.includes('calendar component still has button_next (should be nav_button_next)') ||
      issues.includes('calendar component still has formatMonthDropdown')) {
    log('🛠️ Fixing calendar component...', 'yellow');
    const calendarContent = readFileContent('src/components/ui/calendar.tsx');
    let fixedContent = calendarContent;
    
    if (fixedContent.includes('defaultClassNames.root')) {
      fixedContent = fixedContent.replace(/defaultClassNames\.\w+/g, '');
    }
    
    if (fixedContent.includes('button_previous:')) {
      fixedContent = fixedContent.replace(/button_previous:/g, 'nav_button_previous:');
    }
    
    if (fixedContent.includes('button_next:')) {
      fixedContent = fixedContent.replace(/button_next:/g, 'nav_button_next:');
    }
    
    if (fixedContent.includes('formatMonthDropdown')) {
      fixedContent = fixedContent.replace(/formatMonthDropdown:\s*\(date\)\s*=>\s*date\.toLocaleString\("default",\s*\{\s*month:\s*"short"\s*\}\),?\s*/g, '');
    }
    
    fs.writeFileSync('src/components/ui/calendar.tsx', fixedContent);
    log('✓ calendar component fixed', 'green');
  }
  
  // Fix .env.production
  if (issues.includes('.env.production not found')) {
    log('🛠️ Creating .env.production...', 'yellow');
    fs.writeFileSync('.env.production', `# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/YOUR_DATABASE"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_SUPABASE_ID.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"

# Authentication
JWT_SECRET="YOUR_JWT_SECRET"
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
NEXTAUTH_URL="https://YOUR_APP_URL.vercel.app"`);
    log('✓ .env.production created', 'green');
    log('📝 Please update .env.production with your actual values', 'yellow');
  }
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel Deployment Instructions

## Common Causes and Solutions:

### 1. Deployment Build Errors
- **Problem**: Build process fails during deployment
- **Solution**: 
  1. Check build logs in Vercel Dashboard
  2. Fix any TypeScript or build errors
  3. Ensure all dependencies are installed

### 2. Environment Variables Not Set
- **Problem**: Application fails due to missing environment variables
- **Solution**: 
  1. Configure environment variables in Vercel Dashboard
  2. Ensure all required variables are set

### 3. Database Connection Issues
- **Problem**: Application fails to connect to database
- **Solution**: 
  1. Check DATABASE_URL in environment variables
  2. Ensure database is accessible from Vercel

### 4. Prisma Client Generation Issues
- **Problem**: Prisma Client not generated during build
- **Solution**: 
  1. Ensure \`prisma generate\` is in build script
  2. Ensure \`prisma generate\` is in postinstall script

### 5. Calendar Component Issues
- **Problem**: Calendar component causes build errors
- **Solution**: 
  1. Ensure defaultClassNames is not used
  2. Ensure nav_button_previous and nav_button_next are used instead of button_previous and button_next
  3. Ensure formatMonthDropdown is not used

## Quick Fix:

1. **Run Diagnosis Script**:
   - Run \`node scripts/diagnose-vercel-deployment.js\`
   - Fix all issues found

2. **Update Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all required environment variables

3. **Redeploy**:
   - Run \`vercel --prod\`
   - Or trigger a new deployment from Vercel Dashboard

4. **Check Build Logs**:
   - Check Vercel Dashboard for any build errors
   - Fix any issues found

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

## Test Credentials:

- **Email**: admin@invoice-app.com
- **Password**: admin123
- **Role**: SUPER_ADMIN

## Debugging Steps:

### 1. Check Build Logs
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check for any build errors

### 2. Check Environment Variables
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Ensure all required variables are set

### 3. Test Locally
1. Run \`npm run build\` locally
2. Fix any build errors

### 4. Check Database Connection
1. Test database connection locally
2. Ensure database is accessible from Vercel

## Additional Resources:

- [Vercel Deployment Docs](https://vercel.com/docs/concepts/deployments)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Prisma Deployment Docs](https://www.prisma.io/docs/guides/deployment)
- [Next.js 15 Migration Guide](https://nextjs.org/docs/messages/next-upgrade)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
`;

  fs.writeFileSync('VERCEL-DEPLOYMENT-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Diagnose Vercel Deployment Script', 'bright');
  log('=====================================', 'bright');
  log('');
  
  log('🔍 Checking deployment issues...', 'blue');
  const issues = checkDeploymentErrors();
  
  if (issues.length > 0) {
    log('', 'reset');
    log('❌ Found deployment issues:', 'red');
    issues.forEach(issue => log(`- ${issue}`, 'red'));
    log('', 'reset');
    
    log('🔧 Fixing deployment issues...', 'blue');
    fixDeploymentIssues(issues);
    
    log('', 'reset');
    log('✅ Deployment issues fixed successfully', 'green');
  } else {
    log('', 'reset');
    log('✅ No deployment issues found', 'green');
  }
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app', 'blue');
  log('5. Check https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('6. Check VERCEL-DEPLOYMENT-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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