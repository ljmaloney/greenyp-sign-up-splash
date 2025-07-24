
import { apiClient } from '@/utils/apiClient';
import type { APISubscription, SubscriptionWithFormatting } from '@/types/subscription';

export const fetchSubscriptions = async (): Promise<SubscriptionWithFormatting[]> => {
  const response = await apiClient.get<APISubscription[]>('/subscriptions');
  
  return response.response.map(subscription => ({
    ...subscription,
    formattedMonthlyPrice: subscription.monthlyAutopayAmount === 0 
      ? "Free" 
      : `$${subscription.monthlyAutopayAmount}`,
    formattedYearlyPrice: subscription.annualBillAmount 
      ? `$${subscription.annualBillAmount}` 
      : undefined,
    formattedFeatures: subscription.features.map(feature => ({
      id: feature.feature,
      name: feature.featureName,
      description: feature.featureName
    })),
    popular: subscription.subscriptionId === 'premium' // or whatever logic determines popularity
  }));
};
