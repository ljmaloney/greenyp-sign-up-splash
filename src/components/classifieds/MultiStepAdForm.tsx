
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdPackages } from '@/hooks/useAdPackages';
import { useApiClient } from '@/hooks/useApiClient';
import { ClassifiedFormData } from '@/types/classifieds';
import AdBasicDetailsStep from './AdBasicDetailsStep';
import AdImageUploadStep from './AdImageUploadStep';
import AdPaymentStep from './AdPaymentStep';

interface ExtendedClassifiedFormData extends Omit<ClassifiedFormData, 'pricingTier'> {
  price?: string;
  per?: string;
  address?: string;
  city?: string;
  state?: string;
  firstName: string;
  lastName: string;
  pricingTier: string; // Now stores adTypeId
}

type Step = 'basic' | 'images' | 'payment';

const MultiStepAdForm = () => {
  const { toast } = useToast();
  const { data: adPackagesData } = useAdPackages();
  const apiClient = useApiClient();
  
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [formData, setFormData] = useState<ExtendedClassifiedFormData>({
    title: '',
    description: '',
    category: '',
    price: '',
    per: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pricingTier: '', // Will be set to first available adTypeId
    images: []
  });

  // Set default tier to first available package if not set
  React.useEffect(() => {
    if (adPackagesData?.response && adPackagesData.response.length > 0 && !formData.pricingTier) {
      const firstActivePackage = adPackagesData.response.find(pkg => pkg.active);
      if (firstActivePackage) {
        setFormData(prev => ({ ...prev, pricingTier: firstActivePackage.adTypeId }));
      }
    }
  }, [adPackagesData, formData.pricingTier]);

  const handleInputChange = (field: keyof ExtendedClassifiedFormData, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectedPackage = adPackagesData?.response?.find(pkg => pkg.adTypeId === formData.pricingTier);

  const validateBasicForm = () => {
    if (!formData.title || !formData.description || !formData.category || 
        !formData.zipCode || !formData.email || !formData.phone ||
        !formData.firstName || !formData.lastName || !formData.address ||
        !formData.city || !formData.state) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (!selectedPackage) {
      toast({
        title: "Error",
        description: "Please select a valid ad package",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleBasicFormSubmit = () => {
    if (!validateBasicForm()) return;

    // Check if package allows images
    if (selectedPackage && selectedPackage.features.maxImages > 0) {
      setCurrentStep('images');
    } else {
      setCurrentStep('payment');
    }
  };

  const handleImageUploadComplete = () => {
    if (selectedPackage && formData.images.length > selectedPackage.features.maxImages) {
      toast({
        title: "Error",
        description: `Too many images for ${selectedPackage.adTypeName} package. Maximum: ${selectedPackage.features.maxImages}`,
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async () => {
    try {
      console.log('Submitting classified ad to API:', formData);
      
      // Handle empty price and per fields
      const priceValue = formData.price && formData.price.trim() !== '' ? parseFloat(formData.price) : 0.00;
      const perValue = formData.price && formData.price.trim() !== '' && formData.per ? formData.per : 'NA';
      
      const payload = {
        adType: formData.pricingTier,
        categoryId: formData.category,
        price: priceValue,
        pricePerUnitType: perValue,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.zipCode,
        phoneNumber: formData.phone,
        title: formData.title,
        description: formData.description
      };

      console.log('API Payload:', payload);

      const response = await apiClient.post('/classified', payload, { requireAuth: true });
      
      console.log('API Response:', response);

      if (response?.response?.classifiedId) {
        toast({
          title: "Success!",
          description: `Your classified ad has been created successfully! ID: ${response.response.classifiedId}`,
        });
      } else {
        toast({
          title: "Success!",
          description: "Your ad has been posted successfully!",
        });
      }
    } catch (error) {
      console.error('Failed to submit classified ad:', error);
      toast({
        title: "Error",
        description: "Failed to submit your ad. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (currentStep === 'basic') {
    return (
      <AdBasicDetailsStep
        formData={formData}
        onFieldChange={handleInputChange}
        onSubmit={handleBasicFormSubmit}
        selectedPackage={selectedPackage}
      />
    );
  }

  if (currentStep === 'images') {
    return (
      <AdImageUploadStep
        images={formData.images}
        maxImages={selectedPackage?.features.maxImages || 0}
        onImagesChange={(images) => handleInputChange('images', images)}
        onProceedToPayment={handleImageUploadComplete}
        onBack={() => setCurrentStep('basic')}
        selectedPackage={selectedPackage}
      />
    );
  }

  if (currentStep === 'payment') {
    return (
      <AdPaymentStep
        formData={formData}
        selectedPackage={selectedPackage}
        onPaymentComplete={handlePaymentComplete}
        onBack={() => {
          if (selectedPackage && selectedPackage.features.maxImages > 0) {
            setCurrentStep('images');
          } else {
            setCurrentStep('basic');
          }
        }}
      />
    );
  }

  return null;
};

export default MultiStepAdForm;
