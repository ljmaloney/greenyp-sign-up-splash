
import React from 'react';
import { useMultiStepAdForm } from '@/hooks/classifieds/useMultiStepAdForm';
import { useAdFormSubmission } from '@/hooks/classifieds/useAdFormSubmission';
import AdBasicDetailsStep from './AdBasicDetailsStep';
import AdImageUploadStep from './AdImageUploadStep';
import AdPaymentStep from './AdPaymentStep';

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
    handleImageUploadComplete,
    handlePaymentComplete
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
