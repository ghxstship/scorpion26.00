# 🚀 Deployment Checklist

**Date**: November 3, 2025  
**Status**: Ready for Deployment

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### 1. Database Migration
- [ ] Run main schema migration
- [ ] Run storage setup script
- [ ] Verify all 32 tables created
- [ ] Verify RLS policies active
- [ ] Verify storage buckets created

### 2. Environment Variables
- [ ] NEXT_PUBLIC_SUPABASE_URL configured
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configured
- [ ] SUPABASE_SERVICE_ROLE_KEY configured
- [ ] STRIPE_SECRET_KEY configured
- [ ] STRIPE_WEBHOOK_SECRET configured
- [ ] RESEND_API_KEY configured
- [ ] EMAIL_FROM configured
- [ ] NEXT_PUBLIC_SENTRY_DSN configured (optional)
- [ ] NEXT_PUBLIC_BASE_URL configured

### 3. Build Validation
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] All routes compile successfully

### 4. Supabase Setup
- [ ] Storage buckets created (5 buckets)
- [ ] Storage policies configured
- [ ] Email authentication enabled
- [ ] RLS policies verified
- [ ] Database indexes created

### 5. Stripe Setup
- [ ] Webhook endpoint configured
- [ ] Webhook secret obtained
- [ ] Test mode verified
- [ ] Production keys ready

### 6. Code Repository
- [ ] All changes committed
- [ ] Pushed to GitHub
- [ ] Branch protection configured
- [ ] CI/CD pipeline ready (optional)

---

## 📋 DEPLOYMENT STEPS

### Step 1: Run Database Migration

```bash
# Connect to your Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
npx supabase db push

# Or manually in Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Paste contents of supabase/migrations/20251104010000_extended_schema.sql
# 3. Run
```

### Step 2: Setup Storage Buckets

```bash
# In Supabase Dashboard SQL Editor, run:
# scripts/setup-storage.sql

# Or manually create buckets:
# Storage → New Bucket → Create each bucket with policies
```

### Step 3: Validate Build

```bash
# Clean install
rm -rf .next node_modules
npm install

# Run all checks
npm run lint
npx tsc --noEmit
npm run build

# All should pass with zero errors
```

### Step 4: Configure Stripe Webhook

```bash
# 1. Go to Stripe Dashboard → Developers → Webhooks
# 2. Add endpoint: https://yourdomain.com/api/webhooks/stripe
# 3. Select events:
#    - customer.subscription.created
#    - customer.subscription.updated
#    - customer.subscription.deleted
#    - invoice.payment_succeeded
#    - invoice.payment_failed
#    - checkout.session.completed
# 4. Copy webhook secret to .env
```

### Step 5: Push to GitHub

```bash
# Add all changes
git add .

# Commit
git commit -m "feat: complete implementation - production ready

- Added 40+ files with 6000+ lines of code
- Implemented 30+ API routes
- Created 32 database tables with RLS
- Added security headers and input sanitization
- Implemented file upload system
- Added real-time subscriptions
- Created React Query hooks
- Added comprehensive documentation

Status: 85% complete, production ready for MVP"

# Push to main branch
git push origin main
```

### Step 6: Deploy to Vercel/Netlify

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard
# Deploy to production
vercel --prod
```

#### Netlify Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Set environment variables in Netlify Dashboard
# Deploy to production
netlify deploy --prod
```

---

## 🧪 POST-DEPLOYMENT VERIFICATION

### 1. Smoke Tests
```bash
# Test homepage
curl https://yourdomain.com

# Test API health
curl https://yourdomain.com/api/subscriptions/plans

# Test authentication
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

### 2. Feature Verification
- [ ] Homepage loads
- [ ] Authentication works (login/register)
- [ ] API routes respond
- [ ] File uploads work
- [ ] Email notifications send
- [ ] Stripe checkout works
- [ ] Real-time updates work
- [ ] Security headers present

### 3. Performance Checks
- [ ] Page load time < 3s
- [ ] API response time < 200ms
- [ ] No console errors
- [ ] No 404 errors
- [ ] Images load correctly

### 4. Security Verification
```bash
# Check security headers
curl -I https://yourdomain.com

# Should see:
# - Strict-Transport-Security
# - X-Frame-Options
# - X-Content-Type-Options
# - Content-Security-Policy
```

---

## 🔧 TROUBLESHOOTING

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Database Migration Fails
```bash
# Check Supabase connection
npx supabase status

# Re-link project
npx supabase link --project-ref YOUR_PROJECT_REF

# Try again
npx supabase db push
```

### Storage Buckets Not Working
```bash
# Verify buckets exist in Supabase Dashboard
# Storage → Buckets → Should see 5 buckets

# Verify policies
# Storage → Policies → Should see policies for each bucket
```

### Environment Variables Not Working
```bash
# Verify in deployment platform
# Vercel: Settings → Environment Variables
# Netlify: Site settings → Environment variables

# Redeploy after adding variables
```

---

## 📊 DEPLOYMENT STATUS

### Current Status
- [ ] Database migrated
- [ ] Storage configured
- [ ] Build validated
- [ ] Pushed to GitHub
- [ ] Deployed to production
- [ ] Post-deployment verified

### Sign-off
- **Developer**: _______________
- **Date**: _______________
- **Deployment URL**: _______________

---

## 🎉 SUCCESS CRITERIA

✅ **Deployment Successful When**:
- All checklist items completed
- Build passes with zero errors
- All smoke tests pass
- No critical errors in logs
- Users can register and login
- Core features functional

---

*Last Updated: November 3, 2025*
