
import React from 'react';
import { useMultiStepAdForm } from '@/hooks/useMultiStepAdForm';
import { useAdFormSubmission } from '@/hooks/useAdFormSubmission';
import AdBasicDetailsStep from './AdBasicDetailsStep';
import AdImageUploadStep from './AdImageUploadStep';
import AdPaymentStep from './AdPaymentStep';

const MultiStepAdForm = () => {
  console.log('MultiStepAdForm rendering...');
  
  const {
    currentStep,
    setCurrentStep,
    formData,
    handleInputChange,
    selectedPackage
  } = useMultiStepAdForm();

  console.log('Current step:', currentStep);
  console.log('Form data:', formData);
  console.log('Selected package:', selectedPackage);

  const {
    handleBasicFormSubmit,
    handleImageUploadComplete,
    handlePaymentComplete
  } = useAdFormSubmission(formData, selectedPackage, setCurrentStep);

  if (currentStep === 'basic') {
    console.log('Rendering basic step');
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
    console.log('Rendering images step');
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
    console.log('Rendering payment step');
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

  console.log('No step matched, returning null');
  return null;
};

export default MultiStepAdForm;
