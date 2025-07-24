
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useQuery } from '@tanstack/react-query';
import { fetchLineOfBusiness } from '@/services/lineOfBusinessService';
import { fetchSubscriptions } from '@/services/subscriptionService';
import { getApiUrl } from '@/config/api';

interface SignupFormData {
  businessName: string;
  lineOfBusinessId: string;
  subscriptionId: string;
  websiteUrl: string;
  narrative: string;
  genericContactName: string;
  firstName: string;
  lastName: string;
  title: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailAddress: string;
  locationName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  locationWebsiteUrl: string;
  masterFirstName: string;
  masterLastName: string;
  businessPhone: string;
  cellPhone: string;
  masterEmailAddress: string;
  userName: string;
  credentials: string;
}

const SubscriberSignUp = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    businessName: '',
    lineOfBusinessId: '',
    subscriptionId: '',
    websiteUrl: '',
    narrative: '',
    genericContactName: '',
    firstName: '',
    lastName: '',
    title: '',
    phoneNumber: '',
    cellPhoneNumber: '',
    emailAddress: '',
    locationName: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    state: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
    locationWebsiteUrl: '',
    masterFirstName: '',
    masterLastName: '',
    businessPhone: '',
    cellPhone: '',
    masterEmailAddress: '',
    userName: '',
    credentials: ''
  });

  // Fetch line of business options
  const { data: lineOfBusinessData, isLoading: isLoadingLOB } = useQuery({
    queryKey: ['lineOfBusiness'],
    queryFn: fetchLineOfBusiness,
  });

  // Fetch subscription options
  const { data: subscriptionData, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: fetchSubscriptions,
  });

  const handleInputChange = (field: keyof SignupFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email addresses
    if (!validateEmail(formData.emailAddress)) {
      toast.error('Please enter a valid email address for primary contact');
      return;
    }
    
    if (!validateEmail(formData.masterEmailAddress)) {
      toast.error('Please enter a valid email address for master user');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        producerRequest: {
          businessName: formData.businessName,
          lineOfBusinessId: formData.lineOfBusinessId,
          subscriptionId: formData.subscriptionId,
          subscriptionType: "LIVE_UNPAID",
          invoiceCycleType: "MONTHLY",
          websiteUrl: formData.websiteUrl,
          narrative: formData.narrative
        },
        primaryContact: {
          producerContactType: "PRIMARY",
          displayContactType: "NO_DISPLAY",
          genericContactName: formData.genericContactName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          title: formData.title,
          phoneNumber: formatPhoneNumber(formData.phoneNumber),
          cellPhoneNumber: formatPhoneNumber(formData.cellPhoneNumber),
          emailAddress: formData.emailAddress
        },
        primaryLocation: {
          locationName: formData.locationName,
          locationType: "HOME_OFFICE_PRIMARY",
          locationDisplayType: "NO_DISPLAY",
          active: true,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          addressLine3: formData.addressLine3,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          latitude: formData.latitude,
          longitude: formData.longitude,
          websiteUrl: formData.locationWebsiteUrl
        },
        masterUserCredentials: {
          firstName: formData.masterFirstName,
          lastName: formData.masterLastName,
          businessPhone: formatPhoneNumber(formData.businessPhone),
          cellPhone: formatPhoneNumber(formData.cellPhone),
          emailAddress: formData.masterEmailAddress,
          userName: formData.userName,
          credentials: formData.credentials
        }
      };

      console.log('Submitting signup data:', payload);

      const response = await fetch(getApiUrl('/account'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Signup failed: ${response.status}`);
      }

      toast.success('Account created successfully!');
      navigate('/subscribers');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Professional Subscriber Sign Up</CardTitle>
              <CardDescription>
                Create your professional account to start listing your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Business Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lineOfBusinessId">Line of Business *</Label>
                      <Select
                        value={formData.lineOfBusinessId}
                        onValueChange={(value) => handleInputChange('lineOfBusinessId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select line of business" />
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subscriptionId">Subscription Plan *</Label>
                      <Select
                        value={formData.subscriptionId}
                        onValueChange={(value) => handleInputChange('subscriptionId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subscription plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {subscriptionData?.map((sub) => (
                            <SelectItem key={sub.subscriptionId} value={sub.subscriptionId}>
                              {sub.displayName}
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
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="narrative">Business Description</Label>
                    <Textarea
                      id="narrative"
                      value={formData.narrative}
                      onChange={(e) => handleInputChange('narrative', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Primary Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Primary Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="genericContactName">Generic Contact Name</Label>
                      <Input
                        id="genericContactName"
                        value={formData.genericContactName}
                        onChange={(e) => handleInputChange('genericContactName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cellPhoneNumber">Cell Phone Number</Label>
                      <Input
                        id="cellPhoneNumber"
                        type="tel"
                        value={formData.cellPhoneNumber}
                        onChange={(e) => handleInputChange('cellPhoneNumber', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="emailAddress">Email Address *</Label>
                      <Input
                        id="emailAddress"
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Location Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Primary Location Information</h3>
                  
                  <div>
                    <Label htmlFor="locationName">Location Name *</Label>
                    <Input
                      id="locationName"
                      value={formData.locationName}
                      onChange={(e) => handleInputChange('locationName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="addressLine2">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="locationWebsiteUrl">Location Website URL</Label>
                    <Input
                      id="locationWebsiteUrl"
                      type="url"
                      value={formData.locationWebsiteUrl}
                      onChange={(e) => handleInputChange('locationWebsiteUrl', e.target.value)}
                    />
                  </div>
                </div>

                {/* Master User Credentials */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Master User Credentials</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="masterFirstName">First Name *</Label>
                      <Input
                        id="masterFirstName"
                        value={formData.masterFirstName}
                        onChange={(e) => handleInputChange('masterFirstName', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="masterLastName">Last Name *</Label>
                      <Input
                        id="masterLastName"
                        value={formData.masterLastName}
                        onChange={(e) => handleInputChange('masterLastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessPhone">Business Phone *</Label>
                      <Input
                        id="businessPhone"
                        type="tel"
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cellPhone">Cell Phone</Label>
                      <Input
                        id="cellPhone"
                        type="tel"
                        value={formData.cellPhone}
                        onChange={(e) => handleInputChange('cellPhone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="masterEmailAddress">Email Address *</Label>
                      <Input
                        id="masterEmailAddress"
                        type="email"
                        value={formData.masterEmailAddress}
                        onChange={(e) => handleInputChange('masterEmailAddress', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="userName">Username *</Label>
                      <Input
                        id="userName"
                        value={formData.userName}
                        onChange={(e) => handleInputChange('userName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="credentials">Password *</Label>
                    <Input
                      id="credentials"
                      type="password"
                      value={formData.credentials}
                      onChange={(e) => handleInputChange('credentials', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isLoadingLOB || isLoadingSubscriptions}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriberSignUp;
