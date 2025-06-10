
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContactFormData, Location } from "@/types/contact";
import { useContactForm } from "@/hooks/useContactForm";
import ContactFormFields from "./ContactFormFields";

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  onContactAdded: (contact: ContactFormData) => void;
  preSelectedLocationId?: string;
}

const AddContactDialog = ({ isOpen, onClose, locations, onContactAdded, preSelectedLocationId }: AddContactDialogProps) => {
  const { formData, handleChange, handleSubmit } = useContactForm(onContactAdded, onClose, preSelectedLocationId);

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
