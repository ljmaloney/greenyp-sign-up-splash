
import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';

const PaymentError = () => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const [searchParams] = useSearchParams();
  
  const error = searchParams.get('error') || 'Payment processing failed';
  const errorCode = searchParams.get('errorCode') || 'UNKNOWN_ERROR';

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  We encountered an issue processing your payment. Please review the error details below and try again.
                </p>
              </div>

              {/* Error Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 text-red-600">Error Details</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error Code:</span>
                      <span className="font-mono text-red-600">{errorCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error Message:</span>
                      <span className="text-red-600 text-right flex-1 ml-4">{error}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Issues */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Common Issues</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Check that all billing information is correct</li>
                  <li>• Verify your card has sufficient funds</li>
                  <li>• Ensure your card is not expired</li>
                  <li>• Try using a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to={`/classifieds/payment/${classifiedId}`} className="flex-1">
                  <Button className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </Link>
                <Link to="/classifieds" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Classifieds
                  </Button>
                </Link>
              </div>

              {/* Support Information */}
              <div className="border-t pt-4 text-center">
                <p className="text-sm text-gray-600">
                  Need help? Contact our support team with the error code above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default PaymentError;
