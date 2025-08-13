
import React from 'react';
import { Classified } from '@/types/classifieds';
import { validateEmail, validatePhone } from '@/utils/contactFormValidation';
import { getApiUrl } from '@/config/api';

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
    phone: '',
    submit: ''
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({ email: '', phone: '', submit: '' });
    
    // Validate required fields
    if (!formData.name.trim()) {
      setErrors({ ...errors, submit: 'Name is required' });
      return;
    }
    
    if (!formData.email.trim()) {
      setErrors({ ...errors, submit: 'Email address is required' });
      return;
    }
    
    if (!formData.message.trim()) {
      setErrors({ ...errors, submit: 'Message is required' });
      return;
    }
    
    // Validate email format
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
      return;
    }

    // Validate phone if provided
    if (formData.phone && !validatePhone(formData.phone)) {
      setErrors({ ...errors, phone: 'Please enter a valid US phone number' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare payload for /email/contact API
      const payload = {
        requestType: "CLASSIFIED_AD_EMAIL",
        classifiedRequest: {
          classifiedId: classified.id
        },
        emailAddress: formData.email,
        name: formData.name,
        phoneNumber: formData.phone || "",
        subject: formData.subject,
        message: formData.message
      };

      console.log('📧 CONTACT SELLER - Sending email via API:', payload);

      const response = await fetch(getApiUrl('/email/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      // Handle HTTP 202 response with no body
      if (response.status === 202) {
        console.log('✅ CONTACT SELLER - Email queued successfully (HTTP 202)');
      } else {
        // For other success responses, try to parse JSON if available
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('✅ CONTACT SELLER - Email sent successfully:', result);
        } else {
          console.log('✅ CONTACT SELLER - Email sent successfully');
        }
      }
      
      setIsSuccess(true);
      
      // Close dialog after a short delay to show success state
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('❌ CONTACT SELLER - Failed to send email:', error);
      setErrors({ 
        ...errors, 
        submit: 'Failed to send message. Please try again or contact the seller directly.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    isSuccess,
    handleEmailChange,
    handlePhoneChange,
    handleSubmit
  };
};
