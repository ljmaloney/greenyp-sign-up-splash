
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

const Payment = () => {
  const { classifiedId } = useParams();
  const location = useLocation();
  
  const classifiedData = location.state?.classifiedData;
  const packageData = location.state?.packageData;

  const handlePayment = () => {
    // TODO: Implement payment processing
    console.log('Processing payment for classified:', classifiedId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">Review your ad details and complete payment</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Package:</span>
                  <span>{packageData?.adTypeName || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Price:</span>
                  <span className="text-lg font-bold">${packageData?.monthlyPrice || 0}/month</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Duration:</span>
                  <span>30 days</span>
                </div>
                {packageData?.features.maxImages > 0 && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Images:</span>
                    <span>Up to {packageData.features.maxImages} images</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ad Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Title:</span>
                  <p className="text-gray-700">{classifiedData?.title}</p>
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-gray-700">{classifiedData?.description}</p>
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <p className="text-gray-700">{classifiedData?.city}, {classifiedData?.state} {classifiedData?.postalCode}</p>
                </div>
                {classifiedData?.price > 0 && (
                  <div>
                    <span className="font-medium">Price:</span>
                    <p className="text-gray-700">${classifiedData.price}{classifiedData.perUnitType && classifiedData.perUnitType !== 'NA' ? ` per ${classifiedData.perUnitType}` : ''}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    By clicking "Complete Purchase", you agree to pay ${packageData?.monthlyPrice || 0}/month for your classified ad.
                  </p>
                  <Button 
                    onClick={handlePayment}
                    size="lg" 
                    className="bg-greenyp-600 hover:bg-greenyp-700 w-full md:w-auto px-8"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Complete Purchase - ${packageData?.monthlyPrice || 0}/month
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default Payment;
