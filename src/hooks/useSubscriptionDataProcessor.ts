
import { useMemo } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { findSubscriptionMatch, validateAndNormalizeSubscriptionData } from '@/utils/subscriptionMatching';
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
    console.log('🔄 Processing subscription data with enhanced validation:', {
      subscriptionId,
      hasSubscriptionDataParam: !!subscriptionDataParam,
      subscriptionsLoading,
      subscriptionsError: subscriptionsError?.message
    });

    // Parse and validate API subscription data if available
    let apiSubscriptionData = null;
    let processingError = null;

    if (subscriptionDataParam) {
      try {
        const rawApiData = JSON.parse(subscriptionDataParam);
        console.log('📥 Raw API subscription data parsed:', rawApiData);
        
        // Use enhanced validation with normalization
        const { isValid, normalizedData } = validateAndNormalizeSubscriptionData(rawApiData);
        
        if (isValid && normalizedData) {
          apiSubscriptionData = normalizedData;
          console.log('✅ API subscription data validated and normalized successfully');
        } else {
          console.warn('⚠️ API subscription data validation failed after normalization attempt');
          console.log('🔍 Validation failure details:', {
            rawData: rawApiData,
            normalizedData: normalizedData,
            isValid: isValid
          });
          
          // Don't immediately fail - let reference data be the fallback
          processingError = 'API subscription data format is invalid, using reference data as fallback';
        }
      } catch (error) {
        console.error('❌ Failed to parse subscription data from URL:', error);
        processingError = 'Failed to parse subscription data from URL';
      }
    }

    // Find reference subscription data
    const selectedSubscription = findSubscriptionMatch(subscriptions, subscriptionId);

    // Determine data source and validity with improved fallback logic
    let dataSource: 'API' | 'Reference' | 'None' = 'None';
    let hasValidSubscriptionData = false;

    if (apiSubscriptionData) {
      dataSource = 'API';
      hasValidSubscriptionData = true;
      console.log('✅ Using validated API subscription data');
    } else if (selectedSubscription) {
      dataSource = 'Reference';
      hasValidSubscriptionData = true;
      console.log('✅ Using reference subscription data as fallback');
      
      // Clear the processing error if we have valid reference data as fallback
      if (processingError && processingError.includes('using reference data as fallback')) {
        processingError = null;
      }
    } else if (subscriptionsError) {
      processingError = `Failed to load subscriptions: ${subscriptionsError.message}`;
      console.error('❌ Subscriptions loading error:', subscriptionsError.message);
    } else if (subscriptionsLoading && !apiSubscriptionData) {
      // Still loading, don't mark as error yet
      dataSource = 'None';
      console.log('⏳ Still loading subscription data');
    } else {
      processingError = 'No valid subscription data found';
      console.error('❌ No valid subscription data available');
    }

    console.log('📊 Enhanced subscription data processing result:', {
      dataSource,
      hasValidSubscriptionData,
      hasApiData: !!apiSubscriptionData,
      hasReferenceData: !!selectedSubscription,
      processingError,
      stillLoading: subscriptionsLoading && !apiSubscriptionData,
      fallbackUsed: dataSource === 'Reference' && subscriptionDataParam
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
