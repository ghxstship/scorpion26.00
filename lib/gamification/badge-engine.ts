/**
 * Badge Engine - Auto-award logic for gamification system
 * Handles badge checking, awarding, and progress tracking
 */

import { createClient } from '@/lib/supabase/client';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'workout' | 'streak' | 'distance' | 'social' | 'special';
  icon: string;
  requirement_type: 'workout_count' | 'streak_days' | 'distance_km' | 'kudos_given' | 'friends_count';
  requirement_value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  progress: number;
  badge?: Badge;
}

export interface UserStats {
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_workouts: number;
  total_distance_km: number;
  total_duration_minutes: number;
  kudos_given: number;
  kudos_received: number;
  friends_count: number;
  challenges_completed: number;
}

/**
 * Check and award badges for a user
 */
export async function checkAndAwardBadges(userId: string): Promise<{
  newBadges: Badge[];
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .rpc('check_and_award_badges', { p_user_id: userId });
    
    if (error) throw error;
    
    return {
      newBadges: data || [],
      error: null
    };
  } catch (error) {
    console.error('Error checking badges:', error);
    return {
      newBadges: [],
      error: error as Error
    };
  }
}

/**
 * Get all badges for a user
 */
export async function getUserBadges(userId: string): Promise<{
  badges: UserBadge[];
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      badges: data || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return {
      badges: [],
      error: error as Error
    };
  }
}

/**
 * Get all available badges
 */
export async function getAllBadges(): Promise<{
  badges: Badge[];
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('category', { ascending: true })
      .order('requirement_value', { ascending: true });
    
    if (error) throw error;
    
    return {
      badges: data || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching badges:', error);
    return {
      badges: [],
      error: error as Error
    };
  }
}

/**
 * Get badge progress for a user
 */
export async function getBadgeProgress(userId: string): Promise<{
  progress: Array<{
    badge: Badge;
    earned: boolean;
    progress: number;
    progressPercentage: number;
  }>;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    // Get user stats
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (statsError) throw statsError;
    
    // Get all badges
    const { data: allBadges, error: badgesError } = await supabase
      .from('badges')
      .select('*');
    
    if (badgesError) throw badgesError;
    
    // Get earned badges
    const { data: earnedBadges, error: earnedError } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);
    
    if (earnedError) throw earnedError;
    
    const earnedBadgeIds = new Set(earnedBadges?.map(b => b.badge_id) || []);
    
    // Calculate progress for each badge
    const progress = allBadges?.map(badge => {
      const earned = earnedBadgeIds.has(badge.id);
      let currentValue = 0;
      
      switch (badge.requirement_type) {
        case 'workout_count':
          currentValue = stats.total_workouts;
          break;
        case 'streak_days':
          currentValue = stats.longest_streak;
          break;
        case 'distance_km':
          currentValue = Math.floor(stats.total_distance_km);
          break;
        case 'kudos_given':
          currentValue = stats.kudos_given;
          break;
        case 'friends_count':
          currentValue = stats.friends_count;
          break;
      }
      
      const progressValue = Math.min(currentValue, badge.requirement_value);
      const progressPercentage = (progressValue / badge.requirement_value) * 100;
      
      return {
        badge,
        earned,
        progress: progressValue,
        progressPercentage: Math.min(progressPercentage, 100)
      };
    }) || [];
    
    return {
      progress,
      error: null
    };
  } catch (error) {
    console.error('Error calculating badge progress:', error);
    return {
      progress: [],
      error: error as Error
    };
  }
}

/**
 * Get user stats
 */
export async function getUserStats(userId: string): Promise<{
  stats: UserStats | null;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      stats: data,
      error: null
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      stats: null,
      error: error as Error
    };
  }
}

/**
 * Award XP to a user
 */
export async function awardXP(
  userId: string,
  amount: number,
  source: 'workout' | 'badge' | 'challenge' | 'streak' | 'social',
  sourceId?: string,
  description?: string
): Promise<{
  newLevel: number;
  levelUp: boolean;
  totalXp: number;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .rpc('award_xp', {
        p_user_id: userId,
        p_amount: amount,
        p_source: source,
        p_source_id: sourceId || null,
        p_description: description || null
      });
    
    if (error) throw error;
    
    const result = data[0];
    
    return {
      newLevel: result.new_level,
      levelUp: result.level_up,
      totalXp: result.total_xp,
      error: null
    };
  } catch (error) {
    console.error('Error awarding XP:', error);
    return {
      newLevel: 1,
      levelUp: false,
      totalXp: 0,
      error: error as Error
    };
  }
}

/**
 * Update user streak
 */
export async function updateStreak(
  userId: string,
  activityDate?: Date
): Promise<{
  currentStreak: number;
  longestStreak: number;
  isNewRecord: boolean;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const date = activityDate || new Date();
    const dateString = date.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .rpc('update_streak', {
        p_user_id: userId,
        p_activity_date: dateString
      });
    
    if (error) throw error;
    
    const result = data[0];
    
    return {
      currentStreak: result.current_streak,
      longestStreak: result.longest_streak,
      isNewRecord: result.is_new_record,
      error: null
    };
  } catch (error) {
    console.error('Error updating streak:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      isNewRecord: false,
      error: error as Error
    };
  }
}

/**
 * Get rarity color for badge display
 */
export function getRarityColor(rarity: Badge['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-500';
    case 'rare':
      return 'text-blue-500';
    case 'epic':
      return 'text-purple-500';
    case 'legendary':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Get rarity background color for badge display
 */
export function getRarityBgColor(rarity: Badge['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 dark:bg-gray-800';
    case 'rare':
      return 'bg-blue-100 dark:bg-blue-900';
    case 'epic':
      return 'bg-purple-100 dark:bg-purple-900';
    case 'legendary':
      return 'bg-yellow-100 dark:bg-yellow-900';
    default:
      return 'bg-gray-100 dark:bg-gray-800';
  }
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calculate XP needed for next level
 */
export function calculateXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

/**
 * Calculate XP progress to next level
 */
export function calculateLevelProgress(xp: number): {
  currentLevel: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressXP: number;
  progressPercentage: number;
} {
  const currentLevel = calculateLevel(xp);
  const xpForCurrentLevel = calculateXPForNextLevel(currentLevel - 1);
  const xpForNextLevel = calculateXPForNextLevel(currentLevel);
  const progressXP = xp - xpForCurrentLevel;
  const levelXPRange = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = (progressXP / levelXPRange) * 100;
  
  return {
    currentLevel,
    xpForCurrentLevel,
    xpForNextLevel,
    progressXP,
    progressPercentage
  };
}
