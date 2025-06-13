
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Mail, Phone, MapPin, Globe, Building, Package, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SignUpConfirmation = () => {
  const [searchParams] = useSearchParams();
  
  const accountData = {
    businessName: searchParams.get('businessName') || 'Your Business',
    subscriptionPlan: searchParams.get('plan') || 'Basic Listing',
    subscriptionPrice: searchParams.get('planPrice') || '$5',
    subscriptionType: searchParams.get('subscriptionType') || 'LIVE_UNPAID',
    lineOfBusiness: searchParams.get('lineOfBusiness') || 'Business Category',
    email: searchParams.get('email') || 'your@email.com',
    phone: searchParams.get('phone') || '(555) 123-4567',
    location: searchParams.get('location') || 'Your City, State',
    website: searchParams.get('website') || '',
    producerId: searchParams.get('producerId') || 'GYP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    // Location details from API response
    locationName: searchParams.get('locationName') || '',
    addressLine1: searchParams.get('addressLine1') || '',
    addressLine2: searchParams.get('addressLine2') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    postalCode: searchParams.get('postalCode') || '',
    // Contact details from API response
    contactName: searchParams.get('contactName') || '',
    firstName: searchParams.get('firstName') || '',
    lastName: searchParams.get('lastName') || '',
    title: searchParams.get('title') || '',
    cellPhone: searchParams.get('cellPhone') || ''
  };

  // Format subscription type for display
  const formatSubscriptionType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
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
                  <p className="text-sm text-gray-600 flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    Line of Business
                  </p>
                  <p className="font-semibold text-blue-600">{accountData.lineOfBusiness}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    Subscription Plan
                  </p>
                  <p className="font-semibold text-green-600">
                    {accountData.subscriptionPlan}
                    {accountData.subscriptionPrice && accountData.subscriptionPrice !== '$0' && (
                      <span className="text-sm text-gray-600 ml-2">({accountData.subscriptionPrice}/month)</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subscription Type</p>
                  <p className="font-semibold text-purple-600">{formatSubscriptionType(accountData.subscriptionType)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{accountData.producerId}</p>
                </div>
              </CardContent>
            </Card>

            {/* Listing Details */}
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
                {accountData.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span>{accountData.website}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Location Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-green-800 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {accountData.locationName && (
                <div>
                  <p className="text-sm text-gray-600">Location Name</p>
                  <p className="font-semibold">{accountData.locationName}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <div className="font-semibold">
                  {accountData.addressLine1 && <p>{accountData.addressLine1}</p>}
                  {accountData.addressLine2 && <p>{accountData.addressLine2}</p>}
                  <p>{accountData.city}, {accountData.state} {accountData.postalCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-green-800 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Primary Contact</p>
                <p className="font-semibold">
                  {accountData.contactName || `${accountData.firstName} ${accountData.lastName}`.trim()}
                </p>
              </div>
              {accountData.title && (
                <div>
                  <p className="text-sm text-gray-600">Title</p>
                  <p className="font-semibold">{accountData.title}</p>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Business Phone</p>
                  <p className="font-semibold">{accountData.phone}</p>
                </div>
                {accountData.cellPhone && (
                  <div>
                    <p className="text-sm text-gray-600">Cell Phone</p>
                    <p className="font-semibold">{accountData.cellPhone}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{accountData.email}</p>
              </div>
            </CardContent>
          </Card>

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
