
import { getApiUrl, API_CONFIG } from '@/config/api';

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiClient = {
  async request(endpoint: string, options: ApiOptions = {}) {
    const { requireAuth = false, headers = {}, ...fetchOptions } = options;
    
    const url = getApiUrl(endpoint);
    
    console.log('🔧 API Client Request:', {
      endpoint,
      baseUrl: API_CONFIG.BASE_URL,
      fullUrl: url,
      requireAuth,
      method: fetchOptions.method || 'GET'
    });
    
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add authorization header if authentication is required
    if (requireAuth) {
      try {
        const token = await this.getAccessToken();
        console.log('🔑 Token check:', {
          hasToken: !!token,
          tokenStart: token ? token.substring(0, 20) + '...' : 'none'
        });
        
        if (token) {
          requestHeaders['Authorization'] = `Bearer ${token}`;
        } else {
          console.warn('⚠️ No access token available for authenticated request');
        }
      } catch (error) {
        console.error('❌ Failed to get access token:', error);
      }
    }

    console.log(`🌐 Making API Request: ${fetchOptions.method || 'GET'} ${url}`, {
      requireAuth,
      hasAuthHeader: !!requestHeaders['Authorization'],
      headers: Object.keys(requestHeaders)
    });

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
      });

      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ API Success:', {
        hasData: !!result,
        dataKeys: result ? Object.keys(result) : []
      });
      
      return result;
    } catch (error) {
      console.error('❌ API Request Failed:', {
        url,
        error: error.message,
        requireAuth,
        hasAuthHeader: !!requestHeaders['Authorization']
      });
      throw error;
    }
  },

  async getAccessToken(): Promise<string | null> {
    // This will be dynamically set by the useApiClient hook
    return null;
  },

  // Helper method to get the base URL for debugging
  getBaseUrl(): string {
    return API_CONFIG.BASE_URL;
  },

  get(endpoint: string, options: ApiOptions = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint: string, data?: any, options: ApiOptions = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put(endpoint: string, data?: any, options: ApiOptions = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete(endpoint: string, options: ApiOptions = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};
