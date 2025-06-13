
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { Subscription } from '@/services/accountService';

interface SubscriptionCardProps {
  subscriptions: Subscription[];
}

const SubscriptionCard = ({ subscriptions }: SubscriptionCardProps) => {
  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Active Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.subscriptionId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{subscription.displayName}</h4>
                  <p className="text-sm text-gray-600">{subscription.shortDescription}</p>
                </div>
                <Badge variant="outline">
                  ${subscription.subscriptionAmount}/{subscription.invoiceCycleType.toLowerCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Start Date:</span>
                  <p>{new Date(subscription.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Next Invoice:</span>
                  <p>{new Date(subscription.nextInvoiceDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
