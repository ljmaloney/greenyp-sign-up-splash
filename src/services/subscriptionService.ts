
import { apiClient } from '@/config/api';
import { APISubscription, SubscriptionWithFormatting } from '@/types/subscription';

export const fetchSubscriptions = async (): Promise<SubscriptionWithFormatting[]> => {
  const response = await apiClient.get<APISubscription[]>('/subscriptions');
  
  return response.data.map(subscription => ({
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
