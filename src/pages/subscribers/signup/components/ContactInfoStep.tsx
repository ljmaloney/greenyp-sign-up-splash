
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignupFormData } from '../SubscriberSignUp';
import { formatPhoneAsUserTypes } from '@/utils/phoneFormatting';

interface ContactInfoStepProps {
  formData: SignupFormData;
  updateFormData: (field: keyof SignupFormData, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ formData, updateFormData, onNext, onPrev }: ContactInfoStepProps) => {
  const isValid = formData.firstName && formData.lastName && formData.emailAddress;

  const handlePhoneChange = (field: keyof SignupFormData, value: string) => {
    const formatted = formatPhoneAsUserTypes(value);
    updateFormData(field, formatted);
  };

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Primary Contact Information</h3>
        <p className="text-gray-600 mb-6">Provide the primary contact details for your business</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="genericContactName">Generic Contact Name</Label>
          <Input
            id="genericContactName"
            value={formData.genericContactName}
            onChange={(e) => updateFormData('genericContactName', e.target.value)}
            placeholder="e.g., Customer Service, Sales Team"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              placeholder="First name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="Job title"
          />
        </div>

        <div>
          <Label htmlFor="emailAddress">Email Address *</Label>
          <Input
            id="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={(e) => updateFormData('emailAddress', e.target.value)}
            placeholder="contact@yourcompany.com"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handlePhoneChange('phoneNumber', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="cellPhoneNumber">Cell Phone Number</Label>
            <Input
              id="cellPhoneNumber"
              value={formData.cellPhoneNumber}
              onChange={(e) => handlePhoneChange('cellPhoneNumber', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!isValid}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default ContactInfoStep;
