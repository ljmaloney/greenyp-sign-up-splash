
// API configuration with customizable host
const DEFAULT_API_HOST = 'https://services.greenyp.com';
const DEFAULT_IMAGE_HOST = 'https://services.greenyp.com';
const LOCAL_API_HOST = 'http://localhost:8081';

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
  // Check for development override
  const customHost = localStorage.getItem('API_HOST');
  if (customHost) return normalizeUrl(customHost);
  
  // For development, check if we should use local API
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isDevelopment) {
    // Check if we have a local API server preference
    const useLocalApi = localStorage.getItem('USE_LOCAL_API');
    if (useLocalApi === 'false') {
      // Explicitly set to use production API in development
      return DEFAULT_API_HOST;
    }
    // Default to production API in development for now since local API might not be running
    return DEFAULT_API_HOST;
  }
  
  return DEFAULT_API_HOST;
};

// Get image host from environment or use default
const getImageHost = (): string => {
  const customImageHost = localStorage.getItem('IMAGE_HOST');
  if (customImageHost) return normalizeUrl(customImageHost);
  
  // Use the API host for images
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
    CLASSIFIED_CATEGORIES: '/reference/classified/categories',
  }
};

// Helper function to update API host for development/testing
export const setApiHost = (host: string) => {
  const normalizedHost = normalizeUrl(host);
  localStorage.setItem('API_HOST', normalizedHost);
  // Update the current config
  API_CONFIG.BASE_URL = normalizedHost;
  console.log('API host updated to:', normalizedHost);
  // Reload the page to apply the changes
  window.location.reload();
};

// Helper function to toggle local API usage
export const setUseLocalApi = (useLocal: boolean) => {
  if (useLocal) {
    localStorage.setItem('USE_LOCAL_API', 'true');
    API_CONFIG.BASE_URL = LOCAL_API_HOST;
  } else {
    localStorage.setItem('USE_LOCAL_API', 'false');
    API_CONFIG.BASE_URL = DEFAULT_API_HOST;
  }
  console.log('API host updated to:', API_CONFIG.BASE_URL);
  // Reload the page to apply the changes
  window.location.reload();
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
  localStorage.removeItem('USE_LOCAL_API');
  API_CONFIG.BASE_URL = DEFAULT_API_HOST;
  console.log('API host reset to default:', DEFAULT_API_HOST);
  // Reload the page to apply the changes
  window.location.reload();
};

// Helper function to reset to default image host
export const resetImageHost = () => {
  localStorage.removeItem('IMAGE_HOST');
  API_CONFIG.IMAGE_BASE_URL = getImageHost();
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('🌐 API URL constructed:', {
    baseUrl: API_CONFIG.BASE_URL,
    endpoint,
    fullUrl
  });
  return fullUrl;
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

// Development helper - expose functions globally for easy testing in console
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  (window as any).apiConfig = {
    setApiHost,
    setUseLocalApi,
    resetApiHost,
    currentHost: API_CONFIG.BASE_URL
  };
  console.log('🔧 Development API config helpers available:', {
    currentHost: API_CONFIG.BASE_URL,
    helpers: 'Use window.apiConfig.setApiHost("your-host") or window.apiConfig.setUseLocalApi(true/false)'
  });
}
