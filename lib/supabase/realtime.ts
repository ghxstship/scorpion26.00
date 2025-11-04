import { createClient } from './client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribe to real-time changes on a table
 */
export function subscribeToTable(
  table: string,
  callback: (payload: any) => void,
  filter?: { column: string; value: any }
) {
  const supabase = createClient();
  
  let channel: RealtimeChannel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
      },
      callback
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}

/**
 * Subscribe to new posts
 */
export function subscribeToNewPosts(callback: (post: any) => void) {
  return subscribeToTable('posts', (payload) => {
    if (payload.eventType === 'INSERT') {
      callback(payload.new);
    }
  });
}

/**
 * Subscribe to user's notifications
 */
export function subscribeToNotifications(userId: string, callback: (notification: any) => void) {
  return subscribeToTable(
    'notifications',
    (payload) => {
      if (payload.eventType === 'INSERT') {
        callback(payload.new);
      }
    },
    { column: 'user_id', value: userId }
  );
}

/**
 * Subscribe to workout logs
 */
export function subscribeToWorkoutLogs(userId: string, callback: (log: any) => void) {
  return subscribeToTable(
    'workout_logs',
    (payload) => {
      if (payload.eventType === 'INSERT') {
        callback(payload.new);
      }
    },
    { column: 'user_id', value: userId }
  );
}

/**
 * Subscribe to community activity
 */
export function subscribeToCommunityActivity(callback: (activity: any) => void) {
  const supabase = createClient();
  
  const channel = supabase
    .channel('community-activity')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'posts' },
      (payload) => callback({ type: 'post', data: payload.new })
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'comments' },
      (payload) => callback({ type: 'comment', data: payload.new })
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'post_likes' },
      (payload) => callback({ type: 'like', data: payload.new })
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}

/**
 * React hook for real-time subscriptions
 */
export function useRealtimeSubscription(
  table: string,
  callback: (payload: any) => void,
  filter?: { column: string; value: any }
) {
  if (typeof window === 'undefined') return;

  const unsubscribe = subscribeToTable(table, callback, filter);

  // Cleanup on unmount
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', unsubscribe);
  }

  return unsubscribe;
}
