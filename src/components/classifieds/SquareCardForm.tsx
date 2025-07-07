
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Copy, CreditCard } from 'lucide-react';
import { useSquarePayments, SquareCardData } from '@/hooks/useSquarePayments';
import { useToast } from '@/hooks/use-toast';

interface SquareCardFormProps {
  billingInfo: {
    cardholderName: string;
    email: string;
    phoneNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
  onTokenReceived: (tokenData: SquareCardData) => void;
  onCopyFromClassified?: () => void;
  classifiedData?: any;
  isProcessing?: boolean;
}

const SquareCardForm = ({ 
  billingInfo, 
  onInputChange, 
  onTokenReceived,
  onCopyFromClassified, 
  classifiedData,
  isProcessing = false
}: SquareCardFormProps) => {
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [cardInitialized, setCardInitialized] = useState(false);
  const { isSquareReady, isLoading, error, initializeCard, tokenizeCard, clearError } = useSquarePayments();
  const { toast } = useToast();

  useEffect(() => {
    const setupCard = async () => {
      if (isSquareReady && !cardInitialized && cardElementRef.current) {
        try {
          await initializeCard('square-card');
          setCardInitialized(true);
          console.log('Square card initialized successfully');
        } catch (err) {
          console.error('Failed to initialize Square card:', err);
          toast({
            title: "Payment Setup Error",
            description: "Failed to initialize secure payment form",
            variant: "destructive"
          });
        }
      }
    };

    setupCard();
  }, [isSquareReady, cardInitialized, initializeCard, toast]);

  const handleTokenizeCard = async () => {
    if (!cardInitialized) {
      toast({
        title: "Payment Error",
        description: "Payment form is not ready. Please wait and try again.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!billingInfo.cardholderName || !billingInfo.email || !billingInfo.phoneNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required billing information fields",
        variant: "destructive"
      });
      return;
    }

    clearError();

    try {
      const billingContact = {
        givenName: billingInfo.cardholderName.split(' ')[0] || '',
        familyName: billingInfo.cardholderName.split(' ').slice(1).join(' ') || '',
        email: billingInfo.email,
        phone: billingInfo.phoneNumber,
      };

      const tokenData = await tokenizeCard(billingContact);
      
      toast({
        title: "Payment Ready",
        description: "Your payment information has been securely processed",
      });

      onTokenReceived(tokenData);
    } catch (err: any) {
      console.error('Tokenization failed:', err);
      toast({
        title: "Payment Error",
        description: err.message || "Failed to process payment information",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
            Secure Payment
          </div>
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
          <Label htmlFor="cardholderName">Cardholder Name *</Label>
          <Input
            id="cardholderName"
            placeholder="John Doe"
            value={billingInfo.cardholderName}
            onChange={(e) => onInputChange('cardholderName', e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={billingInfo.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="(555) 123-4567"
            value={billingInfo.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <div>
          <Label>Card Information *</Label>
          <div 
            id="square-card" 
            ref={cardElementRef}
            className="min-h-[60px] border border-gray-300 rounded-md p-3 bg-white"
            style={{
              opacity: isSquareReady ? 1 : 0.5,
              pointerEvents: isProcessing ? 'none' : 'auto'
            }}
          >
            {!isSquareReady && (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading secure payment form...
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="pt-4">
          <Button 
            onClick={handleTokenizeCard}
            disabled={!cardInitialized || isLoading || isProcessing}
            className="w-full bg-greenyp-600 hover:bg-greenyp-700"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isLoading ? 'Processing...' : 'Validate Payment Information'}
          </Button>
        </div>

        <div className="flex items-center justify-center text-xs text-gray-500">
          <Lock className="w-3 h-3 mr-1" />
          Secured by Square - PCI DSS Compliant
        </div>
      </CardContent>
    </Card>
  );
};

export default SquareCardForm;
