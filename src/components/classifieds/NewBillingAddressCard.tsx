
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface NewBillingAddressCardProps {
  classified: ClassifiedData;
  customer: CustomerData;
}

const NewBillingAddressCard = ({ classified, customer }: NewBillingAddressCardProps) => {
  const { toast } = useToast();
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleCopyFromAd = () => {
    setBillingAddress({
      address: classified.address,
      city: classified.city,
      state: classified.state,
      zipCode: classified.postalCode
    });
    
    toast({
      title: "Address Copied",
      description: "Billing address has been copied from the classified ad.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Billing Address</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyFromAd}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy from Ad
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            placeholder="123 Main St"
            value={billingAddress.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="San Francisco"
              value={billingAddress.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              placeholder="CA"
              value={billingAddress.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            placeholder="94102"
            value={billingAddress.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NewBillingAddressCard;
