
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { SubscriptionWithFormatting } from '@/types/subscription';

interface SubscriptionSummaryCardProps {
  selectedSubscription?: SubscriptionWithFormatting;
  apiSubscriptionData?: any;
}

const SubscriptionSummaryCard = ({ selectedSubscription, apiSubscriptionData }: SubscriptionSummaryCardProps) => {
  console.log('SubscriptionSummaryCard - Props:', { selectedSubscription, apiSubscriptionData });

  // Prefer API subscription data if available, otherwise fall back to reference data
  const hasApiData = !!apiSubscriptionData;
  const hasReferenceData = !!selectedSubscription;
  
  if (!hasApiData && !hasReferenceData) {
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

  if (hasApiData) {
    // Use API data if available
    subscriptionName = apiSubscriptionData.subscriptionDisplayName || 
                      apiSubscriptionData.displayName || 
                      'Selected Plan';
    
    monthlyPrice = apiSubscriptionData.monthlyAutopayAmount || 0;
    
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
    // Fall back to reference data
    subscriptionName = selectedSubscription.displayName;
    monthlyPrice = selectedSubscription.monthlyAutopayAmount;
    features = selectedSubscription.formattedFeatures || [];
  }
  
  const formattedPrice = `$${(monthlyPrice / 100).toFixed(2)}`;

  console.log('SubscriptionSummaryCard - Display data:', {
    subscriptionName,
    monthlyPrice,
    formattedPrice,
    featuresCount: features.length,
    features,
    dataSource: hasApiData ? 'API' : 'Reference'
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
