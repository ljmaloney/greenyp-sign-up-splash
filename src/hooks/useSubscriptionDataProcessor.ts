
import { useMemo } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { findSubscriptionMatch, validateSubscriptionData } from '@/utils/subscriptionMatching';
import { SubscriptionWithFormatting } from '@/types/subscription';

interface ProcessedSubscriptionData {
  selectedSubscription: SubscriptionWithFormatting | null;
  apiSubscriptionData: any | null;
  hasValidSubscriptionData: boolean;
  dataSource: 'API' | 'Reference' | 'None';
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
    console.log('🔄 Processing subscription data:', {
      subscriptionId,
      hasSubscriptionDataParam: !!subscriptionDataParam,
      subscriptionsLoading,
      subscriptionsError: subscriptionsError?.message
    });

    // Parse API subscription data if available
    let apiSubscriptionData = null;
    let processingError = null;

    if (subscriptionDataParam) {
      try {
        apiSubscriptionData = JSON.parse(subscriptionDataParam);
        console.log('✅ Parsed API subscription data:', apiSubscriptionData);
        
        const isValidApiData = validateSubscriptionData(apiSubscriptionData);
        if (!isValidApiData) {
          console.warn('⚠️ API subscription data is invalid');
          apiSubscriptionData = null;
          processingError = 'Invalid API subscription data format';
        }
      } catch (error) {
        console.error('❌ Failed to parse subscription data from URL:', error);
        apiSubscriptionData = null;
        processingError = 'Failed to parse subscription data';
      }
    }

    // Find reference subscription data
    const selectedSubscription = findSubscriptionMatch(subscriptions, subscriptionId);

    // Determine data source and validity
    let dataSource: 'API' | 'Reference' | 'None' = 'None';
    let hasValidSubscriptionData = false;

    if (apiSubscriptionData) {
      dataSource = 'API';
      hasValidSubscriptionData = true;
    } else if (selectedSubscription) {
      dataSource = 'Reference';
      hasValidSubscriptionData = true;
    } else if (subscriptionsError) {
      processingError = `Failed to load subscriptions: ${subscriptionsError.message}`;
    } else if (subscriptionsLoading && !apiSubscriptionData) {
      // Still loading, don't mark as error yet
      dataSource = 'None';
    } else {
      processingError = 'No valid subscription data found';
    }

    console.log('📊 Subscription data processing result:', {
      dataSource,
      hasValidSubscriptionData,
      hasApiData: !!apiSubscriptionData,
      hasReferenceData: !!selectedSubscription,
      processingError,
      stillLoading: subscriptionsLoading && !apiSubscriptionData
    });

    return {
      selectedSubscription,
      apiSubscriptionData,
      hasValidSubscriptionData,
      dataSource,
      processingError
    };
  }, [subscriptionId, subscriptionDataParam, subscriptions, subscriptionsLoading, subscriptionsError]);
};
