
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign } from 'lucide-react';
import { Subscription } from '@/services/accountService';

interface ActiveSubscriptionsCardProps {
  subscriptions: Subscription[];
}

const ActiveSubscriptionsCard = ({ subscriptions }: ActiveSubscriptionsCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const activeSubscriptions = subscriptions.filter(sub => {
    const endDate = new Date(sub.endDate);
    const today = new Date();
    return endDate > today;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-greenyp-600">
          <Calendar className="h-5 w-5" />
          Active Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeSubscriptions.length === 0 ? (
          <p className="text-gray-600">No active subscriptions</p>
        ) : (
          <div className="space-y-4">
            {activeSubscriptions.map((subscription) => (
              <div key={subscription.subscriptionId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{subscription.displayName}</h4>
                    <p className="text-sm text-gray-600">{subscription.shortDescription}</p>
                  </div>
                  <Badge variant={subscription.subscriptionType === 'LIVE_UNPAID' ? 'destructive' : 'default'}>
                    {subscription.subscriptionType.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatCurrency(subscription.subscriptionAmount)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Billing:</span>
                      <span className="font-medium">{subscription.invoiceCycleType}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{formatDate(subscription.startDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{formatDate(subscription.endDate)}</span>
                    </div>
                    
                    {subscription.nextInvoiceDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Next Invoice:</span>
                        <span className="font-medium">{formatDate(subscription.nextInvoiceDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveSubscriptionsCard;
