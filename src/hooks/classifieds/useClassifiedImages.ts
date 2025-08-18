
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';

interface ClassifiedImage {
  url: string;
  description?: string;
}

export const useClassifiedImages = (classifiedId: string, enabled: boolean = true) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['classified-images', classifiedId],
    queryFn: async (): Promise<ClassifiedImage[]> => {
      console.log('🖼️ Fetching images for classified:', classifiedId);
      
      try {
        const response = await apiClient.get(`/classified/${classifiedId}/image/gallery`, { requireAuth: false });
        console.log('📸 Images response:', response);
        
        if (response.response && Array.isArray(response.response)) {
          return response.response.map((img: any) => ({
            url: img.url || img.imageUrl,
            description: img.description || img.altText
          }));
        }
        
        return [];
      } catch (error) {
        console.warn('⚠️ Failed to fetch images, returning empty array:', error);
        return [];
      }
    },
    enabled: enabled && !!classifiedId && classifiedId !== ':classifiedId',
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};
