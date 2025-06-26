
import { getApiUrl } from '@/config/api';

interface UpgradeSubscriptionRequest {
  producerId: string;
  producerRequest: {
    producerId: string;
    businessName: string;
    lineOfBusinessId: string;
    subscriptionId: string;
    subscriptionType: string;
    invoiceCycleType: string;
    websiteUrl: string;
    narrative: string;
  };
}

// Create a function that accepts an API client for dependency injection
export const createUpgradeService = (apiClient: any) => ({
  async upgradeSubscription(data: UpgradeSubscriptionRequest): Promise<void> {
    return apiClient.put('/account', data, { requireAuth: true });
  }
});

// Legacy function for backward compatibility - will be deprecated
export const upgradeSubscription = async (data: UpgradeSubscriptionRequest): Promise<void> => {
  console.log('⚠️ Using legacy upgradeSubscription - consider using authenticated version');
  const response = await fetch(getApiUrl('/account'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to upgrade subscription: ${response.status}`);
  }
};
