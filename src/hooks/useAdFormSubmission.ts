
import { useToast } from '@/hooks/use-toast';
import { useApiClient } from '@/hooks/useApiClient';
import { ExtendedClassifiedFormData, Step } from '@/types/extendedClassifiedForm';
import { AdPackage } from '@/types/adPackages';
import { FULL_NAME_TO_ABBREVIATION } from '@/constants/usStates';

export const useAdFormSubmission = (
  formData: ExtendedClassifiedFormData,
  selectedPackage: AdPackage | undefined,
  setCurrentStep: (step: Step) => void
) => {
  const { toast } = useToast();
  const apiClient = useApiClient();

  const validateBasicForm = () => {
    console.log('🔍 VALIDATION - Validating form data:', formData);
    
    if (!formData.title || !formData.description || !formData.category || 
        !formData.zipCode || !formData.email || !formData.phone ||
        !formData.firstName || !formData.lastName || !formData.address ||
        !formData.city || !formData.state) {
      console.log('❌ VALIDATION - Form validation failed - missing required fields');
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (!selectedPackage) {
      console.log('❌ VALIDATION - Form validation failed - no package selected');
      toast({
        title: "Error",
        description: "Please select a valid ad package",
        variant: "destructive"
      });
      return false;
    }

    console.log('✅ VALIDATION - Form validation passed');
    return true;
  };

  const handleBasicFormSubmit = () => {
    console.log('🚀 BASIC FORM SUBMIT - handleBasicFormSubmit called');
    if (!validateBasicForm()) return;

    // Check if package allows images
    if (selectedPackage && selectedPackage.features.maxImages > 0) {
      console.log('📸 BASIC FORM SUBMIT - Moving to images step');
      setCurrentStep('images');
    } else {
      console.log('💳 BASIC FORM SUBMIT - Moving to payment step');
      setCurrentStep('payment');
    }
  };

  const handleImageUploadComplete = () => {
    console.log('🖼️ IMAGE UPLOAD - handleImageUploadComplete called');
    if (selectedPackage && formData.images.length > selectedPackage.features.maxImages) {
      toast({
        title: "Error",
        description: `Too many images for ${selectedPackage.adTypeName} package. Maximum: ${selectedPackage.features.maxImages}`,
        variant: "destructive"
      });
      return;
    }
    console.log('💳 IMAGE UPLOAD - Moving to payment step after images');
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async () => {
    console.log('💰 PAYMENT COMPLETE - handlePaymentComplete called');
    console.log('📋 PAYMENT COMPLETE - Current form data:', JSON.stringify(formData, null, 2));
    console.log('📦 PAYMENT COMPLETE - Selected package:', JSON.stringify(selectedPackage, null, 2));
    
    try {
      // Handle empty price and per fields
      const priceValue = formData.price && formData.price.trim() !== '' ? parseFloat(formData.price) : 0;
      const perValue = formData.price && formData.price.trim() !== '' && formData.per ? formData.per : 'NA';
      
      // Convert state name to abbreviation
      const stateAbbreviation = FULL_NAME_TO_ABBREVIATION[formData.state || ''] || formData.state;
      
      const payload = {
        adType: formData.pricingTier,
        categoryId: formData.category,
        price: priceValue,
        pricePerUnitType: perValue,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: stateAbbreviation,
        postalCode: formData.zipCode,
        phoneNumber: formData.phone,
        emailAddress: formData.email,
        title: formData.title,
        description: formData.description
      };

      console.log('🌐 PAYMENT COMPLETE - About to submit classified ad with payload:', JSON.stringify(payload, null, 2));
      console.log('🔗 PAYMENT COMPLETE - API Client base URL:', apiClient.getBaseUrl());
      console.log('🔗 PAYMENT COMPLETE - Making POST request to /classified endpoint');

      const response = await apiClient.post('/classified', payload, { requireAuth: true });
      
      console.log('✅ PAYMENT COMPLETE - API Response received:', JSON.stringify(response, null, 2));

      if (response?.response?.classifiedId) {
        console.log('🎉 PAYMENT COMPLETE - Classified ad created successfully with ID:', response.response.classifiedId);
        toast({
          title: "Success!",
          description: `Your classified ad has been created successfully! ID: ${response.response.classifiedId}`,
        });
      } else {
        console.log('🎉 PAYMENT COMPLETE - Classified ad created successfully (no ID returned)');
        toast({
          title: "Success!",
          description: "Your ad has been posted successfully!",
        });
      }
    } catch (error) {
      console.error('❌ PAYMENT COMPLETE - Failed to submit classified ad:', error);
      console.error('❌ PAYMENT COMPLETE - Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast({
        title: "Error",
        description: `Failed to submit your ad: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return {
    handleBasicFormSubmit,
    handleImageUploadComplete,
    handlePaymentComplete
  };
};
