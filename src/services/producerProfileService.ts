
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
  const response = await fetch(getApiUrl(`/producer/${lineOfBusinessId}/profiles`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch producer profiles: ${response.status}`);
  }
  
  return response.json();
};
