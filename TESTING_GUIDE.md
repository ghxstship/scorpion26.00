# 🧪 Comprehensive Testing Guide

**Last Updated**: November 3, 2025

---

## 📋 TABLE OF CONTENTS

1. [Setup](#setup)
2. [Database Testing](#database-testing)
3. [API Route Testing](#api-route-testing)
4. [Authentication Testing](#authentication-testing)
5. [File Upload Testing](#file-upload-testing)
6. [Real-time Testing](#real-time-testing)
7. [Security Testing](#security-testing)
8. [Performance Testing](#performance-testing)
9. [Integration Testing](#integration-testing)

---

## 🔧 SETUP

### Prerequisites
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and Stripe keys
```

### Run Database Migration
```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase Dashboard
# 1. Go to SQL Editor
# 2. Paste contents of supabase/migrations/20251104010000_extended_schema.sql
# 3. Run
```

### Start Development Server
```bash
npm run dev
```

---

## 🗄️ DATABASE TESTING

### Verify Tables Created
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should return 32+ tables
```

### Test Row Level Security
```sql
-- Set role to authenticated user
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "user-uuid-here"}';

-- Try to access posts
SELECT * FROM posts;

-- Should only see public posts or user's own posts
```

### Test Relationships
```sql
-- Test user_roles relationship
SELECT 
  p.email,
  r.name as role
FROM profiles p
JOIN user_roles ur ON p.id = ur.user_id
JOIN roles r ON ur.role_id = r.id;
```

---

## 📡 API ROUTE TESTING

### Authentication Routes

#### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }'

# Expected: 200 OK with user object
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# Expected: 200 OK with session token
# Save the token for subsequent requests
```

#### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout

# Expected: 200 OK
```

### User Management Routes

#### List Users (Admin/Team only)
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: 200 OK with users array
```

#### Get User Profile
```bash
curl http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: 200 OK with user object
```

#### Update User Profile
```bash
curl -X PATCH http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Updated",
    "last_name": "Name"
  }'

# Expected: 200 OK with updated user
```

### Progress Tracking Routes

#### Get Progress Summary
```bash
curl http://localhost:3000/api/progress \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: 200 OK with progress data
```

#### Log Workout
```bash
curl -X POST http://localhost:3000/api/progress \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workout_id": "workout-uuid",
    "duration_minutes": 45,
    "calories_burned": 350,
    "difficulty_rating": 7,
    "notes": "Great workout!"
  }'

# Expected: 200 OK with workout log
```

#### Get Progress Stats
```bash
curl "http://localhost:3000/api/progress/stats?period=30" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: 200 OK with statistics
```

### Community Routes

#### List Posts
```bash
curl "http://localhost:3000/api/community/posts?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: 200 OK with posts array
```

#### Create Post
```bash
curl -X POST http://localhost:3000/api/community/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Just finished an amazing workout! 💪",
    "visibility": "public"
  }'

# Expected: 200 OK with created post
```

#### Like Post
```bash
curl -X POST http://localhost:3000/api/community/posts/POST_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: 200 OK with { "liked": true }
```

### Subscription Routes

#### List Plans
```bash
curl http://localhost:3000/api/subscriptions/plans

# Expected: 200 OK with plans array (no auth required)
```

#### Get My Subscription
```bash
curl http://localhost:3000/api/subscriptions/my \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: 200 OK with subscription or null
```

#### Create Checkout Session
```bash
curl -X POST http://localhost:3000/api/subscriptions/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_xxxxx"
  }'

# Expected: 200 OK with sessionId and url
```

---

## 📁 FILE UPLOAD TESTING

### Upload Avatar
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/avatar.jpg" \
  -F "type=avatar"

# Expected: 200 OK with file URL
```

### Upload Progress Photo
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/photo.jpg" \
  -F "type=progress-photo"

# Expected: 200 OK with file URL
```

### Upload Multiple Files
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/file1.jpg" \
  -F "files=@/path/to/file2.jpg" \
  -F "type=progress-photo"

# Expected: 200 OK with array of file URLs
```

### Test File Validation

#### File Too Large
```bash
# Upload file > 10MB
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/large-file.jpg" \
  -F "type=avatar"

# Expected: 400 Bad Request with error message
```

#### Invalid File Type
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/document.pdf" \
  -F "type=avatar"

# Expected: 400 Bad Request with error message
```

---

## 🔐 AUTHENTICATION TESTING

### Test Protected Routes Without Auth
```bash
curl http://localhost:3000/api/users

# Expected: 401 Unauthorized
```

### Test Invalid Token
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer invalid_token"

# Expected: 401 Unauthorized
```

### Test Permission Checking
```bash
# Try to create program as guest user
curl -X POST http://localhost:3000/api/programs \
  -H "Authorization: Bearer GUEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Program"}'

# Expected: 403 Forbidden
```

---

## 🔒 SECURITY TESTING

### Test Security Headers
```bash
curl -I http://localhost:3000

# Expected headers:
# Strict-Transport-Security
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection
# Content-Security-Policy
```

### Test Rate Limiting
```bash
# Make 10 rapid requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done

# Expected: Eventually 429 Too Many Requests
```

### Test Input Sanitization
```bash
curl -X POST http://localhost:3000/api/community/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "<script>alert(\"XSS\")</script>Test post"
  }'

# Expected: 200 OK but script tags should be stripped
```

---

## ⚡ REAL-TIME TESTING

### Test Real-time Posts (Browser Console)
```javascript
import { subscribeToNewPosts } from '@/lib/supabase/realtime';

const unsubscribe = subscribeToNewPosts((post) => {
  console.log('New post:', post);
});

// Create a post in another tab
// Should see console log with new post

// Cleanup
unsubscribe();
```

### Test Real-time Notifications
```javascript
import { subscribeToNotifications } from '@/lib/supabase/realtime';

const unsubscribe = subscribeToNotifications('user-id', (notification) => {
  console.log('New notification:', notification);
});
```

---

## 🚀 PERFORMANCE TESTING

### Test API Response Times
```bash
# Using Apache Bench
ab -n 100 -c 10 http://localhost:3000/api/programs

# Expected: Average response time < 200ms
```

### Test Database Query Performance
```sql
-- Run in Supabase SQL Editor
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC
LIMIT 20;

# Check execution time and index usage
```

---

## 🔗 INTEGRATION TESTING

### Test Complete User Flow

```bash
# 1. Register
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"flow@test.com","password":"Test123!","firstName":"Flow","lastName":"Test"}')

echo "Register: $REGISTER_RESPONSE"

# 2. Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"flow@test.com","password":"Test123!"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.session.access_token')
echo "Token: $TOKEN"

# 3. Get Profile
curl -s http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN"

# 4. Log Workout
curl -s -X POST http://localhost:3000/api/progress \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"workout_id":"test","duration_minutes":30,"calories_burned":200}'

# 5. Get Progress
curl -s http://localhost:3000/api/progress \
  -H "Authorization: Bearer $TOKEN"

# 6. Create Post
curl -s -X POST http://localhost:3000/api/community/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Test post from integration test"}'

# 7. Logout
curl -s -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ TEST CHECKLIST

### Database
- [ ] All 32 tables created
- [ ] RLS policies active
- [ ] Indexes created
- [ ] Sample data seeded

### Authentication
- [ ] Register works
- [ ] Login works
- [ ] Logout works
- [ ] Password reset works
- [ ] Protected routes require auth
- [ ] Invalid tokens rejected

### API Routes
- [ ] All 30+ routes respond
- [ ] Proper error handling
- [ ] Validation works
- [ ] Permissions enforced

### File Uploads
- [ ] Files upload successfully
- [ ] File type validation works
- [ ] File size validation works
- [ ] Files accessible via URL

### Security
- [ ] Security headers present
- [ ] Rate limiting works
- [ ] Input sanitization works
- [ ] XSS protection active
- [ ] CSRF protection active

### Real-time
- [ ] Subscriptions connect
- [ ] Updates received
- [ ] Cleanup works

### Performance
- [ ] API responses < 200ms
- [ ] Database queries optimized
- [ ] No N+1 queries

---

## 🐛 TROUBLESHOOTING

### Common Issues

**Issue**: 401 Unauthorized on all requests
```bash
# Solution: Check Supabase keys in .env.local
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Issue**: Database tables not found
```bash
# Solution: Run migration
supabase db push
```

**Issue**: File uploads fail
```bash
# Solution: Create storage buckets in Supabase Dashboard
# Storage → New bucket → avatars, progress-photos, etc.
```

**Issue**: Rate limiting too strict
```bash
# Solution: Adjust limits in lib/api/rate-limit.ts
```

---

## 📊 TEST RESULTS TEMPLATE

```markdown
## Test Run: [Date]

### Environment
- Node: v20.x
- Next.js: 14.2.33
- Database: Supabase PostgreSQL

### Results
- ✅ Database: 32/32 tables
- ✅ API Routes: 30/30 working
- ✅ Authentication: All tests passed
- ✅ File Uploads: All tests passed
- ✅ Security: All headers present
- ✅ Performance: < 200ms average

### Issues Found
- None

### Notes
- All systems operational
- Ready for production
```

---

*Last Updated: November 3, 2025*
