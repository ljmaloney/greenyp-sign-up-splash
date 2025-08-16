
import { Classified, ClassifiedFilters } from '@/types/classifieds';
import { ClassifiedSearchResponse, ApiResponse } from '@/types/api';
import { convertToClassified } from '@/utils/classifiedsConverter';

// No mock data - return empty array when API fails or returns no results

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
      if (filters.category) searchParams.set('category', filters.category);
      if (filters.keyword) searchParams.set('keywords', filters.keyword);
      searchParams.set('page', '0');
      searchParams.set('limit', '15');

      console.log('Making search API call with params:', searchParams.toString());
      
      // The apiClient.get() returns a wrapped response: { response: actualData, status, success }
      const apiResponse = await apiClient.get(`/classified/search?${searchParams.toString()}`);
      
      console.log('Raw API Response wrapper:', apiResponse);
      console.log('Actual search response data:', apiResponse.response);
      
      // Access the actual search response data from the wrapper
      const searchResponse: ClassifiedSearchResponse = apiResponse.response;
      
      // Now check for responseList in the actual search response
      if (searchResponse && searchResponse.responseList && Array.isArray(searchResponse.responseList) && searchResponse.responseList.length > 0) {
        console.log(`Found ${searchResponse.responseList.length} classifieds from search API`);
        return searchResponse.responseList.map(convertToClassified);
      }
      
      // If search API returns no data, return empty array
      console.log('No classifieds found from search API');
      return [];
    } catch (error) {
      console.log('Search API error, returning empty array:', error);
      return [];
    }
  }
  
  // If no search filters, get recent classifieds from API
  try {
    const params = new URLSearchParams('number=9');
    console.log('🔥 DEBUG - filters.selectedCategory:', filters.selectedCategory);
    if (filters.selectedCategory) {
      console.log('🔥 DEBUG - Adding category parameter:', filters.selectedCategory);
      params.set('categoryId', filters.selectedCategory);
    } else {
      console.log('🔥 DEBUG - No selectedCategory found in filters');
    }
    console.log('🔥 DEBUG - Final API URL:', `/classified/mostRecent?${params.toString()}`);
    const response: ApiResponse = await apiClient.get(`/classified/mostRecent?${params.toString()}`);
    
    console.log('API Response for recent classifieds:', response);
    
    // Check if we have a successful response with data
    if (response.response && Array.isArray(response.response) && response.response.length > 0) {
      console.log(`Found ${response.response.length} recent classifieds from API`);
      return response.response.map(convertToClassified);
    }
    
    // If API returns no data, return empty array
    console.log('No recent classifieds found from API, returning empty array');
    return [];
  } catch (error) {
    console.log('API error, returning empty array:', error);
    return [];
  }
};
