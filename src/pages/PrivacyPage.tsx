
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">How we protect and use your information</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                  <p className="text-gray-600 mb-4">
                    We collect information you provide directly to us, such as when you create an account, 
                    use our services, or contact us for support.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Contact information (name, email, phone number)</li>
                    <li>Business information for service providers</li>
                    <li>Usage data and preferences</li>
                    <li>Communication records</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                  <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Provide and improve our services</li>
                    <li>Connect you with relevant service providers</li>
                    <li>Send you updates and communications</li>
                    <li>Ensure security and prevent fraud</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                  <p className="text-gray-600">
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    without your consent, except as described in this policy or as required by law.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                  <p className="text-gray-600">
                    We implement appropriate security measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  <p className="text-gray-600">
                    If you have questions about this Privacy Policy, please contact us at privacy@greenyp.com.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
