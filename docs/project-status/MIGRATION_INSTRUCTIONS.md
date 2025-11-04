# Social Features Migration Instructions

## Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Migration**
   - Open: `/migrations/20251104050000_social_features.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" or press Cmd/Ctrl + Enter
   - Wait for completion (should take 5-10 seconds)

5. **Verify Success**
   - Check for green success message
   - No errors should appear

## Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

## Option 3: Using psql (If you have direct database access)

```bash
# Set your DATABASE_URL
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the migration
psql $DATABASE_URL -f migrations/20251104050000_social_features.sql
```

## Verification Steps

After running the migration, verify in Supabase Dashboard:

### 1. Check Tables Created
Go to: **Table Editor**

You should see these new tables:
- ✅ `user_follows`
- ✅ `activity_posts`
- ✅ `post_kudos`
- ✅ `post_comments`
- ✅ `blocked_users`

### 2. Check Profile Extensions
Go to: **Table Editor > profiles**

New columns should exist:
- ✅ `bio`
- ✅ `location`
- ✅ `website`
- ✅ `profile_visibility`
- ✅ `activity_visibility`
- ✅ `follower_count`
- ✅ `following_count`

### 3. Check RLS Policies
Go to: **Authentication > Policies**

You should see policies for:
- `user_follows`
- `activity_posts`
- `post_kudos`
- `post_comments`
- `blocked_users`

### 4. Check Functions
Go to: **Database > Functions**

You should see:
- ✅ `get_activity_feed`
- ✅ `get_suggested_users`
- ✅ `update_kudos_count`
- ✅ `update_comment_count`
- ✅ `update_follow_counts`

## After Migration

Once migration is complete:

1. **Test the Features**
   ```bash
   npm run dev
   ```
   
   Visit:
   - http://localhost:3000/member/feed
   - http://localhost:3000/member/social

2. **Create Test Data**
   - Create a few posts
   - Follow some users
   - Give kudos
   - Add comments

3. **Monitor for Errors**
   - Check browser console
   - Check Supabase logs
   - Verify RLS policies work

## Troubleshooting

### Error: "relation already exists"
- Some tables may already exist
- Safe to ignore if tables are correct
- Or drop tables and re-run

### Error: "permission denied"
- Check you're using service role key
- Or run from Supabase Dashboard

### Error: "function does not exist"
- Ensure entire migration ran
- Check Database > Functions in dashboard

## Need Help?

- Check: `/docs/SOCIAL_FEATURES_GUIDE.md`
- Review: `/docs/SOCIAL_FEATURES_TROUBLESHOOTING.md`
- Supabase Docs: https://supabase.com/docs

---

**Recommended**: Use Option 1 (Supabase Dashboard) for easiest setup.
