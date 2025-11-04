/**
 * Leaderboard System - Global, friends, and challenge leaderboards
 */

import { createClient } from '@/lib/supabase/client';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  leaderboard_type: 'global_xp' | 'global_workouts' | 'challenge' | 'friends';
  period: 'all_time' | 'monthly' | 'weekly';
  score: number;
  rank: number;
  challenge_id?: string;
  period_start?: string;
  period_end?: string;
  updated_at: string;
}

export interface LeaderboardEntryWithUser extends LeaderboardEntry {
  user?: {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

/**
 * Get global XP leaderboard
 */
export async function getGlobalXPLeaderboard(
  period: 'all_time' | 'monthly' | 'weekly' = 'all_time',
  limit: number = 100
): Promise<{
  leaderboard: LeaderboardEntryWithUser[];
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('leaderboard_type', 'global_xp')
      .eq('period', period)
      .order('rank', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    
    return {
      leaderboard: data || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching global XP leaderboard:', error);
    return {
      leaderboard: [],
      error: error as Error
    };
  }
}

/**
 * Get global workouts leaderboard
 */
export async function getGlobalWorkoutsLeaderboard(
  period: 'all_time' | 'monthly' | 'weekly' = 'all_time',
  limit: number = 100
): Promise<{
  leaderboard: LeaderboardEntryWithUser[];
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('leaderboard_type', 'global_workouts')
      .eq('period', period)
      .order('rank', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    
    return {
      leaderboard: data || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching global workouts leaderboard:', error);
    return {
      leaderboard: [],
      error: error as Error
    };
  }
}

/**
 * Get friends leaderboard
 */
export async function getFriendsLeaderboard(
  userId: string,
  period: 'all_time' | 'monthly' | 'weekly' = 'all_time',
  limit: number = 100
): Promise<{
  leaderboard: LeaderboardEntryWithUser[];
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    // Get user's friends (this would need a friends table)
    // For now, return empty array
    // TODO: Implement friends system
    
    return {
      leaderboard: [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching friends leaderboard:', error);
    return {
      leaderboard: [],
      error: error as Error
    };
  }
}

/**
 * Get user's rank in leaderboard
 */
export async function getUserRank(
  userId: string,
  leaderboardType: 'global_xp' | 'global_workouts',
  period: 'all_time' | 'monthly' | 'weekly' = 'all_time'
): Promise<{
  rank: number | null;
  score: number | null;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('rank, score')
      .eq('user_id', userId)
      .eq('leaderboard_type', leaderboardType)
      .eq('period', period)
      .single();
    
    if (error) throw error;
    
    return {
      rank: data?.rank || null,
      score: data?.score || null,
      error: null
    };
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return {
      rank: null,
      score: null,
      error: error as Error
    };
  }
}

/**
 * Refresh leaderboards (admin function)
 */
export async function refreshLeaderboards(): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase.rpc('refresh_leaderboards');
    
    if (error) throw error;
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error refreshing leaderboards:', error);
    return {
      success: false,
      error: error as Error
    };
  }
}

/**
 * Get leaderboard around user (user's rank +/- range)
 */
export async function getLeaderboardAroundUser(
  userId: string,
  leaderboardType: 'global_xp' | 'global_workouts',
  period: 'all_time' | 'monthly' | 'weekly' = 'all_time',
  range: number = 5
): Promise<{
  leaderboard: LeaderboardEntryWithUser[];
  userRank: number | null;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    // Get user's rank
    const { rank: userRank } = await getUserRank(userId, leaderboardType, period);
    
    if (!userRank) {
      return {
        leaderboard: [],
        userRank: null,
        error: null
      };
    }
    
    const minRank = Math.max(1, userRank - range);
    const maxRank = userRank + range;
    
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('leaderboard_type', leaderboardType)
      .eq('period', period)
      .gte('rank', minRank)
      .lte('rank', maxRank)
      .order('rank', { ascending: true });
    
    if (error) throw error;
    
    return {
      leaderboard: data || [],
      userRank,
      error: null
    };
  } catch (error) {
    console.error('Error fetching leaderboard around user:', error);
    return {
      leaderboard: [],
      userRank: null,
      error: error as Error
    };
  }
}

/**
 * Get leaderboard type label
 */
export function getLeaderboardTypeLabel(type: LeaderboardEntry['leaderboard_type']): string {
  switch (type) {
    case 'global_xp':
      return 'Global XP';
    case 'global_workouts':
      return 'Global Workouts';
    case 'challenge':
      return 'Challenge';
    case 'friends':
      return 'Friends';
    default:
      return 'Leaderboard';
  }
}

/**
 * Get period label
 */
export function getPeriodLabel(period: LeaderboardEntry['period']): string {
  switch (period) {
    case 'all_time':
      return 'All Time';
    case 'monthly':
      return 'This Month';
    case 'weekly':
      return 'This Week';
    default:
      return 'All Time';
  }
}

/**
 * Format rank with medal emoji
 */
export function formatRank(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `#${rank}`;
  }
}

/**
 * Get rank color
 */
export function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'text-yellow-500';
    case 2:
      return 'text-gray-400';
    case 3:
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
}
