import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  is_published: boolean;
}

// Fetch programs
export function usePrograms(filters?: { category?: string; difficulty?: string }) {
  return useQuery({
    queryKey: ['programs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);

      const res = await fetch(`/api/programs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch programs');
      const data = await res.json();
      return data.data as Program[];
    },
  });
}

// Create program
export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (program: Partial<Program>) => {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program),
      });
      if (!res.ok) throw new Error('Failed to create program');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}
