
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface PaymentInformationHeaderProps {
  onCopyFromCustomer: () => void;
}

const PaymentInformationHeader = ({ onCopyFromCustomer }: PaymentInformationHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <span>Payment Information</span>
      <Button
        variant="outline"
        size="sm"
        onClick={onCopyFromCustomer}
        className="text-xs"
      >
        <Copy className="w-3 h-3 mr-1" />
        Copy from Customer
      </Button>
    </div>
  );
};

export default PaymentInformationHeader;
