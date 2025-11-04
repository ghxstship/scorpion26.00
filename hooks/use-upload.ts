import { useMutation } from '@tanstack/react-query';

export function useUpload() {
  return useMutation({
    mutationFn: async ({ files, type }: { files: File[]; type?: string }) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      if (type) formData.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Upload failed');
      }

      return res.json();
    },
  });
}

// Specialized hooks for different upload types
export function useUploadAvatar() {
  const upload = useUpload();
  return {
    ...upload,
    uploadAvatar: (file: File) => upload.mutate({ files: [file], type: 'avatar' }),
  };
}

export function useUploadProgressPhoto() {
  const upload = useUpload();
  return {
    ...upload,
    uploadPhoto: (file: File) => upload.mutate({ files: [file], type: 'progress-photo' }),
  };
}
