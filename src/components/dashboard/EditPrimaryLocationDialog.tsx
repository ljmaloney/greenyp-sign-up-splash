
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PrimaryLocation, Producer } from '@/services/accountService';
import { usePrimaryLocationForm } from '@/hooks/usePrimaryLocationForm';
import PrimaryLocationFormFields from './PrimaryLocationFormFields';
import EditPrimaryLocationDialogHeader from './EditPrimaryLocationDialogHeader';
import EditPrimaryLocationDialogFooter from './EditPrimaryLocationDialogFooter';

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
        <EditPrimaryLocationDialogHeader />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <PrimaryLocationFormFields 
            formData={formData}
            onFieldChange={handleChange}
          />
          
          <EditPrimaryLocationDialogFooter 
            isSubmitting={isSubmitting}
            onCancel={onClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrimaryLocationDialog;
