/**
 * Utility to extract IDs from common video sharing URLs
 */

export function extractYoutubeId(url: string): string {
  if (!url) return '';
  
  // Regex for different YouTube URL formats
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[7].length === 11) ? match[7] : url;
}

export function extractTwitchChannel(url: string): string {
  if (!url) return '';
  
  // If it's just a channel name, return it
  if (!url.includes('/')) return url.trim();
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    if (urlObj.hostname.includes('twitch.tv')) {
      return urlObj.pathname.split('/').filter(Boolean)[0] || '';
    }
  } catch (e) {
    // If URL parsing fails, might be just a username with a slash or something
  }
  
  return url.trim();
}
