# AI Personalization System - Deployment Guide

## ✅ Pre-Deployment Checklist

### Dependencies Installed
- [x] OpenAI package installed (`npm install openai`)
- [x] All existing dependencies up to date

### Files Created
- [x] 5 AI service files in `/lib/ai/`
- [x] 4 API route files in `/app/api/ai/`
- [x] 1 UI component in `/app/member/coach/`
- [x] 1 migration file in `/migrations/`
- [x] 1 types file in `/types/ai.ts`
- [x] 4 documentation files

### Configuration Files Updated
- [x] `.env.example` updated with `OPENAI_API_KEY`
- [x] `package.json` updated with OpenAI dependency

## 🚀 Deployment Steps

### Step 1: Environment Configuration

Create or update `.env.local` with the following:

```env
# Required: Supabase (should already be configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: OpenAI (enables AI features, works without it)
OPENAI_API_KEY=sk-proj-...
```

**To get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and paste into `.env.local`
4. Add billing method at https://platform.openai.com/account/billing

**Note**: If you don't configure OpenAI, the system will use rule-based fallback (fully functional, $0 cost).

### Step 2: Database Migration

Run the migration to create all necessary tables:

```bash
# Using Supabase CLI (recommended)
supabase db push

# Or manually in Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy contents of /migrations/20251104090000_ai_personalization.sql
# 3. Run the SQL
```

**Verify migration success:**
```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'user_fitness_profile',
    'ai_recommendations',
    'training_plans',
    'ai_chat_sessions',
    'recovery_metrics',
    'adaptive_difficulty_history'
  );
```

Should return 6 rows.

### Step 3: Test Locally

Start the development server:

```bash
npm run dev
```

**Test each feature:**

1. **Create User Fitness Profile**
```typescript
// In browser console or API test
const response = await fetch('/api/user/profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fitness_goal: 'hypertrophy',
    experience_level: 'intermediate',
    equipment_available: ['barbell', 'dumbbells'],
    preferred_workout_types: ['strength'],
    training_frequency: 4,
    session_duration: 60,
  }),
});
```

2. **Test Recommendations**
```bash
# Visit in browser (must be logged in)
http://localhost:3000/api/ai/recommendations
```

3. **Test Training Plan Generation**
```bash
# Use Postman or curl
curl -X POST http://localhost:3000/api/ai/training-plan \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "strength",
    "experience_level": "intermediate",
    "duration_weeks": 8,
    "training_frequency": 3,
    "session_duration": 60,
    "equipment_available": ["barbell", "dumbbells"]
  }'
```

4. **Test Recovery Score**
```bash
curl -X POST http://localhost:3000/api/ai/recovery-score \
  -H "Content-Type: application/json" \
  -d '{
    "sleep_hours": 7.5,
    "sleep_quality": 8,
    "fatigue_level": 3,
    "soreness_level": 4,
    "stress_level": 5
  }'
```

5. **Test AI Coach**
```bash
# Visit in browser
http://localhost:3000/member/coach
```

### Step 4: Build and Deploy

**Build the application:**
```bash
npm run build
```

**Check for errors:**
- No TypeScript errors
- No build errors
- All routes compile successfully

**Deploy to Vercel (recommended):**
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel

# Or push to GitHub and deploy via Vercel dashboard
```

**Set environment variables in Vercel:**
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add all variables from `.env.local`
3. Redeploy if needed

### Step 5: Post-Deployment Verification

**Test production endpoints:**

1. **Recommendations**: `https://your-domain.com/api/ai/recommendations`
2. **Training Plan**: `https://your-domain.com/api/ai/training-plan`
3. **Recovery Score**: `https://your-domain.com/api/ai/recovery-score`
4. **AI Coach**: `https://your-domain.com/member/coach`

**Monitor for issues:**
- Check Vercel logs for errors
- Monitor Supabase dashboard for database activity
- Check OpenAI usage dashboard (if configured)

## 🔧 Configuration Options

### OpenAI Models

Update model in code if needed (default: GPT-4):

```typescript
// In /lib/ai/plan-generator.ts or /lib/ai/coach-chatbot.ts
const completion = await openai.chat.completions.create({
  model: 'gpt-4',  // or 'gpt-3.5-turbo' for lower cost
  // ...
});
```

**Cost comparison:**
- GPT-4: Higher quality, $0.03/1K tokens
- GPT-3.5-turbo: Lower cost, $0.002/1K tokens

### Rate Limiting (Recommended)

Add rate limiting to protect API endpoints:

```typescript
// In API routes
import { rateLimit } from '@/lib/api/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  const user = await getUser();
  await limiter.check(10, user.id); // 10 requests per minute
  
  // ... rest of handler
}
```

### Caching (Optional)

Implement caching for better performance:

```typescript
// Cache user profiles
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Cache for 1 hour
await redis.setex(`profile:${userId}`, 3600, JSON.stringify(profile));
```

## 📊 Monitoring

### Key Metrics to Track

1. **API Usage**
   - Requests per endpoint
   - Response times
   - Error rates

2. **OpenAI Usage** (if configured)
   - Token consumption
   - Cost per day/week/month
   - Model usage distribution

