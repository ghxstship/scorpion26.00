import { createClient } from '@/lib/supabase/server';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  bucket?: string;
}

const DEFAULT_OPTIONS: UploadOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  bucket: 'uploads',
};

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  userId: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate file type
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    return {
      url: '',
      path: '',
      error: `Invalid file type. Allowed: ${opts.allowedTypes.join(', ')}`,
    };
  }

  // Validate file size
  if (opts.maxSize && file.size > opts.maxSize) {
    return {
      url: '',
      path: '',
      error: `File too large. Maximum size: ${opts.maxSize / 1024 / 1024}MB`,
    };
  }

  try {
    const supabase = await createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(opts.bucket!)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { url: '', path: '', error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(opts.bucket!)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error: any) {
    return {
      url: '',
      path: '',
      error: error.message || 'Upload failed',
    };
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  path: string,
  bucket: string = 'uploads'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Delete failed' };
  }
}

/**
 * Get signed URL for private files
 */
export async function getSignedUrl(
  path: string,
  bucket: string = 'uploads',
  expiresIn: number = 3600
): Promise<{ url: string; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      return { url: '', error: error.message };
    }

    return { url: data.signedUrl };
  } catch (error: any) {
    return { url: '', error: error.message || 'Failed to generate signed URL' };
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  userId: string,
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map(file => uploadFile(file, userId, options))
  );
  return results;
}
