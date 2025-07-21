
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
  
  console.log('🔍 Raw subscription data for validation:', {
    type: typeof subscription,
    keys: Object.keys(subscription),
    fullData: subscription
  });

  // Check for required fields with multiple possible field names and flexible validation
  const subscriptionIdVariants = [
    subscription.subscriptionId,
    subscription.id,
    subscription.subscription_id
  ].filter(Boolean);
  
  const displayNameVariants = [
    subscription.displayName,
    subscription.subscriptionDisplayName,
    subscription.name,
    subscription.title
  ].filter(Boolean);
  
  // Check for price fields - be more flexible with number types and handle string numbers
  const priceVariants = [
    subscription.monthlyAutopayAmount,
    subscription.monthlyPrice,
    subscription.price,
    subscription.amount,
    subscription.cost
  ].filter(val => val !== undefined && val !== null && val !== '');

  const hasSubscriptionId = subscriptionIdVariants.length > 0;
  const hasDisplayName = displayNameVariants.length > 0;
  const hasPrice = priceVariants.length > 0;

  // Additional validation for price values - ensure they're valid numbers
  let hasValidPrice = false;
  if (hasPrice) {
    hasValidPrice = priceVariants.some(price => {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      return !isNaN(numPrice) && numPrice >= 0;
    });
  }

  const hasRequiredFields = hasSubscriptionId && hasDisplayName && hasValidPrice;

  console.log('🔍 Enhanced subscription validation details:', {
    hasSubscriptionId,
    hasDisplayName,
    hasPrice,
    hasValidPrice,
    hasRequiredFields,
    subscriptionIdVariants,
    displayNameVariants,
    priceVariants,
    validationResult: hasRequiredFields
  });

  // If basic validation fails, try to provide more specific error information
  if (!hasRequiredFields) {
    const missingFields = [];
    if (!hasSubscriptionId) missingFields.push('subscriptionId');
    if (!hasDisplayName) missingFields.push('displayName');
    if (!hasValidPrice) missingFields.push('valid price');
    
    console.warn('⚠️ Subscription validation failed - missing fields:', {
      missingFields,
      availableFields: Object.keys(subscription),
      suggestion: 'Check if the API response structure matches expected format'
    });
  }

  return hasRequiredFields;
};

// New helper function to transform API subscription data to expected format
export const normalizeSubscriptionData = (apiData: any): any => {
  if (!apiData) {
    console.log('❌ No API data to normalize');
    return null;
  }

  console.log('🔄 Normalizing API subscription data:', apiData);

  // Create a normalized object with fallbacks for different field names
  const normalized = {
    subscriptionId: apiData.subscriptionId || apiData.id || apiData.subscription_id,
    displayName: apiData.displayName || apiData.subscriptionDisplayName || apiData.name || apiData.title,
    monthlyAutopayAmount: apiData.monthlyAutopayAmount || apiData.monthlyPrice || apiData.price || apiData.amount || apiData.cost,
    // Preserve all original fields for compatibility
    ...apiData
  };

  console.log('✅ Normalized subscription data:', {
    original: apiData,
    normalized: normalized,
    isValid: validateSubscriptionData(normalized)
  });

  return normalized;
};

// Enhanced validation with automatic normalization
export const validateAndNormalizeSubscriptionData = (subscription: any): { isValid: boolean; normalizedData: any } => {
  console.log('🔍 Starting validation and normalization process');
  
  if (!subscription) {
    return { isValid: false, normalizedData: null };
  }

  // First try direct validation
  const directValid = validateSubscriptionData(subscription);
  if (directValid) {
    console.log('✅ Direct validation passed');
    return { isValid: true, normalizedData: subscription };
  }

  // If direct validation fails, try normalization
  console.log('🔄 Direct validation failed, attempting normalization');
  const normalizedData = normalizeSubscriptionData(subscription);
  
  if (!normalizedData) {
    console.log('❌ Normalization failed');
    return { isValid: false, normalizedData: null };
  }

  const normalizedValid = validateSubscriptionData(normalizedData);
  
  console.log('📊 Final validation result:', {
    directValid,
    normalizedValid,
    finalResult: normalizedValid
  });

  return { isValid: normalizedValid, normalizedData: normalizedValid ? normalizedData : null };
};
