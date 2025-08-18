import { API_CONFIG } from '@/config/api';

interface FileUploadOptions {
  requireAuth?: boolean;
  headers?: Record<string, string>;
}

interface FileUploadResponse<T = any> {
  response: T;
  status: number;
  success: boolean;
  message?: string;
  error?: string;
  errorMessageApi: any | null;
}

class ApiFileClient {
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

  private async makeFileRequest<T>(
    endpoint: string,
    options: RequestInit & FileUploadOptions = {}
  ): Promise<FileUploadResponse<T>> {
    const { requireAuth = true, ...fetchOptions } = options;
    
    const url = `${this.baseUrl}${endpoint}`;
    console.log('📤 FILE CLIENT - Making file upload request:', {
      method: fetchOptions.method || 'POST',
      url,
      requireAuth,
      hasBody: !!fetchOptions.body,
      bodyType: fetchOptions.body?.constructor.name
    });

    // Log FormData contents if possible
    if (fetchOptions.body instanceof FormData) {
      console.log('📤 FILE CLIENT - FormData entries:');
      for (const [key, value] of fetchOptions.body.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
    }

    const headers: Record<string, string> = {
      ...((fetchOptions.headers as Record<string, string>) || {})
    };

    // Don't set Content-Type for FormData - let browser set it with boundary
    // FormData uploads need multipart/form-data with proper boundary

    // Add authorization header if required
    if (requireAuth && this.getAccessToken) {
      try {
        const token = await this.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          console.log('🔐 FILE CLIENT - Added auth header');
        } else {
          console.warn('⚠️ FILE CLIENT - No access token available for authenticated request');
        }
      } catch (error) {
        console.error('❌ FILE CLIENT - Error getting access token:', error);
      }
    }

    console.log('📤 FILE CLIENT - Request headers:', Object.keys(headers));

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers
      });

      console.log('📤 FILE CLIENT - Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseText = await response.text();
      console.log('📤 FILE CLIENT - Raw response text:', responseText);

      // Try to parse as JSON
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn('⚠️ FILE CLIENT - Could not parse response as JSON:', parseError);
        responseData = { rawResponse: responseText };
      }

      if (!response.ok) {
        console.error('❌ FILE CLIENT - HTTP error:', {
          status: response.status,
          statusText: response.statusText,
          responseData
        });
        
        // Handle 401 Unauthorized responses from dashboard context
        if (response.status === 401) {
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/dashboard')) {
            console.warn('🔒 FILE CLIENT - 401 from dashboard context, redirecting to login');
            localStorage.removeItem('accessToken');
            sessionStorage.removeItem('accessToken');
            window.location.href = '/login';
            return Promise.reject(new Error('Authentication required - redirecting to login'));
          }
        }
        
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      console.log('✅ FILE CLIENT - Request successful:', {
        status: response.status,
        hasData: !!responseData,
        dataKeys: responseData ? Object.keys(responseData) : []
      });

      return {
        response: responseData.response || responseData,
        status: response.status,
        success: true,
        errorMessageApi: responseData.errorMessageApi || null
      };

    } catch (error) {
      console.error('❌ FILE CLIENT - Request failed:', error);
      
      if (error instanceof Error) {
        throw new Error(`File upload failed: ${error.message}`);
      }
      
      throw new Error('File upload failed: Unknown error');
    }
  }

  async uploadFile<T>(
    endpoint: string, 
    formData: FormData, 
    options: FileUploadOptions = {}
  ): Promise<FileUploadResponse<T>> {
    return this.makeFileRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      ...options
    });
  }

  // Generic request method for other file operations
  async request<T>(
    endpoint: string, 
    options: RequestInit & FileUploadOptions = {}
  ): Promise<FileUploadResponse<T>> {
    return this.makeFileRequest<T>(endpoint, options);
  }
}

// Create and export the file upload client instance
export const apiFileClient = new ApiFileClient(API_CONFIG.BASE_URL);
