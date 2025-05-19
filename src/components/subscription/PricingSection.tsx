
import React from 'react';
import SubscriptionPlan from './SubscriptionPlan';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: "Free Listing",
    price: "$0",
    period: "forever",
    features: [
      "Basic business listing",
      "Contact information visible",
      "Single category listing",
      "Standard search placement"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Premium",
    price: "$29",
    period: "per month",
    features: [
      "Enhanced business profile",
      "Multiple category listings",
      "Premium search placement",
      "Business analytics dashboard",
      "Customer reviews management",
      "Photo gallery (up to 10 images)"
    ],
    cta: "Start Premium",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$79",
    period: "per month",
    features: [
      "All Premium features",
      "Featured business placement",
      "Unlimited photo gallery",
      "Video content support",
      "Dedicated account manager",
      "API access for integration"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const PricingSectionSubscribe = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (planId: string) => {
    if (planId === "Enterprise") {
      window.location.href = "mailto:sales@greenyp.com?subject=Enterprise Plan Inquiry";
      return;
    }
    
    navigate(`/subscribe?plan=${planId.toLowerCase()}&billing=monthly`);
  };

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
          {plans.map((plan, index) => (
            <SubscriptionPlan
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              cta={plan.cta}
              popular={plan.popular}
              onSelect={() => handlePlanSelect(plan.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSectionSubscribe;
