/**
 * Video Utility Functions
 * Helper functions for video formatting, validation, and calculations
 */

/**
 * Format seconds to HH:MM:SS or MM:SS
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Calculate video completion percentage
 */
export function calculateCompletionPercentage(
  currentTime: number,
  duration: number
): number {
  if (!duration || duration === 0) return 0;
  return Math.min(100, Math.max(0, (currentTime / duration) * 100));
}

/**
 * Check if video is considered "completed" (watched 95% or more)
 */
export function isVideoCompleted(currentTime: number, duration: number): boolean {
  const percentage = calculateCompletionPercentage(currentTime, duration);
  return percentage >= 95;
}

/**
 * Validate video file type
 */
export function isValidVideoFile(file: File): boolean {
  const validTypes = [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/webm',
  ];
  
  return validTypes.includes(file.type);
}

/**
 * Validate video file size (max 5GB)
 */
export function isValidVideoSize(file: File, maxSizeGB: number = 5): boolean {
  const maxBytes = maxSizeGB * 1024 * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Get video quality label from resolution
 */
export function getQualityLabel(width: number, height: number): string {
  if (height >= 2160) return '4K';
  if (height >= 1440) return '1440p';
  if (height >= 1080) return '1080p';
  if (height >= 720) return '720p';
  if (height >= 540) return '540p';
  if (height >= 480) return '480p';
  if (height >= 360) return '360p';
  return '240p';
}

/**
 * Parse quality string to dimensions
 */
export function getQualityDimensions(quality: string): { width: number; height: number } {
  const qualityMap: Record<string, { width: number; height: number }> = {
    '4K': { width: 3840, height: 2160 },
    '1440p': { width: 2560, height: 1440 },
    '1080p': { width: 1920, height: 1080 },
    '720p': { width: 1280, height: 720 },
    '540p': { width: 960, height: 540 },
    '480p': { width: 854, height: 480 },
    '360p': { width: 640, height: 360 },
    '240p': { width: 426, height: 240 },
  };
  
  return qualityMap[quality] || qualityMap['720p'];
}

/**
 * Generate thumbnail timestamp for video preview
 */
export function getThumbnailTimestamp(duration: number, percentage: number = 50): string {
  const seconds = Math.floor((duration * percentage) / 100);
  return `${seconds}s`;
}

/**
 * Check if browser supports HLS natively
 */
export function supportsNativeHLS(): boolean {
  if (typeof document === 'undefined') return false;
  
  const video = document.createElement('video');
  return Boolean(
    video.canPlayType('application/vnd.apple.mpegurl') ||
    video.canPlayType('audio/mpegurl')
  );
}

/**
 * Check if browser supports Picture-in-Picture
 */
export function supportsPictureInPicture(): boolean {
  if (typeof document === 'undefined') return false;
  return 'pictureInPictureEnabled' in document;
}

/**
 * Check if browser supports fullscreen
 */
export function supportsFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  
  return Boolean(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
}

/**
 * Request fullscreen for an element
 */
export async function requestFullscreen(element: HTMLElement): Promise<void> {
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      await (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      await (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      await (element as any).msRequestFullscreen();
    }
  } catch (error) {
    console.error('Error requesting fullscreen:', error);
  }
}

/**
 * Exit fullscreen
 */
export async function exitFullscreen(): Promise<void> {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      await (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      await (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      await (document as any).msExitFullscreen();
    }
  } catch (error) {
    console.error('Error exiting fullscreen:', error);
  }
}

/**
 * Check if currently in fullscreen
 */
export function isFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  
  return Boolean(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
}

/**
 * Request Picture-in-Picture
 */
export async function requestPictureInPicture(
  video: HTMLVideoElement
): Promise<PictureInPictureWindow | null> {
  try {
    if ('pictureInPictureEnabled' in document && video.requestPictureInPicture) {
      return await video.requestPictureInPicture();
    }
  } catch (error) {
    console.error('Error requesting Picture-in-Picture:', error);
  }
  return null;
}

/**
 * Exit Picture-in-Picture
 */
export async function exitPictureInPicture(): Promise<void> {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }
  } catch (error) {
    console.error('Error exiting Picture-in-Picture:', error);
  }
}

/**
 * Get available playback speeds
 */
export function getPlaybackSpeeds(): number[] {
  return [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
}

/**
 * Format playback speed for display
 */
export function formatPlaybackSpeed(speed: number): string {
  return speed === 1 ? 'Normal' : `${speed}x`;
}

/**
 * Calculate estimated download size for quality
 */
export function estimateDownloadSize(
  durationSeconds: number,
  quality: string
): number {
  // Rough estimates in MB per minute
  const bitrateMap: Record<string, number> = {
    '1080p': 8,
    '720p': 5,
    '540p': 3,
    '360p': 1.5,
  };
  
  const bitratePerMinute = bitrateMap[quality] || 5;
  const durationMinutes = durationSeconds / 60;
  
  return Math.ceil(bitratePerMinute * durationMinutes);
}

/**
 * Check available storage quota
 */
export async function checkStorageQuota(): Promise<{
  usage: number;
  quota: number;
  available: number;
  percentage: number;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const available = quota - usage;
    const percentage = quota > 0 ? (usage / quota) * 100 : 0;
    
    return { usage, quota, available, percentage };
  }
  
  return { usage: 0, quota: 0, available: 0, percentage: 0 };
}

/**
 * Format storage quota for display
 */
export function formatStorageQuota(bytes: number): string {
  return formatFileSize(bytes);
}

/**
 * Debounce function for progress saving
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for frequent events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
