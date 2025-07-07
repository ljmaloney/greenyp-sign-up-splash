
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdPackages } from '@/hooks/useAdPackages';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { FULL_NAME_TO_ABBREVIATION } from '@/constants/usStates';

interface FormData {
  adType: string;
  categoryId: string;
  price: string;
  pricePerUnitType: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  emailAddress: string;
  title: string;
  description: string;
}

export const useCreateAdForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: adPackagesData } = useAdPackages();
  const { data: categoriesData } = useClassifiedCategories();
  const apiClient = useApiClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    adType: '',
    categoryId: '',
    price: '',
    pricePerUnitType: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    emailAddress: '',
    title: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set adType based on preSelectedPackage from navigation state or default
  React.useEffect(() => {
    if (adPackagesData?.response && adPackagesData.response.length > 0 && !formData.adType) {
      // Check if there's a pre-selected package from navigation state
      const preSelectedPackage = location.state?.preSelectedPackage;
      
      if (preSelectedPackage) {
        const selectedPackage = adPackagesData.response.find(pkg => pkg.adTypeId === preSelectedPackage && pkg.active);
        if (selectedPackage) {
          setFormData(prev => ({ ...prev, adType: selectedPackage.adTypeId }));
          return;
        }
      }

      // Fallback to default package
      const defaultPackage = adPackagesData.response.find(pkg => pkg.defaultPackage && pkg.active);
      if (defaultPackage) {
        setFormData(prev => ({ ...prev, adType: defaultPackage.adTypeId }));
      } else {
        // Fallback to first active package if no default is found
        const firstActivePackage = adPackagesData.response.find(pkg => pkg.active);
        if (firstActivePackage) {
          setFormData(prev => ({ ...prev, adType: firstActivePackage.adTypeId }));
        }
      }
    }
  }, [adPackagesData, formData.adType, location.state]);

  const adPackages = adPackagesData?.response?.filter(pkg => pkg.active) || [];
  const categories = categoriesData?.response?.filter(cat => cat.active) || [];
  const selectedPackage = adPackages.find(pkg => pkg.adTypeId === formData.adType);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = [
      'adType', 'categoryId', 'firstName', 'lastName', 'address', 
      'city', 'state', 'postalCode', 'phoneNumber', 'emailAddress', 
      'title', 'description'
    ];

    for (const field of required) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Validation Error",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        adType: formData.adType,
        categoryId: formData.categoryId,
        price: formData.price ? parseFloat(formData.price) : 0,
        pricePerUnitType: formData.pricePerUnitType || 'NA',
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: FULL_NAME_TO_ABBREVIATION[formData.state] || formData.state,
        postalCode: formData.postalCode,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        title: formData.title,
        description: formData.description
      };

      console.log('🚀 Submitting classified ad:', payload);
      console.log('📤 Payload JSON string:', JSON.stringify(payload, null, 2));
      console.log('🌐 API Base URL:', apiClient.getBaseUrl());
      console.log('🎯 Full endpoint URL:', `${apiClient.getBaseUrl()}/classified/create-ad`);
      
      // Try using the direct endpoint path that matches your server configuration
      const response = await apiClient.post('/classified/create-ad', payload, { requireAuth: false });
      console.log('✅ Classified ad created:', response);

      if (response?.response?.classifiedId) {
        const classifiedId = response.response.classifiedId;
        
        if (selectedPackage && selectedPackage.features.maxImages > 0) {
          // Go to image upload page
          navigate(`/classifieds/uploadimages/${classifiedId}`, { 
            state: { classifiedData: response.response, packageData: selectedPackage }
          });
        } else {
          // Go directly to payment page
          navigate(`/classifieds/payment/${classifiedId}`, { 
            state: { classifiedData: response.response, packageData: selectedPackage }
          });
        }

        toast({
          title: "Success!",
          description: "Your classified ad has been created successfully!",
        });
      }
    } catch (error) {
      console.error('❌ Error creating classified ad:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      toast({
        title: "Error",
        description: `Failed to create your ad: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    adPackages,
    categories,
    selectedPackage
  };
};
