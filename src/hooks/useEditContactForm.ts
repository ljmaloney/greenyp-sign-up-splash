
import { useState } from 'react';
import { ContactFormData, Contact } from "@/types/contact";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { validateContactForm } from "@/utils/contactValidation";
import { normalizePhoneNumber } from "@/utils/phoneUtils";

export const useEditContactForm = (
  contact: Contact,
  onContactUpdated: (contact: ContactFormData) => void,
  onClose: () => void,
  existingContacts?: Contact[]
) => {
  const [formData, setFormData] = useState<ContactFormData>({
    producerLocationId: contact.producerLocationId || contact.locationId || '',
    producerContactType: contact.producerContactType || (contact.isPrimary ? 'PRIMARY' : 'SALES'),
    displayContactType: contact.displayContactType || 'NO_DISPLAY',
    genericContactName: contact.genericContactName || '',
    firstName: contact.firstName || contact.name.split(' ')[0] || '',
    lastName: contact.lastName || contact.name.split(' ').slice(1).join(' ') || '',
    title: contact.title || '',
    phoneNumber: contact.phoneNumber || contact.phone || '',
    cellPhoneNumber: contact.cellPhoneNumber || '',
    emailAddress: contact.emailAddress || contact.email || ''
  });
  
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateContactForm(formData, existingContacts, contact.id);
    if (!validation.isValid) {
      toast({
        title: "Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Updating contact:', formData);
      
      // Normalize phone numbers and send null for empty values
      const submissionData = {
        ...formData,
        phoneNumber: formData.phoneNumber.trim() ? normalizePhoneNumber(formData.phoneNumber) : null,
        cellPhoneNumber: formData.cellPhoneNumber.trim() ? normalizePhoneNumber(formData.cellPhoneNumber) : null
      };
      
      const response = await fetch(getApiUrl('/producer/contact'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submissionData,
          contactId: contact.id
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update contact: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Contact Updated",
        description: "Contact has been successfully updated.",
      });
      
      onContactUpdated(formData);
      onClose();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit
  };
};
