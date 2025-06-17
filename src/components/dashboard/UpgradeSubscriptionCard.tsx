
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, Check } from 'lucide-react';
import { SubscriptionWithFormatting } from '@/types/subscription';

interface UpgradeSubscriptionCardProps {
  subscription: SubscriptionWithFormatting;
  onUpgrade: (subscriptionId: string, subscriptionName: string) => void;
}

const UpgradeSubscriptionCard = ({ subscription, onUpgrade }: UpgradeSubscriptionCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="relative w-full max-w-sm min-w-0 flex flex-col h-full">
      {subscription.popular && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-greenyp-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 min-w-0">
          <Crown className="h-5 w-5 text-greenyp-600 flex-shrink-0" />
          <span className="truncate">{subscription.displayName}</span>
          {subscription.comingSoon && (
            <span className="text-yellow-600 text-sm font-normal whitespace-nowrap flex-shrink-0">Coming Soon</span>
          )}
        </CardTitle>
        <p className="text-gray-600 text-sm line-clamp-2">{subscription.shortDescription}</p>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-grow">
        <div className="flex flex-col flex-grow space-y-4">
          {!subscription.comingSoon && (
            <div className="text-center">
              <div className="text-3xl font-bold text-greenyp-600 whitespace-nowrap">
                {subscription.monthlyAutopayAmount === 0 
                  ? 'Free' 
                  : formatCurrency(subscription.monthlyAutopayAmount)
                }
              </div>
              <div className="text-gray-500 whitespace-nowrap">
                {subscription.monthlyAutopayAmount === 0 ? 'for first month' : 'per month'}
              </div>
              {subscription.annualBillAmount && (
                <div className="text-sm text-gray-500 mt-1 whitespace-nowrap">
                  or {formatCurrency(subscription.annualBillAmount)} annually
                </div>
              )}
            </div>
          )}
          
          <div className="flex-grow">
            <h4 className="font-medium mb-3 whitespace-nowrap">Features included:</h4>
            <ul className="space-y-2">
              {subscription.formattedFeatures.map((feature) => (
                <li key={feature.id} className="flex items-start gap-2 text-sm min-w-0">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="truncate">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-auto pt-4">
            <Button 
              disabled={subscription.comingSoon}
              className={`w-full whitespace-nowrap ${
                subscription.comingSoon
                  ? 'bg-gray-400 cursor-not-allowed'
                  : subscription.popular
                    ? 'bg-greenyp-600 hover:bg-greenyp-700'
                    : 'bg-greenyp-600 hover:bg-greenyp-700'
              }`}
              onClick={() => !subscription.comingSoon && onUpgrade(subscription.subscriptionId, subscription.displayName)}
            >
              {subscription.comingSoon ? (
                'Coming Soon'
              ) : (
                <>
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradeSubscriptionCard;
