
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
    console.log('🔍 VALIDATION - Starting form validation');
    console.log('🔍 VALIDATION - Form data check:', {
      hasTitle: !!formData.title,
      hasDescription: !!formData.description,
      hasCategory: !!formData.category,
      hasZipCode: !!formData.zipCode,
      hasEmail: !!formData.email,
      hasPhone: !!formData.phone,
      hasFirstName: !!formData.firstName,
      hasLastName: !!formData.lastName,
      hasAddress: !!formData.address,
      hasCity: !!formData.city,
      hasState: !!formData.state,
      hasSelectedPackage: !!selectedPackage
    });
    
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
    console.log('🚀 STEP 1 - BASIC FORM SUBMIT - Starting handleBasicFormSubmit');
    console.log('🚀 STEP 1 - Current form data:', JSON.stringify(formData, null, 2));
    console.log('🚀 STEP 1 - Selected package:', JSON.stringify(selectedPackage, null, 2));
    
    if (!validateBasicForm()) {
      console.log('❌ STEP 1 - Validation failed, stopping submission');
      return;
    }

    // Check if package allows images
    if (selectedPackage && selectedPackage.features.maxImages > 0) {
      console.log('📸 STEP 1 - Package allows images, moving to images step');
      console.log('📸 STEP 1 - Max images allowed:', selectedPackage.features.maxImages);
      setCurrentStep('images');
    } else {
      console.log('💳 STEP 1 - No images allowed, moving directly to payment step');
      setCurrentStep('payment');
    }
    console.log('✅ STEP 1 - Basic form submit completed successfully');
  };

  const handleImageUploadComplete = () => {
    console.log('🖼️ STEP 2 - IMAGE UPLOAD - Starting handleImageUploadComplete');
    console.log('🖼️ STEP 2 - Current images:', formData.images.length);
    console.log('🖼️ STEP 2 - Max images allowed:', selectedPackage?.features.maxImages);
    
    if (selectedPackage && formData.images.length > selectedPackage.features.maxImages) {
      console.log('❌ STEP 2 - Too many images uploaded');
      toast({
        title: "Error",
        description: `Too many images for ${selectedPackage.adTypeName} package. Maximum: ${selectedPackage.features.maxImages}`,
        variant: "destructive"
      });
      return;
    }
    console.log('💳 STEP 2 - Images validated, moving to payment step');
    setCurrentStep('payment');
    console.log('✅ STEP 2 - Image upload completed successfully');
  };

  const handlePaymentComplete = async () => {
    console.log('💰 STEP 3 - PAYMENT COMPLETE - *** STARTING FINAL SUBMISSION ***');
    console.log('💰 STEP 3 - This is where the POST to /classified should happen');
    console.log('💰 STEP 3 - Current form data:', JSON.stringify(formData, null, 2));
    console.log('💰 STEP 3 - Selected package:', JSON.stringify(selectedPackage, null, 2));
    
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

      console.log('🌐 STEP 3 - *** ABOUT TO MAKE POST REQUEST TO /classified ***');
      console.log('🌐 STEP 3 - API Client base URL:', apiClient.getBaseUrl());
      console.log('🌐 STEP 3 - Endpoint: /classified');
      console.log('🌐 STEP 3 - Full URL will be:', `${apiClient.getBaseUrl()}/classified`);
      console.log('🌐 STEP 3 - Payload to be sent:', JSON.stringify(payload, null, 2));
      console.log('🌐 STEP 3 - Making POST request now...');

      const response = await apiClient.post('/classified', payload, { requireAuth: false });
      
      console.log('✅ STEP 3 - *** POST REQUEST COMPLETED ***');
      console.log('✅ STEP 3 - API Response received:', JSON.stringify(response, null, 2));

      if (response?.response?.classifiedId) {
        console.log('🎉 STEP 3 - SUCCESS - Classified ad created with ID:', response.response.classifiedId);
        // Removed success toast - no longer showing success message
      } else {
        console.log('🎉 STEP 3 - SUCCESS - Classified ad created (no ID in response)');
        // Removed success toast - no longer showing success message
      }
    } catch (error) {
      console.error('❌ STEP 3 - *** POST REQUEST FAILED ***');
      console.error('❌ STEP 3 - Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        fullError: error
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
