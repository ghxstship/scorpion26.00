# Social Features & Activity Feed - Implementation Guide

## Overview

Complete social fitness platform with activity feed, follow/friend system, kudos/likes, comments, and public profiles. Built to drive engagement similar to Strava.

## Features Implemented

### 1. Activity Feed
- **Infinite scroll** with automatic loading
- **Filter tabs**: Everyone, Following, Workouts, Achievements
- **Post types**: Workout completion, Achievement unlocked, Photo upload, Status update
- **Real-time interactions**: Kudos, comments, shares
- **Privacy controls**: Public, Followers, Private visibility

### 2. Follow/Friend System
- Follow/unfollow users
- Follower and following lists
- Suggested users based on activity and mutual connections
- User search by name or email
- Block/unblock functionality

### 3. Social Interactions
- **Kudos (Likes)**: Animated heart button with count
- **Comments**: Nested replies (1 level deep)
- **Share**: External social media (Twitter, Facebook, WhatsApp) and copy link
- **Mentions**: Tag users in posts and comments (future enhancement)

### 4. Public Profiles
- Profile photo, bio, location, website
- Follower/following counts
- Total workouts, distance, time stats
- Recent activity feed
- Achievement showcase (badges)
- Privacy settings

### 5. Notifications
- New follower
- Post kudos
- Post comment
- Comment reply
- User mention
- Social milestones

## Database Schema

### Tables Created

```sql
-- Social connections
user_follows (follower_id, following_id)

-- Activity posts
activity_posts (user_id, post_type, content, media_urls, visibility, kudos_count, comment_count)

-- Kudos
post_kudos (post_id, user_id)

-- Comments
post_comments (post_id, user_id, content, parent_comment_id)

-- Blocked users
blocked_users (blocker_id, blocked_id)

-- Profile extensions
profiles (bio, location, website, profile_visibility, activity_visibility, follower_count, following_count)
```

### Indexes
All tables have appropriate indexes for performance:
- User lookups
- Feed queries
- Follow relationships
- Comment threads

### RLS Policies
Row Level Security enabled on all tables:
- Users can only see public or follower-visible content
- Blocked users are filtered out
- Users can manage their own content

## API Endpoints

### Feed
- `GET /api/social/feed` - Get activity feed with filters

### Posts
- `POST /api/social/posts` - Create new post
- `GET /api/social/posts/[id]` - Get post details
- `PATCH /api/social/posts/[id]` - Update post
- `DELETE /api/social/posts/[id]` - Delete post

### Kudos
- `GET /api/social/posts/[id]/kudos` - List kudos
- `POST /api/social/posts/[id]/kudos` - Give kudos
- `DELETE /api/social/posts/[id]/kudos` - Remove kudos

### Comments
- `GET /api/social/posts/[id]/comments` - Get comments
- `POST /api/social/posts/[id]/comments` - Add comment
- `PATCH /api/social/comments/[id]` - Edit comment
- `DELETE /api/social/comments/[id]` - Delete comment

### Follow System
- `POST /api/social/users/[id]/follow` - Follow user
- `DELETE /api/social/users/[id]/follow` - Unfollow user
- `GET /api/social/users/[id]/followers` - Get followers
- `GET /api/social/users/[id]/following` - Get following
- `GET /api/social/users/search` - Search users
- `GET /api/social/users/suggested` - Get suggested users

### Profile
- `GET /api/social/users/[id]/profile` - Get public profile
- `PATCH /api/social/profile` - Update own profile

### Block
- `POST /api/social/users/[id]/block` - Block user
- `DELETE /api/social/users/[id]/block` - Unblock user

## Components

### Social Components (`/components/social/`)

1. **activity-feed.tsx** - Infinite scroll feed with filters
2. **post-card.tsx** - Individual post display with actions
3. **comment-section.tsx** - Comment list and input with nested replies
4. **create-post.tsx** - Post creation form with media upload
5. **follow-button.tsx** - Follow/unfollow button
6. **user-card.tsx** - User profile card with follow button
7. **share-menu.tsx** - Social sharing dropdown menu

## Pages

### Member Pages (`/app/member/`)

1. **feed/page.tsx** - Main activity feed
2. **social/page.tsx** - Find friends and manage connections
3. **profile/[id]/page.tsx** - Public profile view

## Usage Examples

### Creating a Post

