
import { useState, useEffect } from 'react';
import { ContactFormData, Contact } from "@/types/contact";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { validateContactForm } from "@/utils/contactValidation";
import { normalizePhoneNumber } from "@/utils/phoneUtils";

export const useContactForm = (
  onSuccess: (contact: ContactFormData) => void, 
  onClose: () => void, 
  preSelectedLocationId?: string,
  existingContacts?: Contact[]
) => {
  const [formData, setFormData] = useState<ContactFormData>({
    producerLocationId: '',
    producerContactType: 'PRIMARY',
    displayContactType: 'PHONE_EMAIL_ONLY',
    genericContactName: '',
    firstName: '',
    lastName: '',
    title: '',
    phoneNumber: '',
    cellPhoneNumber: '',
    emailAddress: ''
  });
  
  const { toast } = useToast();

  // Set pre-selected location when provided
  useEffect(() => {
    if (preSelectedLocationId) {
      setFormData(prev => ({ ...prev, producerLocationId: preSelectedLocationId }));
    }
  }, [preSelectedLocationId]);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value };
      
      // When contact type changes to PRIMARY, default display type to PHONE_EMAIL_ONLY
      if (field === 'producerContactType' && value === 'PRIMARY') {
        newFormData.displayContactType = 'PHONE_EMAIL_ONLY';
      }
      
      return newFormData;
    });
  };

  const resetForm = () => {
    setFormData({
      producerLocationId: preSelectedLocationId || '',
      producerContactType: 'PRIMARY',
      displayContactType: 'PHONE_EMAIL_ONLY',
      genericContactName: '',
      firstName: '',
      lastName: '',
      title: '',
      phoneNumber: '',
      cellPhoneNumber: '',
      emailAddress: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateContactForm(formData, existingContacts);
    if (!validation.isValid) {
      toast({
        title: "Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Adding contact:', formData);
      
      // Normalize phone numbers and send null for empty values
      const submissionData = {
        ...formData,
        phoneNumber: formData.phoneNumber.trim() ? normalizePhoneNumber(formData.phoneNumber) : null,
        cellPhoneNumber: formData.cellPhoneNumber.trim() ? normalizePhoneNumber(formData.cellPhoneNumber) : null
      };
      
      const response = await fetch(getApiUrl(`/producer/location/${formData.producerLocationId}/contact`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add contact: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Contact Added",
        description: "Contact has been successfully added.",
      });
      
      onSuccess(formData);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm
  };
};
