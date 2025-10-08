# 🚀 Invoice Management System - Supabase + Vercel Deployment

Panduan lengkap untuk deployment Invoice Management System dengan Supabase (database) dan Vercel (hosting).

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- [Node.js 18+](https://nodejs.org/) terinstall
- [Git](https://git-scm.com/) terinstall
- Akun [Supabase](https://supabase.com/)
- Akun [Vercel](https://vercel.com/)
- Akun [GitHub](https://github.com/)

## 🎯 Langkah-Langkah Deployment

### 1. Clone Repository

```bash
git clone https://github.com/shagara2112/invoice-management-system.git
cd invoice-management-system
```

### 2. Setup Supabase Project

1. **Buat Project Supabase:**
   - Login ke [Supabase Dashboard](https://supabase.com/dashboard)
   - Klik "New Project"
   - Pilih organization
   - Set password untuk database
   - Pilih region terdekat
   - Klik "Create new project"

2. **Dapatkan Kredensial Supabase:**
   - Buka project Anda di Supabase Dashboard
   - Go to Settings → API
   - Copy Project URL dan API keys

3. **Setup Environment Variables:**
   ```bash
   # Copy template environment
   cp .env.supabase .env.local
   
   # Edit dengan nilai Supabase Anda
   nano .env.local
   ```

   Update nilai berikut:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
   
   # Database Configuration
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres"
   
   # Authentication Configuration
   JWT_SECRET="your_jwt_secret_key_minimum_32_characters"
   NEXTAUTH_SECRET="your_nextauth_secret_key_minimum_32_characters"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### 3. Setup Database

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
   # Jalankan seed script
   npx prisma db execute --file supabase/seed.sql
   ```

### 4. Setup Vercel Deployment

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

4. **Configure Environment Variables di Vercel:**
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)
   - Pilih project Anda
   - Go to Settings → Environment Variables
   - Tambahkan semua environment variables dari `.env.local`

### 5. Update Production Environment Variables

Setelah deployment ke Vercel, update `NEXTAUTH_URL`:

```bash
# Di Vercel Environment Variables
NEXTAUTH_URL="https://your-vercel-app-url.vercel.app"
```

## 🛠️ Skrip Otomatis

Untuk kemudahan, Anda dapat menggunakan skrip otomatis:

### Linux/macOS

```bash
# Jalankan skrip setup otomatis
chmod +x scripts/setup-supabase-vercel.sh
./scripts/setup-supabase-vercel.sh
```

### Windows

```bash
# Jalankan skrip setup otomatis
scripts\setup-supabase-vercel.bat
```

## 📊 Database Schema

Database menggunakan schema berikut:

### Tables

- **User** - Tabel untuk menyimpan data user
- **Invoice** - Tabel untuk menyimpan data invoice
- **InvoiceHistory** - Tabel untuk tracking perubahan invoice

### Enums

- **UserRole** - SUPER_ADMIN, ADMIN, STAFF, MANAGER
- **InvoiceStatus** - DRAFT, SUBMITTED, INTERNAL_VALIDATION, AWAITING_PAYMENT, SETTLED, DELAYED
- **InvoicePosition** - MITRA, USER, AREA, REGIONAL, HEAD_OFFICE, APM, TERBAYAR
- **WorkRegion** - TARAKAN, BALIKPAPAN, SAMARINDA
- **InvoiceCategory** - PASANG_BARU, ASSURANCE, MAINTENANCE, OSP, SIPIL, KONSTRUKSI, LAINNYA

## 🔐 Konfigurasi Keamanan

### Environment Variables

- **JWT_SECRET** - Generate dengan `openssl rand -base64 32`
- **NEXTAUTH_SECRET** - Generate dengan `openssl rand -base64 32`
- **SUPABASE_SERVICE_ROLE_KEY** - Jangan expose di client-side

### Row Level Security (RLS)

Database sudah dikonfigurasi dengan RLS policies:

- Users hanya bisa melihat invoice yang mereka buat
- Admins bisa melihat semua invoice
- Semua authenticated users bisa membuat invoice

## 🚀 Deployment Commands

### Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Production

```bash
# Build application
npm run build

# Start production server
npm start

# Deploy ke Vercel
vercel --prod
```

### Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Reset database
npx prisma db push --force-reset

# View database
npx prisma studio
```

## 📝 Default Users

Setelah seeding database, Anda dapat login dengan:

- **Email:** admin@invoice-app.com
- **Password:** admin123
- **Role:** SUPER_ADMIN

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Periksa DATABASE_URL di environment variables
   - Pastikan Supabase project aktif
   - Verify password database

2. **Prisma Client Generation Failed**
   - Periksa Prisma schema
   - Verify DATABASE_URL
   - Run `npx prisma generate`

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

## 📈 Monitoring

### Vercel Analytics

1. Buka Vercel Dashboard
2. Pilih project Anda
3. Go to Analytics tab

### Supabase Monitoring

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Go to Logs tab

### Custom Health Check

```bash
# Test health endpoint
curl https://your-vercel-app-url.vercel.app/api/health
```

## 🔄 CI/CD dengan GitHub Actions

Untuk setup CI/CD otomatis:

1. **Buat GitHub Secret:**
   - Go to GitHub repository → Settings → Secrets
   - Tambahkan `VERCEL_TOKEN` dan `VERCEL_ORG_ID`
   - Tambahkan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`

2. **Setup Vercel Integration:**
   - Buka Vercel Dashboard
   - Go to Settings → Git Integrations
   - Connect GitHub repository

3. **Auto-deployment:**
   - Setiap push ke main branch akan auto-deploy
   - Pull requests akan deploy ke preview URL

## 🎉 Selamat!

Invoice Management System Anda sekarang sudah di-deploy dengan Supabase dan Vercel!

### Next Steps:

1. Test semua fitur aplikasi
2. Setup custom domain (opsional)
3. Configure monitoring dan alerts
4. Setup backup strategy
5. Add team members ke Supabase project

### Useful Links:

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [GitHub Repository](https://github.com/shagara2112/invoice-management-system)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

**Version:** 1.0.0  
**Last Updated:** $(date)  
**Framework:** Next.js 15.3.5 + Prisma + Supabase + Vercel