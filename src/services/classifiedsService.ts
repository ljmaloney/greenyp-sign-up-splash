
import { Classified, ClassifiedFilters } from '@/types/classifieds';
import { ClassifiedSearchResponse, ApiResponse } from '@/types/api';
import { convertToClassified } from '@/utils/classifiedsConverter';

// No mock data - return empty array when API fails or returns no results

export const fetchClassifieds = async (filters: ClassifiedFilters, apiClient: any, categoryName?: string): Promise<Classified[]> => {
  console.log('Fetching classifieds with filters:', filters, 'categoryName:', categoryName);
  
  // If we have a categoryName (from category page) and no search filters, use mostRecent
  const hasSearchFilters = filters.zipCode || filters.keyword || filters.maxMiles;
  
  if (!hasSearchFilters && categoryName) {
    console.log('🔥 Using mostRecent API for category:', categoryName);
    try {
      const params = new URLSearchParams();
      params.set('number', '9');
      params.set('categoryName', categoryName);
      
      console.log('🔥 mostRecent API URL:', `/classified/mostRecent?${params.toString()}`);
      const response: ApiResponse = await apiClient.get(`/classified/mostRecent?${params.toString()}`);
      
      console.log('mostRecent API Response:', response);
      
      if (response.response && Array.isArray(response.response) && response.response.length > 0) {
        console.log(`Found ${response.response.length} recent classifieds from API`);
        return response.response.map(convertToClassified);
      }
      
      console.log('No recent classifieds found from API, returning empty array');
      return [];
    } catch (error) {
      console.log('mostRecent API error, returning empty array:', error);
      return [];
    }
  }
  
  // If we have search filters, use search API
  if (hasSearchFilters) {
    try {
      const searchParams = new URLSearchParams();
      if (filters.zipCode) searchParams.set('postalCode', filters.zipCode);
      if (filters.maxMiles) searchParams.set('distance', filters.maxMiles.toString());
      if (filters.selectedCategory) searchParams.set('category', filters.selectedCategory);
      if (filters.keyword) searchParams.set('keywords', filters.keyword);
      searchParams.set('page', '0');
      searchParams.set('limit', '15');

      console.log('🔥 Using search API with params:', searchParams.toString());
      const response: any = await apiClient.get(`/classified/search?${searchParams.toString()}`);
      
      console.log('Search API Response:', response);
      
      // Handle the wrapped API response
      if (response.response && Array.isArray(response.response.searchResults) && response.response.searchResults.length > 0) {
        console.log(`Found ${response.response.searchResults.length} classifieds from search API`);
        return response.response.searchResults.map(convertToClassified);
      }
      
      console.log('No classifieds found from search API, returning empty array');
      return [];
    } catch (error) {
      console.log('Search API error, returning empty array:', error);
      return [];
    }
  }
  
  // Fallback: if no filters and no categoryName, get all recent classifieds
  console.log('🔥 No search filters or categoryName - calling mostRecent for all categories');
  try {
    const params = new URLSearchParams();
    params.set('number', '9');
    // No categoryName parameter = get from all categories
    
    console.log('🔥 mostRecent API URL (all categories):', `/classified/mostRecent?${params.toString()}`);
    const response: ApiResponse = await apiClient.get(`/classified/mostRecent?${params.toString()}`);
    
    console.log('mostRecent API Response (all categories):', response);
    
    if (response.response && Array.isArray(response.response) && response.response.length > 0) {
      console.log(`Found ${response.response.length} recent classifieds from all categories`);
      return response.response.map(convertToClassified);
    }
    
    console.log('No recent classifieds found from API, returning empty array');
    return [];
  } catch (error) {
    console.log('mostRecent API error (all categories), returning empty array:', error);
    return [];
  }
};
