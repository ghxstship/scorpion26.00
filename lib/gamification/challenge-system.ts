/**
 * Challenge System - Time-bound competitions and challenges
 */

import { createClient } from '@/lib/supabase/client';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  challenge_type: 'distance' | 'workouts' | 'duration' | 'streak';
  goal_type: 'individual' | 'team' | 'community';
  goal_value: number;
  start_date: string;
  end_date: string;
  xp_reward: number;
  badge_reward_id?: string;
  max_participants?: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  rank?: number;
  joined_at: string;
}

export interface ChallengeWithParticipation extends Challenge {
  participant?: ChallengeParticipant;
  participant_count?: number;
}

/**
 * Get all active challenges
 */
export async function getActiveChallenges(): Promise<{
  challenges: ChallengeWithParticipation[];
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('end_date', { ascending: true });
    
    if (error) throw error;
    
    return {
      challenges: data || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching active challenges:', error);
    return {
      challenges: [],
      error: error as Error
    };
  }
}

/**
 * Get user's challenges
 */
export async function getUserChallenges(userId: string): Promise<{
  challenges: ChallengeWithParticipation[];
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('challenge_participants')
      .select(`
        *,
        challenge:challenges(*)
      `)
      .eq('user_id', userId)
      .order('joined_at', { ascending: false });
    
    if (error) throw error;
    
    const challenges = data?.map(p => ({
      ...p.challenge,
      participant: {
        id: p.id,
        challenge_id: p.challenge_id,
        user_id: p.user_id,
        progress: p.progress,
        completed: p.completed,
        completed_at: p.completed_at,
        rank: p.rank,
        joined_at: p.joined_at
      }
    })) || [];
    
    return {
      challenges,
      error: null
    };
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    return {
      challenges: [],
      error: error as Error
    };
  }
}

/**
 * Join a challenge
 */
export async function joinChallenge(
  challengeId: string,
  userId: string
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('challenge_participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
        progress: 0,
        completed: false
      });
    
    if (error) throw error;
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error joining challenge:', error);
    return {
      success: false,
      error: error as Error
    };
  }
}

/**
 * Update challenge progress
 */
export async function updateChallengeProgress(
  challengeId: string,
  userId: string,
  progressIncrement: number
): Promise<{
  newProgress: number;
  completed: boolean;
  rank: number;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .rpc('update_challenge_progress', {
        p_challenge_id: challengeId,
        p_user_id: userId,
        p_progress_increment: progressIncrement
      });
    
    if (error) throw error;
    
    const result = data[0];
    
    return {
      newProgress: result.new_progress,
      completed: result.completed,
      rank: result.rank,
      error: null
    };
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    return {
      newProgress: 0,
      completed: false,
      rank: 0,
      error: error as Error
    };
  }
}

/**
 * Get challenge leaderboard
 */
export async function getChallengeLeaderboard(
  challengeId: string,
  limit: number = 100
): Promise<{
  leaderboard: Array<{
    user_id: string;
    progress: number;
    rank: number;
    completed: boolean;
    user?: any;
  }>;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('challenge_participants')
      .select('user_id, progress, rank, completed')
      .eq('challenge_id', challengeId)
      .order('progress', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return {
      leaderboard: data || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching challenge leaderboard:', error);
    return {
      leaderboard: [],
      error: error as Error
    };
  }
}

/**
 * Create a new challenge
 */
export async function createChallenge(
  challenge: Omit<Challenge, 'id' | 'created_at' | 'updated_at'>
): Promise<{
  challenge: Challenge | null;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('challenges')
      .insert(challenge)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      challenge: data,
      error: null
    };
  } catch (error) {
    console.error('Error creating challenge:', error);
    return {
      challenge: null,
      error: error as Error
    };
  }
}

/**
 * Get challenge details
 */
export async function getChallengeDetails(
  challengeId: string,
  userId?: string
): Promise<{
  challenge: ChallengeWithParticipation | null;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    
    // Get challenge
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();
    
    if (challengeError) throw challengeError;
    
    // Get participant count
    const { count, error: countError } = await supabase
      .from('challenge_participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);
    
    if (countError) throw countError;
    
    let participant = undefined;
    
    // Get user's participation if userId provided
    if (userId) {
      const { data: participantData, error: participantError } = await supabase
        .from('challenge_participants')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('user_id', userId)
        .single();
      
      if (!participantError && participantData) {
        participant = participantData;
      }
    }
    
    return {
      challenge: {
        ...challenge,
        participant,
        participant_count: count || 0
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching challenge details:', error);
    return {
      challenge: null,
      error: error as Error
    };
  }
}

/**
 * Calculate challenge progress percentage
 */
export function calculateChallengeProgress(
  progress: number,
  goalValue: number
): number {
  return Math.min((progress / goalValue) * 100, 100);
}

/**
 * Check if challenge is active
 */
export function isChallengeActive(challenge: Challenge): boolean {
  const now = new Date();
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  
  return challenge.is_active && now >= startDate && now <= endDate;
}

/**
 * Get challenge status
 */
export function getChallengeStatus(challenge: Challenge): 'upcoming' | 'active' | 'ended' {
  const now = new Date();
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  
  if (now < startDate) return 'upcoming';
  if (now > endDate) return 'ended';
  return 'active';
}

/**
 * Get time remaining for challenge
 */
export function getChallengeTimeRemaining(challenge: Challenge): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const now = new Date();
  const endDate = new Date(challenge.end_date);
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
  }
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    totalSeconds: seconds
  };
}

/**
 * Get challenge type label
 */
export function getChallengeTypeLabel(type: Challenge['challenge_type']): string {
  switch (type) {
    case 'distance':
      return 'Distance Challenge';
    case 'workouts':
      return 'Workout Challenge';
    case 'duration':
      return 'Duration Challenge';
    case 'streak':
      return 'Streak Challenge';
    default:
      return 'Challenge';
  }
}

/**
 * Get challenge type icon
 */
export function getChallengeTypeIcon(type: Challenge['challenge_type']): string {
  switch (type) {
    case 'distance':
      return 'map';
    case 'workouts':
      return 'dumbbell';
    case 'duration':
      return 'clock';
    case 'streak':
      return 'flame';
    default:
      return 'trophy';
  }
}
