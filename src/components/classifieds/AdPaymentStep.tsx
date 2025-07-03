
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { AdPackage } from '@/types/adPackages';
import { ExtendedClassifiedFormData } from '@/types/extendedClassifiedForm';

interface AdPaymentStepProps {
  formData: ExtendedClassifiedFormData;
  selectedPackage?: AdPackage;
  onPaymentComplete: () => void;
  onBack: () => void;
}

const AdPaymentStep = ({ 
  formData, 
  selectedPackage, 
  onPaymentComplete, 
  onBack 
}: AdPaymentStepProps) => {
  const handlePayment = () => {
    console.log('💳 Payment button clicked');
    console.log('📋 Form data at payment:', formData);
    console.log('📦 Selected package at payment:', selectedPackage);
    onPaymentComplete();
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4 border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Payment & Submit</h2>
        <p className="text-gray-600">
          Review your ad details and complete your purchase
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Package:</span>
            <span>{selectedPackage?.adTypeName || 'Unknown'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Price:</span>
            <span className="text-lg font-bold">${selectedPackage?.monthlyPrice || 0}/month</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Duration:</span>
            <span>30 days</span>
          </div>
          {selectedPackage?.features.maxImages > 0 && (
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Images:</span>
              <span>Up to {selectedPackage.features.maxImages} images</span>
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
            <p className="text-gray-700">{formData.title}</p>
          </div>
          <div>
            <span className="font-medium">Description:</span>
            <p className="text-gray-700">{formData.description}</p>
          </div>
          <div>
            <span className="font-medium">Location:</span>
            <p className="text-gray-700">{formData.city}, {formData.state} {formData.zipCode}</p>
          </div>
          {formData.price && (
            <div>
              <span className="font-medium">Price:</span>
              <p className="text-gray-700">${formData.price}{formData.per ? ` per ${formData.per}` : ''}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              By clicking "Submit Ad", you agree to post your classified ad for ${selectedPackage?.monthlyPrice || 0}/month.
            </p>
            <Button 
              onClick={handlePayment}
              size="lg" 
              className="bg-greenyp-600 hover:bg-greenyp-700 w-full md:w-auto px-8"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Submit Ad - ${selectedPackage?.monthlyPrice || 0}/month
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdPaymentStep;
