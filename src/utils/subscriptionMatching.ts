
import { APISubscription } from '@/types/subscription';

export const findSubscriptionMatch = (
  subscriptions: APISubscription[] | undefined, 
  selectedPlan: string
): APISubscription | null => {
  console.log('🔍 Finding subscription match for plan:', selectedPlan);
  
  if (!subscriptions || !Array.isArray(subscriptions) || subscriptions.length === 0) {
    console.warn('❌ No subscriptions available for matching');
    return null;
  }

  if (!selectedPlan || selectedPlan.trim() === '') {
    console.warn('❌ No plan provided for matching');
    return null;
  }

  const normalizedPlan = selectedPlan.toLowerCase().trim();
  
  // Try exact ID match first
  let match = subscriptions.find(sub => 
    sub.subscriptionId.toLowerCase() === normalizedPlan
  );
  
  if (match) {
    console.log('✅ Found exact ID match:', match.subscriptionId);
    return match;
  }

  // Try display name match
  match = subscriptions.find(sub => 
    sub.displayName.toLowerCase() === normalizedPlan
  );
  
  if (match) {
    console.log('✅ Found display name match:', match.displayName);
    return match;
  }

  // Try partial matches for common plan names
  const planMappings = [
    { keywords: ['basic', 'starter'], priority: 1 },
    { keywords: ['premium', 'professional', 'pro'], priority: 2 },
    { keywords: ['enterprise', 'business'], priority: 3 }
  ];

  for (const mapping of planMappings) {
    if (mapping.keywords.some(keyword => normalizedPlan.includes(keyword))) {
      match = subscriptions.find(sub => 
        mapping.keywords.some(keyword => 
          sub.displayName.toLowerCase().includes(keyword) ||
          sub.subscriptionId.toLowerCase().includes(keyword)
        )
      );
      
      if (match) {
        console.log('✅ Found keyword match:', match.displayName, 'for keywords:', mapping.keywords);
        return match;
      }
    }
  }

  console.warn('❌ No subscription match found for plan:', selectedPlan);
  console.log('📋 Available subscriptions:', subscriptions.map(sub => ({
    id: sub.subscriptionId,
    name: sub.displayName
  })));
  
  return null;
};

export const getDefaultSubscription = (
  subscriptions: APISubscription[] | undefined
): APISubscription | null => {
  if (!subscriptions || !Array.isArray(subscriptions) || subscriptions.length === 0) {
    return null;
  }

  // Sort by sortOrder if available, then by price
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }
    return (a.monthlyAutopayAmount || 0) - (b.monthlyAutopayAmount || 0);
  });

  console.log('📋 Default subscription selected:', sortedSubscriptions[0].displayName);
  return sortedSubscriptions[0];
};

export const validateSubscriptionData = (subscription: APISubscription | null): boolean => {
  if (!subscription) {
    console.warn('❌ Subscription validation failed: no subscription provided');
    return false;
  }

  const required = ['subscriptionId', 'displayName'];
  const missing = required.filter(field => !subscription[field as keyof APISubscription]);
  
  if (missing.length > 0) {
    console.warn('❌ Subscription validation failed: missing fields:', missing);
    return false;
  }

  console.log('✅ Subscription validation passed');
  return true;
};
