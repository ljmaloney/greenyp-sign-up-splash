
import { useQuery } from '@tanstack/react-query';
import { fetchContacts, Contact } from '@/services/contactService';

export const useContacts = (producerId: string | null) => {
  return useQuery<Contact[], Error>({
    queryKey: ['contacts', producerId],
    queryFn: () => {
      if (!producerId) {
        throw new Error('Producer ID is required');
      }
      return fetchContacts(producerId);
    },
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
