
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface InvoiceTypeSelectorProps {
  invoiceType: string;
  onInvoiceTypeChange: (value: string) => void;
}

const InvoiceTypeSelector = ({ invoiceType, onInvoiceTypeChange }: InvoiceTypeSelectorProps) => {
  return (
    <div className="mt-4">
      <RadioGroup value={invoiceType} onValueChange={onInvoiceTypeChange} className="flex space-x-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="classified" id="classified" />
          <Label htmlFor="classified">Display / Search Classified Invoices</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="subscriber" id="subscriber" />
          <Label htmlFor="subscriber">Display / Search Subscriber Invoices</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default InvoiceTypeSelector;
