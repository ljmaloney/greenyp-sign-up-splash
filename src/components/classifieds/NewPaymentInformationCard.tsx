
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPhoneNumber, formatPhoneAsUserTypes } from '@/utils/phoneFormatting';

interface ClassifiedData {
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  emailAddress: string;
}

interface NewPaymentInformationCardProps {
  classified: ClassifiedData;
  customer: CustomerData;
}

const NewPaymentInformationCard = ({ classified, customer }: NewPaymentInformationCardProps) => {
  const { toast } = useToast();
  
  const [billingContact, setBillingContact] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.emailAddress || '',
    phone: formatPhoneNumber(customer?.phoneNumber || '')
  });

  const [billingAddress, setBillingAddress] = useState({
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    zipCode: customer?.postalCode || ''
  });

  const handleCopyFromCustomer = () => {
    setBillingContact({
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.emailAddress || '',
      phone: formatPhoneNumber(customer?.phoneNumber || '')
    });
    setBillingAddress({
      address: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      zipCode: customer?.postalCode || ''
    });
    
    toast({
      title: "Information Copied",
      description: "Payment information has been copied from customer information.",
    });
  };

  const handleContactChange = (field: string, value: string) => {
    if (field === 'phone') {
      const formatted = formatPhoneAsUserTypes(value);
      setBillingContact(prev => ({ ...prev, [field]: formatted }));
    } else {
      setBillingContact(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // TODO: Implement payment processing logic
    toast({
      title: "Payment Processing",
      description: "Payment processing will be implemented here.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Information</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyFromCustomer}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy from Customer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Billing Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Billing Contact</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={billingContact.firstName}
                  onChange={(e) => handleContactChange('firstName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={billingContact.lastName}
                  onChange={(e) => handleContactChange('lastName', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={billingContact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1(555) 123-4567"
                value={billingContact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Billing Address Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="123 Main St"
                value={billingAddress.address}
                onChange={(e) => handleAddressChange('address', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  value={billingAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  value={billingAddress.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                placeholder="94102"
                value={billingAddress.zipCode}
                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            onClick={handleSubmit}
            className="w-full bg-greenyp-600 hover:bg-greenyp-700"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Process Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewPaymentInformationCard;
