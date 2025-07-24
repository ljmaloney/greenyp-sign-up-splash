
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const DisclaimerPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
            <p className="text-xl text-gray-600">Important information about our services</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Service Disclaimer</h2>
                  <p className="text-gray-600">
                    GreenYP serves as a directory platform connecting users with green industry professionals. 
                    We do not directly provide landscaping, lawn care, or other green industry services. 
                    All services are provided by independent third-party professionals listed on our platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">No Warranty</h2>
                  <p className="text-gray-600">
                    While we strive to maintain accurate and up-to-date information, we make no warranties or 
                    representations about the completeness, accuracy, or reliability of the information provided 
                    on this platform. Use of our services is at your own risk.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
                  <p className="text-gray-600">
                    GreenYP is not responsible for the quality, safety, or legality of services provided by 
                    third-party professionals. Users are encouraged to verify credentials, insurance, and 
                    licensing of service providers before engaging their services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                  <p className="text-gray-600">
                    In no event shall GreenYP be liable for any direct, indirect, incidental, special, or 
                    consequential damages arising from the use of our platform or services obtained through 
                    our platform.
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

export default DisclaimerPage;
