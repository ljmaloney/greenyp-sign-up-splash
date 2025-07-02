
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import { AdPackage } from '@/types/adPackages';

interface ExtendedClassifiedFormData {
  title: string;
  description: string;
  category: string;
  price?: string;
  per?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode: string;
  email: string;
  phone: string;
  pricingTier: string;
  images: File[];
}

interface AdPaymentStepProps {
  formData: ExtendedClassifiedFormData;
  selectedPackage?: AdPackage;
  onPaymentComplete: () => void;
  onBack: () => void;
}

const AdPaymentStep = ({ formData, selectedPackage, onPaymentComplete, onBack }: AdPaymentStepProps) => {
  const handlePayment = () => {
    // TODO: Implement actual payment processing
    // For now, just simulate successful payment
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Payment</h2>
        <p className="text-gray-600">Complete your payment to publish your ad</p>
      </div>

      {/* Ad Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Title:</span>
              <p className="text-gray-600">{formData.title}</p>
            </div>
            <div>
              <span className="font-medium">Category:</span>
              <p className="text-gray-600">{formData.category}</p>
            </div>
            <div>
              <span className="font-medium">Location:</span>
              <p className="text-gray-600">{formData.zipCode}</p>
            </div>
            <div>
              <span className="font-medium">Images:</span>
              <p className="text-gray-600">{formData.images.length} uploaded</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Details */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedPackage?.adTypeName}</h3>
              <p className="text-2xl font-bold text-greenyp-600">
                ${selectedPackage?.monthlyPrice}/month
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            {selectedPackage?.features.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800">Payment Integration Coming Soon</span>
            </div>
            <p className="text-sm text-yellow-700">
              Payment processing will be integrated in the next phase. 
              For now, clicking "Complete Payment" will simulate a successful transaction.
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>Total:</span>
              <span>${selectedPackage?.monthlyPrice}/month</span>
            </div>
            
            <Button 
              onClick={handlePayment}
              size="lg" 
              className="w-full bg-greenyp-600 hover:bg-greenyp-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment - ${selectedPackage?.monthlyPrice}/month
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdPaymentStep;
