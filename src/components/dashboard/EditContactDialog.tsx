
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { ContactFormData, Contact, Location } from "@/types/contact";
import { validateContactForm } from "@/utils/contactValidation";
import ContactFormFields from "./ContactFormFields";

interface EditContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  locations: Location[];
  onContactUpdated: (contact: ContactFormData) => void;
}

const EditContactDialog = ({ isOpen, onClose, contact, locations, onContactUpdated }: EditContactDialogProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    producerLocationId: contact.producerLocationId || contact.locationId || '',
    producerContactType: contact.producerContactType || (contact.isPrimary ? 'PRIMARY' : 'SALES'),
    displayContactType: contact.displayContactType || 'NO_DISPLAY',
    genericContactName: contact.genericContactName || '',
    firstName: contact.firstName || contact.name.split(' ')[0] || '',
    lastName: contact.lastName || contact.name.split(' ').slice(1).join(' ') || '',
    phoneNumber: contact.phoneNumber || contact.phone || '',
    cellPhoneNumber: contact.cellPhoneNumber || '',
    emailAddress: contact.emailAddress || contact.email || ''
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateContactForm(formData);
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
      
      const response = await fetch(getApiUrl('/producer/contact'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
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

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <ContactFormFields
            formData={formData}
            locations={locations}
            onFieldChange={handleChange}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700">
              Update Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
