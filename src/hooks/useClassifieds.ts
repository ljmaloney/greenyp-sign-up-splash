
import { useQuery } from '@tanstack/react-query';
import { Classified, ClassifiedFilters } from '@/types/classifieds';
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

// Mock data as fallback - only used when API fails
const mockClassifieds: Classified[] = [
  {
    id: 'mock-1',
    title: 'Sample Classified Ad',
    description: 'This is a sample classified ad to show the layout when no real ads are available.',
    category: 'Miscellaneous Farm & Garden',
    zipCode: '12345',
    city: 'Sample City',
    state: 'CA',
    email: 'sample@email.com',
    phone: '(555) 123-4567',
    images: [],
    pricingTier: 'standard',
    contactObfuscated: false,
    createdAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-02-15T10:00:00Z',
    price: 100,
    perUnitType: 'item'
  }
];

const fetchClassifieds = async (filters: ClassifiedFilters, apiClient: any): Promise<Classified[]> => {
  console.log('Fetching classifieds with filters:', filters);
  
  // If no filters are applied, get recent classifieds from API
  const hasFilters = filters.category || filters.zipCode || filters.keyword;
  
  if (!hasFilters) {
    try {
      const response: ApiResponse = await apiClient.get('/classified/mostRecent?number=9');
      
      console.log('API Response for classifieds:', response);
      
      // Check if we have a successful response with data
      if (response.response && Array.isArray(response.response) && response.response.length > 0) {
        console.log(`Found ${response.response.length} classifieds from API`);
        return response.response.map(convertToClassified);
      }
      
      // If API returns no data, show mock data
      console.log('No classifieds found from API, showing mock data');
      return mockClassifieds;
    } catch (error) {
      console.log('API error, showing mock data:', error);
      return mockClassifieds;
    }
  }
  
  // For filtered searches, use mock data for now (could be replaced with filtered API endpoint later)
  let filtered = mockClassifieds;

  if (filters.category) {
    filtered = filtered.filter(c => c.category === filters.category);
  }

  if (filters.zipCode) {
    filtered = filtered.filter(c => c.zipCode.includes(filters.zipCode!));
  }

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(keyword) ||
      c.description.toLowerCase().includes(keyword)
    );
  }

  return filtered;
};

export const useClassifieds = (filters: ClassifiedFilters) => {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: ['classifieds', filters],
    queryFn: () => fetchClassifieds(filters, apiClient),
    staleTime: 5 * 60 * 1000,
  });
};
