
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ContactFormData, Contact, Location } from "@/types/contact.ts";
import { useEditContactForm } from "@/hooks/useEditContactForm.ts";
import ContactFormFields from "./ContactFormFields.tsx";

interface EditContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  locations: Location[];
  onContactUpdated: (contact: ContactFormData) => void;
  existingContacts?: Contact[];
  isDashboardEdit?: boolean;
}

const EditContactDialog = ({ 
  isOpen, 
  onClose, 
  contact, 
  locations, 
  onContactUpdated,
  existingContacts,
  isDashboardEdit = false
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
            isDashboardEdit={isDashboardEdit}
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
