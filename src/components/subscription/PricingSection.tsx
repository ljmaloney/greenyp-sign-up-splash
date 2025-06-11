
import React from 'react';
import SubscriptionPlan from './SubscriptionPlan';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '../../hooks/useSubscriptions';

const PricingSectionSubscribe = () => {
  const navigate = useNavigate();
  const { data: subscriptions, isLoading, error } = useSubscriptions();

  console.log('PricingSection - subscriptions:', subscriptions);
  console.log('PricingSection - isLoading:', isLoading);
  console.log('PricingSection - error:', error);

  const handlePlanSelect = (subscriptionId: string) => {
    if (subscriptionId.includes('premium')) {
      window.location.href = "mailto:sales@greenyp.com?subject=Premium Plan Inquiry";
      return;
    }
    
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/subscriber/signup?plan=${subscriptionId}`);
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
            The basic listing is free for the first month and takes only a few minutes to set up. For enhanced visibility, consider our premium options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subscriptions?.map((subscription, index) => {
            console.log(`Rendering subscription ${index}:`, subscription);
            return (
              <SubscriptionPlan
                key={subscription.subscriptionId}
                name={subscription.displayName}
                price={subscription.comingSoon ? "" : subscription.formattedMonthlyPrice}
                period={subscription.comingSoon ? "" : subscription.monthlyAutopayAmount === 0 ? "forever" : "per month"}
                description={subscription.shortDescription}
                features={subscription.formattedFeatures.map(f => f.name)}
                cta={subscription.comingSoon ? 'Coming Soon' : 'Start Your Listing'}
                popular={subscription.popular || false}
                comingSoon={subscription.comingSoon}
                onSelect={() => !subscription.comingSoon && handlePlanSelect(subscription.subscriptionId)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSectionSubscribe;
