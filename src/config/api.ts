
// API configuration with customizable host
const DEFAULT_API_HOST = 'https://services.greenyp.com';
const DEFAULT_IMAGE_HOST = 'https://services.greenyp.com';

// Helper function to normalize URL
const normalizeUrl = (url: string): string => {
  // If the URL already starts with http:// or https://, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's just a hostname, add https:// by default
  if (url.includes('.') && !url.includes('://')) {
    return `https://${url}`;
  }
  
  // Return as is for other cases (localhost, etc.)
  return url;
};

// Get API host from environment or use default
const getApiHost = (): string => {
  // In a real environment, you could use import.meta.env.VITE_API_HOST
  // For now, we'll check if there's a custom host set in localStorage for development
  const customHost = localStorage.getItem('API_HOST');
  const host = customHost || DEFAULT_API_HOST;
  return normalizeUrl(host);
};

// Get image host from environment or use default
const getImageHost = (): string => {
  // In production, this would be the same as API host or a CDN
  // For development, we use localhost:8081
  const customImageHost = localStorage.getItem('IMAGE_HOST');
  if (customImageHost) return normalizeUrl(customImageHost);
  
  // Use the API host for images in both development and production
  return getApiHost();
};

export const API_CONFIG = {
  BASE_URL: getApiHost(),
  IMAGE_BASE_URL: getImageHost(),
  ENDPOINTS: {
    CATEGORIES: '/reference/lob',
    CATEGORY_SERVICES: (lineOfBusinessId: string) => `/reference/lob/${lineOfBusinessId}/service`,
    SUBSCRIPTIONS: '/reference/subscription',
    ACCOUNT: '/account',
  }
};

// Helper function to update API host for development/testing
export const setApiHost = (host: string) => {
  const normalizedHost = normalizeUrl(host);
  localStorage.setItem('API_HOST', normalizedHost);
  // Update the current config
  API_CONFIG.BASE_URL = normalizedHost;
};

// Helper function to update image host for development/testing
export const setImageHost = (host: string) => {
  const normalizedHost = normalizeUrl(host);
  localStorage.setItem('IMAGE_HOST', normalizedHost);
  // Update the current config
  API_CONFIG.IMAGE_BASE_URL = normalizedHost;
};

// Helper function to reset to default host
export const resetApiHost = () => {
  localStorage.removeItem('API_HOST');
  API_CONFIG.BASE_URL = normalizeUrl(DEFAULT_API_HOST);
};

// Helper function to reset to default image host
export const resetImageHost = () => {
  localStorage.removeItem('IMAGE_HOST');
  API_CONFIG.IMAGE_BASE_URL = getImageHost();
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get full image URL
export const getImageUrl = (imagePath: string): string => {
  // If the imagePath already has a protocol, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If the imagePath doesn't start with a slash, add one
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  console.log('Constructing image URL:', {
    imageHost: API_CONFIG.IMAGE_BASE_URL,
    imagePath: normalizedPath,
    finalUrl: `${API_CONFIG.IMAGE_BASE_URL}${normalizedPath}`
  });
  
  return `${API_CONFIG.IMAGE_BASE_URL}${normalizedPath}`;
};
