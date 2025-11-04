-- Social Features Migration
-- Activity feed, follow system, kudos, comments, and public profiles

-- Social connections (follow/friend system)
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Activity feed posts
CREATE TABLE activity_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_type VARCHAR(50) NOT NULL, -- 'workout', 'achievement', 'photo', 'status'
  content TEXT,
  workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE SET NULL,
  cardio_activity_id UUID REFERENCES cardio_activities(id) ON DELETE SET NULL,
  badge_id UUID REFERENCES user_badges(id) ON DELETE SET NULL,
  media_urls JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'followers', 'private'
  kudos_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kudos (likes)
CREATE TABLE post_kudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES activity_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comments
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES activity_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blocked users
CREATE TABLE blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- User privacy settings (extend profiles table)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_visibility VARCHAR(20) DEFAULT 'public';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activity_visibility VARCHAR(20) DEFAULT 'followers';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website VARCHAR(200);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS follower_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Indexes for performance
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_user_follows_created ON user_follows(created_at DESC);

CREATE INDEX idx_activity_posts_user ON activity_posts(user_id);
CREATE INDEX idx_activity_posts_created ON activity_posts(created_at DESC);
CREATE INDEX idx_activity_posts_type ON activity_posts(post_type);
CREATE INDEX idx_activity_posts_visibility ON activity_posts(visibility);

CREATE INDEX idx_post_kudos_post ON post_kudos(post_id);
CREATE INDEX idx_post_kudos_user ON post_kudos(user_id);
CREATE INDEX idx_post_kudos_created ON post_kudos(created_at DESC);

CREATE INDEX idx_post_comments_post ON post_comments(post_id);
CREATE INDEX idx_post_comments_user ON post_comments(user_id);
CREATE INDEX idx_post_comments_parent ON post_comments(parent_comment_id);
CREATE INDEX idx_post_comments_created ON post_comments(created_at DESC);

CREATE INDEX idx_blocked_users_blocker ON blocked_users(blocker_id);
CREATE INDEX idx_blocked_users_blocked ON blocked_users(blocked_id);

