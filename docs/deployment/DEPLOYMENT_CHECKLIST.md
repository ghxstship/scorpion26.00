# 🚀 Deployment Checklist

Complete checklist for deploying Scorpion26 with video streaming to production.

## Pre-Deployment

### 1. Dependencies ✅
- [x] Run `npm install`
- [x] Verify all packages installed
- [ ] Run `npm audit fix` (2 moderate vulnerabilities found)
- [ ] Run `npm run type-check`
- [ ] Run `npm run lint`
- [ ] Run `npm run build` (test production build)

### 2. Environment Configuration

#### Required Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] `CLOUDFLARE_STREAM_API_TOKEN`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

#### Optional Variables
- [ ] `NEXT_PUBLIC_SHOPIFY_DOMAIN`
- [ ] `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- [ ] `RESEND_API_KEY`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `NEXT_PUBLIC_SENTRY_DSN`

### 3. Database Setup
- [ ] Run all Supabase migrations
- [ ] Verify video streaming tables exist:
  - [ ] `video_progress`
  - [ ] `video_captions`
  - [ ] `video_downloads`
  - [ ] `workouts` (with video columns)
- [ ] Verify gamification tables exist:
  - [ ] `badges` (54 badges seeded)
  - [ ] `user_badges`
  - [ ] `user_stats`
  - [ ] `challenges`
  - [ ] `challenge_participants`
  - [ ] `leaderboard_entries`
  - [ ] `xp_transactions`
  - [ ] `streak_history`
  - [ ] `milestones`
- [ ] Verify RPC functions exist:
  - [ ] `award_xp()`
  - [ ] `update_streak()`
  - [ ] `check_and_award_badges()`
  - [ ] `update_challenge_progress()`
  - [ ] `refresh_leaderboards()`
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create indexes
- [ ] Test database connection

### 4. Cloudflare Stream Setup
- [ ] Create Cloudflare account
- [ ] Enable Stream product
- [ ] Generate API token with Stream:Edit permissions
- [ ] Note Account ID
- [ ] Test upload with small video
- [ ] Verify HLS playback works

### 5. Stripe Setup
- [ ] Create Stripe account
- [ ] Set up products and prices
- [ ] Configure webhook endpoint
- [ ] Test payment flow
- [ ] Verify subscription creation

## Testing

### Video Streaming Tests
- [ ] Upload test video (5-10 minutes)
- [ ] Verify processing completes
- [ ] Test video playback
- [ ] Test quality switching
- [ ] Test progress tracking
- [ ] Test resume functionality
- [ ] Test keyboard shortcuts
- [ ] Test fullscreen mode
- [ ] Test Picture-in-Picture
- [ ] Test mobile playback (iOS Safari)
- [ ] Test mobile playback (Android Chrome)
- [ ] Test captions (if configured)
- [ ] Test download functionality

### Gamification Tests
- [ ] Visit /member/achievements page
- [ ] Verify badges display correctly
- [ ] Test badge category filtering
- [ ] Check XP and level display
- [ ] Visit /member/challenges page
- [ ] Test challenge browsing
- [ ] Test joining a challenge
- [ ] Visit /member/leaderboard page
- [ ] Verify leaderboard rankings
- [ ] Test period filters (all-time, monthly, weekly)
- [ ] Test badge auto-award on workout completion
- [ ] Test XP award functionality
- [ ] Test streak tracking
- [ ] Test milestone celebrations

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

### Performance Tests
- [ ] Lighthouse score > 90
- [ ] Video buffer time < 3 seconds
- [ ] Page load time < 2 seconds
- [ ] Test with slow 3G network
- [ ] Test with 100 concurrent users

### Security Tests
- [ ] Test authentication flows
- [ ] Verify RLS policies work
- [ ] Test API rate limiting
- [ ] Check for exposed secrets
- [ ] Verify CORS configuration
- [ ] Test file upload validation

## Deployment

### Vercel Deployment
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add all environment variables
- [ ] Configure build settings
- [ ] Deploy to production
- [ ] Verify deployment successful

### Post-Deployment
- [ ] Test production URL
- [ ] Verify video streaming works
- [ ] Test payment flow
- [ ] Check error tracking (Sentry)
- [ ] Monitor performance
- [ ] Set up uptime monitoring

## Monitoring & Alerts

### Set Up Monitoring
- [ ] Cloudflare Stream analytics
- [ ] Vercel analytics
- [ ] Sentry error tracking
- [ ] Uptime monitoring (e.g., UptimeRobot)
- [ ] Cost alerts (Cloudflare, Stripe)

### Key Metrics to Track
- [ ] Video playback success rate (target: >95%)
- [ ] Average buffer time (target: <3s)
- [ ] Video completion rate (target: >60%)
- [ ] API error rate (target: <5%)
- [ ] Page load time (target: <2s)
- [ ] Monthly active users
- [ ] Subscription conversion rate

## Documentation

### Update Documentation
- [ ] Update README with production URL
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document monitoring setup
- [ ] Create backup/recovery procedures

### Team Training
- [ ] Train admins on video upload
- [ ] Document troubleshooting steps
- [ ] Create user guides
- [ ] Set up support channels

## Backup & Recovery

### Database Backups
- [ ] Enable Supabase automatic backups
- [ ] Test backup restoration
- [ ] Document recovery procedures

### Video Backups
- [ ] Cloudflare Stream has built-in redundancy
- [ ] Consider additional backup for critical videos
- [ ] Document video recovery process

## Cost Optimization

### Review Costs
- [ ] Estimate monthly Cloudflare Stream costs
- [ ] Review Supabase usage
- [ ] Check Vercel bandwidth
- [ ] Monitor Stripe transaction fees
- [ ] Set up cost alerts

### Optimization
- [ ] Enable CDN caching
- [ ] Optimize images
- [ ] Minimize API calls
- [ ] Review database queries
- [ ] Clean up unused videos

## Security Hardening

### Production Security
- [ ] Enable HTTPS only
- [ ] Set secure headers
- [ ] Configure CSP (Content Security Policy)
- [ ] Enable rate limiting
- [ ] Set up DDoS protection
- [ ] Regular security audits

### Access Control
- [ ] Review admin access
- [ ] Rotate API keys
- [ ] Enable 2FA for critical accounts
- [ ] Document access procedures

## Launch Checklist

### Final Checks
- [ ] All tests passing
- [ ] No console errors
- [ ] No broken links
- [ ] All images loading
- [ ] Forms working
- [ ] Payments working
- [ ] Videos playing
- [ ] Mobile responsive
- [ ] SEO optimized
- [ ] Analytics tracking

### Communication
- [ ] Notify team of launch
- [ ] Prepare support team
- [ ] Create launch announcement
- [ ] Update social media
- [ ] Send email to beta users

## Post-Launch

### Week 1
- [ ] Monitor error rates
- [ ] Check video playback metrics
- [ ] Review user feedback
- [ ] Fix critical bugs
- [ ] Optimize performance

### Month 1
- [ ] Review analytics
- [ ] Analyze user behavior
- [ ] Gather feedback
- [ ] Plan improvements
- [ ] Update documentation

## Quick Verification

Run the verification script:

```bash
npm run verify-video
```

This checks:
- ✅ All required files present
- ✅ Dependencies installed
- ⚠️  Environment variables configured
- ✅ Documentation complete

## Emergency Contacts

### Critical Services
- **Vercel Support**: support@vercel.com
- **Supabase Support**: support@supabase.com
- **Cloudflare Support**: https://dash.cloudflare.com/support
- **Stripe Support**: https://support.stripe.com

### Internal Team
- **Technical Lead**: [Add contact]
- **DevOps**: [Add contact]
- **Support**: [Add contact]

## Rollback Plan

If issues occur:

1. **Immediate**: Revert to previous Vercel deployment
2. **Database**: Restore from latest backup
3. **Videos**: Cloudflare Stream data persists
4. **Communication**: Notify users of maintenance
5. **Investigation**: Review logs and errors
6. **Fix**: Address issues in development
7. **Re-deploy**: Test thoroughly before re-launch

---

## Status

- **Last Updated**: November 4, 2024
- **Version**: 1.0.0
- **Ready for Deployment**: ⚠️ Pending configuration

### Next Steps

1. Configure environment variables
2. Run `npm run verify-video`
3. Complete testing checklist
4. Deploy to Vercel
5. Monitor and optimize

---

**Good luck with your launch!** 🚀