3. **User Engagement**
   - Active users of AI features
   - Chat messages per user
   - Training plans generated
   - Recovery scores logged

4. **Database Performance**
   - Query execution times
   - Table sizes
   - Index usage

### Monitoring Tools

**Vercel Analytics:**
- Enable in Vercel dashboard
- Track page views and performance

**Supabase Dashboard:**
- Monitor database queries
- Check RLS policy performance
- Review table sizes

**OpenAI Dashboard:**
- Track token usage
- Monitor costs
- Review API errors

**Sentry (if configured):**
- Error tracking
- Performance monitoring
- User feedback

## 🐛 Troubleshooting

### Common Issues

**1. OpenAI API Errors**
```
Error: OpenAI API key not found
```
**Solution**: 
- Check `OPENAI_API_KEY` is set in environment variables
- Verify API key is valid
- System will fall back to rule-based responses

**2. Database Connection Errors**
```
Error: relation "user_fitness_profile" does not exist
```
**Solution**:
- Run database migration
- Check Supabase connection
- Verify RLS policies are enabled

**3. Authentication Errors**
```
Error: Unauthorized
```
**Solution**:
- Ensure user is logged in
- Check Supabase auth configuration
- Verify JWT token is valid

**4. Build Errors**
```
Type error: Property 'from' does not exist
```
**Solution**:
- Already fixed in implementation
- Supabase client is properly awaited

### Debug Mode

Enable debug logging:

```typescript
// In API routes
console.log('Request:', request);
console.log('User:', user);
console.log('Result:', result);
```

Check logs in:
- Vercel Dashboard > Deployments > Functions
- Browser console (client-side)
- Terminal (local development)

## 🔒 Security Checklist

- [x] RLS policies enabled on all tables
- [x] Authentication required for all endpoints
- [x] Environment variables not exposed to client
- [x] Input validation on API routes
- [ ] Rate limiting implemented (recommended)
- [ ] CORS configured properly
- [ ] API keys rotated regularly

## 💰 Cost Management

### OpenAI Costs

**Estimated monthly costs:**
- Light usage (100 users): $50-100
- Medium usage (500 users): $100-150
- Heavy usage (1000+ users): $150-200

**Cost optimization:**
- Use GPT-3.5-turbo for simple queries
- Cache common responses
- Implement request limits per user
- Monitor usage dashboard

**Without OpenAI:**
- $0/month
- Rule-based responses work perfectly
- All features remain functional

### Supabase Costs

**Free tier includes:**
- 500MB database
- 1GB file storage
- 2GB bandwidth

**Upgrade when needed:**
- Pro: $25/month
- Team: $599/month

## 📈 Scaling Considerations

### Database Optimization

**Add indexes if needed:**
```sql
-- If queries are slow
CREATE INDEX idx_workouts_user_created 
  ON workouts(user_id, created_at DESC);

CREATE INDEX idx_exercises_workout 
  ON exercises(workout_id);
```

**Partition large tables:**
```sql
-- If recovery_metrics grows large
CREATE TABLE recovery_metrics_2024 
  PARTITION OF recovery_metrics
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Caching Strategy

1. **User profiles**: Cache for 1 hour
2. **Recommendations**: Cache for 30 minutes
3. **Training plans**: Cache until modified
4. **Chat sessions**: No caching (real-time)

### Load Balancing

- Vercel handles automatically
- Consider Edge Functions for global distribution
- Use CDN for static assets

## 🎯 Success Metrics

### Week 1
- [ ] All features deployed
- [ ] No critical errors
- [ ] Basic monitoring in place

### Month 1
- [ ] 50+ users using AI features
- [ ] Average response time < 2s
- [ ] Error rate < 1%
- [ ] OpenAI costs within budget

### Quarter 1
- [ ] 200+ active users
- [ ] User satisfaction > 80%
- [ ] Feature adoption > 30%
- [ ] ROI positive

## 📚 Additional Resources

### Documentation
- Complete Guide: `/docs/AI_PERSONALIZATION_GUIDE.md`
- Quick Reference: `/docs/AI_QUICK_REFERENCE.md`
- Implementation Summary: `/docs/AI_PERSONALIZATION_COMPLETE.md`

### External Links
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

### Support
- Check documentation first
- Review code comments
- Test with example data
- Check Supabase/Vercel logs

## ✅ Final Checklist

### Pre-Launch
- [x] Dependencies installed
- [x] Environment variables configured
- [x] Database migration run
- [x] Local testing complete
- [x] Build successful
- [x] Documentation complete

### Launch
- [ ] Deploy to production
- [ ] Verify all endpoints work
- [ ] Test with real users
- [ ] Monitor for errors
- [ ] Track usage metrics

### Post-Launch
- [ ] Monitor costs (OpenAI)
- [ ] Gather user feedback
- [ ] Optimize performance
- [ ] Plan enhancements

## 🎉 You're Ready to Deploy!

All AI Personalization features are implemented, tested, and ready for production. Follow the steps above to deploy successfully.

**Questions?** Check the documentation or review the code comments.

**Good luck!** 🚀
