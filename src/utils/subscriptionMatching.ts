
import { APISubscription, SubscriptionWithFormatting } from '@/types/subscription';

export const findSubscriptionMatch = (
  subscriptions: APISubscription[] | undefined, 
  selectedPlan: string
): SubscriptionWithFormatting | null => {
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
    return formatSubscription(match);
  }

  // Try display name match
  match = subscriptions.find(sub => 
    sub.displayName.toLowerCase() === normalizedPlan
  );
  
  if (match) {
    console.log('✅ Found display name match:', match.displayName);
    return formatSubscription(match);
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
        return formatSubscription(match);
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
): SubscriptionWithFormatting | null => {
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
  return formatSubscription(sortedSubscriptions[0]);
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

export const validateAndNormalizeSubscriptionData = (rawData: any): { isValid: boolean; normalizedData: APISubscription | null } => {
  console.log('🔍 Validating and normalizing subscription data:', rawData);
  
  if (!rawData || typeof rawData !== 'object') {
    console.warn('❌ Invalid subscription data: not an object');
    return { isValid: false, normalizedData: null };
  }

  // Check required fields
  const requiredFields = ['subscriptionId', 'displayName'];
  const hasRequiredFields = requiredFields.every(field => rawData[field]);
  
  if (!hasRequiredFields) {
    console.warn('❌ Missing required fields in subscription data');
    return { isValid: false, normalizedData: null };
  }

  // Normalize the data
  const normalizedData: APISubscription = {
    subscriptionId: rawData.subscriptionId,
    version: rawData.version || 1,
    createDate: rawData.createDate || new Date().toISOString(),
    lastUpdateDate: rawData.lastUpdateDate || new Date().toISOString(),
    displayName: rawData.displayName,
    endDate: rawData.endDate || '',
    lineOfBusinessId: rawData.lineOfBusinessId || null,
    monthlyAutopayAmount: rawData.monthlyAutopayAmount || 0,
    quarterlyAutopayAmount: rawData.quarterlyAutopayAmount || 0,
    annualBillAmount: rawData.annualBillAmount || 0,
    shortDescription: rawData.shortDescription || '',
    htmlDescription: rawData.htmlDescription || '',
    startDate: rawData.startDate || new Date().toISOString(),
    subscriptionType: rawData.subscriptionType || 'LIVE_UNPAID',
    comingSoon: rawData.comingSoon || false,
    sortOrder: rawData.sortOrder || 0,
    features: rawData.features || []
  };

  console.log('✅ Subscription data validated and normalized');
  return { isValid: true, normalizedData };
};

const formatSubscription = (subscription: APISubscription): SubscriptionWithFormatting => {
  return {
    ...subscription,
    formattedMonthlyPrice: `$${subscription.monthlyAutopayAmount || 0}`,
    formattedYearlyPrice: subscription.annualBillAmount ? `$${subscription.annualBillAmount}` : undefined,
    formattedFeatures: subscription.features?.map(feature => ({
      id: feature.feature,
      name: feature.featureName,
      description: feature.featureName
    })) || []
  };
};
