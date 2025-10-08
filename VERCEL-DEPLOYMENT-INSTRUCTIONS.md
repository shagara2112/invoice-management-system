
# 🚀 Vercel Deployment Instructions

## 🔧 Common Issues and Fixes:

### 1. Environment Variables
Make sure all required environment variables are set in Vercel Dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://vzavjwkspqmqshmcwdyj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMjEsImV4cCI6MjA3NTQ2NzEyMX0.YOFjpw21w-BfDmmSG33M_vuyKR1lH1cVTCMjsGE5yPo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5MTEyMSwiZXhwIjoyMDc1NDY3MTIxfQ.tRx2-ayPdn0yotTqobS16uNY8h5KbAtmJ-bsZ_KG9r8
DATABASE_URL=postgresql://postgres:2112Danpei2112@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres
JWT_SECRET=i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA==
NEXTAUTH_SECRET=i/JxqMTUl/vBKtxy2kPOKNcMVKIodmV2f5uk0X9jooceGdPYxoQg6KPXmx/uAaENhQoDhudBbLuhKxkiA3u+cA==
NEXTAUTH_URL=https://invoice-management-system-six.vercel.app
```

### 2. Build Issues
If you encounter build issues, try:

1. Clear build cache:
   ```bash
   rm -rf .next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build locally to test:
   ```bash
   npm run build
   ```

### 3. Database Connection Issues
If you encounter database connection issues:

1. Check DATABASE_URL format
2. Verify Supabase project is active
3. Check if password is correct

### 4. API Routes Issues
If you encounter API routes issues:

1. Check vercel.json configuration
2. Make sure API routes are in src/app/api/
3. Check if file extensions are correct (.ts)

## 🚀 Deployment Steps:

1. Configure environment variables in Vercel Dashboard
2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```
3. Test the application
4. Check logs if issues occur

## 🔍 Debugging:

Check Vercel Function Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. Check logs for errors

Check Build Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Deployments tab
4. Click on the latest deployment
5. Check Build logs for errors
