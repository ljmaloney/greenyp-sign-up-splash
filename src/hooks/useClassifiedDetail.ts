
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { Classified } from '@/types/classifieds';

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
  // Create a proper ISO date string for expiration
  const expirationDate = new Date(apiResponse.lastActiveDate);
  expirationDate.setHours(23, 59, 59, 999); // Set to end of day
  
  return {
    id: apiResponse.classifiedId,
    title: apiResponse.title,
    description: apiResponse.description,
    category: apiResponse.categoryId, // Use the actual categoryId from API
    zipCode: apiResponse.postalCode,
    city: apiResponse.city,
    state: apiResponse.state,
    email: apiResponse.emailAddress,
    phone: apiResponse.phoneNumber,
    images: [], // Images will be fetched separately using useClassifiedImages
    pricingTier: apiResponse.adTypeId,
    contactObfuscated: false, // Default value, will be determined by ad package
    createdAt: apiResponse.createDate,
    expiresAt: expirationDate.toISOString(),
    price: apiResponse.price // Add the actual price from the API
  };
};

export const useClassifiedDetail = (id: string) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['classifiedDetail', id],
    queryFn: async (): Promise<Classified | null> => {
      console.log('🔍 Fetching classified detail for ID:', id);
      
      if (!id || id === ':id') {
        console.error('❌ Invalid or missing classified ID:', id);
        throw new Error('Invalid classified ID');
      }
      
      try {
        const response: ClassifiedDetailApiResponse = await apiClient.get(
          `/classified/${id}`,
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
        throw error;
      }
    },
    enabled: !!id && id !== ':id',
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
};
