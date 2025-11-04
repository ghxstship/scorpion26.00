# Social Features & Activity Feed - Quick Start

## 🎯 Overview

Complete social fitness platform with Strava-like features for community engagement.

## ✨ Key Features

- **Activity Feed** with infinite scroll
- **Follow/Friend System** with suggested users
- **Kudos & Comments** for social engagement
- **Public Profiles** with stats and badges
- **Privacy Controls** (public/followers/private)
- **Social Sharing** to external platforms
- **Block System** for user safety

## 🚀 Quick Start

### 1. Run Database Migration

```bash
# Apply the social features migration
psql $DATABASE_URL -f migrations/20251104050000_social_features.sql
```

### 2. Access Social Features

Navigate to these pages:
- **Activity Feed**: `/member/feed`
- **Find Friends**: `/member/social`
- **Your Profile**: `/member/profile/[your-id]`

### 3. Create Your First Post

1. Go to `/member/feed`
2. Click the post creation box
3. Write your content
4. Select visibility (public/followers/private)
5. Click "Post"

## 📱 User Flow

### For New Users

1. **Complete Profile**
   - Add bio, location, avatar
   - Set privacy preferences

2. **Find Friends**
   - Go to `/member/social`
   - Search for users
   - Follow suggested users

3. **Engage with Content**
   - Browse activity feed
   - Give kudos to posts
   - Leave comments
   - Share achievements

### For Active Users

1. **Post Regularly**
   - Share workout completions
   - Post progress photos
   - Celebrate achievements

2. **Build Community**
   - Follow active users
   - Engage with posts
   - Reply to comments

3. **Track Progress**
   - View profile stats
   - Showcase badges
   - Monitor follower growth

## 🎨 Component Usage

### Activity Feed

```tsx
import { ActivityFeed } from '@/components/social/activity-feed';

<ActivityFeed 
  filter="all" // or 'following', 'workouts', 'achievements'
  currentUserId={userId}
/>
```

### Post Card

```tsx
import { PostCard } from '@/components/social/post-card';

<PostCard 
  post={post}
  currentUserId={userId}
  onDelete={handleDelete}
  onKudos={handleKudos}
/>
```

### Follow Button

```tsx
import { FollowButton } from '@/components/social/follow-button';

<FollowButton 
  userId={targetUserId}
  initialIsFollowing={false}
  onFollowChange={handleChange}
/>
```

### User Card

```tsx
import { UserCard } from '@/components/social/user-card';

<UserCard 
  user={user}
  showFollowButton={true}
  onFollowChange={handleChange}
/>
```

## 🔒 Privacy Settings

Users can control visibility at two levels:

### Profile Visibility
- **Public**: Anyone can view profile
- **Followers**: Only followers can view
- **Private**: Only user can view

### Activity Visibility
- **Public**: Posts visible to everyone
- **Followers**: Posts visible to followers
- **Private**: Posts visible only to user

## 📊 Engagement Metrics

Track these KPIs:
- Daily Active Users (DAU)
- Posts per user per week
- Average kudos per post
- Average comments per post
- Follow ratio
- Time spent in feed
- Return visit rate

## 🛠️ API Reference

### Create Post
```typescript
POST /api/social/posts
{
  "post_type": "status",
  "content": "Just finished my workout!",
  "visibility": "public"
}
```

### Follow User
```typescript
POST /api/social/users/[id]/follow
```

### Give Kudos
```typescript
POST /api/social/posts/[id]/kudos
```

### Add Comment
```typescript
POST /api/social/posts/[id]/comments
{
  "content": "Great job!"
}
```

## 🎯 Best Practices

### For Users

1. **Post Regularly** - Share workouts and achievements
2. **Engage Authentically** - Give meaningful kudos and comments
3. **Build Connections** - Follow users with similar goals
4. **Respect Privacy** - Honor others' visibility settings

### For Developers

1. **Optimize Queries** - Use database functions for complex queries
2. **Cache Counts** - Kudos and comment counts cached in posts table
3. **Batch Requests** - Load posts in batches for infinite scroll
4. **Handle Errors** - Graceful fallbacks for failed requests

## 🐛 Troubleshooting

### Posts Not Loading
- Check authentication
- Verify RLS policies
- Check network requests
- Ensure migration applied

### Follow Not Working
- Check for existing relationship
- Verify user not blocked
- Check RLS policies

### Kudos Not Updating
- Verify trigger exists
- Check for duplicates
- Refresh post data

## 📈 Performance Tips

1. **Infinite Scroll** - Load 20 posts at a time
2. **Debounce Search** - Wait 300ms before searching
3. **Optimize Images** - Use Next.js Image component
4. **Cache User Data** - Store profile info in state
5. **Lazy Load** - Load comments on demand

## 🔐 Security

- **RLS Enabled** - All tables protected
- **Input Sanitization** - All user input validated
- **Block System** - Users can block others
- **Privacy Controls** - Granular visibility settings
- **Rate Limiting** - API endpoints protected

## 📚 Additional Resources

- [Full Implementation Guide](./SOCIAL_FEATURES_GUIDE.md)
- [API Documentation](./SOCIAL_FEATURES_GUIDE.md#api-endpoints)
- [Database Schema](./SOCIAL_FEATURES_GUIDE.md#database-schema)
- [Component Reference](./SOCIAL_FEATURES_GUIDE.md#components)

## 🎉 Success Criteria

- ✅ Users can create and view posts
- ✅ Follow/unfollow works smoothly
- ✅ Kudos and comments functional
- ✅ Privacy settings respected
- ✅ Infinite scroll performs well
- ✅ Mobile responsive
- ✅ Social sharing works

## 🚦 Status

**Production Ready** ✅

All features implemented and tested. Ready for deployment.

---

**Need Help?** Check the [Full Guide](./SOCIAL_FEATURES_GUIDE.md) or review the code examples above.
