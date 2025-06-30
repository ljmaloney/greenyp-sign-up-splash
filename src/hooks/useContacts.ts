
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { createContactService, Contact } from '@/services/contactService';

export const useContacts = (producerId: string | null) => {
  const apiClient = useApiClient();
  const contactService = createContactService(apiClient);
  
  return useQuery<Contact[], Error>({
    queryKey: ['contacts', producerId],
    queryFn: () => {
      if (!producerId) {
        throw new Error('Producer ID is required');
      }
      console.log('👥 Fetching authenticated contacts for producer:', producerId);
      return contactService.fetchContacts(producerId);
    },
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
