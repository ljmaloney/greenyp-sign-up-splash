
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewAdPreviewCard from './NewAdPreviewCard';

interface ClassifiedData {
  classifiedId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  price: number;
  perUnitType: string;
  createDate: string;
  adTypeId: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  emailAddress: string;
}

interface PaymentConfirmationContentProps {
  classified: ClassifiedData;
  customer: CustomerData;
  paymentSuccess: boolean;
}

const PaymentConfirmationContent = ({ 
  classified, 
  customer, 
  paymentSuccess 
}: PaymentConfirmationContentProps) => {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="mb-8 text-center">
        {paymentSuccess ? (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="text-gray-600 text-lg">Your classified ad has been published successfully.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="w-16 h-16 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Payment Confirmation</h1>
            <p className="text-gray-600 text-lg">Please review your ad details below.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Ad Preview */}
        <div className="space-y-6">
          <NewAdPreviewCard classified={classified} />
        </div>

        {/* Right Column - Payment & Customer Details */}
        <div className="space-y-6">
          {paymentSuccess && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Payment Confirmed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-green-700">
                  <p>✓ Payment processed successfully</p>
                  <p>✓ Ad published and live</p>
                  <p>✓ Confirmation email sent</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900">{customer.firstName} {customer.lastName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <p className="text-gray-900">{customer.emailAddress}</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Phone:</span>
                <p className="text-gray-900">{customer.phoneNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Address:</span>
                <p className="text-gray-900">
                  {customer.address}<br />
                  {customer.city}, {customer.state} {customer.postalCode}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-gray-600">Your classified ad is now live and can be found by users searching our platform.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={`/classifieds/${classified.classifiedId}`} className="flex-1">
                    <Button className="w-full bg-greenyp-600 hover:bg-greenyp-700">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      View Your Ad
                    </Button>
                  </Link>
                  <Link to="/classifieds" className="flex-1">
                    <Button variant="outline" className="w-full border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                      <Home className="w-4 h-4 mr-2" />
                      Browse Classifieds
                    </Button>
                  </Link>
                </div>
                <Link to="/classifieds/create" className="block">
                  <Button variant="ghost" className="w-full text-greenyp-600 hover:bg-greenyp-50">
                    Post Another Ad
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationContent;
