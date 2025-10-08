
# 🚀 Supabase Database Setup Instructions

## 📋 Your Supabase Credentials:

- **Supabase URL:** https://vzavjwkspqmqshmcwdyj.supabase.co
- **Supabase Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMjEsImV4cCI6MjA3NTQ2NzEyMX0.YOFjpw21w-BfDmmSG33M_vuyKR1lH1cVTCMjsGE5yPo
- **Supabase Service Role Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5MTEyMSwiZXhwIjoyMDc1NDY3MTIxfQ.tRx2-ayPdn0yotTqobS16uNY8h5KbAtmJ-bsZ_KG9r8
- **Database Password:** 2112Danpei2112

## 🔗 Database Connection Strings:

### Option 1: Direct Connection
```bash
DATABASE_URL="postgresql://postgres:2112Danpei2112@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres"
```

### Option 2: Pooler Connection
```bash
DATABASE_URL="postgres://postgres:2112Danpei2112@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

### Option 3: Pooler Connection with username.password format
```bash
DATABASE_URL="postgres://postgres.2112Danpei2112@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

## 🛠️ Manual Setup Steps:

### 1. Create .env.local file:
```bash
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
```

### 2. Generate Prisma Client:
```bash
npx prisma generate
```

### 3. Push Schema to Database:
```bash
npx prisma db push
```

### 4. Seed Database (Optional):
```bash
npx prisma db execute --file supabase/seed.sql
```

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
