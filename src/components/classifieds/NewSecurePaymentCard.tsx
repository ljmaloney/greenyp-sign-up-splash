
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, CreditCard } from 'lucide-react';
import { useSquarePayments } from '@/hooks/useSquarePayments';
import { useToast } from '@/hooks/use-toast';

interface CustomerData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
}

interface NewSecurePaymentCardProps {
  customer: CustomerData;
}

const NewSecurePaymentCard = ({ customer }: NewSecurePaymentCardProps) => {
  const { toast } = useToast();
  const { isSquareReady, isLoading, error, initializeCard, tokenizeCard, clearError } = useSquarePayments();
  const cardElementRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // Format phone number to US format
  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const [paymentInfo, setPaymentInfo] = useState({
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    email: customer.emailAddress || '',
    phone: formatPhoneNumber(customer.phoneNumber || '')
  });

  useEffect(() => {
    let isMounted = true;

    const initializeCardInstance = async () => {
      if (isInitializedRef.current || !isSquareReady || error || !cardElementRef.current) {
        return;
      }

      try {
        console.log('Initializing Square card...');
        const cardInstance = await initializeCard('square-card-element');
        
        if (isMounted) {
          cardInstanceRef.current = cardInstance;
          isInitializedRef.current = true;
          console.log('Square card initialized successfully');
        }
      } catch (initError: any) {
        console.error('Failed to initialize Square card:', initError);
        if (isMounted) {
          toast({
            title: "Payment Error",
            description: initError.message || "Failed to initialize payment form.",
            variant: "destructive"
          });
        }
      }
    };

    if (isSquareReady && !error && !isInitializedRef.current) {
      initializeCardInstance();
    }

    return () => {
      isMounted = false;
      if (cardInstanceRef.current && isInitializedRef.current) {
        try {
          cardInstanceRef.current.destroy();
        } catch (destroyError) {
          console.warn('Error destroying card instance:', destroyError);
        }
        cardInstanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [isSquareReady, error, initializeCard, toast]);

  const handleTokenize = async () => {
    if (!cardInstanceRef.current) {
      toast({
        title: "Payment Error",
        description: "Payment form is not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      const billingContact = {
        givenName: paymentInfo.firstName,
        familyName: paymentInfo.lastName,
        email: paymentInfo.email,
        phone: paymentInfo.phone.replace(/\D/g, ''), // Remove formatting for API
      };

      console.log('Tokenizing with billing contact:', billingContact);
      const tokenData = await tokenizeCard(billingContact);
      
      toast({
        title: "Payment Validated",
        description: "Your payment information has been validated successfully.",
      });

      console.log('Token received:', tokenData);
      
    } catch (tokenizeError: any) {
      console.error('Tokenization error:', tokenizeError);
      toast({
        title: "Payment Error",
        description: tokenizeError.message || "Failed to process payment. Please check your card details and try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      // Format phone number as user types
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) {
        let formatted = cleaned;
        if (cleaned.length >= 6) {
          formatted = `+1(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        } else if (cleaned.length >= 3) {
          formatted = `+1(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else if (cleaned.length > 0) {
          formatted = `+1(${cleaned}`;
        }
        setPaymentInfo(prev => ({ ...prev, [field]: formatted }));
      }
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
            <div>
              <p className="font-medium">Square Configuration Required</p>
              <p className="text-sm mt-1">
                {error.includes('credentials') 
                  ? 'Please set up your Square Application ID and Location ID in the project configuration to enable payments.'
                  : error
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cardholder Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={paymentInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={paymentInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={paymentInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1(555) 123-4567"
            value={paymentInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>

        {/* Card Information */}
        <div>
          <Label>Card Information *</Label>
          <div 
            id="square-card-element" 
            ref={cardElementRef}
            className="min-h-[60px] border border-gray-300 rounded-md p-3 bg-white"
            style={{
              opacity: (isSquareReady && !error) ? 1 : 0.5,
              pointerEvents: error ? 'none' : 'auto'
            }}
          >
            {(!isSquareReady || error) && (
              <div className="flex items-center justify-center h-full text-gray-500">
                {error ? (
                  <div className="text-center">
                    <p className="text-sm">Development Mode</p>
                    <p className="text-xs mt-1">Configure Square credentials to enable payments</p>
                  </div>
                ) : (
                  'Loading secure payment form...'
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Button */}
        <div className="pt-4">
          <Button 
            onClick={handleTokenize}
            disabled={!isSquareReady || isLoading || !!error}
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

export default NewSecurePaymentCard;
