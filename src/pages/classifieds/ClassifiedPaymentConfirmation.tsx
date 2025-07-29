
import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';

const PaymentConfirmation = () => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const [searchParams] = useSearchParams();
  
  const paymentSuccess = searchParams.get('paymentSuccess') === 'true';
  const orderRef = searchParams.get('orderRef');
  const paymentRef = searchParams.get('paymentRef');
  const receiptNumber = searchParams.get('receiptNumber');

  if (!paymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card>
              <CardContent className="pt-6 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Not Confirmed</h1>
                <p className="text-gray-600 mb-6">
                  We couldn't confirm your payment. Please try again or contact support.
                </p>
                <Link to="/classifieds">
                  <Button>Return to Classifieds</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Your classified ad payment has been processed successfully. Your ad is now live and visible to potential customers.
                </p>
              </div>

              {/* Payment Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  {orderRef && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Reference:</span>
                      <span className="font-mono">{orderRef}</span>
                    </div>
                  )}
                  {paymentRef && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Reference:</span>
                      <span className="font-mono">{paymentRef}</span>
                    </div>
                  )}
                  {receiptNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Receipt Number:</span>
                      <span className="font-mono">{receiptNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">What's Next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Your ad is now live and searchable</li>
                  <li>• You'll receive email notifications for any inquiries</li>
                  <li>• Your ad will remain active for 30 days</li>
                  <li>• You can manage your ad from your account dashboard</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to={`/classifieds/${classifiedId}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Your Ad
                  </Button>
                </Link>
                <Link to="/classifieds" className="flex-1">
                  <Button className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Classifieds
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default PaymentConfirmation;
