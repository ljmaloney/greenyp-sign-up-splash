
import React from 'react';
import { SubscriptionWithFormatting } from '@/types/subscription';
import UpgradeSubscriptionCard from './UpgradeSubscriptionCard';

interface UpgradeSubscriptionGridProps {
  subscriptions: SubscriptionWithFormatting[];
  onUpgrade: (subscriptionId: string, subscriptionName: string) => void;
}

const UpgradeSubscriptionGrid = ({ subscriptions, onUpgrade }: UpgradeSubscriptionGridProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 justify-items-center place-items-center">
      {subscriptions.map((subscription) => (
        <UpgradeSubscriptionCard 
          key={subscription.subscriptionId}
          subscription={subscription}
          onUpgrade={onUpgrade}
        />
      ))}
    </div>
  );
};

export default UpgradeSubscriptionGrid;
