
import React from 'react';
import SubscriptionPlan from './SubscriptionPlan';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '../../hooks/useSubscriptions';

const PricingSectionSubscribe = () => {
  const navigate = useNavigate();
  const { data: subscriptions, isLoading, error } = useSubscriptions();

  const handlePlanSelect = (subscriptionId: string) => {
    if (subscriptionId.includes('premium')) {
      window.location.href = "mailto:sales@greenyp.com?subject=Premium Plan Inquiry";
      return;
    }
    
    navigate(`/subscribe?plan=${subscriptionId}&billing=monthly`);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center">Loading subscription plans...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center text-red-600">Error loading plans. Please try again later.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Choose Your Subscription Plan
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Select the plan that's right for your business size and goals. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {subscriptions?.map((subscription, index) => (
            <SubscriptionPlan
              key={subscription.subscriptionId}
              name={subscription.displayName}
              price={subscription.formattedMonthlyPrice}
              period={subscription.monthlyAutopayAmount === 0 ? "forever" : "per month"}
              features={subscription.features.map(f => f.name)}
              cta={subscription.comingSoon ? 'Coming Soon' : subscription.monthlyAutopayAmount === 0 ? 'Get Started' : 'Start Premium'}
              popular={subscription.popular || false}
              comingSoon={subscription.comingSoon}
              onSelect={() => !subscription.comingSoon && handlePlanSelect(subscription.subscriptionId)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSectionSubscribe;
