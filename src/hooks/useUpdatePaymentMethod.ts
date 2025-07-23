
import { useState } from 'react';
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

export const useUpdatePaymentMethod = (producerId: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  const updatePaymentMethod = async (data: UpdatePaymentMethodData) => {
    if (!producerId) {
      throw new Error('Producer ID is required');
    }

    setIsUpdating(true);
    setError(null);

    try {
      console.log('💳 Updating payment method for producer:', producerId);
      
      const response = await apiClient.put(`/payment/producer/${producerId}`, {
        token: data.token,
        billingContact: data.billingContact,
        billingAddress: data.billingAddress
      }, { requireAuth: true });

      console.log('✅ Payment method updated successfully');
      
      // Invalidate payment method query to refresh data
      await queryClient.invalidateQueries({ queryKey: ['payment-method', producerId] });
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment method';
      console.error('❌ Payment method update failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const resetError = () => setError(null);

  return {
    updatePaymentMethod,
    isUpdating,
    error,
    resetError
  };
};
