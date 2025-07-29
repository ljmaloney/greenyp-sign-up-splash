
import React from 'react';
import SubscribersHeader from '../../components/SubscribersHeader';
import Footer from '../../components/Footer';
import FeaturesSection from '../../components/FeaturesSection';

const SubscriptionFeatures = () => {
  return (
    <div className="min-h-screen bg-white">
      <SubscribersHeader />
      <main>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default SubscriptionFeatures;
