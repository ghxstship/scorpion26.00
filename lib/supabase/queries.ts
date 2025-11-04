// Supabase Query Helpers
// Reusable database queries with proper typing

import { createClient as createServerClient } from './server';
import { createClient as createBrowserClient } from './client';

/**
 * Get user profile with role
 */
export async function getUserProfile(userId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      user_roles!inner(
        roles(name, level)
      )
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user's active subscription
 */
export async function getUserSubscription(userId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      subscription_plans(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Get user's workout statistics
 */
export async function getUserWorkoutStats(userId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .rpc('get_user_stats', { user_id_param: userId });

  if (error) throw error;
  return data?.[0] || null;
}

/**
 * Get recent workout logs
 */
export async function getRecentWorkouts(userId: string, limit = 10, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('workout_logs')
    .select(`
      *,
      workouts(
        id,
        title,
        difficulty,
        duration_minutes
      )
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get user's enrolled programs
 */
export async function getEnrolledPrograms(userId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('program_enrollments')
    .select(`
      *,
      programs(
        id,
        title,
        description,
        thumbnail_url,
        difficulty,
        category
      )
    `)
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get published programs with pagination
 */
export async function getPublishedPrograms(
  page = 1,
  limit = 20,
  filters?: {
    category?: string;
    difficulty?: string;
    search?: string;
  },
  isServer = true
) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  let query = supabase
    .from('programs')
    .select('*', { count: 'exact' })
    .eq('is_published', true);

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters?.search) {
    const { data: searchResults } = await supabase
      .rpc('search_programs', { search_query: filters.search });
    
    if (searchResults && searchResults.length > 0) {
      const ids = searchResults.map((r: any) => r.id);
      query = query.in('id', ids);
    }
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return {
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}

/**
 * Get workouts for a program
 */
export async function getProgramWorkouts(programId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('program_id', programId)
    .eq('is_published', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get user's achievements
 */
export async function getUserAchievements(userId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievements(*)
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get community posts with pagination
 */
export async function getCommunityPosts(
  page = 1,
  limit = 20,
  userId?: string,
  isServer = true
) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles!posts_user_id_fkey(
        id,
        first_name,
        last_name,
        avatar_url
      )
    `, { count: 'exact' })
    .eq('visibility', 'public');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return {
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}

/**
 * Check if user has liked a post
 */
export async function hasUserLikedPost(userId: string, postId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('post_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

/**
 * Get user's notifications
 */
export async function getUserNotifications(
  userId: string,
  unreadOnly = false,
  limit = 50,
  isServer = true
) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

/**
 * Get workout leaderboard
 */
export async function getWorkoutLeaderboard(
  period: 'week' | 'month' | 'year' = 'month',
  limit = 10,
  isServer = true
) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .rpc('get_workout_leaderboard', {
      time_period: period,
      limit_count: limit,
    });

  if (error) throw error;
  return data;
}

/**
 * Get user's engagement score
 */
export async function getUserEngagement(userId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('user_engagement_scores')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Get support tickets for user
 */
export async function getUserSupportTickets(userId: string, isServer = true) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create a new support ticket
 */
export async function createSupportTicket(
  userId: string,
  subject: string,
  description: string,
  priority: 'low' | 'normal' | 'high' = 'normal',
  isServer = true
) {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  
  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      user_id: userId,
      subject,
      description,
      priority,
      status: 'open',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
