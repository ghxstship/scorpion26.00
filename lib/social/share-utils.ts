// Social Sharing Utilities

export interface ShareOptions {
  url: string;
  title?: string;
  text?: string;
  image?: string;
}

export const shareToTwitter = ({ url, text }: ShareOptions) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text || 'Check this out!');
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
  
  window.open(twitterUrl, '_blank', 'width=600,height=400');
};

export const shareToFacebook = ({ url }: ShareOptions) => {
  const encodedUrl = encodeURIComponent(url);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  
  window.open(facebookUrl, '_blank', 'width=600,height=400');
};

export const shareToWhatsApp = ({ url, text }: ShareOptions) => {
  const encodedText = encodeURIComponent(text || 'Check this out!');
  const encodedUrl = encodeURIComponent(url);
  const whatsappUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  
  window.open(whatsappUrl, '_blank');
};

export const shareToLinkedIn = ({ url, title }: ShareOptions) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || '');
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`;
  
  window.open(linkedInUrl, '_blank', 'width=600,height=400');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const generatePostUrl = (postId: string, baseUrl?: string): string => {
  const base = baseUrl || window.location.origin;
  return `${base}/member/feed?post=${postId}`;
};

export const generateProfileUrl = (userId: string, baseUrl?: string): string => {
  const base = baseUrl || window.location.origin;
  return `${base}/member/profile/${userId}`;
};

// Check if Web Share API is available
export const canUseNativeShare = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

// Use native share if available
export const nativeShare = async ({ url, title, text }: ShareOptions): Promise<boolean> => {
  if (!canUseNativeShare()) {
    return false;
  }

  try {
    await navigator.share({
      url,
      title,
      text,
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.error('Native share failed:', error);
    return false;
  }
};
