
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContactFormData, Contact, Location } from "@/types/contact";
import { useEditContactForm } from "@/hooks/useEditContactForm";
import ContactFormFields from "./ContactFormFields";

interface EditContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  locations: Location[];
  onContactUpdated: (contact: ContactFormData) => void;
  existingContacts?: Contact[];
}

const EditContactDialog = ({ 
  isOpen, 
  onClose, 
  contact, 
  locations, 
  onContactUpdated,
  existingContacts 
}: EditContactDialogProps) => {
  const { formData, handleChange, handleSubmit } = useEditContactForm(
    contact, 
    onContactUpdated, 
    onClose,
    existingContacts
  );

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
