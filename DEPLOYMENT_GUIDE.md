# Deployment Guide - Scorpion26.00

This guide will help you deploy your fitness brand website to GitHub and Vercel.

## Prerequisites

- [x] Git initialized and initial commit completed
- [ ] GitHub account (https://github.com)
- [ ] Vercel account (https://vercel.com)
- [ ] Stripe account with API keys
- [ ] Shopify store with Storefront API access

## Part 1: GitHub Deployment

### 1.1 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `scorpion26-fitness` (or your preferred name)
3. Description: "Scorpion26.00 - Modern fitness brand website"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### 1.2 Push Code to GitHub

After creating the repository, run these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/scorpion26-fitness.git

# Push the code
git branch -M main
git push -u origin main
```

## Part 2: Vercel Deployment

### 2.1 Connect Vercel to GitHub

1. Go to https://vercel.com and sign in (use "Continue with GitHub")
2. Click "Add New..." → "Project"
3. Import your `scorpion26-fitness` repository
4. Vercel will auto-detect Next.js settings

### 2.2 Configure Environment Variables

Before deploying, add these environment variables in Vercel:

**Go to: Project Settings → Environment Variables**

#### Required Variables:

1. **NEXT_PUBLIC_BASE_URL**
   - Value: Your Vercel deployment URL (e.g., `https://your-project.vercel.app`)
   - Available for: Production, Preview, Development

2. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - Value: Your Stripe publishable key (starts with `pk_`)
   - Get from: https://dashboard.stripe.com/apikeys
   - Available for: Production, Preview, Development

3. **STRIPE_SECRET_KEY**
   - Value: Your Stripe secret key (starts with `sk_`)
   - Get from: https://dashboard.stripe.com/apikeys
   - Available for: Production, Preview, Development
   - ⚠️ Keep this secret!

4. **NEXT_PUBLIC_SHOPIFY_DOMAIN**
   - Value: Your Shopify store domain (e.g., `your-store.myshopify.com`)
   - Available for: Production, Preview, Development

5. **NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN**
   - Value: Your Shopify Storefront API token
   - Get from: Shopify Admin → Apps → Develop apps → Create an app
   - Available for: Production, Preview, Development

6. **SHOPIFY_ADMIN_ACCESS_TOKEN** (Optional)
   - Value: Your Shopify Admin API token
   - Get from: Shopify Admin → Apps → Develop apps
   - Available for: Production, Preview, Development

7. **SHOPIFY_API_VERSION**
   - Value: `2024-01` (or latest version)
   - Available for: Production, Preview, Development

### 2.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://your-project.vercel.app`

### 2.4 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_BASE_URL` to your custom domain

## Part 3: Post-Deployment

### 3.1 Update Base URL

After your first deployment:

1. Copy your Vercel deployment URL
2. Go to Project Settings → Environment Variables
3. Update `NEXT_PUBLIC_BASE_URL` with your actual URL
4. Redeploy (Deployments → Click "..." → Redeploy)

### 3.2 Test Your Deployment

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Shop page displays products (requires Shopify setup)
- [ ] Cart functionality works
- [ ] Checkout redirects to Stripe/Shopify
- [ ] All pages are accessible

### 3.3 Configure Stripe Webhooks (Optional)

For production, set up Stripe webhooks:

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events to listen to
4. Add webhook secret to Vercel environment variables

## Part 4: Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Environment Variables Not Working

- Make sure they start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing variables
- Check variable names match exactly (case-sensitive)

### 404 Errors

- Ensure all pages are in the `app` directory
- Check file naming conventions (lowercase, kebab-case)
- Verify dynamic routes are properly configured

## Quick Commands Reference

```bash
# Check git status
git status

# Add and commit changes
git add .
git commit -m "Your commit message"

# Push to GitHub
git push

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Shopify Docs**: https://shopify.dev/docs

---

## Summary Checklist

- [ ] Git repository initialized
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Base URL updated
- [ ] Site tested and working
- [ ] Custom domain configured (optional)
- [ ] Stripe webhooks set up (optional)

**Your site is now live! 🎉**
