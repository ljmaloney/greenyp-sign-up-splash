
import { getApiUrl } from '@/config/api';

export interface LocationHour {
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

export const fetchLocations = async (producerId: string): Promise<Location[]> => {
  const url = getApiUrl(`/producer/${producerId}/locations?activeOnly=false&includeHours=true`);
  
  console.log('🌍 Fetching locations from:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status} ${response.statusText}`);
  }
  
  const data: LocationsResponse = await response.json();
  
  console.log('🌍 Locations response:', data);
  
  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi);
  }
  
  return data.response;
};
