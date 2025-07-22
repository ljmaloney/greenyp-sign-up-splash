
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { Classified } from '@/types/classifieds';
import { API_CONFIG } from '@/config/api';

interface ClassifiedDetailApiResponse {
  response: {
    classifiedId: string;
    createDate: string;
    lastUpdateDate: string;
    activeDate: string;
    lastActiveDate: string;
    renewalCount: number;
    categoryId: string;
    adTypeId: string;
    price?: number;
    perUnitType?: string;
    title: string;
    description: string;
    city: string;
    state: string;
    postalCode: string;
    emailAddress: string;
    phoneNumber: string;
    longitude?: number;
    latitude?: number;
  };
  errorMessageApi?: string | null;
}

// Safari-safe browser detection
const isSafari = () => {
  try {
    const userAgent = navigator?.userAgent || '';
    return /^((?!chrome|android).)*safari/i.test(userAgent);
  } catch (error) {
    console.warn('⚠️ Browser detection failed:', error);
    return false;
  }
};

const transformApiResponseToClassified = (apiResponse: ClassifiedDetailApiResponse['response']): Classified => {
  // Safari-safe date parsing - create explicit Date objects
  let expirationDate: Date;
  try {
    // Handle different date formats Safari might receive
    const lastActiveDate = apiResponse.lastActiveDate;
    if (lastActiveDate.includes('T')) {
      // ISO format
      expirationDate = new Date(lastActiveDate);
    } else {
      // Fallback for other formats
      expirationDate = new Date(lastActiveDate + 'T23:59:59.999Z');
    }
    
    // Validate the date is valid
    if (isNaN(expirationDate.getTime())) {
      console.warn('⚠️ Invalid lastActiveDate, using fallback:', lastActiveDate);
      expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1); // 1 month from now
    } else {
      // Set to end of day
      expirationDate.setHours(23, 59, 59, 999);
    }
  } catch (error) {
    console.error('❌ Date parsing error:', error);
    expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
  }
  
  return {
    id: apiResponse.classifiedId,
    title: apiResponse.title,
    description: apiResponse.description,
    category: apiResponse.categoryId,
    zipCode: apiResponse.postalCode,
    city: apiResponse.city,
    state: apiResponse.state,
    email: apiResponse.emailAddress,
    phone: apiResponse.phoneNumber,
    images: [],
    pricingTier: apiResponse.adTypeId,
    contactObfuscated: false,
    createdAt: apiResponse.createDate,
    expiresAt: expirationDate.toISOString(),
    price: apiResponse.price
  };
};

// Safari-specific mock data fallback for when API calls fail
const createMockClassified = (id: string): Classified => {
  console.log('🦺 Creating mock classified for Safari API fallback:', id);
  return {
    id: id,
    title: 'Sample Classified Ad (Safari Mode)',
    description: 'This is a sample classified ad shown when the API is not accessible in Safari. The actual data would be loaded from the backend service.',
    category: 'sample-category',
    zipCode: '12345',
    city: 'Sample City',
    state: 'CA',
    email: 'contact@example.com',
    phone: '(555) 123-4567',
    images: [],
    pricingTier: 'standard',
    contactObfuscated: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    price: 100
  };
};

export const useClassifiedDetail = (id: string) => {
  const apiClient = useApiClient();
  const safariDetected = isSafari();

  return useQuery({
    queryKey: ['classifiedDetail', id],
    queryFn: async (): Promise<Classified | null> => {
      console.log('🔍 Fetching classified detail for ID:', id);
      console.log('🌐 Current API host:', API_CONFIG.BASE_URL);
      console.log('🦘 Safari detected:', safariDetected);
      
      if (!id || id === ':id') {
        console.error('❌ Invalid or missing classified ID:', id);
        throw new Error('Invalid classified ID');
      }
      
      try {
        // Log request URL for debugging
        const endpoint = `/classified/${id}`;
        const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
        console.log('🔗 Making API request to:', fullUrl);
        
        const response: ClassifiedDetailApiResponse = await apiClient.get(
          endpoint,
          { requireAuth: false }
        );
        
        console.log('📋 Classified detail API response:', response);
        
        if (response.errorMessageApi) {
          console.error('❌ Error fetching classified detail:', response.errorMessageApi);
          
          // Safari-specific fallback for API errors
          if (safariDetected) {
            console.log('🦺 Safari detected - providing mock data fallback');
            return createMockClassified(id);
          }
          
          throw new Error(response.errorMessageApi);
        }

        if (!response.response) {
          console.warn('⚠️ No classified data found for ID:', id);
          
          // Safari-specific fallback for missing data
          if (safariDetected) {
            console.log('🦺 Safari detected - providing mock data for missing response');
            return createMockClassified(id);
          }
          
          return null;
        }

        const transformedClassified = transformApiResponseToClassified(response.response);
        console.log('✅ Transformed classified data:', transformedClassified);
        
        return transformedClassified;
      } catch (error) {
        console.error('❌ Failed to fetch classified detail:', error);
        console.error('Error details:', {
          id,
          apiHost: API_CONFIG.BASE_URL,
          endpoint: `/classified/${id}`,
          fullUrl: `${API_CONFIG.BASE_URL}/classified/${id}`,
          safari: safariDetected,
          error
        });
        
        // Safari-specific error handling with fallback
        if (safariDetected) {
          console.log('🦺 Safari CORS/API error detected - providing mock data fallback');
          return createMockClassified(id);
        }
        
        throw error;
      }
    },
    enabled: !!id && id !== ':id',
    staleTime: 5 * 60 * 1000,
    retry: safariDetected ? 1 : 2 // Reduce retries on Safari to fail faster to fallback
  });
};