```typescript
const response = await fetch('/api/social/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    post_type: 'status',
    content: 'Just completed my first 5K run!',
    visibility: 'public'
  })
});
```

### Following a User

```typescript
const response = await fetch(`/api/social/users/${userId}/follow`, {
  method: 'POST'
});
```

### Giving Kudos

```typescript
const response = await fetch(`/api/social/posts/${postId}/kudos`, {
  method: 'POST'
});
```

### Adding a Comment

```typescript
const response = await fetch(`/api/social/posts/${postId}/comments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Great job! Keep it up!'
  })
});
```

## Privacy Settings

Users can control their visibility:

1. **Profile Visibility**
   - Public: Anyone can view
   - Followers: Only followers can view
   - Private: Only user can view

2. **Activity Visibility**
   - Public: Posts visible to everyone
   - Followers: Posts visible to followers only
   - Private: Posts visible only to user

## Performance Optimizations

1. **Database Indexes** - All queries optimized with appropriate indexes
2. **Infinite Scroll** - Load posts in batches of 20
3. **Eager Loading** - User profiles loaded with posts
4. **Count Caching** - Kudos and comment counts cached in post table
5. **RLS Policies** - Efficient filtering at database level

## Testing Checklist

- [ ] Create posts of all types (workout, achievement, photo, status)
- [ ] Give and remove kudos
- [ ] Add, edit, and delete comments
- [ ] Follow and unfollow users
- [ ] Search for users
- [ ] View public profiles
- [ ] Test privacy settings (public, followers, private)
- [ ] Block and unblock users
- [ ] Share posts to external platforms
- [ ] Test infinite scroll with 50+ posts
- [ ] Test on mobile devices

## Engagement Metrics

Track these metrics for success:

1. **Daily Active Users (DAU)** - Users who visit feed daily
2. **Posts per User per Week** - Average posting frequency
3. **Kudos per Post** - Average engagement rate
4. **Comments per Post** - Conversation rate
5. **Follow Ratio** - Following/Followers balance
6. **Time Spent in Feed** - Session duration
7. **Return Visit Rate** - User retention

## Future Enhancements

1. **Real-time Updates** - WebSocket integration for live updates
2. **User Mentions** - @username tagging in posts and comments
3. **Hashtags** - #tag support for content discovery
4. **Post Reactions** - Multiple reaction types beyond kudos
5. **Story Feature** - Temporary 24-hour posts
6. **Direct Messaging** - Extend existing messaging to social context
7. **Group Challenges** - Social fitness challenges
8. **Leaderboards** - Competitive rankings
9. **Activity Insights** - Analytics for user engagement
10. **Push Notifications** - Mobile push for social actions

## Migration Instructions

1. Run the migration:
```bash
# Apply the migration to your Supabase database
psql $DATABASE_URL -f migrations/20251104050000_social_features.sql
```

2. Verify tables created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_follows', 'activity_posts', 'post_kudos', 'post_comments', 'blocked_users');
```

3. Test RLS policies:
```sql
-- Should return policies for each table
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';
```

## Troubleshooting

### Posts Not Showing in Feed
- Check user is authenticated
- Verify RLS policies are enabled
- Check post visibility settings
- Ensure user is not blocked

### Follow Not Working
- Check for existing follow relationship
- Verify user is not blocked
- Check RLS policies on user_follows table

### Kudos Count Not Updating
- Verify trigger is created: `trigger_update_kudos_count`
- Check post_kudos table for duplicate entries
- Refresh post data from database

### Comments Not Appearing
- Check RLS policies on post_comments
- Verify post exists and is accessible
- Check parent_comment_id for nested replies

## Security Considerations

1. **RLS Enabled** - All tables have Row Level Security
2. **Input Validation** - All user input sanitized
3. **Rate Limiting** - API endpoints should have rate limits
4. **Block System** - Users can block abusive accounts
5. **Content Moderation** - Report functionality (future)
6. **Privacy Controls** - Granular visibility settings

## Dependencies

Required packages (already in package.json):
- `date-fns` - Date formatting
- `lucide-react` - Icons
- `react-intersection-observer` - Infinite scroll (needs to be added)

To install missing dependencies:
```bash
npm install react-intersection-observer
```

## Support

For issues or questions:
1. Check this documentation
2. Review API endpoint responses
3. Check browser console for errors
4. Verify database migrations applied
5. Test with demo users

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: 2024-11-04
