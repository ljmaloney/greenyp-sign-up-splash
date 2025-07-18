
import { useMemo } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { findSubscriptionMatch, validateAndNormalizeSubscriptionData } from '@/utils/subscriptionMatching';
import { SubscriptionWithFormatting } from '@/types/subscription';

interface ProcessedSubscriptionData {
  selectedSubscription: SubscriptionWithFormatting | null;
  apiSubscriptionData: any | null;
  hasValidSubscriptionData: boolean;
  dataSource: 'API' | 'Reference' | 'FirstAvailable' | 'None';
  processingError: string | null;
}

interface UseSubscriptionDataProcessorProps {
  subscriptionId: string | null;
  subscriptionDataParam: string | null;
}

export const useSubscriptionDataProcessor = ({
  subscriptionId,
  subscriptionDataParam
}: UseSubscriptionDataProcessorProps): ProcessedSubscriptionData => {
  const { data: subscriptions, isLoading: subscriptionsLoading, error: subscriptionsError } = useSubscriptions();

  return useMemo(() => {
    console.log('🔄 Enhanced subscription data processing starting:', {
      subscriptionId,
      hasSubscriptionDataParam: !!subscriptionDataParam,
      subscriptionsLoading,
      subscriptionsError: subscriptionsError?.message,
      availableSubscriptions: subscriptions?.length || 0
    });

    // Parse and validate API subscription data if available
    let apiSubscriptionData = null;
    let processingError = null;

    if (subscriptionDataParam) {
      try {
        const rawApiData = JSON.parse(subscriptionDataParam);
        console.log('📥 Raw API subscription data parsed:', rawApiData);
        
        const { isValid, normalizedData } = validateAndNormalizeSubscriptionData(rawApiData);
        
        if (isValid && normalizedData) {
          apiSubscriptionData = normalizedData;
          console.log('✅ API subscription data validated and normalized successfully');
        } else {
          console.warn('⚠️ API subscription data validation failed, continuing with reference fallback');
        }
      } catch (error) {
        console.warn('⚠️ Failed to parse subscription data from URL, continuing with reference fallback:', error);
      }
    }

    // Find reference subscription data
    const selectedSubscription = findSubscriptionMatch(subscriptions, subscriptionId);

    // Enhanced fallback logic - determine best available data source
    let dataSource: 'API' | 'Reference' | 'FirstAvailable' | 'None' = 'None';
    let hasValidSubscriptionData = false;

    if (apiSubscriptionData) {
      dataSource = 'API';
      hasValidSubscriptionData = true;
      console.log('✅ Using validated API subscription data');
    } else if (selectedSubscription) {
      dataSource = 'Reference';
      hasValidSubscriptionData = true;
      console.log('✅ Using reference subscription data');
    } else if (!subscriptionsLoading && subscriptions && subscriptions.length > 0) {
      // Ultimate fallback: use the first available subscription
      dataSource = 'FirstAvailable';
      hasValidSubscriptionData = true;
      console.log('⚠️ Using first available subscription as ultimate fallback:', subscriptions[0]);
    } else if (subscriptionsError) {
      processingError = `Failed to load subscriptions: ${subscriptionsError.message}`;
      console.error('❌ Subscriptions loading error:', subscriptionsError.message);
    } else if (subscriptionsLoading) {
      // Still loading, don't mark as error yet
      console.log('⏳ Still loading subscription data');
    } else {
      processingError = 'No subscription data available';
      console.error('❌ No valid subscription data found');
    }

    // For the "FirstAvailable" fallback, we'll return the first subscription as selectedSubscription
    let finalSelectedSubscription = selectedSubscription;
    if (dataSource === 'FirstAvailable' && subscriptions && subscriptions.length > 0) {
      finalSelectedSubscription = subscriptions[0];
      console.log('🔄 Using first available subscription:', finalSelectedSubscription);
    }

    console.log('📊 Enhanced subscription data processing result:', {
      dataSource,
      hasValidSubscriptionData,
      hasApiData: !!apiSubscriptionData,
      hasReferenceData: !!selectedSubscription,
      usingFirstAvailable: dataSource === 'FirstAvailable',
      processingError,
      stillLoading: subscriptionsLoading,
      totalSubscriptions: subscriptions?.length || 0
    });

    return {
      selectedSubscription: finalSelectedSubscription,
      apiSubscriptionData,
      hasValidSubscriptionData,
      dataSource,
      processingError
    };
  }, [subscriptionId, subscriptionDataParam, subscriptions, subscriptionsLoading, subscriptionsError]);
};
