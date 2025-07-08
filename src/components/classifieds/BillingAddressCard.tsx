
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';

interface BillingAddressCardProps {
  paymentForm: {
    billingAddress: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onInputChange: (field: string, value: string) => void;
  isProcessing?: boolean;
  onCopyFromClassified?: () => void;
  classifiedData?: any;
}

const BillingAddressCard = ({ 
  paymentForm, 
  onInputChange, 
  isProcessing = false,
  onCopyFromClassified,
  classifiedData 
}: BillingAddressCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Billing Address</span>
          {onCopyFromClassified && classifiedData && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyFromClassified}
              className="text-xs"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy from Ad
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="billingAddress">Address *</Label>
          <Input
            id="billingAddress"
            placeholder="123 Main St"
            value={paymentForm.billingAddress}
            onChange={(e) => onInputChange('billingAddress', e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="San Francisco"
              value={paymentForm.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              placeholder="CA"
              value={paymentForm.state}
              onChange={(e) => onInputChange('state', e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            placeholder="94102"
            value={paymentForm.zipCode}
            onChange={(e) => onInputChange('zipCode', e.target.value)}
            disabled={isProcessing}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingAddressCard;
