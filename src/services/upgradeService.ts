
import { getApiUrl } from '@/config/api';

interface UpgradeSubscriptionRequest {
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

export const upgradeSubscription = async (data: UpgradeSubscriptionRequest): Promise<void> => {
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
