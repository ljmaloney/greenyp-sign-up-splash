
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, X } from 'lucide-react';
import { Classified } from '@/types/classifieds';
import { validateEmail, validatePhone } from '@/utils/contactFormValidation';

interface ContactSellerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classified: Classified;
}

const ContactSellerDialog = ({ isOpen, onOpenChange, classified }: ContactSellerDialogProps) => {
  const [formData, setFormData] = React.useState({
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
    
    onOpenChange(false);
  };

  const formatContact = (contact: string, type: 'email' | 'phone') => {
    if (!classified.contactObfuscated) {
      return contact;
    }
    
    if (type === 'email') {
      const [username, domain] = contact.split('@');
      return `${username.slice(0, 2)}***@${domain}`;
    } else {
      return `${contact.slice(0, 3)}***${contact.slice(-4)}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to the seller about "{classified.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-sm space-x-6">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-greenyp-600" />
              <span className="text-gray-600">
                {formatContact(classified.email, 'email')}
              </span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-greenyp-600" />
              <span className="text-gray-600">
                {formatContact(classified.phone, 'phone')}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onChange={(e) => handleEmailChange(e.target.value)}
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
              onChange={(e) => handlePhoneChange(e.target.value)}
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
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Subject"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerDialog;
