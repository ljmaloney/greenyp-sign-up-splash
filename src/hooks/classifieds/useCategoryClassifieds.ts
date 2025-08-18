// src/hooks/useCategoryClassifieds.ts

import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';

interface CategoryClassifiedResponse {
  classifiedId: string;
  activeDate: string;
  lastActiveDate: string;
  adTypeId: string;
  categoryId: string;
  categoryName: string;
  price: number;
  perUnitType: string;
  title: string;
  description: string;
  city: string;
  state: string;
  postalCode: string;
  emailAddress: string;
  phoneNumber: string;
  obscureContactInfo: boolean;
  imageName: string | null;
  url: string | null;
  longitude: number;
  latitude: number;
}

interface ApiResponse {
  response: CategoryClassifiedResponse[] | null;
  errorMessageApi: any | null;
}

// Convert API response to our existing Classified interface
const convertToClassified = (item: CategoryClassifiedResponse) => ({
  id: item.classifiedId,
  title: item.title,
  description: item.description,
  category: item.categoryName,
  zipCode: item.postalCode,
  city: item.city,
  state: item.state,
  email: item.emailAddress,
  phone: item.phoneNumber,
  images: item.url ? [item.url] : [],
  pricingTier: item.adTypeId,
  contactObfuscated: item.obscureContactInfo,
  createdAt: item.activeDate + 'T00:00:00Z',
  expiresAt: item.lastActiveDate + 'T00:00:00Z',
  price: item.price,
  perUnitType: item.perUnitType
});

const fetchCategoryClassifieds = async (apiClient: any, urlName: string) => {
  console.log('Fetching classifieds for category:', urlName);
  
  // Use query parameters instead of path parameters - backend expects 'categoryName' parameter
  const response: ApiResponse = await apiClient.get(`/classified/mostRecent?number=20&categoryName=${urlName}`);
  
  console.log('Category API Response:', response);
  
  // Check if we have a successful response with data
  if (response.response && Array.isArray(response.response) && response.response.length > 0) {
    console.log(`Found ${response.response.length} classifieds for category ${urlName}`);
    return response.response.map(convertToClassified);
  }
  
  // If there's an API error or no data, return empty array
  console.log('No classifieds found or API error for category:', urlName, response.errorMessageApi);
  return [];
};

export const useCategoryClassifieds = (urlName: string | undefined) => {
  const apiClient = useApiClient();
  
  console.log('🏷️ useCategoryClassifieds hook called with urlName:', urlName);
  
  return useQuery({
    queryKey: ['category-classifieds', urlName],
    queryFn: () => {
      console.log('🚀 Executing fetchCategoryClassifieds for:', urlName);
      return fetchCategoryClassifieds(apiClient, urlName!);
    },
    enabled: !!urlName,
    staleTime: 0, // Always fetch fresh data to ensure API calls are made
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
