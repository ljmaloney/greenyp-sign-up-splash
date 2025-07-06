
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface InvoiceTypeToggleProps {
  value: 'classifieds' | 'subscribers';
  onChange: (value: 'classifieds' | 'subscribers') => void;
}

const InvoiceTypeToggle = ({ value, onChange }: InvoiceTypeToggleProps) => {
  return (
    <div className="flex items-center space-x-6">
      <Label className="text-sm font-medium text-gray-700">Invoice Type:</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex items-center space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="classifieds" id="classifieds" />
          <Label htmlFor="classifieds" className="text-sm cursor-pointer">
            Classifieds Invoices
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="subscribers" id="subscribers" />
          <Label htmlFor="subscribers" className="text-sm cursor-pointer">
            Subscriber Invoices
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default InvoiceTypeToggle;
