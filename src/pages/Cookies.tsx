import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Cookies Policy for GreenYP.com
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                This Cookies Policy explains how GreenYP.com ("we," "our," or "us") uses cookies and similar tracking technologies on our website and related services ("Services"). It should be read together with our Privacy Policy for a full understanding of how we collect and use information.
              </p>
              
              <p className="text-gray-700 mb-8">
                By using our Services, you agree to the use of cookies as described in this policy.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. What Are Cookies?</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files stored on your computer or mobile device when you visit a website. They help websites function properly, improve performance, and provide information to website owners.
                </p>
                <p className="text-gray-700 mb-4">Cookies can be:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Session Cookies</strong> — Temporary and deleted when you close your browser.</li>
                  <li><strong>Persistent Cookies</strong> — Stay on your device until they expire or you delete them.</li>
                  <li><strong>First-Party Cookies</strong> — Set by the website you're visiting.</li>
                  <li><strong>Third-Party Cookies</strong> — Set by other websites or services (e.g., analytics, advertising).</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Cookies</h2>
                <p className="text-gray-700 mb-4">We use cookies to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Make the site work</strong> — Enable core features like navigation and account login.</li>
                  <li><strong>Improve performance</strong> — Analyze how visitors use our site to make improvements.</li>
                  <li><strong>Remember preferences</strong> — Store settings such as language and location.</li>
                  <li><strong>Deliver relevant content</strong> — Show business listings and recommendations based on your activity.</li>
                </ul>
                <p className="text-gray-700 mt-4 font-semibold">
                  We do not use cookies to store sensitive personal information such as passwords.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Types of Cookies We Use</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-800">Cookie Type</th>
                        <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-800">Purpose</th>
                        <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-800">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Strictly Necessary</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Required for the website to function.</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Login authentication</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Performance</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Helps us understand site usage.</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Google Analytics</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Functionality</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Remembers your preferences.</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Saved search filters</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Targeting/Advertising</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Shows relevant ads or promoted listings.</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Third-party ad networks</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">Some cookies are placed by third-party services that appear on our pages. For example:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Analytics providers (e.g., Google Analytics) to understand usage trends.</li>
                  <li>Advertising networks for displaying relevant business listings.</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  These third parties have their own privacy and cookie policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Choices and Control</h2>
                <p className="text-gray-700 mb-4">You can control cookies in several ways:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Browser settings:</strong> Most browsers let you block or delete cookies.</li>
                  <li><strong>Opt-out tools:</strong> Use Google's Ad Settings or Network Advertising Initiative.</li>
                  <li><strong>Consent banners:</strong> If you are in certain regions (like the EU or UK), you may see a cookie consent pop-up to accept or reject cookies.</li>
                </ul>
                <p className="text-gray-700 mt-4 font-semibold">
                  Please note that disabling cookies may affect the functionality of our site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Changes to This Policy</h2>
                <p className="text-gray-700">
                  We may update this Cookies Policy from time to time. Any changes will be posted here with a revised effective date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contact Us</h2>
                <p className="text-gray-700 mb-2">
                  If you have any questions about our use of cookies, please contact:
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

export default Cookies;
