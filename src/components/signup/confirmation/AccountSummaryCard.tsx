
import React from 'react';
import { CheckCircle, Building, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountSummaryCardProps {
  businessName: string;
  lineOfBusiness: string;
  subscriptionPlan: string;
  subscriptionPrice: string;
  subscriptionType: string;
  producerId: string;
}

const AccountSummaryCard = ({
  businessName,
  lineOfBusiness,
  subscriptionPlan,
  subscriptionPrice,
  subscriptionType,
  producerId
}: AccountSummaryCardProps) => {
  // Format subscription type for display
  const formatSubscriptionType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-800 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Account Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Business Name</p>
          <p className="font-semibold">{businessName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 flex items-center">
            <Building className="h-4 w-4 mr-1" />
            Line of Business
          </p>
          <p className="font-semibold text-blue-600">{lineOfBusiness}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 flex items-center">
            <Package className="h-4 w-4 mr-1" />
            Subscription Plan
          </p>
          <p className="font-semibold text-green-600">
            {subscriptionPlan}
            {subscriptionPrice && subscriptionPrice !== '$0' && (
              <span className="text-sm text-gray-600 ml-2">({subscriptionPrice}/month)</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Account ID</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">{producerId}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSummaryCard;
