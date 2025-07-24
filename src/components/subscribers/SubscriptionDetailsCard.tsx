
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Check, Clock } from 'lucide-react';
import { SubscriptionWithFormatting } from '@/types/subscription';

interface SubscriptionDetailsCardProps {
  subscription: SubscriptionWithFormatting | null;
  isLoading?: boolean;
}

const SubscriptionDetailsCard = ({ subscription, isLoading }: SubscriptionDetailsCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No subscription details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Subscription Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{subscription.displayName}</h3>
            {subscription.popular && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Popular
              </span>
            )}
            {subscription.comingSoon && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Coming Soon
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-3">{subscription.shortDescription}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              {subscription.formattedMonthlyPrice}
            </span>
            <span className="text-gray-500">/month</span>
            {subscription.formattedYearlyPrice && (
              <span className="text-sm text-gray-500">
                (${subscription.formattedYearlyPrice}/year)
              </span>
            )}
          </div>
        </div>
        
        {subscription.formattedFeatures && subscription.formattedFeatures.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Features included:</h4>
            <ul className="space-y-1">
              {subscription.formattedFeatures.map((feature) => (
                <li key={feature.id} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionDetailsCard;
