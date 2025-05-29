
// API configuration with customizable host
const DEFAULT_API_HOST = 'http://services.greenyp.com';

// Get API host from environment or use default
const getApiHost = (): string => {
  // In a real environment, you could use import.meta.env.VITE_API_HOST
  // For now, we'll check if there's a custom host set in localStorage for development
  const customHost = localStorage.getItem('API_HOST');
  return customHost || DEFAULT_API_HOST;
};

export const API_CONFIG = {
  BASE_URL: getApiHost(),
  ENDPOINTS: {
    CATEGORIES: '/reference/lob',
    CATEGORY_SERVICES: (lineOfBusinessId: string) => `/reference/lob/${lineOfBusinessId}/service`,
  }
};

// Helper function to update API host for development/testing
export const setApiHost = (host: string) => {
  localStorage.setItem('API_HOST', host);
  // Update the current config
  API_CONFIG.BASE_URL = host;
};

// Helper function to reset to default host
export const resetApiHost = () => {
  localStorage.removeItem('API_HOST');
  API_CONFIG.BASE_URL = DEFAULT_API_HOST;
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
