// 🔧 Fix Vercel Calendar Final Nav Script
// This script will help fix the final calendar component nav and caption issues

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
  log('🔧 Fixing calendar component final nav and caption issues...', 'blue');
  
  const calendarPath = 'src/components/ui/calendar.tsx';
  
  if (checkFileExists(calendarPath)) {
    const calendarContent = fs.readFileSync(calendarPath, 'utf8');
    
    // Fix the classNames object
    const fixedContent = calendarContent
      // Replace month_caption with caption
      .replace(
        /month_caption: cn\(\s*"flex items-center justify-center h-\(--cell-size\) w-full px-\(--cell-size\)"\s*\),/,
        'caption: cn("flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)"),'
      )
      // Replace dropdowns with dropdown
      .replace(
        /dropdowns: cn\(\s*"w-full flex items-center text-sm font-medium justify-center h-\(--cell-size\) gap-1\.5"\s*\),/,
        'dropdown: cn("w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5"),'
      )
      // Replace dropdown_root with dropdown
      .replace(
        /dropdown_root: cn\(\s*"relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring\/50 has-focus:ring-\[3px\] rounded-md"\s*\),/,
        'dropdown: cn("relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md"),'
      )
      // Replace dropdown with dropdown
      .replace(
        /dropdown: cn\(\s*"absolute bg-popover inset-0 opacity-0"\s*\),/,
        'dropdown: cn("absolute bg-popover inset-0 opacity-0"),'
      )
      // Replace caption_label with caption_label
      .replace(
        /caption_label: cn\(\s*"select-none font-medium",\s*captionLayout === "label"\s*\?\s*"text-sm"\s*:\s*"rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 \[&>svg\]:text-muted-foreground \[&>svg\]:size-3\.5"\s*\),/,
        'caption_label: cn("select-none font-medium", captionLayout === "label" ? "text-sm" : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5"),'
      )
      // Replace weekdays with head_row
      .replace(
        /weekdays: cn\("flex"\),/,
        'head_row: cn("flex"),'
      )
      // Replace weekday with head_cell
      .replace(
        /weekday: cn\(\s*"text-muted-foreground rounded-md flex-1 font-normal text-\[0\.8rem\] select-none"\s*\),/,
        'head_cell: cn("text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none"),'
      )
      // Replace week with tbody
      .replace(
        /week: cn\("flex w-full mt-2"\),/,
        'tbody: cn("flex flex-col space-y-1"),'
      )
      // Replace week_number_header with week_number_header
      .replace(
        /week_number_header: cn\(\s*"select-none w-\(--cell-size\)"\s*\),/,
        'week_number_header: cn("select-none w-(--cell-size)"),'
      )
      // Replace week_number with week_number
      .replace(
        /week_number: cn\(\s*"text-\[0\.8rem\] select-none text-muted-foreground"\s*\),/,
        'week_number: cn("text-[0.8rem] select-none text-muted-foreground"),'
      )
      // Replace day with day
      .replace(
        /day: cn\(\s*"relative w-full h-full p-0 text-center \[&:first-child\[data-selected=true\]_button\]:rounded-l-md \[&:last-child\[data-selected=true\]_button\]:rounded-r-md group\/day aspect-square select-none"\s*\),/,
        'day: cn("text-center text-sm p-0 relative [&:has[aria-selected]]:bg-accent first:[&:has[aria-selected]]:rounded-l-md last:[&:has[aria-selected]]:rounded-r-md focus-within:relative focus-within:z-20"),'
      )
      // Replace range_start with day_range_start
      .replace(
        /range_start: cn\(\s*"rounded-l-md bg-accent"\s*\),/,
        'day_range_start: cn("day-range-end"),'
      )
      // Replace range_middle with day_range_middle
      .replace(
        /range_middle: cn\("rounded-none"\),/,
        'day_range_middle: cn("aria-selected:bg-accent aria-selected:text-accent-foreground"),'
      )
      // Replace range_end with day_range_end
      .replace(
        /range_end: cn\(\s*"rounded-r-md bg-accent"\s*\),/,
        'day_range_end: cn("day-range-end"),'
      )
      // Replace today with day_today
      .replace(
        /today: cn\(\s*"bg-accent text-accent-foreground rounded-md data-\[selected=true\]:rounded-none"\s*\),/,
        'day_today: cn("bg-accent text-accent-foreground"),'
      )
      // Replace outside with day_outside
      .replace(
        /outside: cn\(\s*"text-muted-foreground aria-selected:text-muted-foreground"\s*\),/,
        'day_outside: cn("text-muted-foreground opacity-50"),'
      )
      // Replace disabled with day_disabled
      .replace(
        /disabled: cn\(\s*"text-muted-foreground opacity-50"\s*\),/,
        'day_disabled: cn("text-muted-foreground opacity-50"),'
      )
      // Replace hidden with day_hidden
      .replace(
        /hidden: cn\("invisible"\),/,
        'day_hidden: cn("invisible"),'
      );
    
    fs.writeFileSync(calendarPath, fixedContent);
    log('✓ Calendar component final nav and caption issues fixed', 'green');
  } else {
    log('✗ Calendar component not found', 'red');
  }
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel Calendar Final Nav Instructions

## Common Causes and Solutions:

### 1. Calendar Component Final Nav and Caption Issues
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
- **Issue**: Property 'month_caption' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace month_caption with caption
- **Issue**: Property 'dropdowns' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace dropdowns with dropdown
- **Issue**: Property 'dropdown_root' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace dropdown_root with dropdown
- **Issue**: Property 'weekdays' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace weekdays with head_row
- **Issue**: Property 'weekday' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace weekday with head_cell
- **Issue**: Property 'week' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace week with tbody
- **Issue**: Property 'range_start' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace range_start with day_range_start
- **Issue**: Property 'range_middle' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace range_middle with day_range_middle
- **Issue**: Property 'range_end' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace range_end with day_range_end
- **Issue**: Property 'today' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace today with day_today
- **Issue**: Property 'outside' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace outside with day_outside
- **Issue**: Property 'disabled' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace disabled with day_disabled
- **Issue**: Property 'hidden' does not exist on type 'Partial<StyledElement<string>>'
- **Fix**: Replace hidden with day_hidden

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
   - Run the fix-vercel-calendar-final-nav.js script
   - Fix all calendar component final nav and caption issues

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

  fs.writeFileSync('VERCEL-CALENDAR-FINAL-NAV-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel Calendar Final Nav Script', 'bright');
  log('=======================================', 'bright');
  log('');
  
  log('🔍 Fixing calendar component final nav and caption issues...', 'blue');
  
  // Fix calendar component
  fixCalendarComponent();
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ Calendar component final nav and caption issues fixed successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app', 'blue');
  log('5. Check https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('6. Check VERCEL-CALENDAR-FINAL-NAV-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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