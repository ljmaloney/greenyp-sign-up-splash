
import React from 'react';
import PricingCard from './PricingCard';

interface PricingGridProps {
  subscriptions: any[];
  billingPeriod: 'monthly' | 'yearly';
  onSubscriptionClick: (subscriptionId: string) => void;
  getDisplayPrice: (subscription: any) => string;
  getDisplayPeriod: (subscription: any) => string;
  getSavingsText: (subscription: any) => string | null;
}

const PricingGrid = ({ 
  subscriptions, 
  billingPeriod, 
  onSubscriptionClick,
  getDisplayPrice,
  getDisplayPeriod,
  getSavingsText
}: PricingGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {subscriptions?.map((subscription, index) => (
        <PricingCard
          key={subscription.subscriptionId}
          subscription={subscription}
          billingPeriod={billingPeriod}
          onSubscriptionClick={onSubscriptionClick}
          getDisplayPrice={getDisplayPrice}
          getDisplayPeriod={getDisplayPeriod}
          getSavingsText={getSavingsText}
        />
      ))}
    </div>
  );
};

export default PricingGrid;
