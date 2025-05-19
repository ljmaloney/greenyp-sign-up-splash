
import React from 'react';
import SubscriptionForm from '@/components/SubscriptionForm';

const SubscribeCTASection = () => {
  return (
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
  );
};

export default SubscribeCTASection;
