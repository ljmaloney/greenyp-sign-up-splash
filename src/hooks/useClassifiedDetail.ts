
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

export const useClassifiedDetail = (id: string) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['classifiedDetail', id],
    queryFn: async (): Promise<Classified | null> => {
      console.log('🔍 Fetching classified detail for ID:', id);
      console.log('🌐 Current API host:', API_CONFIG.BASE_URL);
      
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
          throw new Error(response.errorMessageApi);
        }

        if (!response.response) {
          console.warn('⚠️ No classified data found for ID:', id);
          return null;
        }

        const transformedClassified = transformApiResponseToClassified(response.response);
        console.log('✅ Transformed classified data:', transformedClassified);
        
        return transformedClassified;
      } catch (error) {
        console.error('❌ Failed to fetch classified detail:', error);
        // Log more details about the error for debugging
        console.error('Error details:', {
          id,
          apiHost: API_CONFIG.BASE_URL,
          endpoint: `/classified/${id}`,
          fullUrl: `${API_CONFIG.BASE_URL}/classified/${id}`,
          error
        });
        throw error;
      }
    },
    enabled: !!id && id !== ':id',
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
};
