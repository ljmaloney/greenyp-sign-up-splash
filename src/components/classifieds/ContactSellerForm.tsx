
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { validateEmail, validatePhone } from '@/utils/contactFormValidation';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactSellerFormProps {
  formData: ContactFormData;
  onFormDataChange: (data: ContactFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  errors: {
    email: string;
    phone: string;
  };
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
}

const ContactSellerForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  errors,
  onEmailChange,
  onPhoneChange
}: ContactSellerFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Your Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Your Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="your@email.com"
          required
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Your Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="(555) 123-4567"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => onFormDataChange({ ...formData, subject: e.target.value })}
          placeholder="Subject"
          required
        />
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => onFormDataChange({ ...formData, message: e.target.value })}
          placeholder="I'm interested in your listing..."
          rows={4}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          className="flex-1 bg-greenyp-600 hover:bg-greenyp-700"
          disabled={!!errors.email || !!errors.phone}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Message
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ContactSellerForm;
