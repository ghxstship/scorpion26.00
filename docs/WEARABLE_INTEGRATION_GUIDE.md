# Wearable & Health Data Integration Guide

## Overview

The platform now includes comprehensive wearable and health data integration, allowing users to sync their fitness data from multiple sources including Apple Health, Google Fit, Fitbit, and Garmin.

## Features

### ✅ Implemented

- **Apple Health Integration (iOS)**
  - Workouts, heart rate, steps, sleep, weight
  - VO2 Max and resting heart rate
  - Requires native iOS app with HealthKit

- **Google Fit Integration (Android/Web)**
  - Activities, heart rate, steps, sleep, weight
  - OAuth 2.0 authentication
  - Web-based connection

- **Fitbit Integration**
  - Activities, heart rate, steps, sleep, weight, floors
  - OAuth 2.0 authentication
  - Intraday heart rate data

- **Garmin Integration**
  - Daily summaries, activities, heart rate
  - Requires partnership agreement
  - OAuth 1.0a authentication

- **Background Sync Service**
  - Automatic sync every 4 hours (configurable)
  - Incremental sync (only new data)
  - Error handling and retry logic
  - Conflict resolution

- **Health Dashboard**
  - Today's stats (steps, calories, active minutes, sleep)
  - Weekly activity charts
  - Heart rate tracking and zones
  - Sleep quality analysis
  - Weight tracking

- **Connection Management**
  - Connect/disconnect devices
  - Enable/disable sync
  - Adjust sync frequency
  - View sync history

## Database Schema

### Tables Created

1. **health_connections** - Stores connected device/app information
2. **health_data_sync** - Logs sync operations
3. **heart_rate_data** - Stores heart rate measurements
4. **daily_stats** - Aggregated daily health statistics
5. **sleep_sessions** - Sleep tracking data
6. **weight_logs** - Weight and body composition logs
7. **health_sync_queue** - Queue for failed syncs

## API Endpoints

### Health Connections

```typescript
GET    /api/health/connections          // List connected providers
POST   /api/health/connections          // Connect new provider
DELETE /api/health/connections/[id]     // Disconnect provider
PATCH  /api/health/connections/[id]     // Update connection settings
```

### Health Data

```typescript
GET    /api/health/stats/daily          // Get daily stats
GET    /api/health/stats/weekly         // Get weekly summary
GET    /api/health/heart-rate           // Get heart rate data
POST   /api/health/heart-rate           // Log heart rate
GET    /api/health/weight               // Get weight logs
POST   /api/health/weight               // Log weight
POST   /api/health/sync                 // Trigger manual sync
```

### OAuth Callbacks

```typescript
GET    /api/auth/google-fit/callback    // Google Fit OAuth
GET    /api/auth/fitbit/callback        // Fitbit OAuth
```

## Setup Instructions

### 1. Database Migration

Run the health data schema migration:

```bash
# Apply migration
supabase db push

# Or if using Supabase CLI
supabase migration up
```

### 2. Environment Variables

Add the following to your `.env.local`:

```bash
# Google Fit
NEXT_PUBLIC_GOOGLE_FIT_CLIENT_ID=your_client_id
GOOGLE_FIT_CLIENT_SECRET=your_client_secret
GOOGLE_FIT_REDIRECT_URI=http://localhost:3000/api/auth/google-fit/callback

# Fitbit
NEXT_PUBLIC_FITBIT_CLIENT_ID=your_client_id
FITBIT_CLIENT_SECRET=your_client_secret
FITBIT_REDIRECT_URI=http://localhost:3000/api/auth/fitbit/callback

# Garmin (Optional)
GARMIN_CONSUMER_KEY=your_consumer_key
GARMIN_CONSUMER_SECRET=your_consumer_secret
```

### 3. Google Fit Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Fit API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID and Secret

**Required Scopes:**
- `https://www.googleapis.com/auth/fitness.activity.read`
- `https://www.googleapis.com/auth/fitness.activity.write`
- `https://www.googleapis.com/auth/fitness.body.read`
- `https://www.googleapis.com/auth/fitness.location.read`
- `https://www.googleapis.com/auth/fitness.heart_rate.read`

### 4. Fitbit Setup

