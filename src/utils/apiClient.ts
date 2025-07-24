
import { API_CONFIG } from '@/config/api';

interface ApiResponse<T = any> {
  response: T;
  status: number;
  success: boolean;
  message?: string;
  error?: string;
  errorMessageApi?: string | null;
}

interface ApiClientOptions {
  requireAuth?: boolean;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private getAccessToken?: () => Promise<string | null>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Method to set the access token getter (used by useApiClient hook)
  setAccessTokenGetter(getter: () => Promise<string | null>) {
    this.getAccessToken = getter;
  }

  // Method to get the base URL
  getBaseUrl(): string {
    return this.baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & { requireAuth?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    const { requireAuth = true, ...fetchOptions } = options;
    
    const url = `${this.baseUrl}${endpoint}`;
    console.log('🌐 API CLIENT - Making request:', {
      method: fetchOptions.method || 'GET',
      url,
      requireAuth,
      hasBody: !!fetchOptions.body,
      bodyLength: fetchOptions.body ? String(fetchOptions.body).length : 0
    });

    // Log the exact body being sent for POST requests
    if (fetchOptions.body && fetchOptions.method === 'POST') {
      console.log('🌐 API CLIENT - POST body:', fetchOptions.body);
      try {
        const parsedBody = JSON.parse(String(fetchOptions.body));
        console.log('🌐 API CLIENT - Parsed POST body:', parsedBody);
      } catch (e) {
        console.log('🌐 API CLIENT - Could not parse POST body as JSON');
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((fetchOptions.headers as Record<string, string>) || {})
    };

    // Add authorization header if required
    if (requireAuth && this.getAccessToken) {
      try {
        const token = await this.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          console.log('🔐 API CLIENT - Added auth header');
        } else {
          console.warn('⚠️ API CLIENT - No access token available for authenticated request');
        }
      } catch (error) {
        console.error('❌ API CLIENT - Error getting access token:', error);
      }
    }

    console.log('🌐 API CLIENT - Request headers:', Object.keys(headers));

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers
      });

      console.log('🌐 API CLIENT - Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseText = await response.text();
      console.log('🌐 API CLIENT - Raw response text:', responseText);

      // Try to parse as JSON
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn('⚠️ API CLIENT - Could not parse response as JSON:', parseError);
        responseData = { rawResponse: responseText };
      }

      if (!response.ok) {
        console.error('❌ API CLIENT - HTTP error:', {
          status: response.status,
          statusText: response.statusText,
          responseData
        });
        
        // Create a detailed error message
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      console.log('✅ API CLIENT - Request successful:', {
        status: response.status,
        hasData: !!responseData,
        dataKeys: responseData ? Object.keys(responseData) : []
      });

      return {
        response: responseData,
        status: response.status,
        success: true,
        errorMessageApi: null
      };

    } catch (error) {
      console.error('❌ API CLIENT - Request failed:', error);
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      
      throw new Error('API request failed: Unknown error');
    }
  }

  async get<T>(endpoint: string, options: ApiClientOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      ...options
    });
  }

  async post<T>(endpoint: string, data: any, options: ApiClientOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put<T>(endpoint: string, data: any, options: ApiClientOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete<T>(endpoint: string, options: ApiClientOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      ...options
    });
  }

  // Legacy method for backward compatibility
  async request<T>(endpoint: string, options: RequestInit & { requireAuth?: boolean } = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, options);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
