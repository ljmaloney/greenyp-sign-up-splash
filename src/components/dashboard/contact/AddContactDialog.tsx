
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ContactFormData, Location, Contact } from "@/types/contact.ts";
import { useContactForm } from "@/hooks/useContactForm.ts";
import { useApiClient } from "@/hooks/useApiClient";
import ContactFormFields from "./ContactFormFields.tsx";

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  onContactAdded: (contact: ContactFormData) => void;
  preSelectedLocationId?: string;
  existingContacts?: Contact[];
  isDashboardEdit?: boolean;
}

const AddContactDialog = ({ 
  isOpen, 
  onClose, 
  locations, 
  onContactAdded, 
  preSelectedLocationId,
  existingContacts,
  isDashboardEdit = false
}: AddContactDialogProps) => {
  const apiClient = useApiClient();
  const { formData, handleChange, handleSubmit } = useContactForm(
    apiClient,
    onContactAdded, 
    onClose, 
    preSelectedLocationId,
    existingContacts
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
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
              Add Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
