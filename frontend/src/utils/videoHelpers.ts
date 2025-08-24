// Helper function to detect video format and MIME type
export const getVideoMimeType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'ogg':
    case 'ogv':
      return 'video/ogg';
    case 'avi':
      return 'video/x-msvideo';
    case 'mov':
      return 'video/quicktime';
    case 'mkv':
      return 'video/x-matroska';
    case 'flv':
      return 'video/x-flv';
    case 'wmv':
      return 'video/x-ms-wmv';
    case '3gp':
      return 'video/3gpp';
    case 'm4v':
      return 'video/x-m4v';
    default:
      return 'video/mp4'; // Default fallback
  }
};

// Check if URL is a YouTube video
export const isYouTubeVideo = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Convert YouTube URL to embed URL
export const getYouTubeEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/embed')) {
    return url; // Already an embed URL
  }
  
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  if (url.includes('youtu.be')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url;
};

// Check if URL is a direct video file
export const isDirectVideoFile = (url: string): boolean => {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'ogv', 'avi', 'mov', 'mkv', 'flv', 'wmv', '3gp', 'm4v'];
  const extension = url.split('.').pop()?.toLowerCase();
  return extension ? videoExtensions.includes(extension) : false;
};
