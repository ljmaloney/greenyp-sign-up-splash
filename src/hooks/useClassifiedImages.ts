
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';

export interface ClassifiedImage {
  imageName: string;
  description: string;
  url: string;
}

export interface ClassifiedImagesResponse {
  response: ClassifiedImage[];
  error?: {
    errorCode: string;
    displayMessage: string;
    errorDetails: string;
  };
}

export const useClassifiedImages = (classifiedId: string, enabled: boolean = true) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['classified-images', classifiedId],
    queryFn: async (): Promise<ClassifiedImage[]> => {
      console.log('🖼️ Fetching classified images for ID:', classifiedId);
      
      if (!classifiedId || classifiedId === ':id') {
        console.error('❌ Invalid or missing classified ID for images:', classifiedId);
        return [];
      }
      
      const response: ClassifiedImagesResponse = await apiClient.get(
        `/classified/images/${classifiedId}/gallery`,
        { requireAuth: false }
      );
      
      console.log('🖼️ Classified images response:', response);
      
      if (response.error) {
        console.error('❌ Error fetching classified images:', response.error);
        throw new Error(response.error.displayMessage || 'Failed to fetch images');
      }
      
      return response.response || [];
    },
    enabled: enabled && !!classifiedId && classifiedId !== ':id',
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};
