
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrimaryLocation, Producer } from '@/services/accountService';
import { usePrimaryLocationForm } from '@/hooks/usePrimaryLocationForm';
import PrimaryLocationFormFields from './PrimaryLocationFormFields';

interface EditPrimaryLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  primaryLocation: PrimaryLocation;
  producer: Producer;
}

const EditPrimaryLocationDialog = ({ isOpen, onClose, primaryLocation, producer }: EditPrimaryLocationDialogProps) => {
  const { formData, isSubmitting, handleChange, handleSubmit } = usePrimaryLocationForm({
    primaryLocation,
    producer,
    onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Primary Location</DialogTitle>
          <DialogDescription>
            Update your primary location information. This is the main address for your business.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <PrimaryLocationFormFields 
            formData={formData}
            onFieldChange={handleChange}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-greenyp-600 hover:bg-greenyp-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrimaryLocationDialog;
