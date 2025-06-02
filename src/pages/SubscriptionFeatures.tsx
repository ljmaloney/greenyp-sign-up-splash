
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeaturesSection from '../components/FeaturesSection';
import { Settings, User, MapPin, Calendar } from 'lucide-react';

const ManageBusinessSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Manage Your Business Listing
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-greenyp-100 p-8">
          <div className="flex items-start mb-6">
            <Settings className="w-8 h-8 text-greenyp-500 mr-4 mt-1" />
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Keep your business profile up to date by managing your subscription details in one place. 
                Customize the products and services you offer, update your business location and contact 
                information, and ensure your listing accurately reflects what customers can expect. This 
                section will also grow with your needs—future enhancements will unlock tools tailored to 
                your line of business and subscription tier, helping you reach more customers and maximize 
                your visibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center p-4 bg-greenyp-50 rounded-lg">
              <User className="w-6 h-6 text-greenyp-600 mr-3" />
              <span className="text-sm font-medium text-gray-700">Profile Management</span>
            </div>
            <div className="flex items-center p-4 bg-greenyp-50 rounded-lg">
              <MapPin className="w-6 h-6 text-greenyp-600 mr-3" />
              <span className="text-sm font-medium text-gray-700">Location Updates</span>
            </div>
            <div className="flex items-center p-4 bg-greenyp-50 rounded-lg">
              <Calendar className="w-6 h-6 text-greenyp-600 mr-3" />
              <span className="text-sm font-medium text-gray-700">Service Scheduling</span>
            </div>
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
