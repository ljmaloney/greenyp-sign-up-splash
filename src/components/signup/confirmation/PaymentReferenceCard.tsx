
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Copy, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PaymentReferenceCardProps {
  orderRef?: string;
  paymentRef?: string;
  receiptNumber?: string;
}

const PaymentReferenceCard = ({ orderRef, paymentRef, receiptNumber }: PaymentReferenceCardProps) => {
  const { toast } = useToast();

  const hasPaymentData = orderRef || paymentRef || receiptNumber;

  if (!hasPaymentData) {
    return null;
  }

  const handleCopyToClipboard = () => {
    const paymentInfo = [
      orderRef && `Order Reference: ${orderRef}`,
      paymentRef && `Payment Reference: ${paymentRef}`,
      receiptNumber && `Receipt Number: ${receiptNumber}`
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(paymentInfo).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "Payment reference information has been copied to your clipboard.",
      });
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          Payment Reference Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {orderRef && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">Order Reference:</span>
                <p className="text-lg font-mono">{orderRef}</p>
              </div>
            </div>
          )}
          
          {paymentRef && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">Payment Reference:</span>
                <p className="text-lg font-mono">{paymentRef}</p>
              </div>
            </div>
          )}
          
          {receiptNumber && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">Receipt Number:</span>
                <p className="text-lg font-mono">{receiptNumber}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToClipboard}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy References
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Page
          </Button>
        </div>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Please save these reference numbers</p>
          <p>Keep these reference numbers for your records. You may need them for future inquiries or support requests.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentReferenceCard;
