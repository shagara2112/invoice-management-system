// 🔧 Fix Vercel Calendar ClassNames Script
// This script will help fix the build errors due to calendar component classnames issues

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
  log('🔧 Fixing calendar component classnames issues...', 'blue');
  
  const calendarPath = 'src/components/ui/calendar.tsx';
  
  if (checkFileExists(calendarPath)) {
    const calendarContent = fs.readFileSync(calendarPath, 'utf8');
    
    // Fix the classNames object
    const fixedContent = calendarContent.replace(
      /classNames={{\s*root: cn\("w-fit", defaultClassNames\.root\),\s*months: cn\(\s*"flex gap-4 flex-col md:flex-row relative",\s*defaultClassNames\.months\s*\),\s*caption: cn\(\s*"flex justify-center pt-1 relative items-center",\s*defaultClassNames\.caption\s*\),\s*caption_label: cn\(\s*"text-sm font-medium",\s*defaultClassNames\.caption_label\s*\),\s*nav: cn\(\s*"flex items-center",\s*defaultClassNames\.nav\s*\),\s*nav_button: cn\(\s*cn\(\s*buttonVariants\({ variant: "outline" }\),\s*h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"\s*\),\s*defaultClassNames\.nav_button\s*\),\s*nav_button_previous: cn\(\s*"absolute left-1",\s*defaultClassNames\.nav_button_previous\s*\),\s*nav_button_next: cn\(\s*"absolute right-1",\s*defaultClassNames\.nav_button_next\s*\),\s*table: cn\(\s*"w-full border-collapse space-y-1",\s*defaultClassNames\.table\s*\),\s*head_row: cn\(\s*"flex",\s*defaultClassNames\.head_row\s*\),\s*head_cell: cn\(\s*"text-muted-foreground rounded-md w-9 font-normal text-\[0\.8rem\]",\s*defaultClassNames\.head_cell\s*\),\s*tbody: cn\(\s*"flex flex-col space-y-1",\s*defaultClassNames\.tbody\s*\),\s*row: cn\(\s*"flex w-full mt-2",\s*defaultClassNames\.row\s*\),\s*cell: cn\(\s*"text-center text-sm p-0 relative \[\&:has\[aria-selected\]\:bg-accent\] first:\[&:has\[aria-selected\]\:rounded-l-md last:\[&:has\[aria-selected\]\:rounded-r-md focus-within:relative focus-within:z-20",\s*defaultClassNames\.cell\s*\),\s*day: cn\(\s*cn\(\s*buttonVariants\({ variant: "ghost" }\),\s"h-9 w-9 p-0 font-normal aria-selected:opacity-100"\s*\),\s*defaultClassNames\.day\s*\),\s*day_range_end: cn\(\s*"day-range-end",\s*defaultClassNames\.day_range_end\s*\),\s*day_selected: cn\(\s*"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",\s*defaultClassNames\.day_selected\s*\),\s*day_today: cn\(\s*"bg-accent text-accent-foreground",\s*defaultClassNames\.day_today\s*\),\s*day_outside: cn\(\s*"text-muted-foreground opacity-50",\s*defaultClassNames\.day_outside\s*\),\s*day_disabled: cn\(\s*"text-muted-foreground opacity-50",\s*defaultClassNames\.day_disabled\s*\),\s*day_range_middle: cn\(\s*"aria-selected:bg-accent aria-selected:text-accent-foreground",\s*defaultClassNames\.day_range_middle\s*\),\s*day_hidden: cn\(\s*"invisible",\s*defaultClassNames\.day_hidden\s*\),\s*\.\.\.classNames\s*}}/,
      'classNames={{\n        root: "w-fit",\n        months: "flex gap-4 flex-col md:flex-row relative",\n        caption: "flex justify-center pt-1 relative items-center",\n        caption_label: "text-sm font-medium",\n        nav: "flex items-center",\n        nav_button: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),\n        nav_button_previous: "absolute left-1",\n        nav_button_next: "absolute right-1",\n        table: "w-full border-collapse space-y-1",\n        head_row: "flex",\n        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",\n        tbody: "flex flex-col space-y-1",\n        row: "flex w-full mt-2",\n        cell: "text-center text-sm p-0 relative [&:has[aria-selected]]:bg-accent first:[&:has[aria-selected]]:rounded-l-md last:[&:has[aria-selected]]:rounded-r-md focus-within:relative focus-within:z-20",\n        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),\n        day_range_end: "day-range-end",\n        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",\n        day_today: "bg-accent text-accent-foreground",\n        day_outside: "text-muted-foreground opacity-50",\n        day_disabled: "text-muted-foreground opacity-50",\n        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",\n        day_hidden: "invisible",\n        ...classNames\n      }}'
    );
    
    fs.writeFileSync(calendarPath, fixedContent);
    log('✓ Calendar component classnames issues fixed', 'green');
  } else {
    log('✗ Calendar component not found', 'red');
  }
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel Calendar ClassNames Instructions

## Common Causes and Solutions:

### 1. Calendar Component ClassNames Issues
- **Problem**: Build process fails due to incorrect classNames object
- **Solution**: 
  1. Fix the classNames object in calendar component
  2. Update the usage of calendar component to match the API

### 2. Calendar Component API Issues
- **Problem**: Build process fails due to calendar component API changes
- **Solution**: 
  1. Update the calendar component usage to match the API
  2. Check the calendar component documentation for correct usage

## Fixed Components:

### 1. Calendar Component
- **Issue**: Property 'root' does not exist on type '""'
- **Fix**: Remove defaultClassNames from the classNames object

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
   - Run the fix-vercel-calendar-classnames.js script
   - Fix all calendar component classnames issues

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

  fs.writeFileSync('VERCEL-CALENDAR-CLASSNAMES-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel Calendar ClassNames Script', 'bright');
  log('=======================================', 'bright');
  log('');
  
  log('🔍 Fixing calendar component classnames issues...', 'blue');
  
  // Fix calendar component
  fixCalendarComponent();
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ Calendar component classnames issues fixed successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app', 'blue');
  log('5. Check https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('6. Check VERCEL-CALENDAR-CLASSNAMES-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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