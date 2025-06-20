
import { useQuery } from '@tanstack/react-query';
import { fetchGalleryImages } from '@/services/galleryService';

export const useProfileGalleryImages = (producerId?: string) => {
  return useQuery({
    queryKey: ['profileGalleryImages', producerId],
    queryFn: () => fetchGalleryImages(producerId!),
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
