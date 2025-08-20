
import { getApiUrl } from '@/config/api';

export interface ProducerListing {
  producerId: string;
  producerLocationId: string;
  businessName: string;
  phone: string;
  city: string;
  state: string;
  websiteUrl: string;
  iconLink: string;
}

export interface ProducerListingsResponse {
  response: ProducerListing[];
  errorMessageApi: {
    errorCode: string;
    displayMessage: string;
    errorDetails: string;
  } | null;
}

export const fetchProducerProfiles = async (lineOfBusinessId: string): Promise<ProducerListingsResponse> => {
  const response = await fetch(getApiUrl(`/producer/profiles?lineOfBusinessId=${lineOfBusinessId}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch producer profiles: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Transform the API response to match the expected ProducerListing type
  if (data.response && Array.isArray(data.response)) {
    const transformedResponse = data.response.map((producer: any) => ({
      producerId: producer.producerId || '',
      producerLocationId: producer.producerLocationId || '',
      businessName: producer.businessName || 'Business Name Not Available',
      phone: producer.phone || '',
      city: producer.city || '',
      state: producer.state || '',
      websiteUrl: producer.websiteUrl || '',
      iconLink: producer.iconLink || '/placeholder-logo.png' // Default placeholder if no icon
    }));
    
    return {
      ...data,
      response: transformedResponse
    };
  }
  
  return data;
};

export const fetchProducerProfilesByLobUrl = async (lobUrl: string, mostRecent: boolean = true, number: number = 6): Promise<ProducerListingsResponse> => {
  const response = await fetch(getApiUrl(`/producer/profiles?lobUrl=${lobUrl}&mostRecent=${mostRecent}&number=${number}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch producer profiles: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Transform the API response to match the expected ProducerListing type
  if (data.response && Array.isArray(data.response)) {
    const transformedResponse = data.response.map((producer: any) => ({
      producerId: producer.producerId || '',
      producerLocationId: producer.producerLocationId || '',
      businessName: producer.businessName || 'Business Name Not Available',
      phone: producer.phone || '',
      city: producer.city || '',
      state: producer.state || '',
      websiteUrl: producer.websiteUrl || '',
      iconLink: producer.iconLink || '/placeholder-logo.png' // Default placeholder if no icon
    }));
    
    return {
      ...data,
      response: transformedResponse
    };
  }
  
  return data;
};
