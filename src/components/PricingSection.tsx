import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '../hooks/useSubscriptions';
import BillingToggle from './pricing/BillingToggle';
import PricingGrid from './pricing/PricingGrid';
import { getDisplayPrice, getDisplayPeriod, getSavingsText } from '../utils/pricingUtils';

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  const { data: subscriptions, isLoading, error } = useSubscriptions();

  const handleSubscriptionClick = (subscriptionId: string) => {
    if (subscriptionId.includes('premium')) {
      // For premium plan, navigate to a contact sales page
      window.location.href = "mailto:sales@greenyp.com?subject=Premium Plan Inquiry";
      return;
    }
    
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Navigate to the subscriber signup page with the selected plan (using plural form)
    navigate(`/subscribers/signup?plan=${subscriptionId}&billing=${billingPeriod}`);
  };

  const getPriceDisplay = (subscription: any) => getDisplayPrice(subscription, billingPeriod);
  const getPeriodDisplay = (subscription: any) => getDisplayPeriod(subscription, billingPeriod);
  const getSavingsDisplay = (subscription: any) => getSavingsText(subscription, billingPeriod);

  if (isLoading) {
    return (
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center">Loading pricing options...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center text-red-600">Error loading pricing options. Please try again later.</div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Directory Listing Options
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            The basic listing is free for the first month and takes only a few minutes to set up. For enhanced visibility, consider our premium options.
          </p>
          
          <BillingToggle 
            billingPeriod={billingPeriod}
            onBillingChange={setBillingPeriod}
          />
        </div>
        
        <PricingGrid
          subscriptions={subscriptions}
          billingPeriod={billingPeriod}
          onSubscriptionClick={handleSubscriptionClick}
          getDisplayPrice={getPriceDisplay}
          getDisplayPeriod={getPeriodDisplay}
          getSavingsText={getSavingsDisplay}
        />
      </div>
    </section>
  );
};

export default PricingSection;
