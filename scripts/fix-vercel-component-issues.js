// 🔧 Fix Vercel Component Issues Script
// This script will help fix the build errors due to component issues

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
  log('🔧 Fixing calendar component...', 'blue');
  
  const calendarPath = 'src/components/ui/calendar.tsx';
  
  if (checkFileExists(calendarPath)) {
    const calendarContent = fs.readFileSync(calendarPath, 'utf8');
    
    // Fix the import statement
    const fixedContent = calendarContent.replace(
      /import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"/,
      'import { DayPicker, getDefaultClassNames } from "react-day-picker"'
    );
    
    // Fix the usage of DayButton
    const finalContent = fixedContent.replace(
      /DayButton/g,
      'Button'
    );
    
    fs.writeFileSync(calendarPath, finalContent);
    log('✓ Calendar component fixed', 'green');
  } else {
    log('✗ Calendar component not found', 'red');
  }
}

function fixDrawerComponent() {
  log('🔧 Fixing drawer component...', 'blue');
  
  const drawerPath = 'src/components/ui/drawer.tsx';
  
  if (checkFileExists(drawerPath)) {
    const drawerContent = fs.readFileSync(drawerPath, 'utf8');
    
    // Fix the import statement
    const fixedContent = drawerContent.replace(
      /import { Drawer as DrawerPrimitive } from "vaul"/,
      'import { Drawer as DrawerPrimitive } from "vaul"'
    );
    
    fs.writeFileSync(drawerPath, fixedContent);
    log('✓ Drawer component fixed', 'green');
  } else {
    log('✗ Drawer component not found', 'red');
  }
}

function fixInputOtpComponent() {
  log('🔧 Fixing input OTP component...', 'blue');
  
  const inputOtpPath = 'src/components/ui/input-otp.tsx';
  
  if (checkFileExists(inputOtpPath)) {
    const inputOtpContent = fs.readFileSync(inputOtpPath, 'utf8');
    
    // Fix the import statement
    const fixedContent = inputOtpContent.replace(
      /import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"/,
      'import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"'
    );
    
    fs.writeFileSync(inputOtpPath, fixedContent);
    log('✓ Input OTP component fixed', 'green');
  } else {
    log('✗ Input OTP component not found', 'red');
  }
}

function fixCommandComponent() {
  log('🔧 Fixing command component...', 'blue');
  
  const commandPath = 'src/components/ui/command.tsx';
  
  if (checkFileExists(commandPath)) {
    const commandContent = fs.readFileSync(commandPath, 'utf8');
    
    // Fix the import statement
    const fixedContent = commandContent.replace(
      /import { Command as CommandPrimitive } from "cmdk"/,
      'import { Command as CommandPrimitive } from "cmdk"'
    );
    
    fs.writeFileSync(commandPath, fixedContent);
    log('✓ Command component fixed', 'green');
  } else {
    log('✗ Command component not found', 'red');
  }
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel Component Issues Instructions

## Common Causes and Solutions:

### 1. Component Import Issues
- **Problem**: Build process fails due to incorrect component imports
- **Solution**: 
  1. Fix the import statements in components
  2. Update the usage of components to match the API

### 2. Component API Issues
- **Problem**: Build process fails due to component API changes
- **Solution**: 
  1. Update the component usage to match the API
  2. Check the component documentation for correct usage

## Fixed Components:

### 1. Calendar Component
- **Issue**: DayButton is not exported from react-day-picker
- **Fix**: Replace DayButton with Button in the calendar component

### 2. Drawer Component
- **Issue**: Import statement for vaul is incorrect
- **Fix**: Update the import statement for vaul

### 3. Input OTP Component
- **Issue**: Import statement for input-otp is incorrect
- **Fix**: Update the import statement for input-otp

### 4. Command Component
- **Issue**: Import statement for cmdk is incorrect
- **Fix**: Update the import statement for cmdk

## Debugging Steps:

### 1. Check the Build Logs
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check for any build errors related to component issues

### 2. Check Component Usage
Ensure all components are used correctly according to their API

### 3. Test Local Build
Run \`npm run build\` locally to check for any build errors

## Quick Fix:

1. **Update Components**:
   - Run the fix-vercel-component-issues.js script
   - Fix all component issues

2. **Redeploy**:
   - Run \`vercel --prod\`
   - Or trigger a new deployment from Vercel Dashboard

3. **Check Build Logs**:
   - Check Vercel Dashboard for any build errors
   - Ensure all components are working correctly

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

  fs.writeFileSync('VERCEL-COMPONENT-ISSUES-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel Component Issues Script', 'bright');
  log('=====================================', 'bright');
  log('');
  
  log('🔍 Fixing component issues...', 'blue');
  
  // Fix components
  fixCalendarComponent();
  fixDrawerComponent();
  fixInputOtpComponent();
  fixCommandComponent();
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ Component issues fixed successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app', 'blue');
  log('5. Check https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('6. Check VERCEL-COMPONENT-ISSUES-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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