
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionForm from '@/components/SubscriptionForm';
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

const Subscribe = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 px-4 md:py-24 bg-gradient-to-br from-green-50 to-greenyp-100">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Grow Your Green Industry Business
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Join the leading directory for landscaping, lawn care, nurseries, and other green industry services. Connect with customers actively searching for your services.
            </p>
            <SubscriptionForm />
          </div>
        </section>

        {/* Pricing Plans */}
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
                <div 
                  key={index} 
                  className={`relative rounded-lg border ${plan.popular ? 'border-greenyp-500 shadow-lg' : 'border-gray-200'} p-6 flex flex-col`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-greenyp-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <ul className="mb-6 flex-grow space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="bg-greenyp-100 rounded-full p-1 mr-2 flex-shrink-0">
                          <CheckIcon className="h-4 w-4 text-greenyp-600" />
                        </span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-greenyp-600 hover:bg-greenyp-700 text-white' : 'bg-white border border-greenyp-600 text-greenyp-700 hover:bg-greenyp-50'}`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
              What Our Subscribers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-greenyp-200 flex items-center justify-center text-greenyp-700 font-bold text-xl mr-4">
                    JS
                  </div>
                  <div>
                    <h4 className="font-semibold">Jessica Smith</h4>
                    <p className="text-sm text-gray-600">Sunshine Nursery</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Since listing our nursery on GreenYP, we've seen a 40% increase in new customers. The platform is easy to use and the customer support is excellent."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-greenyp-200 flex items-center justify-center text-greenyp-700 font-bold text-xl mr-4">
                    MT
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Thompson</h4>
                    <p className="text-sm text-gray-600">Green Thumb Landscaping</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The premium subscription has been worth every penny. Our business shows up at the top of search results and the analytics dashboard helps us understand our customer base better."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-greenyp-200 flex items-center justify-center text-greenyp-700 font-bold text-xl mr-4">
                    AR
                  </div>
                  <div>
                    <h4 className="font-semibold">Amanda Rodriguez</h4>
                    <p className="text-sm text-gray-600">Blooming Gardens</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "As a small plant nursery, GreenYP has helped us compete with larger stores. The customer targeting is precise and we're reaching people who are specifically looking for our specialty plants."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">How do I get my business listed?</h3>
                <p className="text-gray-700">Simply sign up and complete your business profile. The basic listing is free and takes only a few minutes to set up. For enhanced visibility, consider our premium options.</p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Can I upgrade my subscription later?</h3>
                <p className="text-gray-700">Yes, you can upgrade or downgrade your subscription at any time. Changes will be reflected immediately in your account features and billing.</p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">How do customers find my business?</h3>
                <p className="text-gray-700">Customers can find your business by searching categories, services, or locations. Premium subscribers appear higher in search results and have enhanced profile features.</p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Is there a contract or commitment?</h3>
                <p className="text-gray-700">No long-term contracts. Our premium plans are month-to-month and you can cancel at any time. The free basic listing has no time limit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-greenyp-100">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Ready to Grow Your Green Business?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of green industry professionals who are growing their businesses with GreenYP.
            </p>
            <SubscriptionForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Subscribe;
