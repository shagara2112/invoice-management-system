// 🔧 Fix Vercel Calendar Components Script
// This script will help fix the components properties in calendar component

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

function fixCalendarComponent() {
  log('🔧 Fixing calendar component components properties...', 'blue');
  
  const calendarPath = 'src/components/ui/calendar.tsx';
  
  if (checkFileExists(calendarPath)) {
    const calendarContent = fs.readFileSync(calendarPath, 'utf8');
    
    // Fix the components properties
    const fixedContent = calendarContent
      // Replace Root with root
      .replace(
        /Root: \(\{ className: rootClassName, rootRef, \.\.\.rootProps \}: any\) => \{/g,
        'root: ({ className: rootClassName, rootRef, ...rootProps }: any) => {'
      )
      // Replace Chevron with chevron
      .replace(
        /Chevron: \(\{ className: chevronClassName, orientation, \.\.\.chevronProps \}: any\) => \{/g,
        'chevron: ({ className: chevronClassName, orientation, ...chevronProps }: any) => {'
      )
      // Replace Button with button
      .replace(
        /Button: CalendarButton,/g,
        'button: CalendarButton,'
      )
      // Replace WeekNumber with weeknumber
      .replace(
        /WeekNumber: \(\{ children, \.\.\.weekProps \}: any\) => \{/g,
        'weeknumber: ({ children, ...weekProps }: any) => {'
      );
    
    fs.writeFileSync(calendarPath, fixedContent);
    log('✓ Calendar component components properties fixed', 'green');
  } else {
    log('✗ Calendar component not found', 'red');
  }
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel Calendar Components Instructions

## Common Causes and Solutions:

### 1. Calendar Component Components Properties Issues
- **Problem**: Build process fails due to incorrect components properties
- **Solution**: 
  1. Replace Root with root
  2. Replace Chevron with chevron
  3. Replace Button with button
  4. Replace WeekNumber with weeknumber

### 2. Calendar Component API Issues
- **Problem**: Build process fails due to calendar component API changes
- **Solution**: 
  1. Update the calendar component usage to match the API
  2. Check the calendar component documentation for correct usage

## Fixed Components:

### 1. Calendar Component
- **Issue**: Object literal may only specify known properties, and 'Root' does not exist in type 'CustomComponents'
- **Fix**: Replace Root with root, Chevron with chevron, Button with button, and WeekNumber with weeknumber

## Debugging Steps:

### 1. Check the Build Logs
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check for any build errors related to calendar component issues

### 2. Check Calendar Component Usage
Ensure calendar component is used correctly according to its API

### 3. Test Local Build
Run \`npm run build\` locally to check for any build errors

## Quick Fix:

1. **Update Calendar Component**:
   - Run the fix-vercel-calendar-components.js script
   - Fix all calendar component components properties issues

2. **Redeploy**:
   - Run \`vercel --prod\`
   - Or trigger a new deployment from Vercel Dashboard

3. **Check Build Logs**:
   - Check Vercel Dashboard for any build errors
   - Ensure calendar component is working correctly

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

## Additional Resources:

- [Vercel Deployment Docs](https://vercel.com/docs/concepts/deployments)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Prisma Deployment Docs](https://www.prisma.io/docs/guides/deployment)
- [Next.js 15 Migration Guide](https://nextjs.org/docs/messages/next-upgrade)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
`;

  fs.writeFileSync('VERCEL-CALENDAR-COMPONENTS-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel Calendar Components Script', 'bright');
  log('==========================================', 'bright');
  log('');
  
  log('🔍 Fixing calendar component components properties...', 'blue');
  
  // Fix calendar component
  fixCalendarComponent();
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ Calendar component components properties fixed successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app', 'blue');
  log('5. Check https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('6. Check VERCEL-CALENDAR-COMPONENTS-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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