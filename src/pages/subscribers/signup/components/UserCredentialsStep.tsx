
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignupFormData } from '../SubscriberSignUp';
import { formatPhoneAsUserTypes } from '@/utils/phoneFormatting';
import { validatePasswords } from '@/utils/userFormValidation';
import { useToast } from '@/hooks/use-toast';

interface UserCredentialsStepProps {
  formData: SignupFormData;
  updateFormData: (field: keyof SignupFormData, value: string) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const UserCredentialsStep = ({ formData, updateFormData, onPrev, onSubmit, isSubmitting }: UserCredentialsStepProps) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const isValid = formData.userFirstName && 
    formData.userLastName && 
    formData.userEmailAddress && 
    formData.userName && 
    formData.password && 
    formData.confirmPassword;

  const handlePhoneChange = (field: keyof SignupFormData, value: string) => {
    const formatted = formatPhoneAsUserTypes(value);
    updateFormData(field, formatted);
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const passwordValidation = validatePasswords(formData.password, formData.confirmPassword);
    if (!passwordValidation.isValid) {
      toast({
        title: passwordValidation.error?.title,
        description: passwordValidation.error?.description,
        variant: "destructive",
      });
      return;
    }

    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">User Account Setup</h3>
        <p className="text-gray-600 mb-6">Create your login credentials for the dashboard</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="userFirstName">First Name *</Label>
            <Input
              id="userFirstName"
              value={formData.userFirstName}
              onChange={(e) => updateFormData('userFirstName', e.target.value)}
              placeholder="First name"
              required
            />
          </div>
          <div>
            <Label htmlFor="userLastName">Last Name *</Label>
            <Input
              id="userLastName"
              value={formData.userLastName}
              onChange={(e) => updateFormData('userLastName', e.target.value)}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="userEmailAddress">Email Address *</Label>
          <Input
            id="userEmailAddress"
            type="email"
            value={formData.userEmailAddress}
            onChange={(e) => updateFormData('userEmailAddress', e.target.value)}
            placeholder="your.email@company.com"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessPhone">Business Phone</Label>
            <Input
              id="businessPhone"
              value={formData.businessPhone}
              onChange={(e) => handlePhoneChange('businessPhone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="cellPhone">Cell Phone</Label>
            <Input
              id="cellPhone"
              value={formData.cellPhone}
              onChange={(e) => handlePhoneChange('cellPhone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="userName">Username *</Label>
          <Input
            id="userName"
            value={formData.userName}
            onChange={(e) => updateFormData('userName', e.target.value)}
            placeholder="Choose a username"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            placeholder="Create a secure password"
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="showPassword" className="text-sm">Show passwords</Label>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          Previous
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!isValid || isSubmitting}
          className="bg-greenyp-600 hover:bg-greenyp-700"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </div>
  );
};

export default UserCredentialsStep;
