
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdPackages } from '@/hooks/useAdPackages';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { US_STATES_AND_TERRITORIES, FULL_NAME_TO_ABBREVIATION } from '@/constants/usStates';
import { CheckIcon } from 'lucide-react';

interface FormData {
  adType: string;
  categoryId: string;
  price: string;
  pricePerUnitType: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  emailAddress: string;
  title: string;
  description: string;
}

const CreateAd = () => {
  const navigate = useNavigate();
  const { data: adPackagesData } = useAdPackages();
  const { data: categoriesData } = useClassifiedCategories();
  const apiClient = useApiClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    adType: '',
    categoryId: '',
    price: '',
    pricePerUnitType: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    emailAddress: '',
    title: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const adPackages = adPackagesData?.response?.filter(pkg => pkg.active) || [];
  const categories = categoriesData?.response?.filter(cat => cat.active) || [];
  const selectedPackage = adPackages.find(pkg => pkg.adTypeId === formData.adType);

  const predefinedPerOptions = [
    'Hour', 'Day', 'Each', 'Set', 'Lot', 'Yard', 'Sq Ft'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = [
      'adType', 'categoryId', 'firstName', 'lastName', 'address', 
      'city', 'state', 'postalCode', 'phoneNumber', 'emailAddress', 
      'title', 'description'
    ];

    for (const field of required) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Validation Error",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        adType: formData.adType,
        categoryId: formData.categoryId,
        price: formData.price ? parseFloat(formData.price) : 0,
        pricePerUnitType: formData.pricePerUnitType || 'NA',
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: FULL_NAME_TO_ABBREVIATION[formData.state] || formData.state,
        postalCode: formData.postalCode,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        title: formData.title,
        description: formData.description
      };

      console.log('🚀 Submitting classified ad:', payload);
      const response = await apiClient.post('/classified/create-ad', payload, { requireAuth: false });
      console.log('✅ Classified ad created:', response);

      if (response?.response?.classifiedId) {
        const classifiedId = response.response.classifiedId;
        
        if (selectedPackage && selectedPackage.features.maxImages > 0) {
          // Go to image upload page
          navigate(`/classifieds/uploadimages/${classifiedId}`, { 
            state: { classifiedData: response.response, packageData: selectedPackage }
          });
        } else {
          // Go directly to payment page
          navigate(`/classifieds/payment/${classifiedId}`, { 
            state: { classifiedData: response.response, packageData: selectedPackage }
          });
        }

        toast({
          title: "Success!",
          description: "Your classified ad has been created successfully!",
        });
      }
    } catch (error) {
      console.error('❌ Error creating classified ad:', error);
      toast({
        title: "Error",
        description: `Failed to create your ad: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Classified Ad</h1>
            <p className="text-gray-600">Create your classified ad in just a few simple steps</p>
          </div>

          <div className="space-y-6">
            {/* Card 1: Select Ad Package */}
            <Card>
              <CardHeader>
                <CardTitle>Select Your Ad Package</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {adPackages.map((pkg) => (
                    <div
                      key={pkg.adTypeId}
                      onClick={() => handleInputChange('adType', pkg.adTypeId)}
                      className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                        formData.adType === pkg.adTypeId 
                          ? 'bg-yellow-50 border-yellow-500 border-2' 
                          : 'border-greenyp-500 hover:bg-greenyp-50'
                      }`}
                    >
                      <div className="font-semibold text-lg mb-2">{pkg.adTypeName}</div>
                      <div className="text-2xl font-bold text-greenyp-600 mb-4">${pkg.monthlyPrice}/month</div>
                      <div className="space-y-2">
                        {pkg.features.features.map((feature, index) => (
                          <div key={index} className="flex items-start text-sm text-gray-600">
                            <CheckIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Enter Ad Details */}
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Ad Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {categories.map((cat) => (
                        <SelectItem key={cat.categoryId} value={cat.categoryId}>
                          {cat.name} - {cat.shortDescription}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (optional)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="per">Per (optional)</Label>
                    <Select value={formData.pricePerUnitType} onValueChange={(value) => handleInputChange('pricePerUnitType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {predefinedPerOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter ad title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your item or service"
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Enter Ad Location */}
            <Card>
              <CardHeader>
                <CardTitle>Enter the Ad Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  The address you provide below helps determine your location so that listings can be sorted by distance from potential buyers. <strong>Only the city, state, and ZIP code will be visible in your ad</strong> — your street address will remain private.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter street address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 max-h-96">
                        {US_STATES_AND_TERRITORIES.map((stateName) => (
                          <SelectItem key={stateName} value={stateName}>
                            {stateName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="Enter zip code"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Provide Your Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 5: Next Steps */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    {selectedPackage && selectedPackage.features.maxImages > 0 ? (
                      <span className="text-sm text-gray-600">Step 2 - Upload Images</span>
                    ) : (
                      <span className="text-sm text-gray-600">Proceed to Payment</span>
                    )}
                  </div>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-greenyp-600 hover:bg-greenyp-700 px-8"
                  >
                    {isSubmitting ? 'Creating...' : 'Continue'}
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

export default CreateAd;
