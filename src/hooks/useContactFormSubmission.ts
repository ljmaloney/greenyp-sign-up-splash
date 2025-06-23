
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from "@/components/ui/sonner";
import { 
  validateName, 
  validateEmail, 
  validateSubject, 
  validatePhone, 
  validateCompanyName 
} from "@/utils/contactFormValidation";

interface ContactFormData {
  requestType: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const useContactFormSubmission = (form: UseFormReturn<ContactFormData>) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    // Validate fields
    if (!data.requestType) {
      toast.error("Please select a request type.");
      return;
    }

    if (!validateCompanyName(data.companyName)) {
      toast.error("Company name should only contain letters and spaces.");
      return;
    }

    if (!validateName(data.name)) {
      toast.error("Contact name should only contain letters and spaces.");
      return;
    }

    if (!validateEmail(data.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validateSubject(data.subject)) {
      toast.error("Subject should only contain letters and spaces.");
      return;
    }

    if (!validatePhone(data.phone)) {
      toast.error("Please enter a valid phone number format.");
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        requestType: data.requestType,
        leadContactRequest: null,
        companyName: data.companyName,
        emailAddress: data.email,
        name: data.name,
        phoneNumber: data.phone || null,
        subject: data.subject,
        message: data.message
      };

      const response = await fetch('http://services.greenyp.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        form.reset();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading };
};
