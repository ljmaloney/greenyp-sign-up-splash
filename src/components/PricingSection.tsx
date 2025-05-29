
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '../hooks/useSubscriptions';

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
    
    // For other plans, navigate to the subscription page with the selected plan
    navigate(`/subscribe?plan=${subscriptionId}&billing=${billingPeriod}`);
  };

  const getDisplayPrice = (subscription: any) => {
    if (subscription.monthlyAutopayAmount === 0) {
      return "Free";
    }
    
    if (billingPeriod === 'yearly' && subscription.yearlyAutopayAmount) {
      return `$${subscription.yearlyAutopayAmount}`;
    }
    
    return subscription.formattedMonthlyPrice;
  };

  const getDisplayPeriod = (subscription: any) => {
    if (subscription.monthlyAutopayAmount === 0) {
      return "forever";
    }
    
    if (billingPeriod === 'yearly' && subscription.yearlyAutopayAmount) {
      return "/year";
    }
    
    return "/month";
  };

  const getSavingsText = (subscription: any) => {
    if (billingPeriod === 'yearly' && subscription.yearlyAutopayAmount && subscription.monthlyAutopayAmount > 0) {
      const yearlyTotal = subscription.monthlyAutopayAmount * 12;
      const savings = yearlyTotal - subscription.yearlyAutopayAmount;
      const savingsPercent = Math.round((savings / yearlyTotal) * 100);
      return `Save ${savingsPercent}% with annual billing`;
    }
    return null;
  };

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
            Choose the perfect visibility package for your lawn care, landscaping, or garden business
          </p>
          
          <div className="inline-flex p-1 rounded-lg bg-gray-100 mb-8">
            <button
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                billingPeriod === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                billingPeriod === 'yearly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly <span className="text-xs text-greenyp-600 font-normal ml-1">Save up to 20%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptions?.map((subscription, index) => (
            <div 
              key={subscription.subscriptionId}
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
              
              <ul className="space-y-3 mb-8 flex-grow">
                {subscription.features.map((feature) => (
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
                onClick={() => !subscription.comingSoon && handleSubscriptionClick(subscription.subscriptionId)}
                disabled={subscription.comingSoon}
              >
                {subscription.comingSoon ? 'Coming Soon' : subscription.monthlyAutopayAmount === 0 ? 'Get Started Free' : 'Start Free Trial'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
