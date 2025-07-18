
import { SubscriptionWithFormatting } from '@/types/subscription';

export const findSubscriptionMatch = (
  subscriptions: SubscriptionWithFormatting[] | undefined,
  subscriptionId: string | null
): SubscriptionWithFormatting | null => {
  if (!subscriptions || !subscriptionId) {
    console.log('❌ No subscriptions data or subscription ID provided:', {
      hasSubscriptions: !!subscriptions,
      subscriptionId,
      subscriptionsCount: subscriptions?.length
    });
    return null;
  }

  console.log('🔍 Looking for subscription match:', {
    subscriptionId,
    subscriptionIdLength: subscriptionId.length,
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
  if (!subscription) {
    console.log('❌ Subscription validation failed: No subscription data');
    return false;
  }
  
  // Check for required fields with multiple possible field names
  const hasSubscriptionId = !!(subscription.subscriptionId);
  const hasDisplayName = !!(subscription.displayName || subscription.subscriptionDisplayName);
  
  // Check for price fields - API uses monthlyAutopayAmount, some contexts may use monthlyPrice
  const hasPrice = !!(
    subscription.monthlyAutopayAmount !== undefined || 
    subscription.monthlyPrice !== undefined ||
    subscription.price !== undefined
  );

  const hasRequiredFields = hasSubscriptionId && hasDisplayName && hasPrice;

  console.log('🔍 Subscription validation details:', {
    hasSubscriptionId,
    hasDisplayName,
    hasPrice,
    hasRequiredFields,
    subscriptionId: subscription.subscriptionId,
    displayName: subscription.displayName || subscription.subscriptionDisplayName,
    monthlyAutopayAmount: subscription.monthlyAutopayAmount,
    monthlyPrice: subscription.monthlyPrice,
    price: subscription.price,
    fullData: subscription
  });

  return hasRequiredFields;
};
