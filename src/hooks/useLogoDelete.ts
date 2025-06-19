
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProducerLogo } from '@/services/galleryService';
import { useAccountData } from './useAccountData';

export const useLogoDelete = () => {
  const queryClient = useQueryClient();
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

  return useMutation({
    mutationFn: () => deleteProducerLogo(producerId!),
    onSuccess: () => {
      // Invalidate account data to refresh the business profile
      queryClient.invalidateQueries({ queryKey: ['account-data'] });
    },
  });
};
