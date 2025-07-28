// UpdatePaymentMethodDialog.tsx - Simplified implementation
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import ReactSquareSubscriptionCard from "@/components/subscribers/ReactSquareSubscriptionCard.tsx";

// Update the interface to include all required props
interface UpdatePaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isProcessing: boolean;
  billingContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onBillingContactChange: (field: string, value: string) => void;
  onBillingAddressChange: (field: string, value: string) => void;
  onUpdatePayment: (data: any) => Promise<any>;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  squareError: string | null;
  isSquareReady: boolean;
  isSquareInitializing: boolean;
  initializationPhase: string;
  retryCount: number;
  onSquareRetry: () => void;
  producerId: string;
}

// Basic billing info structure
interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

const UpdatePaymentMethodDialog: React.FC<UpdatePaymentMethodDialogProps> = (props) => {
  // Destructure props to ensure they're captured
  const { isOpen, onClose, producerId } = props;
  
  // Debug: Log props on mount and when they change
  useEffect(() => {
    console.log('🔄 UpdatePaymentMethodDialog mounted or props changed:', { 
      isOpen, 
      producerId 
    });
  }, [isOpen, producerId]);
  
  // Better validation and debugging for producerId
  useEffect(() => {
    if (isOpen) {
      if (!producerId) {
        console.error('❌ UpdatePaymentMethodDialog opened without a producerId');
      } else {
        console.log('✅ UpdatePaymentMethodDialog has valid producerId:', producerId);
      }
    }
  }, [isOpen, producerId]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Handler for billing info changes - no logging to prevent infinite loop
  const handleBillingInfoChange = (updatedInfo: BillingInfo) => {
    // Don't log here to avoid infinite loops
    setBillingInfo(updatedInfo);
  };

  // Handler for Square payment success
  const handlePayment = (tokenData: any) => {
    console.log('💳 Payment tokenization success:', tokenData);
    
    // Validate producerId with detailed logging
    console.log('🔎 Checking producerId for payment:', { 
      producerId, 
      isDefined: !!producerId,
      length: producerId?.length || 0
    });
    
    if (!producerId) {
      const errorMsg = 'Producer ID is missing';
      console.error('❌', errorMsg);
      setError(errorMsg);
      return;
    }
    
    // Validate token data
    if (!tokenData || !tokenData.token) {
      const errorMsg = 'Payment token is missing';
      console.error('❌', errorMsg, tokenData);
      setError(errorMsg);
      return;
    }
    
    // Start processing
    setIsProcessing(true);
    setError(null);
    
    console.log('📊 Preparing payload with:', {
      producerId,
      tokenData,
      billingInfo
    });
    
    // Use billing info from tokenData (from Square) if available
    const contactInfo = tokenData.billingContact || {};
    const addressInfo = tokenData.billingAddress || {};
    
    // Prepare the payment payload
    const payload = {
      referenceId: producerId,
      paymentToken: tokenData.token,
      verificationToken: tokenData.verificationToken || '',
      firstName: (contactInfo.firstName || billingInfo.firstName || '').trim(),
      lastName: (contactInfo.lastName || billingInfo.lastName || '').trim(),
      companyName: billingInfo.company?.trim() || null,
      addressLine1: (addressInfo.address || billingInfo.address || '').trim(),
      addressLine2: billingInfo.address2?.trim() || '',
      city: (addressInfo.city || billingInfo.city || '').trim(),
      state: (addressInfo.state || billingInfo.state || '').trim(),
      postalCode: (addressInfo.zipCode || billingInfo.zipCode || '').trim(),
      phoneNumber: (contactInfo.phone || billingInfo.phone || '').trim(),
      emailAddress: (contactInfo.email || billingInfo.email || '').trim(),
      emailValidationToken: '',
      producerPayment: {
        paymentMethod: tokenData.details?.card?.brand || 'CREDIT_CARD',
        actionType: 'APPLY_ONCE',
        cycleType: 'MONTHLY'
      }
    };
    
    console.log('📤 Submitting to /account/replace/payment:', payload);
    
    // Submit to API
    apiClient.post('/account/replace/payment', payload, { requireAuth: true })
      .then(response => {
        console.log('✅ Payment updated successfully:', response);
        toast({
          title: 'Success',
          description: 'Payment method updated successfully',
          variant: 'default'
        });
        
        // Invalidate queries and close the dialog
        queryClient.invalidateQueries({ queryKey: ['payment-method', producerId] });
        onClose();
      })
      .catch(err => {
        console.error('❌ Payment update failed:', err);
        const errorMessage = err.message || 'Failed to update payment method';
        setError(errorMessage);
        
        toast({
          title: 'Payment Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  // Handle payment errors
  const handlePaymentError = (errorMsg: string) => {
    console.error('❌ Payment error:', errorMsg);
    setError(errorMsg);
  };

  // Handle dialog close
  const handleClose = () => {
    if (isProcessing) return; // Don't close while processing
    
    console.log('🚪 Closing payment dialog');
    setError(null);
    setBillingInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      zipCode: ''
    });
    onClose();
  };

  // Inside the UpdatePaymentMethodDialog component
  const handleSubmit = () => {
    console.log('🔵 Submit button clicked');
    // Your existing submit logic
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
          <DialogDescription>
            Update your billing information and payment details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Debug info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex flex-col gap-1">
            <div><strong>Producer ID:</strong> {producerId || 'Not available'}</div>
            {!producerId && <div className="text-red-500">(No producer ID available - payment may fail)</div>}
          </div>

          <div className="">
            <h3 className="text-lg font-medium mb-2">Billing Information</h3>
            <PaymentInformationCard
                initialBillingInfo={billingInfo}
                onBillingInfoChange={handleBillingInfoChange}
                emailValidationToken=''
                isEmailValidated={true}
                // copyFromAdData={}
                showCopyButton={false}
            />
          </div>

          <div className= "">
            <h3 className="text-lg font-medium mb-2">Payment Method</h3>
            <ReactSquareSubscriptionCard
                billingContact={{
                  firstName: billingInfo.firstName || '',
                  lastName: billingInfo.lastName || '',
                  email: billingInfo.email || '',
                  phone: billingInfo.phone || ''
                }}
                billingAddress={{
                  address: billingInfo.address || '',
                  city: billingInfo.city || '',
                  state: billingInfo.state || '',
                  zipCode: billingInfo.zipCode || ''
                }}
                paymentType={"PAYMENT_UPDATE"}
                emailValidationToken=''
                producerId={producerId || ''}
            />
          </div>
          
          {/* Error display */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentMethodDialog;