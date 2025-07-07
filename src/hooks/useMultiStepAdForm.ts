
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdPackages } from '@/hooks/useAdPackages';
import { ExtendedClassifiedFormData, Step } from '@/types/extendedClassifiedForm';

export const useMultiStepAdForm = () => {
  const location = useLocation();
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
    pricingTier: '', // Will be set based on preSelectedPackage or defaultPackage
    images: []
  });

  // Set pricing tier based on preSelectedPackage from navigation state or defaultPackage property
  React.useEffect(() => {
    if (adPackagesData?.response && adPackagesData.response.length > 0 && !formData.pricingTier) {
      // Check if there's a pre-selected package from navigation state
      const preSelectedPackage = location.state?.preSelectedPackage;
      
      if (preSelectedPackage) {
        const selectedPackage = adPackagesData.response.find(pkg => pkg.adTypeId === preSelectedPackage && pkg.active);
        if (selectedPackage) {
          setFormData(prev => ({ ...prev, pricingTier: selectedPackage.adTypeId }));
          return;
        }
      }

      // Fallback to default package
      const defaultPackage = adPackagesData.response.find(pkg => pkg.defaultPackage && pkg.active);
      if (defaultPackage) {
        setFormData(prev => ({ ...prev, pricingTier: defaultPackage.adTypeId }));
      } else {
        // Fallback to first active package if no default is found
        const firstActivePackage = adPackagesData.response.find(pkg => pkg.active);
        if (firstActivePackage) {
          setFormData(prev => ({ ...prev, pricingTier: firstActivePackage.adTypeId }));
        }
      }
    }
  }, [adPackagesData, formData.pricingTier, location.state]);

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
