
import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

interface UpdatePaymentMethodData {
  token: string;
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
}

export const useUpdatePaymentMethod = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const [billingContact, setBillingContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    setError(null);
  };

  const handleBillingContactChange = (field: string, value: string) => {
    setBillingContact(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdatePayment = async (data: UpdatePaymentMethodData) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('💳 Updating payment method');
      
      const response = await apiClient.put(`/payment/producer/update`, {
        token: data.token,
        billingContact: data.billingContact,
        billingAddress: data.billingAddress
      }, { requireAuth: true });

      console.log('✅ Payment method updated successfully');
      
      // Invalidate payment method query to refresh data
      await queryClient.invalidateQueries({ queryKey: ['payment-method'] });
      
      closeDialog();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment method';
      console.error('❌ Payment method update failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const retrySquareInitialization = () => {
    setRetryCount(prev => prev + 1);
    setIsInitializing(true);
    setTimeout(() => {
      setIsInitializing(false);
      setIsInitialized(true);
    }, 1000);
  };

  return {
    isDialogOpen,
    isProcessing,
    billingContact,
    billingAddress,
    squareError: error,
    isInitialized,
    isInitializing,
    initializationPhase: 'ready',
    retryCount,
    cardContainerRef,
    openDialog,
    closeDialog,
    handleBillingContactChange,
    handleBillingAddressChange,
    handleUpdatePayment,
    retrySquareInitialization
  };
};
