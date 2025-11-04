# Quick Deploy Reference

## 🚀 Deploy in 3 Steps

### Step 1: Create GitHub Repository
```bash
# Go to: https://github.com/new
# Repository name: scorpion26-fitness
# DO NOT initialize with README
# Click "Create repository"
```

### Step 2: Push to GitHub
```bash
# Option A: Use the automated script
./deploy-to-github.sh

# Option B: Manual commands
git remote add origin https://github.com/YOUR_USERNAME/scorpion26-fitness.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
```bash
# 1. Go to: https://vercel.com
# 2. Click "Add New..." → "Project"
# 3. Import your repository
# 4. Add environment variables (see below)
# 5. Click "Deploy"
```

---

## 🔑 Required Environment Variables

Add these in Vercel Project Settings → Environment Variables:

```env
# Required for all deployments
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
SHOPIFY_API_VERSION=2024-01

# Optional
SHOPIFY_ADMIN_ACCESS_TOKEN=...
```

---

## 📋 Pre-Deployment Checklist

- [x] Git initialized
- [x] Initial commit made
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Environment variables ready
- [ ] Stripe account set up
- [ ] Shopify store configured

---

## 🆘 Quick Troubleshooting

**Push failed?**
- Make sure you created the GitHub repo first
- Check your GitHub username is correct
- Verify you have push access

**Build failed on Vercel?**
- Check all environment variables are set
- Verify variable names are correct (case-sensitive)
- Check build logs for specific errors

**Site deployed but not working?**
- Update `NEXT_PUBLIC_BASE_URL` to your actual Vercel URL
- Redeploy after changing environment variables
- Check browser console for errors

---

## 📚 Full Documentation

- **Complete Guide**: See `DEPLOYMENT_GUIDE.md`
- **Shop Setup**: See `SHOP_QUICKSTART.md`
- **Project Info**: See `README.md`

---

## 🎯 After Deployment

1. ✅ Test your live site
2. ✅ Update `NEXT_PUBLIC_BASE_URL` with actual URL
3. ✅ Configure custom domain (optional)
4. ✅ Set up Stripe webhooks (optional)
5. ✅ Add Google Analytics (optional)

---

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
