
import { getApiUrl } from '@/config/api';

export interface Subscription {
  subscriptionId: string;
  displayName: string;
  shortDescription: string;
  subscriptionAmount: number;
  subscriptionType: string;
  invoiceCycleType: string;
}

export interface SubscriptionResponse {
  response: Subscription[];
  errorMessageApi: string | null;
}

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  console.log('🔍 Fetching subscription data');
  
  const url = getApiUrl('/reference/subscription');
  console.log(`📡 API URL: ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`❌ Subscription API failed: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch subscription data: ${response.statusText}`);
  }

  const data: SubscriptionResponse = await response.json();
  console.log('✅ Subscription data received:', data);

  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi);
  }

  return data.response;
};
