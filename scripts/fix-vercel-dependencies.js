// 🔧 Fix Vercel Dependencies Issues Script
// This script will help fix the build errors due to missing dependencies

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
  log('📦 Updating package.json with all required dependencies...', 'blue');
  
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
      "@radix-ui/react-avatar": "^1.0.4",
      "@radix-ui/react-checkbox": "^1.0.4",
      "@radix-ui/react-dialog": "^1.0.5",
      "@radix-ui/react-dropdown-menu": "^2.0.6",
      "@radix-ui/react-label": "^2.0.2",
      "@radix-ui/react-popover": "^1.0.7",
      "@radix-ui/react-select": "^2.0.0",
      "@radix-ui/react-separator": "^1.0.3",
      "@radix-ui/react-slot": "^1.0.2",
      "@radix-ui/react-switch": "^1.0.3",
      "@radix-ui/react-tabs": "^1.0.4",
      "@radix-ui/react-toast": "^1.1.5",
      "@supabase/supabase-js": "^2.39.3",
      "class-variance-authority": "^0.7.0",
      "clsx": "^2.0.0",
      "date-fns": "^3.0.6",
      "jsonwebtoken": "^9.0.2",
      "lucide-react": "^0.303.0",
      "next": "15.3.5",
      "next-auth": "^4.24.5",
      "prisma": "^6.15.0",
      "react": "^19.0.0",
      "react-dom": "^19.0.0",
      "react-hook-form": "^7.48.2",
      "tailwind-merge": "^2.2.0",
      "tailwindcss-animate": "^1.0.7",
      "zod": "^3.22.4"
    },
    "devDependencies": {
      "@types/jsonwebtoken": "^9.0.5",
      "@types/node": "^20.10.6",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "autoprefixer": "^10.4.16",
      "eslint": "^9",
      "eslint-config-next": "15.3.5",
      "postcss": "^8.4.32",
      "tailwindcss": "^3.4.0",
      "typescript": "^5.3.3"
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  log('✓ package.json updated with all required dependencies', 'green');
}

function updateNextConfig() {
  log('⚙️ Updating Next.js configuration...', 'blue');
  
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;`;
  
  fs.writeFileSync('next.config.js', nextConfig);
  log('✓ next.config.js updated', 'green');
}

function createDeploymentInstructions() {
  log('📋 Creating deployment instructions...', 'blue');
  
  const instructions = `
# 🔧 Fix Vercel Dependencies Issues Instructions

## Common Causes and Solutions:

### 1. Missing Dependencies
- **Problem**: Build process fails due to missing dependencies
- **Solution**: 
  1. Update package.json with all required dependencies
  2. Ensure all UI libraries are included
  3. Ensure all authentication libraries are included

### 2. Missing Tailwind CSS
- **Problem**: Build process fails due to missing Tailwind CSS
- **Solution**: 
  1. Add tailwindcss to dependencies
  2. Add postcss to dependencies
  3. Add autoprefixer to dependencies

### 3. Missing UI Libraries
- **Problem**: Build process fails due to missing UI libraries
- **Solution**: 
  1. Add @radix-ui/react-slot to dependencies
  2. Add lucide-react to dependencies
  3. Add class-variance-authority to dependencies

## Required Dependencies:

### Core Dependencies:
- \`next\` - Next.js framework
- \`react\` - React library
- \`react-dom\` - React DOM library
- \`typescript\` - TypeScript compiler

### Database Dependencies:
- \`@prisma/client\` - Prisma Client
- \`prisma\` - Prisma CLI

### Authentication Dependencies:
- \`next-auth\` - NextAuth.js for authentication
- \`jsonwebtoken\` - JWT library
- \`@types/jsonwebtoken\` - TypeScript types for JWT

### UI Dependencies:
- \`tailwindcss\` - Tailwind CSS framework
- \`postcss\` - PostCSS for CSS processing
- \`autoprefixer\` - Autoprefixer for CSS
- \`@radix-ui/react-slot\` - Radix UI Slot component
- \`lucide-react\` - Lucide React icons
- \`class-variance-authority\` - Utility for component variants
- \`tailwind-merge\` - Utility for merging Tailwind classes
- \`clsx\` - Utility for constructing className strings

### Form Dependencies:
- \`react-hook-form\` - React Hook Form
- \`zod\` - Schema validation
- \`@radix-ui/react-label\` - Radix UI Label component
- \`@radix-ui/react-checkbox\` - Radix UI Checkbox component
- \`@radix-ui/react-select\` - Radix UI Select component

### Additional UI Dependencies:
- \`@radix-ui/react-avatar\` - Radix UI Avatar component
- \`@radix-ui/react-dialog\` - Radix UI Dialog component
- \`@radix-ui/react-dropdown-menu\` - Radix UI Dropdown Menu component
- \`@radix-ui/react-popover\` - Radix UI Popover component
- \`@radix-ui/react-separator\` - Radix UI Separator component
- \`@radix-ui/react-switch\` - Radix UI Switch component
- \`@radix-ui/react-tabs\` - Radix UI Tabs component
- \`@radix-ui/react-toast\` - Radix UI Toast component
- \`tailwindcss-animate\` - Tailwind CSS animations

### Utility Dependencies:
- \`date-fns\` - Date utility library
- \`@supabase/supabase-js\` - Supabase client

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
   - Update package.json with all required dependencies
   - Ensure all UI libraries are included

2. **Update Configuration**:
   - Update next.config.js with proper environment variables

3. **Redeploy**:
   - Run \`vercel --prod\`
   - Or trigger a new deployment from Vercel Dashboard

4. **Check Build Logs**:
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

  fs.writeFileSync('VERCEL-DEPENDENCIES-FIX-INSTRUCTIONS.md', instructions);
  log('✓ Deployment instructions created', 'green');
}

function main() {
  log('🔧 Fix Vercel Dependencies Issues Script', 'bright');
  log('=================================', 'bright');
  log('');
  
  log('🔍 Fixing dependency issues...', 'blue');
  
  // Update configurations
  updatePackageJson();
  updateNextConfig();
  
  // Create instructions
  createDeploymentInstructions();
  
  log('', 'reset');
  log('✅ Dependencies fixed successfully', 'green');
  log('', 'reset');
  
  log('🎯 Next Steps:', 'blue');
  log('1. Commit and push these changes to GitHub', 'blue');
  log('2. Configure environment variables in Vercel Dashboard', 'blue');
  log('3. Deploy: vercel --prod', 'blue');
  log('4. Visit https://invoice-management-system-six.vercel.app', 'blue');
  log('5. Check https://invoice-management-system-six.vercel.app/debug', 'blue');
  log('6. Check VERCEL-DEPENDENCIES-FIX-INSTRUCTIONS.md for detailed solutions', 'blue');
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