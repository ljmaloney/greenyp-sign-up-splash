
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ExtendedClassifiedFormData } from '@/types/extendedClassifiedForm';
import { AdPackage } from '@/types/adPackages';

export const useAdFormSubmission = (
  formData: ExtendedClassifiedFormData,
  selectedPackage: AdPackage | null,
  setCurrentStep: (step: string) => void
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBasicFormSubmit = () => {
    console.log('Basic form submitted, moving to images step');
    setCurrentStep('images');
  };

  const handleImageUploadComplete = async () => {
    if (!selectedPackage) {
      toast({
        title: "Error",
        description: "No package selected",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting ad with data:', formData);
      
      // Simulate API call to create classified ad
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock classified ID
      const mockClassifiedId = 'demo_' + Date.now();
      
      toast({
        title: "Ad Created Successfully",
        description: "Your classified ad has been created. Proceeding to payment...",
      });
      
      // Navigate to payment page
      navigate(`/classified/payment/${mockClassifiedId}`);
      
    } catch (error) {
      console.error('Error creating ad:', error);
      toast({
        title: "Error",
        description: "Failed to create ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleBasicFormSubmit,
    handleImageUploadComplete,
    isSubmitting
  };
};
