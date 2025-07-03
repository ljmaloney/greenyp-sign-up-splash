
import React, { useState } from 'react';
import { useAdPackages } from '@/hooks/useAdPackages';
import { ExtendedClassifiedFormData, Step } from '@/types/extendedClassifiedForm';

export const useMultiStepAdForm = () => {
  console.log('useMultiStepAdForm hook initializing...');
  
  const { data: adPackagesData } = useAdPackages();
  console.log('Ad packages data:', adPackagesData);
  
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

  console.log('Initial form data set');

  // Set default tier to first available package if not set
  React.useEffect(() => {
    console.log('Effect running - checking for default package...');
    if (adPackagesData?.response && adPackagesData.response.length > 0 && !formData.pricingTier) {
      const firstActivePackage = adPackagesData.response.find(pkg => pkg.active);
      console.log('First active package:', firstActivePackage);
      if (firstActivePackage) {
        console.log('Setting default pricing tier to:', firstActivePackage.adTypeId);
        setFormData(prev => ({ ...prev, pricingTier: firstActivePackage.adTypeId }));
      }
    }
  }, [adPackagesData, formData.pricingTier]);

  const handleInputChange = (field: keyof ExtendedClassifiedFormData, value: string | File[]) => {
    console.log('Input change:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectedPackage = adPackagesData?.response?.find(pkg => pkg.adTypeId === formData.pricingTier);
  console.log('Selected package in hook:', selectedPackage);

  return {
    currentStep,
    setCurrentStep,
    formData,
    handleInputChange,
    selectedPackage
  };
};
