// 🔧 Fix Vercel Radix Dependencies Script
// This script will help fix the build errors due to missing Radix UI dependencies

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

function updatePackageJson() {
  log('📦 Updating package.json with missing Radix UI dependencies...', 'blue');
  
  const packageJson = {
    "name": "invoice-management-system",
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "prisma generate && next build",
      "start": "next start",
      "lint": "next lint",
      "postinstall": "prisma generate"
    },
    "dependencies": {
      "@prisma/client": "^6.15.0",
      "@radix-ui/react-accessible-icon": "^1.0.3",
      "@radix-ui/react-alert-dialog": "^1.0.5",
      "@radix-ui/react-aspect-ratio": "^1.0.3",
      "@radix-ui/react-avatar": "^1.0.4",
      "@radix-ui/react-checkbox": "^1.0.4",
      "@radix-ui/react-collapsible": "^1.0.3",
      "@radix-ui/react-context-menu": "^2.1.5",
      "@radix-ui/react-dialog": "^1.0.5",
      "@radix-ui/react-dropdown-menu": "^2.0.6",
      "@radix-ui/react-hover-card": "^1.0.7",
      "@radix-ui/react-label": "^2.0.2",
      "@radix-ui/react-menubar": "^1.0.4",
      "@radix-ui/react-navigation-menu": "^1.1.4",
      "@radix-ui/react-popover": "^1.0.7",
      "@radix-ui/react-progress": "^1.0.3",
      "@radix-ui/react-radio-group": "^1.1.3",
      "@radix-ui/react-scroll-area": "^1.0.5",
      "@radix-ui/react-select": "^2.0.0",
      "@radix-ui/react-separator": "^1.0.3",
      "@radix-ui/react-slider": "^1.1.2",
      "@radix-ui/react-slot": "^1.0.2",
      "@radix-ui/react-switch": "^1.0.3",
      "@radix-ui/react-tabs": "^1.0.4",
      "@radix-ui/react-toast": "^1.1.5",
      "@radix-ui/react-toggle": "^1.0.3",
      "@radix-ui/react-toggle-group": "^1.0.4",
      "@radix-ui/react-tooltip": "^1.0.7",
      "@supabase/supabase-js": "^2.39.3",
      "bcryptjs": "^2.4.3",
      "class-variance-authority": "^0.7.0",
      "clsx": "^2.0.0",
      "date-fns": "^3.0.6",
      "jsonwebtoken": "^9.0.2",
      "lucide-react": "^0.394.0",
      "next": "15.3.5",
      "next-auth": "^4.24.5",
      "prisma": "^6.15.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-hook-form": "^7.48.2",
      "tailwind-merge": "^2.2.0",
      "tailwindcss-animate": "^1.0.7",
      "zod": "^3.22.4"
    },
    "devDependencies": {
      "@types/bcryptjs": "^2.4.6",
      "@types/jsonwebtoken": "^9.0.5",
      "@types/node": "^20.10.6",
      "@types/react": "^18.2.45",
      "@types/react-dom": "^18.2.18",
      "autoprefixer": "^10.4.16",
      "eslint": "^9",
      "eslint-config-next": "15.3.5",
      "postcss": "^8.4.32",
      "tailwindcss": "^3.4.0",
      "typescript": "^5.3.3"
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  log('✓ package.json updated with missing Radix UI dependencies', 'green');
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel Radix Dependencies Instructions

## Common Causes and Solutions:

### 1. Missing Radix UI Dependencies
- **Problem**: Build process fails due to missing Radix UI dependencies
- **Solution**: 
  1. Add all missing Radix UI dependencies to package.json
  2. Ensure all UI components have their dependencies

### 2. Missing Other Dependencies
- **Problem**: Build process fails due to other missing dependencies
- **Solution**: 
  1. Check build logs for missing dependencies
  2. Add all missing dependencies to package.json

## Required Dependencies:

### Core Dependencies:
- \`next\` - Next.js framework
- \`react\` - React library (version 18)
- \`react-dom\` - React DOM library (version 18)
- \`typescript\` - TypeScript compiler

### Database Dependencies:
- \`@prisma/client\` - Prisma Client
- \`prisma\` - Prisma CLI

### Authentication Dependencies:
- \`next-auth\` - NextAuth.js for authentication
- \`jsonwebtoken\` - JWT library
- \`@types/jsonwebtoken\` - TypeScript types for JWT
- \`bcryptjs\` - Password hashing library
- \`@types/bcryptjs\` - TypeScript types for bcryptjs

### UI Dependencies:
- \`tailwindcss\` - Tailwind CSS framework
- \`postcss\` - PostCSS for CSS processing
- \`autoprefixer\` - Autoprefixer for CSS
- \`lucide-react\` - Lucide React icons (version 0.394.0)
- \`class-variance-authority\` - Utility for component variants
- \`tailwind-merge\` - Utility for merging Tailwind classes
- \`clsx\` - Utility for constructing className strings
- \`tailwindcss-animate\` - Tailwind CSS animations

### Radix UI Dependencies:
- \`@radix-ui/react-accessible-icon\` - Accessible Icon component
- \`@radix-ui/react-alert-dialog\` - Alert Dialog component
- \`@radix-ui/react-aspect-ratio\` - Aspect Ratio component
- \`@radix-ui/react-avatar\` - Avatar component
- \`@radix-ui/react-checkbox\` - Checkbox component
- \`@radix-ui/react-collapsible\` - Collapsible component
- \`@radix-ui/react-context-menu\` - Context Menu component
- \`@radix-ui/react-dialog\` - Dialog component
- \`@radix-ui/react-dropdown-menu\` - Dropdown Menu component
- \`@radix-ui/react-hover-card\` - Hover Card component
- \`@radix-ui/react-label\` - Label component
- \`@radix-ui/react-menubar\` - Menubar component
- \`@radix-ui/react-navigation-menu\` - Navigation Menu component
- \`@radix-ui/react-popover\` - Popover component
- \`@radix-ui/react-progress\` - Progress component
- \`@radix-ui/react-radio-group\` - Radio Group component
- \`@radix-ui/react-scroll-area\` - Scroll Area component
- \`@radix-ui/react-select\` - Select component
- \`@radix-ui/react-separator\` - Separator component
- \`@radix-ui/react-slider\` - Slider component
- \`@radix-ui/react-slot\` - Slot component
- \`@radix-ui/react-switch\` - Switch component
- \`@radix-ui/react-tabs\` - Tabs component
- \`@radix-ui/react-toast\` - Toast component
- \`@radix-ui/react-toggle\` - Toggle component
- \`@radix-ui/react-toggle-group\` - Toggle Group component
- \`@radix-ui/react-tooltip\` - Tooltip component

## Debugging Steps:

### 1. Check the Build Logs
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check for any build errors related to missing dependencies

### 2. Check Package.json
Ensure all required dependencies are included in package.json

### 3. Test Local Build
Run \`npm run build\` locally to check for any build errors

## Quick Fix:

1. **Update Dependencies**:
   - Add all missing Radix UI dependencies
   - Add all other missing dependencies

2. **Redeploy**:
   - Run \`vercel --prod\`
   - Or trigger a new deployment from Vercel Dashboard

3. **Check Build Logs**:
   - Check Vercel Dashboard for any build errors
   - Ensure all dependencies are installed correctly

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

  fs.writeFileSync('VERCEL-RADIX-DEPENDENCIES-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel Radix Dependencies Script', 'bright');
  log('=================================', 'bright');
  log('');
  
  log('🔍 Fixing missing Radix UI dependencies...', 'blue');
  
  // Update configurations
  updatePackageJson();
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ Missing Radix UI dependencies fixed successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app', 'blue');
  log('5. Check https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('6. Check VERCEL-RADIX-DEPENDENCIES-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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