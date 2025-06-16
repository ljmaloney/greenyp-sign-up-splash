
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

interface PricingCardProps {
  subscription: any;
  billingPeriod: 'monthly' | 'yearly';
  onSubscriptionClick: (subscriptionId: string) => void;
  getDisplayPrice: (subscription: any) => string;
  getDisplayPeriod: (subscription: any) => string;
  getSavingsText: (subscription: any) => string | null;
}

const PricingCard = ({ 
  subscription, 
  billingPeriod, 
  onSubscriptionClick,
  getDisplayPrice,
  getDisplayPeriod,
  getSavingsText
}: PricingCardProps) => {
  return (
    <div 
      className={`pricing-card relative rounded-lg border p-6 ${
        subscription.comingSoon 
          ? 'border-yellow-400 border-2' 
          : subscription.popular 
            ? 'border-greenyp-500 md:scale-105 z-10 shadow-lg' 
            : 'border-gray-200'
      }`}
    >
      {subscription.popular && !subscription.comingSoon && (
        <div className="absolute top-0 -translate-y-1/2 bg-greenyp-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {subscription.displayName}
          {subscription.comingSoon && (
            <span className="text-yellow-600 text-sm font-normal ml-2">Coming Soon</span>
          )}
        </h3>
        <p className="text-gray-600 text-sm">{subscription.shortDescription}</p>
      </div>
      
      {!subscription.comingSoon && (
        <div className="mb-6">
          <div className="flex items-end">
            <span className="text-4xl font-bold text-gray-900">
              {getDisplayPrice(subscription)}
            </span>
            <span className="text-gray-500 ml-1">
              {getDisplayPeriod(subscription)}
            </span>
          </div>
          {getSavingsText(subscription) && (
            <p className="text-greenyp-600 text-sm mt-1">{getSavingsText(subscription)}</p>
          )}
        </div>
      )}
      
      <ul className="space-y-3 mb-8 flex-grow">
        {subscription.formattedFeatures.map((feature) => (
          <li key={feature.id} className="flex items-start">
            <Check className="h-5 w-5 text-greenyp-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature.name}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full ${
          subscription.comingSoon
            ? 'bg-gray-400 cursor-not-allowed'
            : subscription.popular
              ? 'bg-greenyp-600 hover:bg-greenyp-700 text-white'
              : 'bg-white border-2 border-greenyp-600 text-greenyp-700 hover:bg-greenyp-50'
        }`}
        onClick={() => !subscription.comingSoon && onSubscriptionClick(subscription.subscriptionId)}
        disabled={subscription.comingSoon}
      >
        {subscription.comingSoon ? 'Coming Soon' : 'Start Your Listing'}
      </Button>
    </div>
  );
};

export default PricingCard;
