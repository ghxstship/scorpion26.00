import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch progress summary
export function useProgress() {
  return useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const res = await fetch('/api/progress');
      if (!res.ok) throw new Error('Failed to fetch progress');
      const data = await res.json();
      return data.data;
    },
  });
}

// Fetch progress stats
export function useProgressStats(period: number = 30) {
  return useQuery({
    queryKey: ['progress', 'stats', period],
    queryFn: async () => {
      const res = await fetch(`/api/progress/stats?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      return data.data;
    },
  });
}

// Log workout
export function useLogWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workout: {
      workout_id: string;
      duration_minutes: number;
      calories_burned?: number;
      difficulty_rating?: number;
      notes?: string;
    }) => {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });
      if (!res.ok) throw new Error('Failed to log workout');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'stats'] });
    },
  });
}

// Upload progress photo
export function useUploadProgressPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { photo_urls: string[]; notes?: string }) => {
      const res = await fetch('/api/progress/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to upload photo');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', 'photos'] });
    },
  });
}
