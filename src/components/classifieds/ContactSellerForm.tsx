
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

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
    submit: string;
  };
  isSubmitting: boolean;
  isSuccess: boolean;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
}

const ContactSellerForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  errors,
  isSubmitting,
  isSuccess,
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
        <MDEditor
          value={formData.message}
          onChange={(val) => onFormDataChange({ ...formData, message: val || '' })}
          data-color-mode="light"
          height={150}
          preview="edit"
          hideToolbar={false}
          visibleDragbar={false}
        />
      </div>

      {errors.submit && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      {isSuccess && (
        <div className="text-green-500 text-sm bg-green-50 p-3 rounded-lg flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Message sent successfully! The seller will contact you soon.
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          className="flex-1 bg-greenyp-600 hover:bg-greenyp-700"
          disabled={!!errors.email || !!errors.phone || isSubmitting || isSuccess}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Message Sent
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ContactSellerForm;
