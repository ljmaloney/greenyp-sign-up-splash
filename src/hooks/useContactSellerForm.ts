
import React from 'react';
import { Classified } from '@/types/classifieds';
import { validateEmail, validatePhone } from '@/utils/contactFormValidation';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const useContactSellerForm = (classified: Classified, onClose: () => void) => {
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: `Re - ${classified.title}`,
    message: ''
  });

  const [errors, setErrors] = React.useState({
    email: '',
    phone: ''
  });

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    if (email && !validateEmail(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePhoneChange = (phone: string) => {
    setFormData({ ...formData, phone });
    if (phone && !validatePhone(phone)) {
      setErrors({ ...errors, phone: 'Please enter a valid US phone number' });
    } else {
      setErrors({ ...errors, phone: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
      return;
    }

    // Validate phone if provided
    if (formData.phone && !validatePhone(formData.phone)) {
      setErrors({ ...errors, phone: 'Please enter a valid US phone number' });
      return;
    }
    
    // Create mailto link with pre-filled content
    const subject = formData.subject;
    const body = `Hi,

I'm interested in your listing: ${classified.title}

${formData.message}

Best regards,
${formData.name}
${formData.email}
${formData.phone}`;

    const mailtoLink = `mailto:${classified.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    onClose();
  };

  return {
    formData,
    setFormData,
    errors,
    handleEmailChange,
    handlePhoneChange,
    handleSubmit
  };
};
