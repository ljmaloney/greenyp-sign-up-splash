
// API configuration with customizable host
const DEFAULT_API_HOST = 'https://services.greenyp.com';
const DEFAULT_IMAGE_HOST = 'http://localhost:8081';

// Get API host from environment or use default
const getApiHost = (): string => {
  // In a real environment, you could use import.meta.env.VITE_API_HOST
  // For now, we'll check if there's a custom host set in localStorage for development
  const customHost = localStorage.getItem('API_HOST');
  return customHost || DEFAULT_API_HOST;
};

// Get image host from environment or use default
const getImageHost = (): string => {
  // In production, this would be the same as API host or a CDN
  // For development, we use localhost:8081
  const customImageHost = localStorage.getItem('IMAGE_HOST');
  if (customImageHost) return customImageHost;
  
  // In production, use the API host for images
  if (import.meta.env.PROD) {
    return getApiHost();
  }
  
  // In development, use the specific image host
  return DEFAULT_IMAGE_HOST;
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
  localStorage.setItem('API_HOST', host);
  // Update the current config
  API_CONFIG.BASE_URL = host;
};

// Helper function to update image host for development/testing
export const setImageHost = (host: string) => {
  localStorage.setItem('IMAGE_HOST', host);
  // Update the current config
  API_CONFIG.IMAGE_BASE_URL = host;
};

// Helper function to reset to default host
export const resetApiHost = () => {
  localStorage.removeItem('API_HOST');
  API_CONFIG.BASE_URL = DEFAULT_API_HOST;
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
  return `${API_CONFIG.IMAGE_BASE_URL}${imagePath}`;
};
