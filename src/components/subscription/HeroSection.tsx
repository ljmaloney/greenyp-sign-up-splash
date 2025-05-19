
import React from 'react';
import SubscriptionForm from '@/components/SubscriptionForm';

const SubscribeHeroSection = () => {
  return (
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
  );
};

export default SubscribeHeroSection;
