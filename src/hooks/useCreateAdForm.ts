import { useState } from 'react';
import React from 'react';
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
      
      console.log('🎯 FORM INIT - Ad packages available:', adPackagesData.response.map(pkg => ({
        id: pkg.adTypeId,
        name: pkg.adTypeName
      })));
      console.log('🎯 FORM INIT - Pre-selected package from navigation:', preSelectedPackage);
      
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
          console.log('🎯 FORM INIT - Found matching package:', selectedPackage.adTypeId, selectedPackage.adTypeName);
          setFormData(prev => ({ ...prev, adType: selectedPackage.adTypeId }));
          return;
        } else {
          console.log('🎯 FORM INIT - No matching package found for:', preSelectedPackage);
        }
      }

      // Fallback to default package
      const defaultPackage = adPackagesData.response.find(pkg => pkg.defaultPackage && pkg.active);
      if (defaultPackage) {
        console.log('🎯 FORM INIT - Using default package:', defaultPackage.adTypeId, defaultPackage.adTypeName);
        setFormData(prev => ({ ...prev, adType: defaultPackage.adTypeId }));
      } else {
        // Fallback to first active package if no default is found
        const firstActivePackage = adPackagesData.response.find(pkg => pkg.active);
        if (firstActivePackage) {
          console.log('🎯 FORM INIT - Using first active package:', firstActivePackage.adTypeId, firstActivePackage.adTypeName);
          setFormData(prev => ({ ...prev, adType: firstActivePackage.adTypeId }));
        }
      }
    }
  }, [adPackagesData, formData.adType, location.state]);

  const adPackages = adPackagesData?.response?.filter(pkg => pkg.active) || [];
  const categories = categoriesData?.response?.filter(cat => cat.active) || [];
  const selectedPackage = adPackages.find(pkg => pkg.adTypeId === formData.adType);

  const handleInputChange = (field: keyof FormData, value: string) => {
    console.log('📝 FORM CHANGE - Field:', field, 'Value:', value);
    if (field === 'adType') {
      // Ensure we're always setting a valid UUID for adType
      const selectedPkg = adPackages.find(pkg => pkg.adTypeId === value);
      if (selectedPkg) {
        console.log('📝 FORM CHANGE - Valid adType UUID:', value, 'Package:', selectedPkg.adTypeName);
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

      console.log('🚀 SUBMIT - Form data:', formData);
      console.log('🚀 SUBMIT - Selected package:', selectedPackage);
      console.log('🚀 SUBMIT - Payload being sent:', payload);
      console.log('🚀 SUBMIT - AdType UUID validation:', {
        adType: payload.adType,
        isValidUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.adType),
        matchingPackage: adPackages.find(pkg => pkg.adTypeId === payload.adType)?.adTypeName
      });
      console.log('📤 SUBMIT - Payload JSON string:', JSON.stringify(payload, null, 2));
      console.log('🌐 SUBMIT - API Base URL:', apiClient.getBaseUrl());
      console.log('🎯 SUBMIT - Full endpoint URL:', `${apiClient.getBaseUrl()}/classified/create-ad`);
      
      const response = await apiClient.post('/classified/create-ad', payload, { requireAuth: false });
      console.log('✅ SUBMIT - Classified ad created:', response);

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
