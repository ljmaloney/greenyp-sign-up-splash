
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface PaymentInformationHeaderProps {
  onCopyFromCustomer: () => void;
  isValidated?: boolean;
}

const PaymentInformationHeader = ({ onCopyFromCustomer, isValidated = false }: PaymentInformationHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <span>Payment Information</span>
      <Button
        variant="outline"
        size="sm"
        onClick={onCopyFromCustomer}
        disabled={!isValidated}
        className="text-xs"
        title={!isValidated ? "Email must be validated before copying customer information" : "Copy customer information to payment form"}
      >
        <Copy className="w-3 h-3 mr-1" />
        Copy from Ad
      </Button>
    </div>
  );
};

export default PaymentInformationHeader;
