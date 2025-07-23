
import React from 'react';
import { useMultiStepAdForm } from '@/hooks/useMultiStepAdForm';
import { useAdFormSubmission } from '@/hooks/useAdFormSubmission';
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

  const {
    handleBasicFormSubmit,
    handleImageUploadComplete
  } = useAdFormSubmission(formData, selectedPackage, setCurrentStep);

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
