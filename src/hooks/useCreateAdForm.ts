
import { useState } from 'react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdPackages } from '@/hooks/useAdPackages';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { ClassifiedCreationApiResponse } from '@/types/classifiedCreation';
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

// Helper function for conditional logging
const debugLog = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(message, ...args);
  }
};

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
      
      debugLog('🎯 FORM INIT - Ad packages available:', adPackagesData.response.map(pkg => ({
        id: pkg.adTypeId,
        name: pkg.adTypeName
      })));
      debugLog('🎯 FORM INIT - Pre-selected package from navigation:', preSelectedPackage);
      
      if (preSelectedPackage) {
        // Look for exact match first (UUID)
        let selectedPackage = adPackagesData.response.find(pkg => pkg.adTypeId === preSelectedPackage && pkg.active);
        
        // If no exact match, try to find by name (fallback for old logic)
        if (!selectedPackage) {
          selectedPackage = adPackagesData.response.find(pkg => 
            pkg.adTypeName.toLowerCase() === preSelectedPackage.toLowerCase() && pkg.active
          );
        }
        
        if (selectedPackage) {
          debugLog('🎯 FORM INIT - Found matching package:', selectedPackage.adTypeId, selectedPackage.adTypeName);
          setFormData(prev => ({ ...prev, adType: selectedPackage.adTypeId }));
          return;
        } else {
          debugLog('🎯 FORM INIT - No matching package found for:', preSelectedPackage);
        }
      }

      // Fallback to default package
      const defaultPackage = adPackagesData.response.find(pkg => pkg.defaultPackage && pkg.active);
      if (defaultPackage) {
        debugLog('🎯 FORM INIT - Using default package:', defaultPackage.adTypeId, defaultPackage.adTypeName);
        setFormData(prev => ({ ...prev, adType: defaultPackage.adTypeId }));
      } else {
        // Fallback to first active package if no default is found
        const firstActivePackage = adPackagesData.response.find(pkg => pkg.active);
        if (firstActivePackage) {
          debugLog('🎯 FORM INIT - Using first active package:', firstActivePackage.adTypeId, firstActivePackage.adTypeName);
          setFormData(prev => ({ ...prev, adType: firstActivePackage.adTypeId }));
        }
      }
    }
  }, [adPackagesData, formData.adType, location.state]);

  const adPackages = adPackagesData?.response?.filter(pkg => pkg.active) || [];
  const categories = categoriesData?.response?.filter(cat => cat.active) || [];
  const selectedPackage = adPackages.find(pkg => pkg.adTypeId === formData.adType);

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Only log important adType changes for validation
    if (field === 'adType') {
      const selectedPkg = adPackages.find(pkg => pkg.adTypeId === value);
      if (selectedPkg) {
        debugLog('📝 FORM CHANGE - Valid adType UUID:', value, 'Package:', selectedPkg.adTypeName);
      } else {
        console.warn('📝 FORM CHANGE - Invalid adType value:', value);
      }
    }
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
    
    // Additional validation to ensure adType is a valid UUID
    if (formData.adType && !adPackages.find(pkg => pkg.adTypeId === formData.adType)) {
      console.error('❌ VALIDATION - Invalid adType UUID:', formData.adType);
      toast({
        title: "Validation Error",
        description: "Please select a valid ad package",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        adType: formData.adType, // This should now always be a proper UUID
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

      debugLog('🚀 SUBMIT - Form data:', formData);
      debugLog('🚀 SUBMIT - Selected package:', selectedPackage);
      debugLog('🚀 SUBMIT - Payload being sent:', payload);
      debugLog('🚀 SUBMIT - AdType UUID validation:', {
        adType: payload.adType,
        isValidUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.adType),
        matchingPackage: adPackages.find(pkg => pkg.adTypeId === payload.adType)?.adTypeName
      });
      debugLog('📤 SUBMIT - Payload JSON string:', JSON.stringify(payload, null, 2));
      debugLog('🌐 SUBMIT - API Base URL:', apiClient.getBaseUrl());
      debugLog('🎯 SUBMIT - Full endpoint URL:', `${apiClient.getBaseUrl()}/classified/create-ad`);
      
      const response = await apiClient.post('/classified/create-ad', payload, { requireAuth: false });
      debugLog('✅ SUBMIT - Classified ad created:', response);

      // Type assertion to properly handle the response
      const apiResponse = response as ClassifiedCreationApiResponse;
      
      if (apiResponse?.response?.classifiedId) {
        const classifiedId = apiResponse.response.classifiedId;
        
        if (selectedPackage && selectedPackage.features.maxImages > 0) {
          // Go to image upload page
          navigate(`/classifieds/uploadimages/${classifiedId}`, { 
            state: { classifiedData: apiResponse.response, packageData: selectedPackage }
          });
        } else {
          // Go directly to payment page
          navigate(`/classifieds/payment/${classifiedId}`, { 
            state: { classifiedData: apiResponse.response, packageData: selectedPackage }
          });
        }
      }
    } catch (error) {
      console.error('❌ SUBMIT - Error creating classified ad:', error);
      console.error('❌ SUBMIT - Error details:', {
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
