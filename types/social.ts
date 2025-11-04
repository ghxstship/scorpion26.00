// Social Features Types

export interface ActivityPost {
  id: string;
  user_id: string;
  post_type: 'workout' | 'achievement' | 'photo' | 'status';
  content: string | null;
  workout_session_id: string | null;
  cardio_activity_id: string | null;
  badge_id: string | null;
  media_urls: string[];
  visibility: 'public' | 'followers' | 'private';
  kudos_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  user_full_name?: string;
  user_avatar_url?: string;
  has_kudos?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export interface PostKudos {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  profile_visibility: 'public' | 'followers' | 'private';
  activity_visibility: 'public' | 'followers' | 'private';
  follower_count: number;
  following_count: number;
  created_at: string;
  is_following?: boolean;
  is_own_profile?: boolean;
  mutual_followers?: number;
}

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface SocialStats {
  total_workouts: number;
  total_distance: number;
  total_duration: number;
}

export interface FeedFilter {
  filter: 'all' | 'following' | 'workouts' | 'achievements';
  limit?: number;
  offset?: number;
}

export interface CreatePostData {
  post_type: 'workout' | 'achievement' | 'photo' | 'status';
  content?: string;
  workout_session_id?: string;
  cardio_activity_id?: string;
  badge_id?: string;
  media_urls?: string[];
  visibility?: 'public' | 'followers' | 'private';
}

export interface UpdateProfileData {
  bio?: string;
  location?: string;
  website?: string;
  profile_visibility?: 'public' | 'followers' | 'private';
  activity_visibility?: 'public' | 'followers' | 'private';
}
