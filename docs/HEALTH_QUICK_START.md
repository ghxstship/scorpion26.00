# 🚀 Health Integration - Quick Start Guide

Get your health data integration up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase project set up
- Google Cloud or Fitbit developer account (for OAuth)

## Step 1: Install Dependencies

```bash
npm install
```

This will install the `@capacitor-community/health` package and all other dependencies.

## Step 2: Run Database Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply the migration manually in Supabase Dashboard
# Copy contents of: supabase/migrations/20251104040000_health_data_schema.sql
```

This creates 7 tables for health data storage.

## Step 3: Configure OAuth (Choose One or Both)

### Option A: Google Fit

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/google-fit/callback`
4. Enable Google Fit API
5. Copy Client ID and Secret

Add to `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_FIT_CLIENT_ID=your_client_id_here
GOOGLE_FIT_CLIENT_SECRET=your_client_secret_here
GOOGLE_FIT_REDIRECT_URI=http://localhost:3000/api/auth/google-fit/callback
```

### Option B: Fitbit

1. Go to [Fitbit Developer Portal](https://dev.fitbit.com/apps)
2. Register a new application
3. Set OAuth 2.0 Application Type: "Server"
4. Add Callback URL: `http://localhost:3000/api/auth/fitbit/callback`
5. Copy Client ID and Secret

Add to `.env.local`:
```bash
NEXT_PUBLIC_FITBIT_CLIENT_ID=your_client_id_here
FITBIT_CLIENT_SECRET=your_client_secret_here
FITBIT_REDIRECT_URI=http://localhost:3000/api/auth/fitbit/callback
```

## Step 4: Start Development Server

```bash
npm run dev
```

## Step 5: Test the Integration

1. Open browser: `http://localhost:3000`
2. Log in to your account
3. Navigate to: **Settings → Connections**
4. Click "Connect Google Fit" or "Connect Fitbit"
5. Complete OAuth flow
6. Navigate to: **Health Dashboard**
7. Click "Sync Now" to pull your data
8. View your health stats!

## Verify It's Working

### Check Database
```sql
-- In Supabase SQL Editor
SELECT * FROM health_connections;
SELECT * FROM daily_stats;
SELECT * FROM heart_rate_data;
```

### Check API
```bash
# Get connections
curl http://localhost:3000/api/health/connections

# Get daily stats
curl http://localhost:3000/api/health/stats/daily
```

### Check UI
- Health Dashboard should show today's stats
- Connection status badge should be green
- Weekly charts should display data

## Common Issues

### "OAuth Error: redirect_uri_mismatch"
- Ensure redirect URI in OAuth app matches exactly
- Check for trailing slashes
- Verify http vs https

### "No data syncing"
- Check connection is enabled in UI
- Verify OAuth tokens are valid
- Check browser console for errors
- Review API logs

### "Database error"
- Ensure migration ran successfully
- Check RLS policies are enabled
- Verify user is authenticated

## Next Steps

1. **Enable Background Sync**
   ```typescript
   import { healthSyncService } from '@/lib/health/sync-service';
   healthSyncService.startBackgroundSync(4); // Every 4 hours
   ```

2. **Customize Goals**
   - Edit goal values in `app/member/health/page.tsx`
   - Default: 10,000 steps, 500 calories, 30 active minutes

3. **Add More Providers**
   - Configure Garmin (requires partnership)
   - Add Apple Health (requires iOS app)

4. **Production Deployment**
   - Update redirect URIs to production domain
   - Set production environment variables
   - Enable HTTPS
   - Monitor sync success rates

## Resources

- **Full Guide**: `docs/WEARABLE_INTEGRATION_GUIDE.md`
- **Implementation Details**: `docs/WEARABLE_INTEGRATION_COMPLETE.md`
- **API Docs**: Check route files in `app/api/health/`
- **Components**: `components/health/`

## Support

Having issues? Check:
1. Environment variables are set correctly
2. Database migration completed
3. OAuth apps configured properly
4. User is authenticated
5. Browser console for errors

Still stuck? Review the full documentation or contact support.

---

**Setup Time**: ~5 minutes  
**Difficulty**: Easy  
**Status**: Production Ready ✅
