
import React, { useState, useMemo } from 'react';
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
import { useClassifiedImages } from '@/hooks/useClassifiedImages';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';

const Payment = () => {
  const { classifiedId } = useParams();
  const location = useLocation();
  
  const classifiedData = location.state?.classifiedData;
  const packageData = location.state?.packageData;

  // Fetch categories to get the category name
  const { data: categories = [] } = useClassifiedCategories();
  
  // Find the category name based on categoryId
  const categoryName = useMemo(() => {
    if (!classifiedData?.categoryId || !categories.length) return 'Category';
    const category = categories.find(cat => cat.categoryId === classifiedData.categoryId);
    return category?.name || 'Category';
  }, [classifiedData?.categoryId, categories]);

  // Fetch images if the package supports them
  const shouldFetchImages = packageData?.features?.maxImages > 0;
  const { data: images = [], isLoading: imagesLoading } = useClassifiedImages(
    classifiedId || '', 
    shouldFetchImages
  );

  // Select a random image to display
  const randomImage = useMemo(() => {
    if (!images || images.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }, [images]);

  // Truncate description to 200 characters
  const truncatedDescription = useMemo(() => {
    if (!classifiedData?.description) return '';
    if (classifiedData.description.length <= 200) return classifiedData.description;
    return classifiedData.description.substring(0, 200) + '...';
  }, [classifiedData?.description]);

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

              {/* Ad Preview Card - New Layout */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Ad Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <Card className="hover:shadow-md hover:border-yellow-500 transition-all duration-200 border-2">
                      <CardContent className="p-4 space-y-3">
                        {/* Title and Price - Left justified */}
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg flex-1 text-left">
                            {classifiedData?.title}
                            {classifiedData?.price > 0 && (
                              <span className="text-greenyp-600 ml-2">
                                - ${classifiedData.price}
                                {classifiedData.pricePerUnitType && classifiedData.pricePerUnitType !== 'NA' ? ` per ${classifiedData.pricePerUnitType}` : ''}
                              </span>
                            )}
                          </h3>
                        </div>
                        
                        {/* Category and Date */}
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{categoryName}</Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1 text-greenyp-600" />
                            {format(new Date(), 'MMM dd')}
                          </div>
                        </div>
                        
                        {/* Location - Left justified */}
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1 text-greenyp-600" />
                          {classifiedData?.city}, {classifiedData?.state} {classifiedData?.postalCode}
                        </div>

                        {/* Random Image - if package supports images */}
                        {packageData?.features?.maxImages > 0 && randomImage && (
                          <div className="relative h-48 w-full mt-3">
                            <img 
                              src={randomImage.url} 
                              alt={randomImage.description || classifiedData?.title || 'Ad image'}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                console.error('Failed to load image:', randomImage.url);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        {/* Truncated Description */}
                        <p className="text-gray-700 text-sm text-left leading-relaxed">
                          {truncatedDescription}
                        </p>
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
