
import { Classified, ClassifiedFilters } from '@/types/classifieds';
import { ClassifiedSearchResponse, ApiResponse } from '@/types/api';
import { convertToClassified } from '@/utils/classifiedsConverter';

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

export const fetchClassifieds = async (filters: ClassifiedFilters, apiClient: any): Promise<Classified[]> => {
  console.log('Fetching classifieds with filters:', filters);
  
  // Check if we have any search filters that require the search endpoint
  const hasSearchFilters = filters.category || filters.zipCode || filters.keyword || filters.maxMiles;
  
  if (hasSearchFilters) {
    try {
      // Build search query parameters
      const searchParams = new URLSearchParams();
      if (filters.zipCode) searchParams.set('postalCode', filters.zipCode);
      if (filters.maxMiles) searchParams.set('distance', filters.maxMiles.toString());
      if (filters.category) searchParams.set('categoryId', filters.category);
      if (filters.keyword) searchParams.set('keywords', filters.keyword);
      searchParams.set('page', '0');
      searchParams.set('limit', '15');

      const response: any = await apiClient.get(`/classified/search?${searchParams.toString()}`);
      
      console.log('Search API Response for classifieds:', response);
      
      // Check the actual response structure - could be response.response or response.responseList
      let classifiedsList = null;
      
      if (response.response && Array.isArray(response.response)) {
        classifiedsList = response.response;
        console.log(`Found ${classifiedsList.length} classifieds from search API (response.response)`);
      } else if (response.responseList && Array.isArray(response.responseList)) {
        classifiedsList = response.responseList;
        console.log(`Found ${classifiedsList.length} classifieds from search API (response.responseList)`);
      } else {
        console.log('No classifieds array found in response:', Object.keys(response));
      }
      
      if (classifiedsList && classifiedsList.length > 0) {
        return classifiedsList.map(convertToClassified);
      }
      
      // If search API returns no data, return empty array
      console.log('No classifieds found from search API');
      return [];
    } catch (error) {
      console.log('Search API error, showing mock data:', error);
      return mockClassifieds;
    }
  }
  
  // If no search filters, get recent classifieds from API
  try {
    const response: ApiResponse = await apiClient.get('/classified/mostRecent?number=9');
    
    console.log('API Response for recent classifieds:', response);
    
    // Check if we have a successful response with data
    if (response.response && Array.isArray(response.response) && response.response.length > 0) {
      console.log(`Found ${response.response.length} recent classifieds from API`);
      return response.response.map(convertToClassified);
    }
    
    // If API returns no data, show mock data
    console.log('No recent classifieds found from API, showing mock data');
    return mockClassifieds;
  } catch (error) {
    console.log('API error, showing mock data:', error);
    return mockClassifieds;
  }
};
