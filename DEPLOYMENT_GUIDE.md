# 🚀 Invoice Management System - Deployment Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Options](#deployment-options)
   - [Docker Deployment](#docker-deployment)
   - [Vercel Deployment](#vercel-deployment)
   - [Railway Deployment](#railway-deployment)
   - [cPanel Deployment](#cpanel-deployment)
5. [Database Setup](#database-setup)
6. [SSL & Security](#ssl--security)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

## 🎯 Overview

This guide will help you deploy the Invoice Management System to various hosting platforms. The application is built with Next.js, Prisma, and supports multiple deployment options.

## ✅ Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Database (PostgreSQL recommended for production)
- Domain name (optional but recommended)

## 🔧 Environment Configuration

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env.production
```

### 2. Configure Required Variables

Edit `.env.production` with your production values:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/invoice_app"

# Authentication
JWT_SECRET="your_long_random_secret_key_minimum_32_characters"
NEXTAUTH_SECRET="your_long_random_secret_key_minimum_32_characters"
NEXTAUTH_URL="https://yourdomain.com"

# Application
NODE_ENV="production"
PORT=3000

# Optional: Supabase (if using instead of PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
```

### 3. Generate Secrets

Generate secure secrets for production:

```bash
# Generate JWT secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🐳 Docker Deployment

### Quick Start

1. **Build and Run with Docker Compose:**

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

2. **Setup Database:**

```bash
# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed database (optional)
docker-compose exec app npm run seed
```

3. **Access Application:**

- Application: http://localhost:3000
- Database: localhost:5432

### Production Docker Deployment

1. **Configure Production Environment:**

```bash
# Create production environment file
cp .env.example .env.production

# Edit with your production values
nano .env.production
```

2. **Build Production Image:**

```bash
docker build -t invoice-management-system:latest .
```

3. **Run with Docker Compose:**

```bash
docker-compose -f docker-compose.yml --env-file .env.production up -d
```

### Docker Swarm/Kubernetes

For container orchestration, use the provided Dockerfile and environment variables.

## 🌐 Vercel Deployment

### Prerequisites

- Vercel account
- GitHub repository (recommended)

### Deployment Steps

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Login to Vercel:**

```bash
vercel login
```

3. **Deploy Application:**

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

4. **Configure Environment Variables:**

In Vercel dashboard, add environment variables from your `.env.production` file.

5. **Setup Database:**

- Use Vercel Postgres or external PostgreSQL
- Configure DATABASE_URL in Vercel environment variables
- Run migrations: `vercel env pull .env.production && npx prisma migrate deploy`

### Vercel Configuration

Create `vercel.json` for custom configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/pages/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

## 🚂 Railway Deployment

### Prerequisites

- Railway account
- GitHub repository

### Deployment Steps

1. **Install Railway CLI:**

```bash
npm install -g @railway/cli
```

2. **Login to Railway:**

```bash
railway login
```

3. **Initialize Project:**

```bash
railway init
```

4. **Deploy Application:**

```bash
railway up
```

5. **Configure Environment Variables:**

In Railway dashboard, add environment variables from your `.env.production` file.

6. **Setup Database:**

- Add PostgreSQL service in Railway
- Configure DATABASE_URL
- Run migrations: `railway run npx prisma migrate deploy`

## 🖥️ cPanel Deployment

### Prerequisites

- cPanel hosting with Node.js support
- SSH access (recommended)

### Manual Deployment

1. **Build Application Locally:**

```bash
npm run build
```

2. **Upload Files:**

- Upload all files except `node_modules`, `.git`, `.next`
- Use File Manager or FTP/SFTP

3. **Setup Node.js App:**

1. Login to cPanel
2. Go to "Setup Node.js App"
3. Create Application with:
   - Application Root: `invoice-app`
   - Application URL: `yourdomain.com`
   - Application Startup File: `server.js`
   - Node.js Version: 18.x

4. **Install Dependencies:**

```bash
cd invoice-app
npm install --production
```

5. **Configure Environment Variables:**

In cPanel Node.js App → Environment Variables, add your production variables.

6. **Start Application:**

Click "Restart" in cPanel Node.js App.

### Automated cPanel Deployment

Use the provided script:

```bash
# Make script executable
chmod +x scripts/deploy-production.sh

# Run cPanel deployment
./scripts/deploy-production.sh cpanel
```

This creates a deployment package with instructions.

## 🗄️ Database Setup

### PostgreSQL (Recommended)

1. **Create Database:**

```sql
CREATE DATABASE invoice_app;
CREATE USER invoice_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE invoice_app TO invoice_user;
```

2. **Run Migrations:**

```bash
npx prisma migrate deploy
```

3. **Seed Database (Optional):**

```bash
npm run seed
```

### Supabase

1. **Create Supabase Project:**

- Go to [supabase.com](https://supabase.com)
- Create new project
- Get connection details

2. **Configure Environment:**

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

3. **Run Migrations:**

```bash
npx supabase db push
```

### SQLite (Development Only)

For development, you can use SQLite:

```bash
DATABASE_URL="file:./dev.db"
```

## 🔒 SSL & Security

### SSL Certificate

1. **Let's Encrypt (Free):**

```bash
# On Ubuntu/Debian
sudo apt install certbot
sudo certbot --nginx -d yourdomain.com
```

2. **Cloudflare (Free):**

- Sign up for Cloudflare
- Point your nameservers to Cloudflare
- Enable SSL/TLS in Cloudflare dashboard

### Security Headers

The application includes security headers by default:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- X-XSS-Protection: 1; mode=block

### Additional Security

1. **Environment Variables:**

- Never commit `.env.production` to version control
- Use strong, unique secrets
- Rotate secrets regularly

2. **Database Security:**

- Use strong passwords
- Limit database user permissions
- Enable SSL connections

3. **Application Security:**

- Keep dependencies updated
- Enable rate limiting
- Monitor for vulnerabilities

## 📊 Monitoring & Maintenance

### Health Checks

The application includes a health check endpoint:

```bash
curl https://yourdomain.com/api/health
```

### Logging

1. **Application Logs:**

```bash
# Docker
docker-compose logs -f app

# PM2
pm2 logs

# Systemd
journalctl -u invoice-app -f
```

2. **Database Logs:**

```bash
# PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Backup Strategy

1. **Database Backups:**

```bash
# PostgreSQL
pg_dump invoice_app > backup_$(date +%Y%m%d).sql

# Automated backup
0 2 * * * /usr/bin/pg_dump invoice_app > /backups/invoice_$(date +\%Y\%m\%d).sql
```

2. **File Backups:**

```bash
# Backup application files
tar -czf invoice_app_backup_$(date +%Y%m%d).tar.gz /path/to/app
```

### Performance Monitoring

1. **Application Performance:**

- Use APM tools (New Relic, DataDog)
- Monitor response times
- Track error rates

2. **Database Performance:**

- Monitor query performance
- Check connection pool usage
- Optimize slow queries

## 🔧 Troubleshooting

### Common Issues

#### 1. Application Won't Start

**Symptoms:**
- Server returns 502 error
- Application logs show startup errors

**Solutions:**
```bash
# Check logs
docker-compose logs app

# Check environment variables
printenv | grep NODE_ENV

# Verify build
npm run build
```

#### 2. Database Connection Failed

**Symptoms:**
- Database connection errors
- Timeouts when accessing data

**Solutions:**
```bash
# Test database connection
npx prisma db pull

# Check DATABASE_URL
echo $DATABASE_URL

# Verify database is running
docker-compose ps db
```

#### 3. Build Errors

**Symptoms:**
- Build fails during deployment
- TypeScript errors

**Solutions:**
```bash
# Clean build
rm -rf .next node_modules
npm install
npm run build

# Check TypeScript configuration
npx tsc --noEmit
```

#### 4. Memory Issues

**Symptoms:**
- Out of memory errors
- Slow performance

**Solutions:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Optimize build
npm run build -- --optimize
```

### Getting Help

1. **Check Logs:**

```bash
# Application logs
docker-compose logs -f

# System logs
journalctl -f
```

2. **Community Support:**

- GitHub Issues: [Create an issue](https://github.com/shagara2112/invoice-management-system/issues)
- Documentation: [Check docs](./docs/)

3. **Professional Support:**

- Contact development team
- Hire a DevOps consultant

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Database setup and tested
- [ ] SSL certificate installed
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Security review completed

### Post-Deployment

- [ ] Application accessible
- [ ] All features working
- [ ] Database operations working
- [ ] Authentication working
- [ ] Performance acceptable
- [ ] Logs being collected
- [ ] Backups running

### Ongoing Maintenance

- [ ] Regular updates applied
- [ ] Security patches installed
- [ ] Performance monitored
- [ ] Backups verified
- [ ] Logs reviewed
- [ ] User feedback collected

## 🎉 Conclusion

You've successfully deployed the Invoice Management System! 

For additional help or questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [API documentation](./docs/API.md)
3. Create a [GitHub issue](https://github.com/shagara2112/invoice-management-system/issues)

Thank you for using Invoice Management System! 🚀