1. Go to [Fitbit Developer Portal](https://dev.fitbit.com)
2. Register a new application
3. Set OAuth 2.0 Application Type to "Server"
4. Add Callback URL
5. Copy Client ID and Secret

**Required Scopes:**
- `activity`
- `heartrate`
- `sleep`
- `weight`
- `profile`

### 5. Apple Health Setup (iOS Only)

Apple Health requires a native iOS app with HealthKit capabilities:

1. Add HealthKit capability in Xcode
2. Add usage descriptions to Info.plist:
   - `NSHealthShareUsageDescription`
   - `NSHealthUpdateUsageDescription`
3. Install Capacitor Health plugin:
   ```bash
   npm install @capacitor-community/health
   ```

### 6. Install Dependencies

```bash
npm install
```

## Usage

### User Flow

1. **Connect Device**
   - Navigate to Settings → Connections
   - Click "Connect" on desired provider
   - Complete OAuth flow
   - Device is now connected

2. **View Health Data**
   - Navigate to Health Dashboard
   - View today's stats and goals
   - Explore weekly trends
   - Check heart rate zones

3. **Manage Connections**
   - Enable/disable automatic sync
   - Adjust sync frequency
   - Disconnect devices
   - View sync history

### Background Sync

The sync service runs automatically every 4 hours:

```typescript
import { healthSyncService } from '@/lib/health/sync-service';

// Start background sync
healthSyncService.startBackgroundSync(4); // 4 hours

// Stop background sync
healthSyncService.stopBackgroundSync();

// Manual sync
await healthSyncService.manualSync(userId, 'google_fit');
```

### Programmatic Access

```typescript
// Get daily stats
const response = await fetch('/api/health/stats/daily?date=2024-11-04');
const { stats } = await response.json();

// Log heart rate
await fetch('/api/health/heart-rate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recorded_at: new Date().toISOString(),
    bpm: 75,
    source: 'manual',
  }),
});

// Trigger sync
await fetch('/api/health/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ provider: 'google_fit' }),
});
```

## Data Flow

### Sync Process

1. **Check Connections** - Find enabled connections needing sync
2. **Fetch Data** - Request data from provider API
3. **Transform Data** - Convert to standard format
4. **Resolve Conflicts** - Handle duplicate/conflicting data
5. **Store Data** - Save to database
6. **Update Stats** - Aggregate daily statistics
7. **Log Sync** - Record sync operation

### Conflict Resolution

When multiple sources report different values:

- **Newest** - Use most recently synced value
- **Highest** - Use highest value (for steps, calories, etc.)
- **Manual** - Ask user to resolve

## Data Privacy

- All health data is encrypted at rest
- Access tokens are encrypted in database
- Users can disconnect and delete data anytime
- No data sharing with third parties
- HIPAA-compliant storage (Supabase)

## Rate Limits

### Provider Limits

- **Google Fit**: No strict limits
- **Fitbit**: 150 requests/hour per user
- **Garmin**: Varies by partnership tier
- **Apple Health**: No API limits (local device)

### Handling Rate Limits

The sync service automatically:
- Detects rate limit errors
- Queues failed syncs
- Retries with exponential backoff
- Notifies users of persistent failures

## Troubleshooting

### Common Issues

**Connection Failed**
- Verify OAuth credentials are correct
- Check redirect URIs match exactly
- Ensure scopes are properly configured

**Sync Not Working**
- Check connection is enabled
- Verify last_sync_at timestamp
- Review sync queue for errors
- Check provider API status

**Missing Data**
- Confirm data exists in source app
- Check date range of sync
- Verify permissions granted
- Review sync logs

### Debug Mode

Enable debug logging:

```typescript
// In sync-service.ts
console.log('Syncing connection:', connection);
console.log('Date range:', startDate, endDate);
console.log('Response:', response);
```

## Performance Optimization

### Sync Optimization

- Incremental sync (only new data)
- Batch API requests
- Parallel connection syncs
- Database indexing on date fields

### Caching

- Cache daily stats for 1 hour
- Cache weekly summaries for 4 hours
- Invalidate on manual sync

## Future Enhancements

### Planned Features

- [ ] WHOOP integration
- [ ] Oura Ring integration
- [ ] Strava integration
- [ ] MyFitnessPal integration
- [ ] Real-time sync via webhooks
- [ ] Advanced analytics and insights
- [ ] Goal setting and tracking
- [ ] Social features (challenges, leaderboards)
- [ ] Export data to CSV/PDF
- [ ] Integration with workout programs

### API Improvements

- [ ] GraphQL API
- [ ] Webhook notifications
- [ ] Bulk data import
- [ ] Data export API
- [ ] Historical data backfill

## Testing

### Manual Testing

1. Connect a test account for each provider
2. Verify data syncs correctly
3. Test disconnect/reconnect flow
4. Verify conflict resolution
5. Test manual sync trigger

### Automated Testing

```bash
# Run tests
npm test

# Test specific provider
npm test -- google-fit

# Integration tests
npm test -- --integration
```

## Support

For issues or questions:
- Check troubleshooting section
- Review API documentation
- Contact support team
- Submit GitHub issue

## References

- [Google Fit API Docs](https://developers.google.com/fit)
- [Fitbit API Docs](https://dev.fitbit.com/build/reference/)
- [Garmin Health API](https://developer.garmin.com/health-api/)
- [Apple HealthKit](https://developer.apple.com/documentation/healthkit)
- [Capacitor Health Plugin](https://github.com/Ad-Scientiam/capacitor-healthkit)
