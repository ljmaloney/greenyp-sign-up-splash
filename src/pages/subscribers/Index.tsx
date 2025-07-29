
import React from 'react';
import SubscribersHeader from '@/components/SubscribersHeader';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/subscription/CategorySection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import DevApiConfig from '@/components/DevApiConfig';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SubscribersHeader />
      <main className="flex-grow">
        <HeroSection />
        <CategorySection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
      <DevApiConfig />
    </div>
  );
};

export default Index;
