
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import DevApiConfig from '@/components/DevApiConfig';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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
