
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface SubscriptionSummaryCardProps {
  planName: string;
  planPrice: number;
}

const SubscriptionSummaryCard = ({ planName, planPrice }: SubscriptionSummaryCardProps) => {
  const features = [
    'Business directory listing',
    'Enhanced search visibility',
    'Customer contact management',
    'Business analytics dashboard',
    'Priority customer support'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-greenyp-700">Subscription Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-greenyp-50 rounded-lg">
          <h3 className="text-2xl font-bold text-greenyp-700 mb-2">{planName}</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ${planPrice}
            <span className="text-lg font-normal text-gray-600">/year</span>
          </div>
          <p className="text-sm text-gray-600">Billed annually</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-greenyp-600 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center font-semibold">
            <span>Total:</span>
            <span className="text-lg">${planPrice}/year</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSummaryCard;
