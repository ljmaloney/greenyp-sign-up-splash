
import { apiClient } from '@/utils/apiClient';
import { APISubscription, SubscriptionWithFormatting, SubscriptionFeature } from '@/types/subscription';

export const fetchSubscriptions = async (): Promise<SubscriptionWithFormatting[]> => {
  const response = await apiClient.get<APISubscription[]>('/subscriptions');
  
  // Handle the ApiResponse structure - the actual data should be in response.response
  const subscriptions = response.response || [];
  
  return subscriptions.map(subscription => ({
    ...subscription,
    formattedMonthlyPrice: subscription.monthlyAutopayAmount === 0 
      ? "Free" 
      : `$${subscription.monthlyAutopayAmount.toFixed(2)}`,
    formattedAnnualPrice: subscription.annualBillAmount === 0 
      ? "Free" 
      : `$${subscription.annualBillAmount.toFixed(2)}`,
    formattedSetupFee: "No setup fee", // Since setupFee doesn't exist on APISubscription
    formattedFeatures: subscription.features
      .filter(feature => feature.display)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(feature => ({
        id: feature.feature,
        name: feature.featureName,
        description: feature.featureName
      })) as SubscriptionFeature[]
  }));
};
