
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Classified } from '@/types/classifieds';
import { useContactSellerForm } from '@/hooks/useContactSellerForm';
import ContactSellerForm from './ContactSellerForm';
import SellerContactDisplay from './SellerContactDisplay';

interface ContactSellerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classified: Classified;
}

const ContactSellerDialog = ({ isOpen, onOpenChange, classified }: ContactSellerDialogProps) => {
  const {
    formData,
    setFormData,
    errors,
    handleEmailChange,
    handlePhoneChange,
    handleSubmit
  } = useContactSellerForm(classified, () => onOpenChange(false));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to the seller about "{classified.title}"
          </DialogDescription>
        </DialogHeader>

        <SellerContactDisplay classified={classified} />

        <ContactSellerForm
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          errors={errors}
          onEmailChange={handleEmailChange}
          onPhoneChange={handlePhoneChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerDialog;
