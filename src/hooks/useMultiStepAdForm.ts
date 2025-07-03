
import React, { useState } from 'react';
import { useAdPackages } from '@/hooks/useAdPackages';
import { ExtendedClassifiedFormData, Step } from '@/types/extendedClassifiedForm';

export const useMultiStepAdForm = () => {
  const { data: adPackagesData } = useAdPackages();
  
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

  return {
    currentStep,
    setCurrentStep,
    formData,
    handleInputChange,
    selectedPackage
  };
};
