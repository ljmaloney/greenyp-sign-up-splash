
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: "Basic",
    description: "Perfect for small eco-friendly businesses just getting started",
    price: "$9",
    period: "per month",
    features: [
      "Standard business listing",
      "Basic analytics dashboard",
      "Business profile page",
      "Email support"
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    description: "Ideal for established sustainable businesses looking to expand",
    price: "$29",
    period: "per month",
    features: [
      "Enhanced business visibility",
      "Featured in category searches",
      "Advanced analytics & reporting",
      "Customer reviews management",
      "Priority email & chat support"
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Premium",
    description: "For market-leading green brands with multiple locations",
    price: "$79",
    period: "per month",
    features: [
      "Top placement in search results",
      "Multiple location management",
      "Custom business showcase page",
      "Competitor analysis tools",
      "Dedicated account manager",
      "24/7 priority support"
    ],
    cta: "Contact Sales",
    popular: false,
  }
];

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Choose the plan that's right for your sustainable business
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
              className={`pricing-card relative ${
                plan.popular ? 'border-greenyp-500 md:scale-105 z-10' : ''
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
                    {billingPeriod === 'yearly' ? 
                      `$${parseInt(plan.price.replace('$', '')) * 0.8 * 12}` : 
                      plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">
                    {billingPeriod === 'yearly' ? '/year' : plan.period}
                  </span>
                </div>
                {billingPeriod === 'yearly' && (
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
