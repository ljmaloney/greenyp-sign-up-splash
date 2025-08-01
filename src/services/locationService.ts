
import { apiClient } from '@/utils/apiClient';

export interface LocationHour {
  locationHoursId?: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  closed: boolean;
}

export interface Location {
  locationId: string;
  producerId: string;
  createDate: string;
  lastUpdateDate: string;
  locationName: string;
  locationType: string;
  locationDisplayType: string;
  active: boolean;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  websiteUrl: string;
  locationHours: LocationHour[];
}

export interface LocationsResponse {
  response: Location[];
  errorMessageApi: string | null;
}

// Create a function that accepts an API client for dependency injection
export const createLocationService = (authenticatedApiClient: any) => ({
  async fetchLocations(producerId: string): Promise<Location[]> {
    console.log('🌍 Fetching locations for producer:', producerId);
    
    const endpoint = `/producer/${producerId}/locations?activeOnly=false&includeHours=true`;
    
    try {
      const data: LocationsResponse = await authenticatedApiClient.get(endpoint, { requireAuth: true });
      
      console.log('🌍 Locations response:', data);
      
      if (data.errorMessageApi) {
        throw new Error(data.errorMessageApi);
      }
      
      return data.response || [];
    } catch (error) {
      console.error('❌ Failed to fetch locations:', error);
      throw error;
    }
  },

  async updateLocation(locationData: any): Promise<any> {
    console.log('🏢 Updating location:', locationData);
    
    const endpoint = '/producer/location';
    
    try {
      const response = await authenticatedApiClient.put(endpoint, locationData, { requireAuth: true });
      
      if (response.error) {
        throw new Error(`Failed to update location: ${response.error}`);
      }
      
      console.log('✅ Location updated successfully');
      return response.response;
    } catch (error) {
      console.error('❌ Failed to update location:', error);
      throw error;
    }
  }
});

// Legacy function - will be deprecated in favor of authenticated version
export const fetchLocations = async (producerId: string): Promise<Location[]> => {
  console.log('⚠️ Using legacy fetchLocations - should use authenticated version');
  
  const endpoint = `/producer/${producerId}/locations?activeOnly=false&includeHours=true`;
  
  try {
    const data: LocationsResponse = await apiClient.get(endpoint);
    
    console.log('🌍 Locations response:', data);
    
    if (data.errorMessageApi) {
      throw new Error(data.errorMessageApi);
    }
    
    return data.response || [];
  } catch (error) {
    console.error('❌ Failed to fetch locations:', error);
    throw error;
  }
};
