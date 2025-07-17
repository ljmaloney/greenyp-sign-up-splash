
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { SubscriptionWithFormatting } from '@/types/subscription';

interface SubscriptionSummaryCardProps {
  selectedSubscription?: SubscriptionWithFormatting;
  apiSubscriptionData?: any;
}

const SubscriptionSummaryCard = ({ selectedSubscription, apiSubscriptionData }: SubscriptionSummaryCardProps) => {
  console.log('SubscriptionSummaryCard - Input props:', { 
    hasSelectedSubscription: !!selectedSubscription,
    hasApiSubscriptionData: !!apiSubscriptionData,
    selectedSubscriptionId: selectedSubscription?.subscriptionId,
    apiSubscriptionId: apiSubscriptionData?.subscriptionId
  });

  // Prefer API subscription data if available, otherwise fall back to reference data
  const hasApiData = !!apiSubscriptionData;
  const hasReferenceData = !!selectedSubscription;
  
  if (!hasApiData && !hasReferenceData) {
    console.warn('⚠️ SubscriptionSummaryCard - No subscription data provided');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loading subscription details...</p>
        </CardContent>
      </Card>
    );
  }

  // Extract subscription details based on data source
  let subscriptionName = 'Selected Plan';
  let monthlyPrice = 0;
  let features = [];
  let dataSource = 'unknown';

  if (hasApiData) {
    // Use API data if available (this is the producer's actual subscription)
    dataSource = 'API';
    subscriptionName = apiSubscriptionData.subscriptionDisplayName || 
                      apiSubscriptionData.displayName || 
                      'Selected Plan';
    
    // Handle different possible price field names from API
    monthlyPrice = apiSubscriptionData.monthlyAutopayAmount || 
                   apiSubscriptionData.monthlyPrice || 
                   apiSubscriptionData.price || 
                   0;
    
    console.log('📊 API subscription price extraction:', {
      monthlyAutopayAmount: apiSubscriptionData.monthlyAutopayAmount,
      monthlyPrice: apiSubscriptionData.monthlyPrice,
      price: apiSubscriptionData.price,
      finalPrice: monthlyPrice
    });
    
    if (apiSubscriptionData.features) {
      features = apiSubscriptionData.features
        .filter((f: any) => f.display)
        .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
        .map((f: any) => ({
          id: f.feature,
          name: f.featureName || f.feature,
          description: f.feature
        }));
    }
  } else if (hasReferenceData) {
    // Fall back to reference data (this is from the cached subscription list)
    dataSource = 'Reference';
    subscriptionName = selectedSubscription.displayName;
    monthlyPrice = selectedSubscription.monthlyAutopayAmount;
    features = selectedSubscription.formattedFeatures || [];
  }
  
  // Ensure price is a valid number and format it
  const numericPrice = typeof monthlyPrice === 'number' ? monthlyPrice : 0;
  const formattedPrice = `$${(numericPrice / 100).toFixed(2)}`;

  console.log('📋 SubscriptionSummaryCard - Display data:', {
    dataSource,
    subscriptionName,
    monthlyPrice: numericPrice,
    formattedPrice,
    featuresCount: features.length,
    features: features.map(f => f.name)
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-green-800">{subscriptionName}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formattedPrice}
            <span className="text-lg font-normal text-gray-600">/month</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Data source: {dataSource}
          </p>
        </div>

        {features.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Included Features:</h4>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature.id} className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Your subscription will be activated immediately after payment is processed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSummaryCard;
