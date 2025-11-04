# 🧪 Health Integration - Testing Checklist

Complete testing guide for the wearable and health data integration system.

## Pre-Testing Setup

- [ ] Database migration applied successfully
- [ ] Environment variables configured
- [ ] OAuth apps created (Google Fit, Fitbit)
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)

---

## 1. Database Testing

### Schema Validation
- [ ] All 7 tables created successfully
- [ ] RLS policies enabled on all tables
- [ ] Indexes created for performance
- [ ] RPC functions working correctly

**Test Commands:**
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'health%' OR table_name IN ('daily_stats', 'sleep_sessions', 'weight_logs');

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'health%';

-- Test RPC function
SELECT * FROM get_weekly_health_summary(
  'user_id_here',
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE
);
```

### Test Data Creation
- [ ] Run seed script: `scripts/seed-health-test-data.sql`
- [ ] Replace `YOUR_USER_ID` with actual user ID
- [ ] Verify data appears in tables
- [ ] Check data shows in UI

---

## 2. API Endpoint Testing

### Connection Endpoints

**GET /api/health/connections**
- [ ] Returns empty array for new user
- [ ] Returns connections after connecting device
- [ ] Tokens are not exposed in response
- [ ] Requires authentication

**POST /api/health/connections**
- [ ] Creates new connection successfully
- [ ] Updates existing connection
- [ ] Validates required fields
- [ ] Returns sanitized response

**DELETE /api/health/connections/[id]**
- [ ] Deletes connection successfully
- [ ] Verifies ownership before deletion
- [ ] Returns 404 for non-existent connection
- [ ] Cascades to related data

**PATCH /api/health/connections/[id]**
- [ ] Updates sync settings
- [ ] Validates input
- [ ] Returns updated connection

### Stats Endpoints

**GET /api/health/stats/daily**
- [ ] Returns today's stats by default
- [ ] Accepts date parameter
- [ ] Accepts date range (start_date, end_date)
- [ ] Returns null for days with no data

**GET /api/health/stats/weekly**
- [ ] Returns 7 days of data
- [ ] Formats data correctly for charts
- [ ] Handles missing days gracefully

### Heart Rate Endpoints

**GET /api/health/heart-rate**
- [ ] Returns heart rate data
- [ ] Filters by session_id
- [ ] Filters by date range
- [ ] Returns zone summary when available

**POST /api/health/heart-rate**
- [ ] Logs heart rate successfully
- [ ] Validates BPM range (30-250)
- [ ] Associates with session if provided
- [ ] Calculates zone automatically

### Weight Endpoints

**GET /api/health/weight**
- [ ] Returns weight logs
- [ ] Filters by date range
- [ ] Orders by date descending

**POST /api/health/weight**
- [ ] Logs weight successfully
- [ ] Validates weight value
- [ ] Calculates BMI if height available
- [ ] Updates daily stats

### Sync Endpoint

**POST /api/health/sync**
- [ ] Triggers manual sync
- [ ] Syncs specific provider if specified
- [ ] Syncs all providers if not specified
- [ ] Returns sync results

---

## 3. OAuth Flow Testing

### Google Fit OAuth

**Setup:**
- [ ] Client ID configured in .env.local
- [ ] Redirect URI matches OAuth app
- [ ] Scopes include all required permissions

**Flow:**
1. [ ] Click "Connect Google Fit"
2. [ ] Redirects to Google OAuth
3. [ ] Shows permission screen
4. [ ] User grants permissions
5. [ ] Redirects back to app
6. [ ] Connection saved to database
7. [ ] Success message displayed
8. [ ] Connection appears in list

**Error Cases:**
- [ ] User denies permissions → Shows error
- [ ] Invalid credentials → Shows error
- [ ] Network error → Shows error

### Fitbit OAuth

**Setup:**
- [ ] Client ID configured in .env.local
- [ ] Redirect URI matches OAuth app
- [ ] Scopes include all required permissions

**Flow:**
1. [ ] Click "Connect Fitbit"
2. [ ] Redirects to Fitbit OAuth
3. [ ] Shows permission screen
4. [ ] User grants permissions
5. [ ] Redirects back to app
6. [ ] Connection saved to database
7. [ ] Success message displayed
8. [ ] Connection appears in list

**Error Cases:**
- [ ] User denies permissions → Shows error
- [ ] Invalid credentials → Shows error
- [ ] Network error → Shows error

---

## 4. Data Sync Testing

### Initial Sync
- [ ] Triggers automatically after connection
- [ ] Fetches historical data (7 days)
- [ ] Stores data in database
- [ ] Updates last_sync_at timestamp
- [ ] Shows data in dashboard

### Manual Sync
- [ ] Click "Sync Now" button
- [ ] Shows loading state
- [ ] Fetches new data
- [ ] Updates dashboard
- [ ] Shows success message

### Background Sync
- [ ] Service starts automatically
- [ ] Syncs every 4 hours (configurable)
- [ ] Only syncs enabled connections
- [ ] Respects sync frequency setting
- [ ] Logs sync operations

### Sync Error Handling
- [ ] Rate limit errors → Queues retry
- [ ] Auth errors → Disables sync, notifies user
- [ ] Network errors → Retries with backoff
- [ ] Invalid data → Logs error, continues
- [ ] Partial sync → Marks as partial success

---

## 5. UI Component Testing

### Health Dashboard (`/member/health`)

**Today's Stats:**
- [ ] Steps widget shows correct value
- [ ] Calories widget shows correct value
- [ ] Active minutes widget shows correct value
- [ ] Sleep widget shows correct value
- [ ] Goal progress bars work
- [ ] Achievement badges appear when goals met

**Additional Stats:**
- [ ] Distance displays correctly
- [ ] Heart rate shows resting and average
- [ ] Activity level calculated correctly

**Charts:**
- [ ] Weekly activity chart displays
- [ ] Heart rate chart shows hourly data
- [ ] Sleep chart shows 7 days
- [ ] Weight chart shows trend
- [ ] Charts handle missing data

**Interactions:**
- [ ] Tab switching works
- [ ] Sync button triggers sync
- [ ] Loading states display
- [ ] Error messages show

### Connection Management (`/member/settings/connections`)

**Provider Cards:**
- [ ] All providers listed
- [ ] Connection status accurate
- [ ] Features displayed
- [ ] Platform badges shown

**Connection Actions:**
- [ ] Connect button works
- [ ] Disconnect button works
- [ ] Confirmation dialog appears
- [ ] Sync toggle works
- [ ] Settings update

**Sync Settings:**
- [ ] Auto sync toggle works
- [ ] Conflict resolution dropdown works
- [ ] Bidirectional sync toggle works

---

## 6. Integration Testing

### End-to-End Flow

**New User:**
1. [ ] User signs up
2. [ ] Navigates to connections
3. [ ] Connects Google Fit
4. [ ] OAuth completes successfully
5. [ ] Initial sync runs
6. [ ] Data appears in dashboard
7. [ ] Manual sync works
8. [ ] Disconnects device
9. [ ] Data persists
10. [ ] Reconnects device

**Existing User:**
1. [ ] User logs in
2. [ ] Dashboard shows existing data
3. [ ] Sync runs automatically
4. [ ] New data appears
5. [ ] Charts update
6. [ ] Manual logging works

### Multi-Provider Testing
- [ ] Connect Google Fit
- [ ] Connect Fitbit
- [ ] Both sync independently
- [ ] Data merges correctly
- [ ] Conflict resolution works
- [ ] Disconnect one provider
- [ ] Other continues working

---

## 7. Performance Testing

### Load Testing
- [ ] Dashboard loads in < 2 seconds
- [ ] Charts render smoothly
- [ ] API responses < 500ms
- [ ] Sync completes in reasonable time
- [ ] No memory leaks

### Database Performance
- [ ] Queries use indexes
- [ ] No N+1 queries
- [ ] Aggregations are efficient
- [ ] RLS doesn't slow queries

---

## 8. Security Testing

### Authentication
- [ ] All endpoints require auth
- [ ] RLS prevents cross-user access
- [ ] Tokens not exposed in responses
- [ ] Session validation works

### Authorization
- [ ] Users can only access own data
- [ ] Cannot modify other users' data
- [ ] Cannot view other users' connections
- [ ] API validates ownership

### Data Privacy
- [ ] Tokens encrypted in database
- [ ] Sensitive data not logged
- [ ] HTTPS enforced in production
- [ ] OAuth follows best practices

---

## 9. Error Handling Testing

### Network Errors
- [ ] Offline mode handled gracefully
- [ ] Retry logic works
- [ ] User notified of errors
- [ ] Data not lost

### API Errors
- [ ] 400 errors show helpful messages
- [ ] 401 redirects to login
- [ ] 500 errors logged and reported
- [ ] Rate limits handled

### Data Validation
- [ ] Invalid BPM rejected
- [ ] Invalid weight rejected
- [ ] Invalid dates rejected
- [ ] SQL injection prevented

---

## 10. Mobile Testing

### Responsive Design
- [ ] Dashboard mobile-friendly
- [ ] Charts scale properly
- [ ] Buttons accessible
- [ ] Navigation works

### Touch Interactions
- [ ] Tap targets adequate size
- [ ] Swipe gestures work
- [ ] Scroll smooth
- [ ] Forms usable

---

## 11. Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 12. Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] ARIA labels present

---

## Test Results Template

```markdown
## Test Session: [Date]
**Tester:** [Name]
**Environment:** [Dev/Staging/Production]

### Summary
- Total Tests: X
- Passed: X
- Failed: X
- Skipped: X

### Failed Tests
1. [Test Name]
   - Expected: [Expected result]
   - Actual: [Actual result]
   - Steps to reproduce: [Steps]
   - Priority: [High/Medium/Low]

### Notes
[Any additional observations]

### Next Steps
[Action items]
```

---

## Automated Testing (Future)

### Unit Tests
```bash
npm test -- health-utils
npm test -- sync-service
npm test -- providers
```

### Integration Tests
```bash
npm test -- --integration
npm test -- api/health
```

### E2E Tests
```bash
npm run test:e2e
```

---

## Sign-Off Checklist

Before marking as production-ready:

- [ ] All critical tests passing
- [ ] No security vulnerabilities
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Error handling robust
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Rollback plan documented

---

**Testing Status:** ⏳ Pending  
**Last Updated:** [Date]  
**Approved By:** [Name]
