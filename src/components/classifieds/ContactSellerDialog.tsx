
import React, { useEffect } from 'react';
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
    isSubmitting,
    isSuccess,
    handleEmailChange,
    handlePhoneChange,
    handleSubmit
  } = useContactSellerForm(classified, () => onOpenChange(false));

  // Ensure body scroll is restored when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Force restore body scroll when dialog closes
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Message Seller</DialogTitle>
          <DialogDescription>
               <b>Ad Title :<em>"{classified.title}"</em></b>
          </DialogDescription>
        </DialogHeader>

        <SellerContactDisplay classified={classified} />

        <ContactSellerForm
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          errors={errors}
          isSubmitting={isSubmitting}
          isSuccess={isSuccess}
          onEmailChange={handleEmailChange}
          onPhoneChange={handlePhoneChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerDialog;
