
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadProducerLogo, fetchProducerLogo } from '@/services/galleryService';
import { useAccountData } from './useAccountData';

export const useLogoUpload = () => {
  const { data: accountData } = useAccountData();
  const queryClient = useQueryClient();
  const producerId = accountData?.producer?.producerId;

  return useMutation({
    mutationFn: async (file: File) => {
      if (!producerId) throw new Error('Producer ID is required');
      return uploadProducerLogo(producerId, file);
    },
    onSuccess: async () => {
      if (!producerId) return;
      
      // Invalidate the account data to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ['account-data'] });
      
      // Optionally fetch the latest logo URL
      try {
        const logoData = await fetchProducerLogo(producerId);
        return logoData;
      } catch (error) {
        console.error('Error fetching updated logo:', error);
      }
    },
  });
};
