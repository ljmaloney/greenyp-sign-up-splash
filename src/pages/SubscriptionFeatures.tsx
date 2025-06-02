
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeaturesSection from '../components/FeaturesSection';

const SubscriptionFeatures = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default SubscriptionFeatures;
