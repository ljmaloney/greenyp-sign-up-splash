
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactPageHeader from '@/components/contact/ContactPageHeader';
import QuickLinksCard from '@/components/contact/QuickLinksCard';
import ContactForm from '@/components/contact/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <ContactPageHeader />

          <div className="space-y-8">
            {/* Quick Links at the top */}
            <QuickLinksCard />

            {/* Send us a Message below */}
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
