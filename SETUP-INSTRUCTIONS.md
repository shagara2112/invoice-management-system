# 🚀 Invoice Management System - Setup Instructions

Panduan lengkap untuk setup Invoice Management System dengan Supabase dan Vercel menggunakan kredensial yang sudah disediakan.

## 📋 Kredensial Supabase

Berikut adalah kredensial Supabase Anda yang sudah dikonfigurasi:

- **Supabase URL:** `https://vzavjwkspqmqshmcwdyj.supabase.co`
- **Supabase Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMjEsImV4cCI6MjA3NTQ2NzEyMX0.YOFjpw21w-BfDmmSG33M_vuyKR1lH1cVTCMjsGE5yPo`

## 🎯 Langkah-Langkah Setup

### 1. Setup Supabase Database

1. **Login ke Supabase Dashboard:**
   - Buka https://supabase.com/dashboard
   - Login dengan akun Anda

2. **Buka Project Anda:**
   - Project URL: `https://vzavjwkspqmqshmcwdyj.supabase.co`

3. **Dapatkan Database URL:**
   - Go to Settings → Database
   - Copy Connection string
   - Format: `postgresql://postgres:@Danpei2112@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres`

4. **Dapatkan Service Role Key:**
   - Go to Settings → API
   - Copy `service_role` key

5. **Update .env.local:**
   ```bash
   # Tambahkan ke .env.local
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres"
   SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
   ```

### 2. Setup Database Schema

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Push Schema ke Supabase:**
   ```bash
   npx prisma db push
   ```

3. **Seed Database (Opsional):**
   ```bash
   npx prisma db execute --file supabase/seed.sql
   ```

### 3. Setup Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login ke Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy ke Vercel:**
   ```bash
   # Deploy ke preview
   vercel
   
   # Deploy ke production
   vercel --prod
   ```

### 4. Configure Environment Variables di Vercel

1. **Buka Vercel Dashboard:**
   - Go to https://vercel.com/dashboard
   - Pilih project Anda

2. **Add Environment Variables:**
   - Go to Settings → Environment Variables
   - Tambahkan variabel berikut:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://vzavjwkspqmqshmcwdyj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZqd2tzcHFtcXNobWN3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMjEsImV4cCI6MjA3NTQ2NzEyMX0.YOFjpw21w-BfDmmSG33M_vuyKR1lH1cVTCMjsGE5yPo
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.vzavjwkspqmqshmcwdyj.supabase.co:5432/postgres
   JWT_SECRET=your_jwt_secret_key_minimum_32_characters
   NEXTAUTH_SECRET=your_nextauth_secret_key_minimum_32_characters
   NEXTAUTH_URL=https://your-vercel-app-url.vercel.app
   ```

3. **Redeploy Aplikasi:**
   ```bash
   vercel --prod
   ```

## 🛠️ Skrip Otomatis

Untuk kemudahan, Anda dapat menggunakan skrip otomatis:

### Windows

1. **Jalankan skrip setup:**
   ```bash
   scripts\setup-supabase-vercel.bat
   ```

2. **Follow instruksi di skrip**

### Linux/macOS

1. **Jalankan skrip setup:**
   ```bash
   chmod +x scripts/setup-supabase-vercel.sh
   ./scripts/setup-supabase-vercel.sh
   ```

2. **Follow instruksi di skrip**

## 📝 Default Login

Setelah database di-seed, Anda dapat login dengan:

- **Email:** admin@invoice-app.com
- **Password:** admin123
- **Role:** SUPER_ADMIN

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Periksa DATABASE_URL di environment variables
   - Pastikan password database benar
   - Verify Supabase project aktif

2. **Prisma Client Generation Failed**
   - Run `npx prisma generate`
   - Periksa Prisma schema
   - Verify DATABASE_URL

3. **Vercel Deployment Failed**
   - Periksa build logs
   - Verify environment variables
   - Check Next.js configuration

4. **Authentication Failed**
   - Periksa JWT_SECRET dan NEXTAUTH_SECRET
   - Verify NEXTAUTH_URL
   - Check Supabase auth configuration

### Debug Commands

```bash
# Check Prisma connection
npx prisma db pull

# Test database connection
npx prisma db execute --sql "SELECT 1"

# Check Vercel logs
vercel logs

# Check environment variables
vercel env pull .env.local
```

## 🚀 Quick Start

Untuk setup cepat:

1. **Copy Environment Variables:**
   ```bash
   # Copy dari .env.local ke .env.production
   cp .env.local .env.production
   ```

2. **Update Production Variables:**
   - Get Service Role Key dari Supabase
   - Get Database URL dari Supabase
   - Generate JWT secrets

3. **Deploy ke Vercel:**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables di Vercel:**
   - Tambahkan semua variabel dari .env.production

## 📊 Monitoring

### Vercel Analytics

1. Buka Vercel Dashboard
2. Pilih project Anda
3. Go to Analytics tab

### Supabase Monitoring

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Go to Logs tab

## 🎉 Selamat!

Invoice Management System Anda sekarang siap untuk production dengan Supabase dan Vercel!

### Next Steps:

1. Test semua fitur aplikasi
2. Setup custom domain (opsional)
3. Configure monitoring dan alerts
4. Setup backup strategy
5. Add team members ke Supabase project

### Useful Links:

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://vzavjwkspqmqshmcwdyj.supabase.co)
- [GitHub Repository](https://github.com/shagara2112/invoice-management-system)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

**Version:** 1.0.0  
**Last Updated:** $(date)  
**Framework:** Next.js 15.3.5 + Prisma + Supabase + Vercel