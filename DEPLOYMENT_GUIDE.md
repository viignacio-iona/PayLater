# PayLater App - Vercel Deployment Guide

## 🚀 Production Deployment Checklist

### 1. Database Setup (Required)

**Current Status:** Using SQLite (development only)
**Production Need:** Cloud database (PostgreSQL recommended)

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Select your project
3. Go to Storage tab
4. Click "Create Database" → "Postgres"
5. Choose a name (e.g., `paylater-db`)
6. Select region closest to your users
7. Copy the connection string

#### Option B: External PostgreSQL Provider
- **Neon** (Free tier available): https://neon.tech
- **PlanetScale** (MySQL): https://planetscale.com
- **Railway**: https://railway.app
- **Supabase**: https://supabase.com

### 2. Update Database Configuration

#### Step 1: Update Prisma Schema
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

#### Step 2: Update Environment Variables
Create `.env.production` (for reference):
```bash
# Production Database
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# App Authentication
APP_PASSWORD="YourSecureProductionPassword"

# Next.js
NEXTAUTH_SECRET="your-super-secret-production-key"
NEXTAUTH_URL="https://your-app.vercel.app"
```

### 3. Vercel Environment Variables

In your Vercel dashboard, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Production database connection string |
| `APP_PASSWORD` | `YourSecurePassword` | App authentication password |
| `NEXTAUTH_SECRET` | `random-string` | NextAuth.js secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your production URL |

### 4. Database Migration

#### Step 1: Install Prisma CLI (if not already installed)
```bash
npm install -g prisma
```

#### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

#### Step 3: Push Schema to Production Database
```bash
npx prisma db push
```

#### Step 4: (Optional) Seed Production Database
```bash
npx prisma db seed
```

### 5. Build Configuration

#### Update `package.json` (if needed)
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

#### Create `vercel.json` (optional)
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 6. Deployment Steps

#### Step 1: Connect to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`

#### Step 2: Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Step 3: Verify Deployment
1. Check all API endpoints work
2. Test authentication flow
3. Verify database operations
4. Test on mobile devices

### 7. Post-Deployment Checklist

- [ ] Database connection working
- [ ] Authentication working
- [ ] All API endpoints responding
- [ ] Trip creation/editing working
- [ ] Expense management working
- [ ] User management working
- [ ] Mobile responsiveness verified
- [ ] Performance optimized

### 8. Monitoring & Maintenance

#### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance and errors

#### Database Monitoring
- Monitor database performance
- Set up alerts for connection issues
- Regular backups (if using external provider)

### 9. Security Considerations

- [ ] Strong production password
- [ ] Secure database credentials
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] Regular security updates

### 10. Troubleshooting

#### Common Issues:
1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall settings

2. **Build Failures**
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors
   - Verify Prisma schema

3. **API Errors**
   - Check Vercel function logs
   - Verify environment variables
   - Test endpoints individually

### 11. Cost Estimation

#### Vercel (Free Tier)
- ✅ Hobby plan: Free
- ✅ 100GB bandwidth/month
- ✅ Unlimited static deployments

#### Database Costs
- **Vercel Postgres**: $20/month (Pro plan required)
- **Neon Free Tier**: 0.5GB storage, 10GB transfer
- **PlanetScale Free**: 1GB storage, 1 billion reads/month

### 12. Next Steps After Deployment

1. **Domain Setup** (Optional)
   - Add custom domain in Vercel
   - Update NEXTAUTH_URL

2. **Backup Strategy**
   - Set up database backups
   - Export data regularly

3. **Performance Optimization**
   - Enable Vercel Edge Functions
   - Optimize images
   - Monitor Core Web Vitals

## 🎉 Ready to Deploy!

Your PayLater app is ready for production! Follow the steps above to deploy to Vercel with a production database.

**Estimated Deployment Time:** 30-45 minutes
**Complexity:** Medium (mainly database setup)
**Cost:** Free to $20/month depending on database choice
