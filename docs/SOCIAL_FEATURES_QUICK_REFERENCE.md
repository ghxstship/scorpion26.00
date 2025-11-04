# Social Features - Quick Reference Card

## 🚀 Quick Start

```bash
# 1. Run migration
./scripts/setup-social-features.sh

# 2. Start dev server
npm run dev

# 3. Visit pages
# - Feed: http://localhost:3000/member/feed
# - Social: http://localhost:3000/member/social
# - Profile: http://localhost:3000/member/profile/[id]
```

## 📁 File Locations

| Type | Location |
|------|----------|
| Migration | `/migrations/20251104050000_social_features.sql` |
| API Routes | `/app/api/social/` |
| Components | `/components/social/` |
| Pages | `/app/member/feed/`, `/app/member/social/`, `/app/member/profile/[id]/` |
| Types | `/types/social.ts` |
| Utils | `/lib/social/share-utils.ts` |

## 🔌 API Endpoints

### Feed
```typescript
GET /api/social/feed?filter=all&limit=20&offset=0
```

### Posts
```typescript
POST   /api/social/posts
GET    /api/social/posts/[id]
PATCH  /api/social/posts/[id]
DELETE /api/social/posts/[id]
```

### Kudos
```typescript
GET    /api/social/posts/[id]/kudos
POST   /api/social/posts/[id]/kudos
DELETE /api/social/posts/[id]/kudos
```

### Comments
```typescript
GET    /api/social/posts/[id]/comments
POST   /api/social/posts/[id]/comments
PATCH  /api/social/comments/[id]
DELETE /api/social/comments/[id]
```

### Follow
```typescript
POST   /api/social/users/[id]/follow
DELETE /api/social/users/[id]/follow
GET    /api/social/users/[id]/followers
GET    /api/social/users/[id]/following
GET    /api/social/users/search?q=query
GET    /api/social/users/suggested
```

### Profile
```typescript
GET   /api/social/users/[id]/profile
PATCH /api/social/profile
```

### Block
```typescript
POST   /api/social/users/[id]/block
DELETE /api/social/users/[id]/block
```

## 🎨 Component Usage

### Activity Feed
```tsx
import { ActivityFeed } from '@/components/social/activity-feed';

<ActivityFeed filter="all" currentUserId={userId} />
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

### Create Post
```tsx
import { CreatePost } from '@/components/social/create-post';

<CreatePost 
  userProfile={profile}
  onPostCreated={handlePostCreated}
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

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `user_follows` | Follow relationships |
| `activity_posts` | Feed posts |
| `post_kudos` | Likes/kudos |
| `post_comments` | Comments |
| `blocked_users` | Blocked users |
| `profiles` | Extended with social fields |

## 🔐 Privacy Levels

| Level | Description |
|-------|-------------|
| `public` | Visible to everyone |
| `followers` | Visible to followers only |
| `private` | Visible to user only |

## 📊 Post Types

| Type | Description |
|------|-------------|
| `workout` | Workout completion |
| `achievement` | Badge earned |
| `photo` | Progress photo |
| `status` | Text update |

## 🎯 Key Functions

### Database Functions
```sql
-- Get activity feed
SELECT * FROM get_activity_feed(
  p_user_id UUID,
  p_filter VARCHAR DEFAULT 'all',
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
);

-- Get suggested users
SELECT * FROM get_suggested_users(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
);
```

### Utility Functions
```typescript
// Share utilities
import { 
  shareToTwitter,
  shareToFacebook,
  shareToWhatsApp,
  copyToClipboard,
  generatePostUrl,
  generateProfileUrl
} from '@/lib/social/share-utils';
```

## 🐛 Common Issues

### Posts Not Loading
```typescript
// Check authentication
const { data: { session } } = await supabase.auth.getSession();

// Check RLS policies
SELECT * FROM activity_posts; -- Should respect RLS
```

### Follow Not Working
```typescript
// Check for existing relationship
SELECT * FROM user_follows 
WHERE follower_id = ? AND following_id = ?;

// Check if blocked
SELECT * FROM blocked_users 
WHERE (blocker_id = ? OR blocked_id = ?);
```

### Kudos Not Updating
```typescript
// Check trigger exists
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_update_kudos_count';

// Manually update count
UPDATE activity_posts 
SET kudos_count = (
  SELECT COUNT(*) FROM post_kudos WHERE post_id = ?
) WHERE id = ?;
```

## 📈 Performance Tips

1. **Batch Loading** - Load 20 posts at a time
2. **Debounce Search** - Wait 300ms before searching
3. **Cache Counts** - Use cached counts in posts table
4. **Lazy Load** - Load comments on demand
5. **Optimize Images** - Use Next.js Image component

## 🔒 Security Checklist

- ✅ RLS enabled on all tables
- ✅ Input validation on all endpoints
- ✅ Authentication required
- ✅ Block system implemented
- ✅ Privacy controls in place

## 📚 Documentation Links

- [Quick Start](./SOCIAL_FEATURES_README.md)
- [Full Guide](./SOCIAL_FEATURES_GUIDE.md)
- [Implementation Summary](./SOCIAL_FEATURES_IMPLEMENTATION_SUMMARY.md)
- [Deployment Checklist](./SOCIAL_FEATURES_CHECKLIST.md)

## 🎯 Testing Commands

```bash
# Create test post
curl -X POST http://localhost:3000/api/social/posts \
  -H "Content-Type: application/json" \
  -d '{"post_type":"status","content":"Test post","visibility":"public"}'

# Follow user
curl -X POST http://localhost:3000/api/social/users/[id]/follow

# Give kudos
curl -X POST http://localhost:3000/api/social/posts/[id]/kudos

# Search users
curl http://localhost:3000/api/social/users/search?q=john
```

## 🆘 Support

1. Check documentation
2. Review error logs
3. Test with demo users
4. Check database state
5. Verify migrations applied

---

**Quick Reference Version**: 1.0  
**Last Updated**: 2024-11-04
