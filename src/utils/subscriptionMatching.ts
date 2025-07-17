
import { SubscriptionWithFormatting } from '@/types/subscription';

export const findSubscriptionMatch = (
  subscriptions: SubscriptionWithFormatting[] | undefined,
  subscriptionId: string | null
): SubscriptionWithFormatting | null => {
  if (!subscriptions || !subscriptionId) {
    console.log('❌ No subscriptions data or subscription ID provided');
    return null;
  }

  console.log('🔍 Looking for subscription match:', {
    subscriptionId,
    availableSubscriptions: subscriptions.map(sub => ({
      id: sub.subscriptionId,
      name: sub.displayName
    }))
  });

  // First try exact match
  let match = subscriptions.find(sub => sub.subscriptionId === subscriptionId);
  
  if (match) {
    console.log('✅ Found exact subscription match:', match.displayName);
    return match;
  }

  // Try case-insensitive match
  match = subscriptions.find(sub => 
    sub.subscriptionId.toLowerCase() === subscriptionId.toLowerCase()
  );
  
  if (match) {
    console.log('✅ Found case-insensitive subscription match:', match.displayName);
    return match;
  }

  // Try partial match (in case of URL encoding issues)
  match = subscriptions.find(sub => 
    sub.subscriptionId.includes(subscriptionId) || subscriptionId.includes(sub.subscriptionId)
  );
  
  if (match) {
    console.log('✅ Found partial subscription match:', match.displayName);
    return match;
  }

  console.log('❌ No subscription match found for:', subscriptionId);
  return null;
};

export const validateSubscriptionData = (subscription: any): boolean => {
  if (!subscription) return false;
  
  const hasRequiredFields = !!(
    subscription.subscriptionId &&
    subscription.displayName &&
    subscription.monthlyPrice !== undefined
  );

  console.log('🔍 Subscription validation:', {
    hasRequiredFields,
    subscriptionId: subscription.subscriptionId,
    displayName: subscription.displayName,
    monthlyPrice: subscription.monthlyPrice
  });

  return hasRequiredFields;
};
