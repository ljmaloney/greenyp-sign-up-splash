
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeaturesSection from '../components/FeaturesSection';
import { Settings, User, MapPin, Calendar, Check } from 'lucide-react';

const ManageBusinessSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Manage Your Business Listing
          </h2>
          <p className="text-xl text-gray-700">
            Keep your business profile up to date and customize your offerings to reach more customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col p-6 bg-white border border-greenyp-100 rounded-xl shadow-sm transition-all hover:shadow-md hover:border-greenyp-200">
            <div className="mb-4">
              <Settings className="w-10 h-10 text-greenyp-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Business Profile Management</h3>
            <p className="text-gray-600 mb-4">
              Customize the products and services you offer, update your business location and contact 
              information, and ensure your listing accurately reflects what customers can expect.
            </p>
            
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Profile customization
                </span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Service listings management
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col p-6 bg-white border border-greenyp-100 rounded-xl shadow-sm transition-all hover:shadow-md hover:border-greenyp-200">
            <div className="mb-4">
              <MapPin className="w-10 h-10 text-greenyp-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Future Business Tools</h3>
            <p className="text-gray-600 mb-4">
              This section will grow with your needs—future enhancements will unlock tools tailored to 
              your line of business and subscription tier, helping you maximize your visibility.
            </p>
            
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Advanced analytics
                </span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Customer management tools
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const SubscriptionFeatures = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <FeaturesSection />
        <ManageBusinessSection />
      </main>
      <Footer />
    </div>
  );
};

export default SubscriptionFeatures;
