
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { ClassifiedData, CustomerData } from '@/types/classifieds';

interface PaymentLayoutProps {
  classified: ClassifiedData;
  customer: CustomerData;
  onBack: () => void;
  onSubmit: (paymentData: any) => void;
}

const PaymentLayout = ({ classified, customer, onBack, onSubmit }: PaymentLayoutProps) => {
  const [step, setStep] = useState<'payment' | 'confirmation'>('payment');
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [emailValidationToken, setEmailValidationToken] = useState('');
  const [isEmailValidated, setIsEmailValidated] = useState(false);

  const handleBillingInfoChange = (info: any, token: string) => {
    setBillingInfo(info);
    setEmailValidationToken(token);
    setIsEmailValidated(true);
  };

  const handlePaymentComplete = () => {
    setStep('confirmation');
    onSubmit({ billingInfo, classified, customer });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Preview
          </Button>
        </div>

        {step === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{classified.title}</h3>
                    <p className="text-sm text-gray-600">{classified.category}</p>
                    <p className="text-sm text-gray-600">Duration: {classified.duration} days</p>
                  </div>
                  
                  <hr />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Listing Fee</span>
                      <span>${classified.price}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${classified.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-600">Payment form component would go here</p>
                    <Button 
                      onClick={handlePaymentComplete}
                      className="mt-4"
                    >
                      Complete Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your classified ad has been submitted and will be reviewed shortly.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentLayout;
