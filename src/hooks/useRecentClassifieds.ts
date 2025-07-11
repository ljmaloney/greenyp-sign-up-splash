
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

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
  response: RecentClassifiedResponse[];
  errorMessageApi: string | null;
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

// Dummy ad to display when no results
const dummyAd = {
  id: 'dummy-1',
  title: 'Farm Fresh Vegetables',
  description: 'Fresh, locally grown vegetables available year-round. Perfect for your family meals and healthy lifestyle.',
  category: 'Produce',
  zipCode: '30014',
  city: 'Covington',
  state: 'GA',
  email: 'farmer@example.com',
  phone: '(555) 123-4567',
  images: [],
  pricingTier: 'basic',
  contactObfuscated: false,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  price: 15,
  perUnitType: 'Basket'
};

const fetchRecentClassifieds = async (apiClient: any) => {
  try {
    const response: ApiResponse = await apiClient.get('/classified/mostRecent?number=9');
    
    if (response.response && response.response.length > 0) {
      return response.response.map(convertToClassified);
    } else {
      // Return dummy ad if no results
      return [dummyAd];
    }
  } catch (error) {
    console.error('Error fetching recent classifieds:', error);
    // Return dummy ad on error
    return [dummyAd];
  }
};

export const useRecentClassifieds = () => {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: ['recent-classifieds'],
    queryFn: () => fetchRecentClassifieds(apiClient),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
