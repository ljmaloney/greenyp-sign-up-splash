
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign } from 'lucide-react';
import { Subscription } from '@/services/accountService';

interface ActiveSubscriptionsCardProps {
  subscriptions: Subscription[];
  producerSubscriptionType?: string;
}

const ActiveSubscriptionsCard = ({ subscriptions, producerSubscriptionType }: ActiveSubscriptionsCardProps) => {
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

  const getSubscriptionStatus = (subscription: Subscription) => {
    // Check if producer subscription type is LIVE_UNPAID
    if (producerSubscriptionType === 'LIVE_UNPAID') {
      return 'Pending';
    }
    
    // Check if subscription has ended
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    
    if (endDate <= today) {
      return 'Expired';
    }
    
    // Default to Active for valid subscriptions
    return 'Active';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'outline';
      case 'Expired':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Show all subscriptions from the JSON payload, don't filter by expiration for display purposes
  const displaySubscriptions = subscriptions || [];

  console.log('🔍 ActiveSubscriptionsCard - All Subscriptions from JSON:', subscriptions);
  console.log('🔍 ActiveSubscriptionsCard - Producer Subscription Type:', producerSubscriptionType);
  console.log('🔍 ActiveSubscriptionsCard - Display Subscriptions:', displaySubscriptions);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-greenyp-600">
          <Calendar className="h-5 w-5" />
          Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displaySubscriptions.length === 0 ? (
          <p className="text-gray-600">No subscriptions found</p>
        ) : (
          <div className="space-y-4">
            {displaySubscriptions.map((subscription) => {
              const status = getSubscriptionStatus(subscription);
              return (
                <div key={subscription.subscriptionId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{subscription.displayName}</h4>
                      <p className="text-sm text-gray-600">{subscription.shortDescription}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(status)}>
                      {status}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-greenyp-600" />
                        <span className="text-gray-600 font-semibold">Amount:</span>
                        <span className="font-medium">{formatCurrency(subscription.subscriptionAmount)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-greenyp-600" />
                        <span className="text-gray-600 font-semibold">Billing:</span>
                        <span className="font-medium">{subscription.invoiceCycleType}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-greenyp-600" />
                        <span className="text-gray-600 font-semibold">Start Date:</span>
                        <span className="font-medium">{formatDate(subscription.startDate)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-greenyp-600" />
                        <span className="text-gray-600 font-semibold">End Date:</span>
                        <span className="font-medium">{formatDate(subscription.endDate)}</span>
                      </div>

                      {subscription.nextInvoiceDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-greenyp-600" />
                          <span className="text-gray-600 font-semibold">Next Invoice:</span>
                          <span className="font-medium">{formatDate(subscription.nextInvoiceDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveSubscriptionsCard;
