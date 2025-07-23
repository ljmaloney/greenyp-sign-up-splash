
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, User, Building } from 'lucide-react';

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
          <DollarSign className="h-5 w-5" />
          Subscription Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-500" />
          <div>
            <span className="text-sm text-gray-500">Business:</span>
            <p className="font-medium">{businessName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <span className="text-sm text-gray-500">Plan:</span>
            <p className="font-medium">{subscriptionPlan}</p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <span>Producer ID: {producerId}</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Monthly Total:</span>
            <span className="font-bold text-lg">{subscriptionPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSummaryCard;
