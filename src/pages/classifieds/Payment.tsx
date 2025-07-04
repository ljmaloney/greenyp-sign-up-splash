
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, MapPin, Calendar, Lock } from 'lucide-react';
import { format } from 'date-fns';

const Payment = () => {
  const { classifiedId } = useParams();
  const location = useLocation();
  
  const classifiedData = location.state?.classifiedData;
  const packageData = location.state?.packageData;

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = () => {
    // TODO: Implement payment processing
    console.log('Processing payment for classified:', classifiedId);
    console.log('Payment form data:', paymentForm);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">Review your ad details and complete payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Summary and Ad Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Package</div>
                      <div className="text-sm text-gray-600 mt-1">{packageData?.adTypeName || 'Unknown'}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Price</div>
                      <div className="text-lg font-bold text-greenyp-600 mt-1">${packageData?.monthlyPrice || 0}/month</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Duration</div>
                      <div className="text-sm text-gray-600 mt-1">30 days</div>
                    </div>
                  </div>
                  {packageData?.features.maxImages > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>Includes:</strong> Up to {packageData.features.maxImages} images
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ad Preview as Tile */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Ad Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <Card className="border-2 border-yellow-500 hover:shadow-md transition-all duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg line-clamp-2 text-center flex-1">{classifiedData?.title}</h3>
                          <Badge variant="secondary" className="ml-2">Category</Badge>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-greenyp-600" />
                            {classifiedData?.postalCode}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-greenyp-600" />
                            {format(new Date(), 'MMM dd')}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-gray-700 text-sm line-clamp-3 text-left">
                          {classifiedData?.description}
                        </p>

                        {classifiedData?.price > 0 && (
                          <div className="text-lg font-bold text-greenyp-600">
                            ${classifiedData.price}{classifiedData.pricePerUnitType && classifiedData.pricePerUnitType !== 'NA' ? ` per ${classifiedData.pricePerUnitType}` : ''}
                          </div>
                        )}

                        <div className="text-sm text-gray-600">
                          {classifiedData?.city}, {classifiedData?.state} {classifiedData?.postalCode}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentForm.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={paymentForm.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="billingAddress">Address *</Label>
                    <Input
                      id="billingAddress"
                      placeholder="123 Main St"
                      value={paymentForm.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="San Francisco"
                        value={paymentForm.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        placeholder="CA"
                        value={paymentForm.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      placeholder="94102"
                      value={paymentForm.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-gray-900">
                      Total: ${packageData?.monthlyPrice || 0}/month
                    </div>
                    <p className="text-sm text-gray-600">
                      By clicking "Complete Purchase", you agree to pay ${packageData?.monthlyPrice || 0}/month for your classified ad.
                    </p>
                    <Button 
                      onClick={handlePayment}
                      size="lg" 
                      className="bg-greenyp-600 hover:bg-greenyp-700 w-full px-8"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Complete Purchase - ${packageData?.monthlyPrice || 0}/month
                    </Button>
                    <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
                      <Lock className="w-3 h-3 mr-1" />
                      Secure 256-bit SSL encryption
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default Payment;
