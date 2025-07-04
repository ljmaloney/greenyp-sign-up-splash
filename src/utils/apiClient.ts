
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
      ...headers,
    };

    // Only set Content-Type for non-FormData requests
    if (!(fetchOptions.body instanceof FormData)) {
      requestHeaders['Content-Type'] = 'application/json';
    }

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

    // Helper function to get body info safely
    const getBodyInfo = (body: BodyInit | undefined) => {
      if (!body) return { hasBody: false, bodyInfo: 'none' };
      
      if (body instanceof FormData) {
        return { hasBody: true, bodyInfo: 'FormData' };
      }
      
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

    // Only log body details for non-FormData requests
    if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
      console.log('📤 API CLIENT - Request body (raw):', fetchOptions.body);
      try {
        console.log('📤 API CLIENT - Request body (parsed):', JSON.parse(fetchOptions.body as string));
      } catch (e) {
        console.log('📤 API CLIENT - Request body (could not parse as JSON):', fetchOptions.body);
      }
    } else if (fetchOptions.body instanceof FormData) {
      console.log('📤 API CLIENT - Request body: FormData (cannot display contents)');
    }

    console.log('🔍 API CLIENT - Final request details:', {
      url,
      method: fetchOptions.method,
      headers: requestHeaders,
      bodyType: fetchOptions.body instanceof FormData ? 'FormData' : typeof fetchOptions.body
    });

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

      // Check content type before parsing as JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('✅ API CLIENT - Success Response (JSON):', {
          hasData: !!result,
          dataKeys: result ? Object.keys(result) : [],
          fullResponse: result
        });
        return result;
      } else {
        // For non-JSON responses (like successful file uploads), return a success indicator
        const textResult = await response.text();
        console.log('✅ API CLIENT - Success Response (Text):', textResult);
        return { success: true, message: textResult };
      }
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
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body,
    });
  },

  put(endpoint: string, data?: any, options: ApiOptions = {}) {
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body,
    });
  },

  delete(endpoint: string, options: ApiOptions = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};
