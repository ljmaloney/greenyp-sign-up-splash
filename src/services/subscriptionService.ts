
import { apiClient } from '@/utils/apiClient';
import { APISubscription, SubscriptionWithFormatting } from '@/types/subscription';

export const fetchSubscriptions = async (): Promise<SubscriptionWithFormatting[]> => {
  const response = await apiClient.get<APISubscription[]>('/subscriptions');
  
  // Handle the ApiResponse structure - the actual data should be in response.response
  const subscriptions = response.response || [];
  
  return subscriptions.map(subscription => ({
    ...subscription,
    formattedMonthlyPrice: subscription.monthlyAutopayAmount === 0 
      ? "Free" 
      : `$${subscription.monthlyAutopayAmount.toFixed(2)}`,
    formattedAnnualPrice: subscription.annualAutopayAmount === 0 
      ? "Free" 
      : `$${subscription.annualAutopayAmount.toFixed(2)}`,
    formattedSetupFee: subscription.setupFee === 0 
      ? "No setup fee" 
      : `$${subscription.setupFee.toFixed(2)} setup fee`
  }));
};
