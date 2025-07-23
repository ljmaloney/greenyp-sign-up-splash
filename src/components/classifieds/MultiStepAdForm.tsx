
import React from 'react';
import { useMultiStepAdForm } from '@/hooks/useMultiStepAdForm';
import AdBasicDetailsStep from './AdBasicDetailsStep';
import AdImageUploadStep from './AdImageUploadStep';

const MultiStepAdForm = () => {
  const {
    currentStep,
    setCurrentStep,
    formData,
    handleInputChange,
    selectedPackage
  } = useMultiStepAdForm();

  const handleBasicFormSubmit = () => {
    console.log('Basic form submitted, moving to images step');
    setCurrentStep('images');
  };

  const handleImageUploadComplete = () => {
    console.log('Image upload complete, ad creation finished');
    // For now, just log completion - payment functionality removed
    alert('Ad created successfully! Payment functionality has been removed.');
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

  return null;
};

export default MultiStepAdForm;
