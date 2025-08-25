import React from 'react';
import NoNavBarPublicHeader from '@/components/NoNavBarPublicHeader';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NoNavBarPublicHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Privacy Policy for GreenYP.com
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                This Privacy Policy explains how GreenYP.com ("we," "our," or "us") collects, uses, and protects your personal information when you use our website, mobile applications, and related services (collectively, the "Services"). By using our Services, you agree to the terms described in this Privacy Policy.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">We may collect the following types of information:</p>
                
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">a. Information You Provide</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Name, email address, phone number, and other contact details when you create an account, list a business, or contact us.</li>
                    <li>Business information such as name, address, description, and services offered.</li>
                    <li>Content you post (e.g., reviews, photos, comments).</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">b. Information Collected Automatically</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>IP address, browser type, device information, and operating system.</li>
                    <li>Usage data such as pages visited, time spent, and interactions.</li>
                    <li>Cookies and similar tracking technologies (see Section 6).</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Provide, operate, and maintain our Services.</li>
                  <li>Create and manage business listings.</li>
                  <li>Communicate with you, including sending updates and support messages.</li>
                  <li>Improve our Services, user experience, and security.</li>
                  <li>Comply with legal obligations.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Share Your Information</h2>
                <p className="text-gray-700 mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Other Users:</strong> Publicly visible business listings and related information.</li>
                  <li><strong>Service Providers:</strong> Third parties that help us operate our Services (e.g., hosting, analytics, email delivery).</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect our legal rights.</li>
                  <li><strong>Business Transfers:</strong> If our business is sold or merged, your information may be transferred to the new owner.</li>
                </ul>
                <p className="text-gray-700 mt-4 font-semibold">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Your Choices</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>You may update your account information at any time.</li>
                  <li>You can opt out of non-essential marketing emails by using the "unsubscribe" link.</li>
                  <li>You may request deletion of your account and personal information by contacting us at privacy@greenyp.com.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Security</h2>
                <p className="text-gray-700">
                  We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. However, no system is completely secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700">
                  We use cookies and similar technologies to improve our Services, remember preferences, and analyze site traffic. You can manage cookies through your browser settings, but some features may not function properly without them.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Children's Privacy</h2>
                <p className="text-gray-700">
                  Our Services are not intended for children under 13, and we do not knowingly collect personal information from them. If we learn we have collected such information, we will delete it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. International Users</h2>
                <p className="text-gray-700">
                  If you access our Services from outside the United States, you understand that your information may be processed and stored in the United States, where privacy laws may differ.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to This Privacy Policy</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date. Continued use of the Services after changes means you accept the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Us</h2>
                <p className="text-gray-700 mb-2">
                  If you have any questions about this Privacy Policy or our data practices, please contact:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">GreenYP Privacy Team</p>
                  <p className="text-gray-700">Email: privacy@greenyp.com</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
