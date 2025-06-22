
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
        <div className="container mx-auto px-4 max-w-6xl">
          <ContactPageHeader />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Quick Links - moved to top */}
            <div className="space-y-8">
              <QuickLinksCard />
            </div>

            {/* Send us a Message - moved below Quick Links */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
