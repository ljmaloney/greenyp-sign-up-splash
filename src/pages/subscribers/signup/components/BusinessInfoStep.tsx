
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SignupFormData } from '../SubscriberSignUp';

interface BusinessInfoStepProps {
  formData: SignupFormData;
  updateFormData: (field: keyof SignupFormData, value: string) => void;
  onNext: () => void;
}

const BusinessInfoStep = ({ formData, updateFormData, onNext }: BusinessInfoStepProps) => {
  const { data: lineOfBusinessData, isLoading: lobLoading } = useLineOfBusiness();
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useSubscriptions();

  const isValid = formData.businessName && formData.lineOfBusinessId && formData.subscriptionId;

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Business Information</h3>
        <p className="text-gray-600 mb-6">Tell us about your business</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => updateFormData('businessName', e.target.value)}
            placeholder="Enter your business name"
            required
          />
        </div>

        <div>
          <Label htmlFor="lineOfBusiness">Line of Business *</Label>
          <Select
            value={formData.lineOfBusinessId}
            onValueChange={(value) => updateFormData('lineOfBusinessId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={lobLoading ? "Loading..." : "Select your business category"} />
            </SelectTrigger>
            <SelectContent>
              {lineOfBusinessData?.map((lob) => (
                <SelectItem key={lob.lineOfBusinessId} value={lob.lineOfBusinessId}>
                  {lob.lineOfBusinessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subscription">Subscription Plan *</Label>
          <Select
            value={formData.subscriptionId}
            onValueChange={(value) => updateFormData('subscriptionId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={subscriptionsLoading ? "Loading..." : "Select a subscription plan"} />
            </SelectTrigger>
            <SelectContent>
              {subscriptionsData?.map((subscription) => (
                <SelectItem key={subscription.subscriptionId} value={subscription.subscriptionId}>
                  {subscription.displayName} - ${subscription.monthlyAutopayAmount}/month
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => updateFormData('websiteUrl', e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <Label htmlFor="narrative">Business Description</Label>
          <Textarea
            id="narrative"
            value={formData.narrative}
            onChange={(e) => updateFormData('narrative', e.target.value)}
            placeholder="Tell us about your business and services..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!isValid}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
