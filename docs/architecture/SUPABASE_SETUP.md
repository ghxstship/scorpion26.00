# Supabase Implementation Checklist

## 1. Install Packages
```bash
npm install @supabase/supabase-js @supabase/ssr zod bcryptjs stripe
npm install -D @types/bcryptjs
```

## 2. Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

## 3. Database Setup
Run the SQL in `SUPABASE_IMPLEMENTATION_GUIDE.md` in Supabase SQL Editor

## 4. Generate Types
```bash
npx supabase gen types typescript --project-id YOUR_ID > lib/supabase/database.types.ts
```

## 5. Priority Implementation Order

### Phase 1 (Critical - Week 1)
- ✅ Supabase client setup (already created)
- ⏳ Database schema (run SQL)
- ⏳ Auth routes (login, register, logout)
- ⏳ Update dashboard to use real auth
- ⏳ Profile API routes

### Phase 2 (High Priority - Week 2)
- ⏳ Programs API (CRUD)
- ⏳ Workouts API (CRUD)
- ⏳ User management API (Admin)
- ⏳ Subscription API
- ⏳ Stripe integration

### Phase 3 (Medium Priority - Week 3)
- ⏳ Progress tracking API
- ⏳ Community features API
- ⏳ Support tickets API
- ⏳ Notifications API
- ⏳ Analytics API

### Phase 4 (Polish - Week 4)
- ⏳ Dashboard pages
- ⏳ Real-time features
- ⏳ File uploads (Supabase Storage)
- ⏳ Email templates
- ⏳ Testing

## 6. Key Files Created
- `lib/supabase/client.ts` ✅
- `lib/supabase/server.ts` ✅
- `lib/supabase/database.types.ts` (generate)
- `lib/api/supabase-middleware.ts` (create)
- `lib/validation/schemas.ts` (create)

## 7. Next Steps
1. Run database schema in Supabase
2. Generate types
3. Create auth API routes
4. Update login page to use Supabase
5. Test authentication flow

See SUPABASE_IMPLEMENTATION_GUIDE.md for detailed code examples.
