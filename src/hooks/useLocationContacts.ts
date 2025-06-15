
import { useQuery } from '@tanstack/react-query';
import { fetchLocationContacts, Contact } from '@/services/contactService';

export const useLocationContacts = (producerId: string | null, locationId: string | null) => {
  return useQuery<Contact[], Error>({
    queryKey: ['locationContacts', producerId, locationId],
    queryFn: () => {
      if (!producerId || !locationId) {
        throw new Error('Producer ID and Location ID are required');
      }
      return fetchLocationContacts(producerId, locationId);
    },
    enabled: !!producerId && !!locationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
