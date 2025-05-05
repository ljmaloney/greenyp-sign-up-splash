
import React from 'react';
import SubscriptionForm from './SubscriptionForm';

const HeroSection = () => {
  return (
    <section className="relative hero-pattern py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Manage Your Green Business Directory Subscriptions
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-lg">
            Connect eco-conscious customers with your sustainable business through GreenYP's easy-to-use subscription management portal.
          </p>
          
          <SubscriptionForm />
          
          <div className="mt-6 text-sm text-gray-500 flex items-center">
            <svg className="w-5 h-5 mr-2 text-greenyp-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>No credit card required to get started</span>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center animate-slide-in">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-6 -right-6 w-full h-full bg-greenyp-200 rounded-lg transform rotate-3"></div>
            <div className="absolute -bottom-6 -left-6 w-full h-full bg-greenyp-100 rounded-lg transform -rotate-3"></div>
            <div className="relative bg-white p-8 rounded-lg shadow-xl border border-greenyp-100">
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-bold text-gray-800">Subscription Dashboard</div>
                <div className="text-xs px-2 py-1 bg-greenyp-100 text-greenyp-800 rounded-full">Preview</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Business Profile</span>
                    <span className="text-xs bg-greenyp-500 text-white px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Featured Listing</span>
                    <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">Pending</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Analytics Report</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-greenyp-500 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button className="w-full py-2 bg-greenyp-600 hover:bg-greenyp-700 text-white rounded-md text-sm transition-colors">
                  Manage Subscriptions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
