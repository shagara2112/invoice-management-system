// 🚀 Supabase Connection Test Script
// This script will test various connection string formats for Supabase

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

// Connection string formats to try
const connectionFormats = [
  {
    name: 'Direct Connection (postgresql)',
    url: 'postgresql://postgres:2112Danpei2112@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres'
  },
  {
    name: 'Direct Connection (postgres)',
    url: 'postgres://postgres:2112Danpei2112@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres'
  },
  {
    name: 'Pooler Connection (postgres)',
    url: 'postgres://postgres:2112Danpei2112@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  },
  {
    name: 'Pooler Connection with username.password format',
    url: 'postgres://postgres.2112Danpei2112@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  },
  {
    name: 'Direct Connection with IPv4',
    url: 'postgresql://postgres:2112Danpei2112@35.240.207.15:5432/postgres'
  }
];

function createEnvFile(url) {
  const envContent = `DATABASE_URL="${url}"`;
  fs.writeFileSync('.env.temp', envContent);
  log(`Created .env.temp with: ${url}`, 'cyan');
}

function testConnection(url) {
  try {
    createEnvFile(url);
    log(`Testing connection with format: ${url}`, 'blue');
    
    // Try to generate Prisma client first
    execSync('npx prisma generate', { stdio: 'pipe' });
    log('✓ Prisma client generated successfully', 'green');
    
    // Try to push schema to database
    execSync('dotenv -e .env.temp -- npx prisma db push', { stdio: 'pipe' });
    log('✓ Schema pushed to database successfully', 'green');
    
    return true;
  } catch (error) {
    log(`✗ Connection failed: ${error.message}`, 'red');
    return false;
  }
}

function createSetupInstructions() {
  const instructions = `
# 🚀 Supabase Database Setup Instructions

## 📋 Your Supabase Credentials:

- **Supabase URL:** https://vzavjwkspqmqshmcwdyj.supabase.co
- **Supabase Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMjEsImV4cCI6MjA3NTQ2NzEyMX0.YOFjpw21w-BfDmmSG33M_vuyKR1lH1cVTCMjsGE5yPo
- **Supabase Service Role Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5MTEyMSwiZXhwIjoyMDc1NDY3MTIxfQ.tRx2-ayPdn0yotTqobS16uNY8h5KbAtmJ-bsZ_KG9r8
- **Database Password:** 2112Danpei2112

## 🔗 Database Connection Strings:

### Option 1: Direct Connection
\`\`\`bash
DATABASE_URL="postgresql://postgres:2112Danpei2112@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres"
\`\`\`

### Option 2: Pooler Connection
\`\`\`bash
DATABASE_URL="postgres://postgres:2112Danpei2112@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
\`\`\`

### Option 3: Pooler Connection with username.password format
\`\`\`bash
DATABASE_URL="postgres://postgres.2112Danpei2112@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
\`\`\`

## 🛠️ Manual Setup Steps:

### 1. Create .env.local file:
\`\`\`bash
# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://vzavjwkspqmqshmcwdyj.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMjEsImV4cCI6MjA3NTQ2NzEyMX0.YOFjpw21w-BfDmmSG33M_vuyKR1lH1cVTCMjsGE5yPo"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5MTEyMSwiZXhwIjoyMDc1NDY3MTIxfQ.tRx2-ayPdn0yotTqobS16uNY8h5KbAtmJ-bsZ_KG9r8"

# Database Configuration (choose one of the options above)
DATABASE_URL="postgresql://postgres:2112Danpei2112@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres"

# Authentication Configuration
JWT_SECRET="i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA=="
NEXTAUTH_SECRET="i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA=="
NEXTAUTH_URL="http://localhost:3000"

# Application Configuration
NODE_ENV="development"
PORT=3000
EOF
\`\`\`

### 2. Generate Prisma Client:
\`\`\`bash
npx prisma generate
\`\`\`

### 3. Push Schema to Database:
\`\`\`bash
npx prisma db push
\`\`\`

### 4. Seed Database (Optional):
\`\`\`bash
npx prisma db execute --file supabase/seed.sql
\`\`\`

## 🔍 Troubleshooting:

If you encounter connection issues:

1. **Check Supabase Dashboard:**
   - Go to https://vzavjwkspqmqshmcwdyj.supabase.co
   - Verify your project is active
   - Check database settings

2. **Try Different Connection Formats:**
   - Use the pooler connection if direct connection fails
   - Try different password encoding formats

3. **Verify Password:**
   - Ensure password is correct: 2112Danpei2112
   - Try URL encoding if needed

4. **Check Network:**
   - Ensure you can access Supabase from your network
   - Try using a VPN if needed

5. **Check Firewall:**
   - Ensure port 5432 or 6543 is not blocked
   - Check if your ISP blocks PostgreSQL connections

## 📝 Default Login:

After seeding the database, you can login with:
- **Email:** admin@invoice-app.com
- **Password:** admin123
- **Role:** SUPER_ADMIN

## 🎯 Next Steps:

1. Set up the database using one of the connection strings above
2. Deploy to Vercel
3. Configure environment variables in Vercel dashboard
4. Test the application

Good luck! 🚀
`;

  fs.writeFileSync('SUPABASE-CONNECTION-INSTRUCTIONS.md', instructions);
  log('Created SUPABASE-CONNECTION-INSTRUCTIONS.md with detailed instructions', 'green');
}

function main() {
  log('🚀 Supabase Connection Test Script', 'bright');
  log('===================================', 'bright');
  log('');
  
  log('Testing different connection string formats...', 'blue');
  log('');
  
  let successfulFormat = null;
  
  for (const format of connectionFormats) {
    log(`Trying: ${format.name}`, 'yellow');
    if (testConnection(format.url)) {
      successfulFormat = format;
      log(`✓ Success with: ${format.name}`, 'green');
      break;
    }
    log('');
  }
  
  if (successfulFormat) {
    log('🎉 Database setup successful!', 'green');
    log(`✓ Using format: ${successfulFormat.name}`, 'green');
    log(`✓ Connection string: ${successfulFormat.url}`, 'green');
    
    // Update .env.local with successful format
    const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://vzavjwkspqmqshmcwdyj.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMjEsImV4cCI6MjA3NTQ2NzEyMX0.YOFjpw21w-BfDmmSG33M_vuyKR1lH1cVTCMjsGE5yPo"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5MTEyMSwiZXhwIjoyMDc1NDY3MTIxfQ.tRx2-ayPdn0yotTqobS16uNY8h5KbAtmJ-bsZ_KG9r8"

# Database Configuration
DATABASE_URL="${successfulFormat.url}"

# Authentication Configuration
JWT_SECRET="i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA=="
NEXTAUTH_SECRET="i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA=="
NEXTAUTH_URL="http://localhost:3000"

# Application Configuration
NODE_ENV="development"
PORT=3000`;
    
    fs.writeFileSync('.env.local', envContent);
    log('✓ Updated .env.local with successful connection string', 'green');
    
    // Try to seed database
    try {
      log('Seeding database with initial data...', 'blue');
      execSync(`dotenv -e .env.local -- npx prisma db execute --file supabase/seed.sql`, { stdio: 'pipe' });
      log('✓ Database seeded successfully', 'green');
    } catch (error) {
      log(`✗ Database seeding failed: ${error.message}`, 'red');
      log('You can manually seed the database later with:', 'yellow');
      log('npx prisma db execute --file supabase/seed.sql', 'yellow');
    }
    
    log('', 'reset');
    log('🎉 Setup complete! Your application is ready to use.', 'green');
    log('You can now start the application with:', 'blue');
    log('npm run dev', 'blue');
  } else {
    log('❌ All connection formats failed.', 'red');
    log('', 'reset');
    log('Please check the following:', 'yellow');
    log('1. Your Supabase project is active', 'yellow');
    log('2. Your password is correct: 2112Danpei2112', 'yellow');
    log('3. Your network allows connection to Supabase', 'yellow');
    log('4. Your firewall is not blocking PostgreSQL connections', 'yellow');
    log('', 'reset');
    log('See SUPABASE-CONNECTION-INSTRUCTIONS.md for manual setup steps.', 'blue');
  }
  
  // Create setup instructions
  createSetupInstructions();
  
  // Clean up temp file
  if (fs.existsSync('.env.temp')) {
    fs.unlinkSync('.env.temp');
  }
}

// Run the script
main();