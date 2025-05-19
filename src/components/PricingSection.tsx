
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pricingPlans = [
  {
    name: "Basic Listing",
    description: "Perfect for small local landscaping or gardening businesses",
    price: "$0",
    period: "forever",
    features: [
      "Basic business listing",
      "Contact information",
      "Business hours",
      "Single category listing",
      "Map location"
    ],
    cta: "Get Started Free",
    popular: false,
    planId: "basic"
  },
  {
    name: "Featured Business",
    description: "Ideal for established landscaping and garden businesses",
    price: "$29",
    period: "per month",
    features: [
      "Priority placement in searches",
      "Enhanced business profile",
      "Photo gallery (up to 15 images)",
      "Customer reviews & ratings",
      "Multiple category listings",
      "Business verification badge"
    ],
    cta: "Start Free Trial",
    popular: true,
    planId: "featured"
  },
  {
    name: "Premium Partner",
    description: "For multi-location nurseries and landscaping companies",
    price: "$79",
    period: "per month",
    features: [
      "Top search placement",
      "Multiple location management",
      "Seasonal promotional features",
      "Eco-certification badges",
      "Extended photo gallery (50+ images)",
      "Video showcase option",
      "Featured in 'Recommended' section"
    ],
    cta: "Contact Sales",
    popular: false,
    planId: "premium"
  }
];

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  const handleSubscriptionClick = (planId: string) => {
    if (planId === "premium") {
      // For premium plan, navigate to a contact sales page
      window.location.href = "mailto:sales@greenyp.com?subject=Premium Plan Inquiry";
      return;
    }
    
    // For other plans, navigate to the subscription page with the selected plan
    navigate(`/subscribe?plan=${planId}&billing=${billingPeriod}`);
  };

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
              Yearly <span className="text-xs text-greenyp-600 font-normal ml-1">Save 20%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`pricing-card relative rounded-lg border border-gray-200 p-6 ${
                plan.popular ? 'border-greenyp-500 md:scale-105 z-10 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 bg-greenyp-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-end">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === "$0" ? "Free" : 
                      billingPeriod === 'yearly' ? 
                      `$${parseInt(plan.price.replace('$', '')) * 0.8 * 12}` : 
                      plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">
                    {plan.price === "$0" ? "" :
                      billingPeriod === 'yearly' ? '/year' : plan.period}
                  </span>
                </div>
                {plan.price !== "$0" && billingPeriod === 'yearly' && (
                  <p className="text-greenyp-600 text-sm mt-1">Save 20% with annual billing</p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-greenyp-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.popular
                    ? 'bg-greenyp-600 hover:bg-greenyp-700 text-white'
                    : 'bg-white border-2 border-greenyp-600 text-greenyp-700 hover:bg-greenyp-50'
                }`}
                onClick={() => handleSubscriptionClick(plan.planId)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
