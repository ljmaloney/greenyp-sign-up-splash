
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
  // First check if we're explicitly using local API
  try {
    const useLocalApi = localStorage.getItem('USE_LOCAL_API');
    if (useLocalApi === 'true') {
      console.log('🔧 Using local API based on USE_LOCAL_API flag');
      return LOCAL_API_HOST;
    }
  } catch (error) {
    console.warn('⚠️ LocalStorage access error:', error);
  }
  
  // Then check for custom host override
  try {
    const customHost = localStorage.getItem('API_HOST');
    if (customHost) {
      console.log('🔧 Using custom API host from localStorage:', customHost);
      return normalizeUrl(customHost);
    }
  } catch (error) {
    console.warn('⚠️ LocalStorage access error:', error);
  }
  
  // Fallback to production API
  console.log('🔧 Using default production API host');
  return DEFAULT_API_HOST;
};

// Get image host from environment or use default
const getImageHost = (): string => {
  try {
    const customImageHost = localStorage.getItem('IMAGE_HOST');
    if (customImageHost) {
      console.log('🔧 Using custom image host from localStorage:', customImageHost);
      return normalizeUrl(customImageHost);
    }
  } catch (error) {
    console.warn('⚠️ LocalStorage access error:', error);
  }
  
  // Use the API host for images if no specific image host is set
  return getApiHost();
};

// Create and export the API config
const createApiConfig = () => {
  const baseUrl = getApiHost();
  const imageBaseUrl = getImageHost();
  
  console.log('🔧 API Configuration initialized:', {
    baseUrl,
    imageBaseUrl,
    isLocalApi: baseUrl === LOCAL_API_HOST
  });
  
  return {
    BASE_URL: baseUrl,
    IMAGE_BASE_URL: imageBaseUrl,
    ENDPOINTS: {
      CATEGORIES: '/reference/lob',
      CATEGORY_SERVICES: (lineOfBusinessId: string) => `/reference/lob/${lineOfBusinessId}/service`,
      SUBSCRIPTIONS: '/reference/subscription',
      ACCOUNT: '/account',
      CLASSIFIED_CATEGORIES: '/reference/classified/categories',
      CLASSIFIED: '/classified',
    }
  };
};

export const API_CONFIG = createApiConfig();

// Helper function to update API host for development/testing
export const setApiHost = (host: string) => {
  const normalizedHost = normalizeUrl(host);
  localStorage.setItem('API_HOST', normalizedHost);
  localStorage.removeItem('USE_LOCAL_API'); // Clear the local API flag to avoid conflicts
  // Update the current config
  API_CONFIG.BASE_URL = normalizedHost;
  console.log('🔧 API host updated to:', normalizedHost);
};

// Helper function to toggle local API usage
export const setUseLocalApi = (useLocal: boolean) => {
  if (useLocal) {
    localStorage.setItem('USE_LOCAL_API', 'true');
    localStorage.removeItem('API_HOST'); // Clear any custom host
    API_CONFIG.BASE_URL = LOCAL_API_HOST;
    console.log('🔧 Using local API at:', LOCAL_API_HOST);
  } else {
    localStorage.removeItem('USE_LOCAL_API');
    localStorage.removeItem('API_HOST');
    API_CONFIG.BASE_URL = DEFAULT_API_HOST;
    console.log('🔧 Using default API at:', DEFAULT_API_HOST);
  }
};

// Helper function to update image host for development/testing
export const setImageHost = (host: string) => {
  const normalizedHost = normalizeUrl(host);
  localStorage.setItem('IMAGE_HOST', normalizedHost);
  // Update the current config
  API_CONFIG.IMAGE_BASE_URL = normalizedHost;
  console.log('🔧 Image host updated to:', normalizedHost);
};

// Helper function to reset to default host
export const resetApiHost = () => {
  localStorage.removeItem('API_HOST');
  localStorage.removeItem('USE_LOCAL_API');
  API_CONFIG.BASE_URL = DEFAULT_API_HOST;
  console.log('🔧 API host reset to default:', DEFAULT_API_HOST);
};

// Helper function to reset to default image host
export const resetImageHost = () => {
  localStorage.removeItem('IMAGE_HOST');
  API_CONFIG.IMAGE_BASE_URL = getImageHost();
  console.log('🔧 Image host reset to default');
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('🔗 API URL constructed:', {
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
  
  console.log('🔗 Image URL constructed:', {
    imageHost: API_CONFIG.IMAGE_BASE_URL,
    imagePath: normalizedPath,
    finalUrl: `${API_CONFIG.IMAGE_BASE_URL}${normalizedPath}`
  });
  
  return `${API_CONFIG.IMAGE_BASE_URL}${normalizedPath}`;
};

// Add a helper to check if we're using local API
export const isUsingLocalApi = (): boolean => {
  return API_CONFIG.BASE_URL === LOCAL_API_HOST;
};

// Development helper - expose functions globally for easy testing in console
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  (window as any).apiConfig = {
    setApiHost,
    setUseLocalApi,
    resetApiHost,
    isUsingLocalApi,
    currentHost: API_CONFIG.BASE_URL,
    switchToLocal: () => setUseLocalApi(true),
    switchToProduction: () => setUseLocalApi(false)
  };
  console.log('🔧 Development API config helpers available:', {
    currentHost: API_CONFIG.BASE_URL,
    isUsingLocalApi: isUsingLocalApi(),
    helpers: 'Use window.apiConfig.switchToLocal() or window.apiConfig.switchToProduction()'
  });
}
