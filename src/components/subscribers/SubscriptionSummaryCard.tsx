
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, DollarSign } from 'lucide-react';

interface SubscriptionSummaryCardProps {
  businessName: string;
  subscriptionPlan: string;
  subscriptionPrice: string;
  producerId: string;
}

const SubscriptionSummaryCard = ({
  businessName,
  subscriptionPlan,
  subscriptionPrice,
  producerId
}: SubscriptionSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Subscription Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Business</p>
          <p className="font-medium">{businessName}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Plan</p>
          <p className="font-medium">{subscriptionPlan}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Monthly Price</p>
            <p className="font-semibold text-lg">{subscriptionPrice}/month</p>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Producer ID: {producerId}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSummaryCard;
