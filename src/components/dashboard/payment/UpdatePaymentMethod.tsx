import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import ReactSquareCard from '@/components/payment/ReactSquareCard';
import { formatPhoneForSquareAPI } from '@/utils/phoneUtils';

interface UpdatePaymentMethodProps {
  producerId: string;
  onCancel: () => void;
  disabled?: boolean;
  initialBillingInfo?: Partial<BillingInfo>;
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

const UpdatePaymentMethod: React.FC<UpdatePaymentMethodProps> = ({
  producerId,
  onCancel,
  disabled = false,
  initialBillingInfo
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: initialBillingInfo?.firstName || '',
    lastName: initialBillingInfo?.lastName || '',
    email: initialBillingInfo?.email || '',
    phone: initialBillingInfo?.phone || '',
    company: initialBillingInfo?.company || '',
    address: initialBillingInfo?.address || '',
    address2: initialBillingInfo?.address2 || '',
    city: initialBillingInfo?.city || '',
    state: initialBillingInfo?.state || '',
    zipCode: initialBillingInfo?.zipCode || ''
  });

  const apiClient = useApiClient();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle billing info changes
  const handleBillingInfoChange = (updatedBillingInfo: BillingInfo) => {
    setBillingInfo(updatedBillingInfo);
  };

  // Handle payment processing
  const handlePayment = async (paymentData: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('🔄 Processing payment update with data:', paymentData);

      const response = await apiClient.post('/account/replace/payment', {
        referenceId: producerId,
        paymentToken: paymentData.token,
        verificationToken: paymentData.verificationToken || '',
        emailValidationToken: 'dummy-validation-token',
        companyName: billingInfo.company || '',
        firstName: billingInfo.firstName,
        lastName: billingInfo.lastName,
        addressLine1: billingInfo.address,
        addressLine2: billingInfo.address2 || '',
        city: billingInfo.city,
        state: billingInfo.state,
        postalCode: billingInfo.zipCode,
        phoneNumber: formatPhoneForSquareAPI(billingInfo.phone),
        emailAddress: billingInfo.email,
        producerPayment: {
          paymentMethod: 'CREDIT_CARD',
          actionType: 'UPDATE_STORED',
          cycleType: 'MONTHLY'
        }
      });

      // Handle response based on apiClient response structure
      if (response.error) {
        throw new Error('Failed to update payment method');
      }

      toast({
        title: "Success",
        description: "Payment method updated successfully",
      });

      // Close the form first to prevent re-renders during query invalidation
      onCancel();
      
      // Clear any errors
      setError(null);

      // Delay query invalidation slightly to avoid conflicts with state updates
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['payment-method', producerId] });
        queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      }, 100);

    } catch (err) {
      console.error('❌ Payment update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment method';
      setError(errorMessage);
      toast({
        title: "Payment Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <CardHeader>
        <CardTitle>Update Payment Method</CardTitle>
        {disabled && (
          <p className="text-sm text-gray-500">Click "Update Payment Method" to enable editing</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Debug info */}
        {/*<div className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex flex-col gap-1">*/}
        {/*  <div><strong>Producer ID:</strong> {producerId || 'Not available'}</div>*/}
        {/*  {!producerId && <div className="text-red-500">(No producer ID available - payment may fail)</div>}*/}
        {/*</div>*/}

        <div className="">
          <h3 className="text-lg font-medium mb-2">Billing Information</h3>
          <PaymentInformationCard
              initialBillingInfo={billingInfo}
              onBillingInfoChange={handleBillingInfoChange}
              emailValidationToken=''
              isEmailValidated={true}
              showCopyButton={false}
          />
        </div>

        <div className="">
          <h3 className="text-lg font-medium mb-2">Payment Method</h3>
          {producerId ? (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactSquareCard
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
                  onPaymentSuccess={handlePayment}
                  onPaymentError={(errorMessage) => {
                    console.error('Payment error:', errorMessage);
                    setError(errorMessage);
                    toast({
                      title: "Payment Error",
                      description: errorMessage,
                      variant: "destructive",
                    });
                  }}
                  isProcessing={isProcessing}
                  disabled={!billingInfo.firstName || !billingInfo.lastName || !billingInfo.email}
                  paymentType="PAYMENT_UPDATE"
                  buttonText="Update Payment Method"
                  error={null}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Loading payment form...
            </div>
          )}
        </div>
        
        {/* Error display */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
            {error}
          </div>
        )}
        
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdatePaymentMethod;
