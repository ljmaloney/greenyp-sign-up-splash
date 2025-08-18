
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';

interface RecentClassifiedResponse {
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
  response: RecentClassifiedResponse[] | null;
  errorMessageApi: any | null;
}

// Convert API response to our existing Classified interface
const convertToClassified = (item: RecentClassifiedResponse) => ({
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

const fetchRecentClassifieds = async (apiClient: any) => {
  console.log('Fetching recent classifieds...');
  
  const response: ApiResponse = await apiClient.get('/classified/mostRecent?number=9');
  
  console.log('API Response:', response);
  
  // Check if we have a successful response with data
  if (response.response && Array.isArray(response.response) && response.response.length > 0) {
    console.log(`Found ${response.response.length} classifieds`);
    return response.response.map(convertToClassified);
  }
  
  // If there's an API error or no data, return empty array
  console.log('No classifieds found or API error:', response.errorMessageApi);
  return [];
};

export const useRecentClassifieds = () => {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: ['recent-classifieds'],
    queryFn: () => fetchRecentClassifieds(apiClient),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
