
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { createContactService } from '@/services/contactService';
import { Contact } from '@/services/accountService';
import { normalizePhoneNumber } from "@/utils/phoneUtils";

interface ContactFormData {
  contactId: string;
  producerLocationId: string;
  producerContactType: string;
  displayContactType: string;
  genericContactName: string;
  firstName: string;
  lastName: string;
  title: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailAddress: string;
}

interface UseDashboardContactFormProps {
  contact: Contact;
  locationId: string;
  onClose: () => void;
}

export const useDashboardContactForm = ({ contact, locationId, onClose }: UseDashboardContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    contactId: contact.contactId,
    producerLocationId: contact.producerLocationId,
    producerContactType: contact.producerContactType,
    displayContactType: contact.displayContactType,
    genericContactName: contact.genericContactName || '',
    firstName: contact.firstName,
    lastName: contact.lastName,
    title: contact.title || '',
    phoneNumber: contact.phoneNumber,
    cellPhoneNumber: contact.cellPhoneNumber || '',
    emailAddress: contact.emailAddress,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  const contactService = createContactService(apiClient);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('🚀 Updating dashboard contact with payload:', formData);
      
      // Normalize phone numbers and send null for empty values
      const submissionData = {
        ...formData,
        phoneNumber: formData.phoneNumber.trim() ? normalizePhoneNumber(formData.phoneNumber) : null,
        cellPhoneNumber: formData.cellPhoneNumber.trim() ? normalizePhoneNumber(formData.cellPhoneNumber) : null
      };
      
      await contactService.updateContact(locationId, submissionData);

      // Invalidate and refetch account data
      queryClient.invalidateQueries({ queryKey: ['accountData'] });
      
      toast({
        title: "Contact Updated",
        description: "Contact has been successfully updated.",
      });
      
      onClose();
    } catch (error) {
      console.error('❌ Error updating contact:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};
