
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('lovable');

export const API_CONFIG = {
  // Use different base URLs based on environment
  baseUrl: isDevelopment 
    ? 'http://localhost:8080' // Use localhost:8080 for local testing
    : 'https://services.greenyp.com',
  
  // Add timeout and retry logic
  timeout: 10000,
  retries: 2,
  
  // CORS handling
  mode: 'cors' as RequestMode,
  
  // Development mode flag
  isDevelopment
};

// Custom host management for development
let customHost: string | null = null;

export const setApiHost = (host: string) => {
  customHost = host;
  API_CONFIG.baseUrl = host;
};

export const resetApiHost = () => {
  customHost = null;
  API_CONFIG.baseUrl = isDevelopment 
    ? 'http://localhost:8080'
    : 'https://services.greenyp.com';
};

export const getApiUrl = (endpoint: string) => {
  const baseUrl = customHost || API_CONFIG.baseUrl;
  return `${baseUrl}${endpoint}`;
};

// Enhanced fetch wrapper with better error handling
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint);
  
  console.log(`🌐 API Request: ${url}`);
  console.log(`🔧 Environment: ${API_CONFIG.isDevelopment ? 'Development' : 'Production'}`);
  console.log(`🌍 Origin: ${window.location.origin}`);
  console.log(`📍 Target: ${API_CONFIG.baseUrl}`);
  
  const requestOptions: RequestInit = {
    ...options,
    mode: API_CONFIG.mode,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  console.log(`📤 Request options:`, requestOptions);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log(`📥 Response status: ${response.status}`);
    console.log(`📥 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Success:`, data);
    return data;
    
  } catch (error) {
    console.error(`❌ API Error for ${url}:`, {
      error: error.message,
      name: error.name,
      stack: error.stack,
      isDevelopment: API_CONFIG.isDevelopment,
      origin: window.location.origin,
      target: API_CONFIG.baseUrl,
      userAgent: navigator.userAgent
    });
    
    // For development mode, provide helpful debugging info
    if (API_CONFIG.isDevelopment) {
      console.log(`🔧 Debug Info:`, {
        possibleIssues: [
          'API server is down or unreachable',
          'CORS policy blocking the request', 
          'Network connectivity issues',
          'API endpoint has changed or does not exist'
        ],
        suggestions: [
          `Check if the API server is running on ${API_CONFIG.baseUrl}`,
          'Verify CORS configuration on the API server',
          'Try accessing the API directly in a new tab',
          'Check browser network tab for more details',
          'Ensure the endpoint exists and accepts the request method'
        ]
      });
    }
    
    throw error;
  }
};

export default API_CONFIG;
