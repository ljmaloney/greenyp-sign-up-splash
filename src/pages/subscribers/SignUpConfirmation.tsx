
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SignUpConfirmation = () => {
  const [searchParams] = useSearchParams();
  
  // Dummy data for initial look and feel
  const accountData = {
    businessName: searchParams.get('businessName') || 'Green Landscaping Pro',
    subscriptionPlan: searchParams.get('plan') || 'Basic Listing',
    email: searchParams.get('email') || 'john@greenlandscaping.com',
    phone: searchParams.get('phone') || '(555) 123-4567',
    location: searchParams.get('location') || 'San Francisco, CA',
    website: searchParams.get('website') || 'www.greenlandscaping.com',
    accountId: 'GYP-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to GreenYP!
            </h1>
            <p className="text-xl text-gray-600">
              Your account has been successfully created
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-green-800 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-semibold">{accountData.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subscription Plan</p>
                  <p className="font-semibold text-green-600">{accountData.subscriptionPlan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{accountData.accountId}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-green-800">Your Listing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{accountData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{accountData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{accountData.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>{accountData.website}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-green-800">What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Check Your Email</h3>
                  <p className="text-sm text-gray-600">
                    We've sent a welcome email with your login credentials and next steps.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                  <p className="text-sm text-gray-600">
                    Add photos, services, and additional details to make your listing stand out.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Start Getting Leads</h3>
                  <p className="text-sm text-gray-600">
                    Your listing will be live within 24 hours and customers can start finding you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/dashboard" className="flex items-center">
                Access Your Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Support Information */}
          <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help Getting Started?</h3>
            <p className="text-blue-700 mb-4">
              Our support team is here to help you make the most of your GreenYP listing.
            </p>
            <Button variant="outline" asChild>
              <Link to="/subscriber/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpConfirmation;
