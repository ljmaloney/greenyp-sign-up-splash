
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGalleryImages, uploadGalleryImage, deleteGalleryImage, GalleryImage } from '@/services/galleryService';
import { useAccountData } from './useAccountData';

export const useGalleryImages = () => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

  return useQuery({
    queryKey: ['galleryImages', producerId],
    queryFn: () => fetchGalleryImages(producerId!),
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUploadGalleryImage = () => {
  const queryClient = useQueryClient();
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

  return useMutation({
    mutationFn: ({ file, description }: { file: File; description: string }) => 
      uploadGalleryImage(producerId!, file, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages', producerId] });
    },
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

  return useMutation({
    mutationFn: (imageFilename: string) => 
      deleteGalleryImage(producerId!, imageFilename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages', producerId] });
    },
  });
};
