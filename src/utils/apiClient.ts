
import { getApiUrl, API_CONFIG } from '@/config/api';

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiClient = {
  async request(endpoint: string, options: ApiOptions = {}) {
    const { requireAuth = false, headers = {}, ...fetchOptions } = options;
    
    const url = getApiUrl(endpoint);
    
    console.log('🔧 API CLIENT - Request initiated:', {
      endpoint,
      baseUrl: API_CONFIG.BASE_URL,
      fullUrl: url,
      requireAuth,
      method: fetchOptions.method || 'GET',
      hasBody: !!fetchOptions.body
    });
    
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add authorization header if authentication is required
    if (requireAuth) {
      try {
        const token = await this.getAccessToken();
        console.log('🔑 API CLIENT - Token check:', {
          hasToken: !!token,
          tokenStart: token ? token.substring(0, 20) + '...' : 'none'
        });
        
        if (token) {
          requestHeaders['Authorization'] = `Bearer ${token}`;
        } else {
          console.warn('⚠️ API CLIENT - No access token available for authenticated request');
        }
      } catch (error) {
        console.error('❌ API CLIENT - Failed to get access token:', error);
      }
    }

    // Helper function to get body length safely
    const getBodyInfo = (body: BodyInit | undefined) => {
      if (!body) return { hasBody: false, bodyInfo: 'none' };
      
      if (typeof body === 'string') {
        return { hasBody: true, bodyInfo: `string (${body.length} chars)` };
      }
      
      return { hasBody: true, bodyInfo: 'non-string body' };
    };

    const { hasBody, bodyInfo } = getBodyInfo(fetchOptions.body);

    console.log(`🌐 API CLIENT - Making Request: ${fetchOptions.method || 'GET'} ${url}`, {
      requireAuth,
      hasAuthHeader: !!requestHeaders['Authorization'],
      headers: Object.keys(requestHeaders),
      bodyInfo
    });

    if (fetchOptions.body) {
      console.log('📤 API CLIENT - Request body:', fetchOptions.body);
    }

    try {
      console.log('🚀 API CLIENT - About to make fetch request...');
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
      });

      console.log('📡 API CLIENT - Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API CLIENT - Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ API CLIENT - Success Response:', {
        hasData: !!result,
        dataKeys: result ? Object.keys(result) : [],
        fullResponse: result
      });
      
      return result;
    } catch (error) {
      console.error('❌ API CLIENT - Request Failed:', {
        url,
        error: error.message,
        errorName: error.name,
        requireAuth,
        hasAuthHeader: !!requestHeaders['Authorization'],
        stack: error.stack
      });
      throw error;
    }
  },

  async getAccessToken(): Promise<string | null> {
    // This will be dynamically set by the useApiClient hook
    console.log('🔑 API CLIENT - getAccessToken called (default implementation)');
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
