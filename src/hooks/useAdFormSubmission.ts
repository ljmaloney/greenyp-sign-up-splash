
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
    console.log('🔍 Validating form data:', formData);
    
    if (!formData.title || !formData.description || !formData.category || 
        !formData.zipCode || !formData.email || !formData.phone ||
        !formData.firstName || !formData.lastName || !formData.address ||
        !formData.city || !formData.state) {
      console.log('❌ Form validation failed - missing required fields');
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (!selectedPackage) {
      console.log('❌ Form validation failed - no package selected');
      toast({
        title: "Error",
        description: "Please select a valid ad package",
        variant: "destructive"
      });
      return false;
    }

    console.log('✅ Form validation passed');
    return true;
  };

  const handleBasicFormSubmit = () => {
    console.log('🚀 handleBasicFormSubmit called');
    if (!validateBasicForm()) return;

    // Check if package allows images
    if (selectedPackage && selectedPackage.features.maxImages > 0) {
      console.log('📸 Moving to images step');
      setCurrentStep('images');
    } else {
      console.log('💳 Moving to payment step');
      setCurrentStep('payment');
    }
  };

  const handleImageUploadComplete = () => {
    console.log('🖼️ handleImageUploadComplete called');
    if (selectedPackage && formData.images.length > selectedPackage.features.maxImages) {
      toast({
        title: "Error",
        description: `Too many images for ${selectedPackage.adTypeName} package. Maximum: ${selectedPackage.features.maxImages}`,
        variant: "destructive"
      });
      return;
    }
    console.log('💳 Moving to payment step after images');
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async () => {
    console.log('💰 handlePaymentComplete called');
    console.log('📋 Current form data:', formData);
    console.log('📦 Selected package:', selectedPackage);
    
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

      console.log('🌐 About to submit classified ad with payload:', payload);
      console.log('🔗 API Client base URL:', apiClient.getBaseUrl());

      const response = await apiClient.post('/classified', payload, { requireAuth: true });
      
      console.log('✅ API Response received:', response);

      if (response?.response?.classifiedId) {
        console.log('🎉 Classified ad created successfully with ID:', response.response.classifiedId);
        toast({
          title: "Success!",
          description: `Your classified ad has been created successfully! ID: ${response.response.classifiedId}`,
        });
      } else {
        console.log('🎉 Classified ad created successfully (no ID returned)');
        toast({
          title: "Success!",
          description: "Your ad has been posted successfully!",
        });
      }
    } catch (error) {
      console.error('❌ Failed to submit classified ad:', error);
      console.error('❌ Error details:', {
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
