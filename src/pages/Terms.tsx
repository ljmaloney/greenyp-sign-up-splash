import React from 'react';
import NoNavBarPublicHeader from '@/components/NoNavBarPublicHeader';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NoNavBarPublicHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Terms and Conditions for GreenYP.com
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Welcome to GreenYP.com ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our website, mobile applications, and related services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, you may not use the Services.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Use of the Services</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>You must be at least 18 years old to use our Services.</li>
                  <li>You agree to use the Services only for lawful purposes and in accordance with these Terms.</li>
                  <li>We may suspend or terminate your access at our discretion if you violate these Terms.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Accounts</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>You agree to provide accurate, current, and complete information during registration and to keep it updated.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Business Listings and Content</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Business listings, reviews, and other content provided by users are the responsibility of the person or entity that created them.</li>
                  <li>You may not post false, misleading, defamatory, obscene, or otherwise unlawful content.</li>
                  <li>By submitting content to our Services, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content for purposes related to the operation and promotion of the Services.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Intellectual Property</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>All content and materials on the Services, except user-submitted content, are owned by or licensed to GreenYP and are protected by copyright, trademark, and other intellectual property laws.</li>
                  <li>You may not copy, modify, distribute, or create derivative works from our content without our written permission.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Accuracy of Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>We do not guarantee the accuracy, completeness, or reliability of any business listings or other content on the Services.</li>
                  <li>You acknowledge that any reliance on such information is at your own risk.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Third-Party Links</h2>
                <p className="text-gray-700">
                  Our Services may contain links to third-party websites. We are not responsible for the content, privacy practices, or activities of these third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>To the fullest extent permitted by law, GreenYP shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Services.</li>
                  <li>We make no warranties, express or implied, regarding the Services, including without limitation the accuracy or availability of the Services.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Termination</h2>
                <p className="text-gray-700">
                  We may suspend or terminate your access to the Services at any time, without notice, for any reason, including violation of these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to These Terms</h2>
                <p className="text-gray-700">
                  We may update these Terms from time to time. We will notify you by posting the new Terms on the website with a revised effective date. Continued use of the Services after changes means you accept the updated Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Governing Law and Dispute Resolution</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>These Terms are governed by the laws of the State of Georgia, without regard to its conflict of laws rules.</li>
                  <li>Any disputes shall be resolved through binding arbitration in Covington, Georgia, except where prohibited by law.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 mb-2">
                  If you have questions about these Terms, please contact:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">GreenYP Support</p>
                  <p className="text-gray-700">Email: support@greenyp.com</p>
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

export default Terms;
