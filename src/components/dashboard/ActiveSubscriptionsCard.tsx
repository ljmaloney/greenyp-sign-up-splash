
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

  // Show all subscriptions, not just future ones - let the badge indicate status
  const displaySubscriptions = subscriptions || [];
  
  // Check if any subscriptions are LIVE_UNPAID to determine the title
  const hasUnpaidSubscriptions = displaySubscriptions.some(sub => sub.subscriptionType === 'LIVE_UNPAID');
  const cardTitle = hasUnpaidSubscriptions ? 'Pending Subscriptions' : 'Active Subscriptions';

  // Function to determine badge variant based on subscription type and dates
  const getBadgeVariant = (subscription: Subscription) => {
    if (subscription.subscriptionType === 'LIVE_UNPAID') {
      return 'destructive';
    }
    
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    
    if (endDate < today) {
      return 'outline'; // Expired
    }
    
    return 'default'; // Active
  };

  const getBadgeText = (subscription: Subscription) => {
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    
    if (subscription.subscriptionType === 'LIVE_UNPAID') {
      return 'PENDING PAYMENT';
    }
    
    if (endDate < today) {
      return 'EXPIRED';
    }
    
    return subscription.subscriptionType.replace('_', ' ');
  };

  console.log('Subscriptions data:', displaySubscriptions);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-greenyp-600">
          <Calendar className="h-5 w-5" />
          {cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displaySubscriptions.length === 0 ? (
          <p className="text-gray-600">No subscriptions found</p>
        ) : (
          <div className="space-y-4">
            {displaySubscriptions.map((subscription) => (
              <div key={subscription.subscriptionId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{subscription.displayName}</h4>
                    <p className="text-sm text-gray-600">{subscription.shortDescription}</p>
                  </div>
                  <Badge variant={getBadgeVariant(subscription)}>
                    {getBadgeText(subscription)}
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
