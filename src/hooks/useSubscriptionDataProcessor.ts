
import { useMemo } from 'react';
import type { SubscriptionWithFormatting } from '@/types/subscription';

export const useSubscriptionDataProcessor = (subscriptions: SubscriptionWithFormatting[] | undefined) => {
  const processedSubscriptions = useMemo(() => {
    if (!subscriptions) return [];
    
    return subscriptions.map(subscription => {
      // Sort features by sortOrder
      const sortedFeatures = [...subscription.formattedFeatures].sort((a, b) => {
        // Find the original feature to get sortOrder
        const featureA = subscription.features.find(f => f.feature === a.id);
        const featureB = subscription.features.find(f => f.feature === b.id);
        return (featureA?.sortOrder || 0) - (featureB?.sortOrder || 0);
      });

      return {
        ...subscription,
        formattedFeatures: sortedFeatures.filter(feature => {
          // Find the original feature to check display flag
          const originalFeature = subscription.features.find(f => f.feature === feature.id);
          return originalFeature?.display !== false;
        })
      };
    });
  }, [subscriptions]);

  return processedSubscriptions;
};
