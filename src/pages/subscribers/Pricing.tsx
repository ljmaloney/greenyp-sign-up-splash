import React from 'react';
import SubscribersHeader from '@/components/SubscribersHeader';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SubscribersHeader />
      <main className="flex-grow">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
