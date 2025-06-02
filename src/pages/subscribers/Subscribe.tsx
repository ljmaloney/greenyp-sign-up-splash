
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscribeHeroSection from '@/components/subscription/HeroSection';
import PricingSectionSubscribe from '@/components/subscription/PricingSection';
import TestimonialsSection from '@/components/subscription/TestimonialsSection';
import FAQSection from '@/components/subscription/FAQSection';
import SubscribeCTASection from '@/components/subscription/CTASection';

const Subscribe = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <SubscribeHeroSection />
        <PricingSectionSubscribe />
        <TestimonialsSection />
        <FAQSection />
        <SubscribeCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Subscribe;