-- Enable Row Level Security
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_follows
CREATE POLICY "Users can view public follows" ON user_follows
  FOR SELECT USING (
    NOT EXISTS (
      SELECT 1 FROM blocked_users 
      WHERE (blocker_id = auth.uid() AND blocked_id = follower_id)
         OR (blocker_id = auth.uid() AND blocked_id = following_id)
         OR (blocker_id = follower_id AND blocked_id = auth.uid())
         OR (blocker_id = following_id AND blocked_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own follows" ON user_follows
  FOR ALL USING (auth.uid() = follower_id);

-- RLS Policies for activity_posts
CREATE POLICY "Users can view accessible posts" ON activity_posts
  FOR SELECT USING (
    -- Not blocked
    NOT EXISTS (
      SELECT 1 FROM blocked_users 
      WHERE (blocker_id = auth.uid() AND blocked_id = user_id)
         OR (blocker_id = user_id AND blocked_id = auth.uid())
    )
    AND (
      -- Public posts
      visibility = 'public' 
      -- Own posts
      OR user_id = auth.uid() 
      -- Follower posts (if user follows the author)
      OR (visibility = 'followers' AND EXISTS (
        SELECT 1 FROM user_follows 
        WHERE following_id = activity_posts.user_id 
        AND follower_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can manage own posts" ON activity_posts
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for post_kudos
CREATE POLICY "Users can view kudos" ON post_kudos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM activity_posts 
      WHERE id = post_kudos.post_id
    )
  );

CREATE POLICY "Users can manage own kudos" ON post_kudos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own kudos" ON post_kudos
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Users can view comments on accessible posts" ON post_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM activity_posts 
      WHERE id = post_comments.post_id
    )
  );

CREATE POLICY "Users can create comments" ON post_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM activity_posts 
      WHERE id = post_comments.post_id
    )
  );

CREATE POLICY "Users can manage own comments" ON post_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON post_comments
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for blocked_users
CREATE POLICY "Users can view own blocks" ON blocked_users
  FOR SELECT USING (auth.uid() = blocker_id);

CREATE POLICY "Users can manage own blocks" ON blocked_users
  FOR ALL USING (auth.uid() = blocker_id);

-- Functions to update counts
CREATE OR REPLACE FUNCTION update_kudos_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE activity_posts 
    SET kudos_count = kudos_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE activity_posts 
    SET kudos_count = GREATEST(kudos_count - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_kudos_count
AFTER INSERT OR DELETE ON post_kudos
FOR EACH ROW EXECUTE FUNCTION update_kudos_count();

CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE activity_posts 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE activity_posts 
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_count
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_comment_count();

CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment follower count for the followed user
    UPDATE profiles 
    SET follower_count = follower_count + 1 
    WHERE id = NEW.following_id;
    
    -- Increment following count for the follower
    UPDATE profiles 
    SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement follower count for the unfollowed user
    UPDATE profiles 
    SET follower_count = GREATEST(follower_count - 1, 0)
    WHERE id = OLD.following_id;
    
    -- Decrement following count for the unfollower
    UPDATE profiles 
    SET following_count = GREATEST(following_count - 1, 0)
    WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_follow_counts
AFTER INSERT OR DELETE ON user_follows
FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- Function to get activity feed
CREATE OR REPLACE FUNCTION get_activity_feed(
  p_user_id UUID,
  p_filter VARCHAR DEFAULT 'all', -- 'all', 'following', 'workouts', 'achievements'
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  post_type VARCHAR,
  content TEXT,
  workout_session_id UUID,
  cardio_activity_id UUID,
  badge_id UUID,
  media_urls JSONB,
  visibility VARCHAR,
  kudos_count INTEGER,
  comment_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  user_full_name VARCHAR,
  user_avatar_url TEXT,
  has_kudos BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ap.id,
    ap.user_id,
    ap.post_type,
    ap.content,
    ap.workout_session_id,
    ap.cardio_activity_id,
    ap.badge_id,
    ap.media_urls,
    ap.visibility,
    ap.kudos_count,
    ap.comment_count,
    ap.created_at,
    p.full_name as user_full_name,
    p.avatar_url as user_avatar_url,
    EXISTS(SELECT 1 FROM post_kudos pk WHERE pk.post_id = ap.id AND pk.user_id = p_user_id) as has_kudos
  FROM activity_posts ap
  JOIN profiles p ON ap.user_id = p.id
  WHERE 
    -- Not blocked
    NOT EXISTS (
      SELECT 1 FROM blocked_users 
      WHERE (blocker_id = p_user_id AND blocked_id = ap.user_id)
         OR (blocker_id = ap.user_id AND blocked_id = p_user_id)
    )
    AND (
      -- Filter logic
      (p_filter = 'all' AND ap.visibility = 'public')
      OR (p_filter = 'following' AND EXISTS (
        SELECT 1 FROM user_follows uf 
        WHERE uf.follower_id = p_user_id AND uf.following_id = ap.user_id
      ))
      OR (p_filter = 'workouts' AND ap.post_type = 'workout' AND ap.visibility = 'public')
      OR (p_filter = 'achievements' AND ap.post_type = 'achievement' AND ap.visibility = 'public')
      OR ap.user_id = p_user_id -- Always show own posts
    )
  ORDER BY ap.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get suggested users to follow
CREATE OR REPLACE FUNCTION get_suggested_users(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  full_name VARCHAR,
  avatar_url TEXT,
  bio TEXT,
  follower_count INTEGER,
  mutual_followers INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.follower_count,
    (
      SELECT COUNT(*)::INTEGER
      FROM user_follows uf1
      WHERE uf1.follower_id = p_user_id
      AND EXISTS (
        SELECT 1 FROM user_follows uf2
        WHERE uf2.follower_id = uf1.following_id
        AND uf2.following_id = p.id
      )
    ) as mutual_followers
  FROM profiles p
  WHERE 
    p.id != p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM user_follows 
      WHERE follower_id = p_user_id AND following_id = p.id
    )
    AND NOT EXISTS (
      SELECT 1 FROM blocked_users 
      WHERE (blocker_id = p_user_id AND blocked_id = p.id)
         OR (blocker_id = p.id AND blocked_id = p_user_id)
    )
    AND p.profile_visibility = 'public'
  ORDER BY 
    p.follower_count DESC,
    mutual_followers DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Add social notification types
INSERT INTO notification_types (type, description) VALUES
  ('social_follow', 'Someone followed you'),
  ('social_kudos', 'Someone gave kudos to your post'),
  ('social_comment', 'Someone commented on your post'),
  ('social_reply', 'Someone replied to your comment'),
  ('social_mention', 'Someone mentioned you'),
  ('social_milestone', 'You reached a social milestone')
ON CONFLICT (type) DO NOTHING;
