
import { useMutation } from '@tanstack/react-query';
import { uploadProducerLogo } from '@/services/galleryService';
import { useAccountData } from './useAccountData';

export const useLogoUpload = () => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

  return useMutation({
    mutationFn: (file: File) => uploadProducerLogo(producerId!, file),
  });
};
