
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { createContactService, Contact } from '@/services/contactService';

export const useLocationContacts = (producerId: string | null, locationId: string | null) => {
  const apiClient = useApiClient();
  const contactService = createContactService(apiClient);
  
  return useQuery<Contact[], Error>({
    queryKey: ['locationContacts', producerId, locationId],
    queryFn: () => {
      if (!producerId || !locationId) {
        throw new Error('Producer ID and Location ID are required');
      }
      console.log('👥 Fetching authenticated location contacts for producer:', producerId, 'location:', locationId);
      return contactService.fetchLocationContacts(producerId, locationId);
    },
    enabled: !!producerId && !!locationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
