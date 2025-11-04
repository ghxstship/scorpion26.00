/**
 * Cloudflare Stream API Wrapper
 * Handles video upload, processing, and streaming URL generation
 */

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_STREAM_API_TOKEN = process.env.CLOUDFLARE_STREAM_API_TOKEN;
const CLOUDFLARE_API_BASE = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream`;

export interface CloudflareVideoMetadata {
  uid: string;
  thumbnail: string;
  thumbnailTimestampPct: number;
  readyToStream: boolean;
  status: {
    state: 'pendingupload' | 'downloading' | 'queued' | 'inprogress' | 'ready' | 'error';
    pctComplete?: string;
    errorReasonCode?: string;
    errorReasonText?: string;
  };
  meta: {
    name?: string;
  };
  created: string;
  modified: string;
  size: number;
  preview: string;
  duration: number;
  input: {
    width: number;
    height: number;
  };
  playback: {
    hls: string;
    dash: string;
  };
  watermark?: {
    uid: string;
  };
}

export interface UploadResponse {
  success: boolean;
  result?: CloudflareVideoMetadata;
  errors?: Array<{ code: number; message: string }>;
}

export interface SignedUploadUrl {
  uploadURL: string;
  uid: string;
}

/**
 * Upload video directly to Cloudflare Stream
 */
export async function uploadVideo(
  videoFile: File | Buffer,
  metadata?: { name?: string; requireSignedURLs?: boolean }
): Promise<UploadResponse> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_STREAM_API_TOKEN) {
    throw new Error('Cloudflare Stream credentials not configured');
  }

  const formData = new FormData();
  
  if (videoFile instanceof File) {
    formData.append('file', videoFile);
  } else {
    // For Buffer/server-side uploads
    const uint8Array = new Uint8Array(videoFile);
    formData.append('file', new Blob([uint8Array]));
  }

  if (metadata?.name) {
    formData.append('meta', JSON.stringify({ name: metadata.name }));
  }

  if (metadata?.requireSignedURLs) {
    formData.append('requireSignedURLs', 'true');
  }

  const response = await fetch(CLOUDFLARE_API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_STREAM_API_TOKEN}`,
    },
    body: formData,
  });

  const data: UploadResponse = await response.json();
  
  if (!data.success) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to upload video to Cloudflare Stream'
    );
  }

  return data;
}

/**
 * Get a signed upload URL for direct browser uploads
 * This is more efficient for large files
 */
export async function getSignedUploadUrl(
  maxDurationSeconds?: number
): Promise<SignedUploadUrl> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_STREAM_API_TOKEN) {
    throw new Error('Cloudflare Stream credentials not configured');
  }

  const body: any = {
    maxDurationSeconds: maxDurationSeconds || 3600, // 1 hour default
    requireSignedURLs: true,
  };

  const response = await fetch(`${CLOUDFLARE_API_BASE}/direct_upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_STREAM_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to get signed upload URL'
    );
  }

  return data.result;
}

/**
 * Get video metadata and status
 */
export async function getVideoMetadata(videoId: string): Promise<CloudflareVideoMetadata> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_STREAM_API_TOKEN) {
    throw new Error('Cloudflare Stream credentials not configured');
  }

  const response = await fetch(`${CLOUDFLARE_API_BASE}/${videoId}`, {
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_STREAM_API_TOKEN}`,
    },
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to get video metadata'
    );
  }

  return data.result;
}

/**
 * Delete a video from Cloudflare Stream
 */
export async function deleteVideo(videoId: string): Promise<boolean> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_STREAM_API_TOKEN) {
    throw new Error('Cloudflare Stream credentials not configured');
  }

  const response = await fetch(`${CLOUDFLARE_API_BASE}/${videoId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_STREAM_API_TOKEN}`,
    },
  });

  const data = await response.json();
  return data.success;
}

/**
 * Generate a signed URL for video playback (if requireSignedURLs is enabled)
 */
export async function getSignedStreamUrl(
  videoId: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_STREAM_API_TOKEN) {
    throw new Error('Cloudflare Stream credentials not configured');
  }

  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  
  const response = await fetch(
    `${CLOUDFLARE_API_BASE}/${videoId}/token`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_STREAM_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: videoId,
        exp,
        accessRules: [
          {
            type: 'any',
            action: 'allow',
          },
        ],
      }),
    }
  );

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to generate signed URL'
    );
  }

  return data.result.token;
}

/**
 * Get HLS manifest URL for a video
 */
export function getHlsUrl(videoId: string): string {
  return `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
}

/**
 * Get thumbnail URL for a video
 */
export function getThumbnailUrl(
  videoId: string,
  options?: {
    time?: string; // e.g., '1s', '2m', '30s'
    width?: number;
    height?: number;
    fit?: 'crop' | 'clip' | 'scale';
  }
): string {
  const params = new URLSearchParams();
  
  if (options?.time) params.append('time', options.time);
  if (options?.width) params.append('width', options.width.toString());
  if (options?.height) params.append('height', options.height.toString());
  if (options?.fit) params.append('fit', options.fit);

  const queryString = params.toString();
  const base = `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
  
  return queryString ? `${base}?${queryString}` : base;
}

/**
 * Upload video via TUS (resumable uploads for large files)
 */
export async function uploadVideoTus(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_STREAM_API_TOKEN) {
    throw new Error('Cloudflare Stream credentials not configured');
  }

  // Get signed upload URL first
  const { uploadURL, uid } = await getSignedUploadUrl();

  // Upload using TUS protocol
  const response = await fetch(uploadURL, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': 'application/offset+octet-stream',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload video via TUS');
  }

  return uid;
}

/**
 * Check if video is ready for streaming
 */
export async function isVideoReady(videoId: string): Promise<boolean> {
  try {
    const metadata = await getVideoMetadata(videoId);
    return metadata.readyToStream && metadata.status.state === 'ready';
  } catch (error) {
    console.error('Error checking video status:', error);
    return false;
  }
}

/**
 * Poll video status until ready or error
 */
export async function waitForVideoReady(
  videoId: string,
  maxAttempts: number = 60,
  intervalMs: number = 5000
): Promise<CloudflareVideoMetadata> {
  for (let i = 0; i < maxAttempts; i++) {
    const metadata = await getVideoMetadata(videoId);
    
    if (metadata.status.state === 'ready') {
      return metadata;
    }
    
    if (metadata.status.state === 'error') {
      throw new Error(
        metadata.status.errorReasonText || 'Video processing failed'
      );
    }
    
    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  throw new Error('Video processing timeout');
}
