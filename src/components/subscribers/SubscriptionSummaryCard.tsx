
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { SubscriptionWithFormatting } from '@/types/subscription';

interface SubscriptionSummaryCardProps {
  selectedSubscription: SubscriptionWithFormatting;
}

const SubscriptionSummaryCard = ({ selectedSubscription }: SubscriptionSummaryCardProps) => {
  console.log('SubscriptionSummaryCard - Rendering with subscription:', selectedSubscription);

  const {
    displayName,
    annualBillAmount,
    monthlyAutopayAmount,
    formattedFeatures,
    shortDescription
  } = selectedSubscription;

  // Use the actual annual bill amount from the subscription
  const displayPrice = annualBillAmount || monthlyAutopayAmount * 12;
  const billingPeriod = annualBillAmount ? 'year' : 'month';
  const periodPrice = annualBillAmount || monthlyAutopayAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-greenyp-700">Subscription Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-greenyp-50 rounded-lg">
          <h3 className="text-2xl font-bold text-greenyp-700 mb-2">{displayName}</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ${periodPrice}
            <span className="text-lg font-normal text-gray-600">/{billingPeriod}</span>
          </div>
          {billingPeriod === 'year' && (
            <p className="text-sm text-gray-600">Billed annually</p>
          )}
          {shortDescription && (
            <p className="text-sm text-gray-600 mt-2">{shortDescription}</p>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
          <ul className="space-y-2">
            {formattedFeatures.map((feature) => (
              <li key={feature.id} className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-greenyp-600 mr-2 flex-shrink-0" />
                {feature.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center font-semibold">
            <span>Total:</span>
            <span className="text-lg">${periodPrice}/{billingPeriod}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSummaryCard;
