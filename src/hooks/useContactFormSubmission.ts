
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from "@/components/ui/sonner";
import { getApiUrl } from '@/config/api';
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
      // Prepare payload for /email/contact API
      const payload = {
        requestType: data.requestType, // SUBSCRIBER_INFO_TYPE or SUBSCRIBER_SUPPORT_TYPE
        companyName: data.companyName,
        emailAddress: data.email,
        name: data.name,
        phoneNumber: data.phone || "",
        subject: data.subject,
        message: data.message
      };

      console.log('📧 SUBSCRIBER CONTACT - Sending email via API:', payload);

      const response = await fetch(getApiUrl('/email/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      // Handle HTTP 202 response with no body (same as classified contact form)
      if (response.status === 202) {
        console.log('✅ SUBSCRIBER CONTACT - Email queued successfully (HTTP 202)');
      } else {
        // For other success responses, try to parse JSON if available
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('✅ SUBSCRIBER CONTACT - Email sent successfully:', result);
        } else {
          console.log('✅ SUBSCRIBER CONTACT - Email sent successfully');
        }
      }

      toast.success("Message sent successfully! We'll get back to you soon.", {
        duration: 10000
      });
      form.reset();
      
    } catch (error) {
      console.error('❌ SUBSCRIBER CONTACT - Failed to send email:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading };
};
