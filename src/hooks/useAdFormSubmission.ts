
import { useToast } from '@/hooks/use-toast';
import { useApiClient } from '@/hooks/useApiClient';
import { ExtendedClassifiedFormData, Step } from '@/types/extendedClassifiedForm';
import { AdPackage } from '@/types/adPackages';

export const useAdFormSubmission = (
  formData: ExtendedClassifiedFormData,
  selectedPackage: AdPackage | undefined,
  setCurrentStep: (step: Step) => void
) => {
  const { toast } = useToast();
  const apiClient = useApiClient();

  const validateBasicForm = () => {
    if (!formData.title || !formData.description || !formData.category || 
        !formData.zipCode || !formData.email || !formData.phone ||
        !formData.firstName || !formData.lastName || !formData.address ||
        !formData.city || !formData.state) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (!selectedPackage) {
      toast({
        title: "Error",
        description: "Please select a valid ad package",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleBasicFormSubmit = () => {
    if (!validateBasicForm()) return;

    // Check if package allows images
    if (selectedPackage && selectedPackage.features.maxImages > 0) {
      setCurrentStep('images');
    } else {
      setCurrentStep('payment');
    }
  };

  const handleImageUploadComplete = () => {
    if (selectedPackage && formData.images.length > selectedPackage.features.maxImages) {
      toast({
        title: "Error",
        description: `Too many images for ${selectedPackage.adTypeName} package. Maximum: ${selectedPackage.features.maxImages}`,
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async () => {
    try {
      console.log('Submitting classified ad to API:', formData);
      
      // Handle empty price and per fields
      const priceValue = formData.price && formData.price.trim() !== '' ? parseFloat(formData.price) : 0;
      const perValue = formData.price && formData.price.trim() !== '' && formData.per ? formData.per : 'NA';
      
      const payload = {
        adType: formData.pricingTier,
        categoryId: formData.category,
        price: priceValue,
        pricePerUnitType: perValue,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.zipCode,
        phoneNumber: formData.phone,
        emailAddress: formData.email,
        title: formData.title,
        description: formData.description
      };

      console.log('API Payload:', payload);

      const response = await apiClient.post('/classified', payload, { requireAuth: true });
      
      console.log('API Response:', response);

      if (response?.response?.classifiedId) {
        toast({
          title: "Success!",
          description: `Your classified ad has been created successfully! ID: ${response.response.classifiedId}`,
        });
      } else {
        toast({
          title: "Success!",
          description: "Your ad has been posted successfully!",
        });
      }
    } catch (error) {
      console.error('Failed to submit classified ad:', error);
      toast({
        title: "Error",
        description: "Failed to submit your ad. Please try again.",
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
