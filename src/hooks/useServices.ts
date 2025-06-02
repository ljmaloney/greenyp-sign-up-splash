
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/services/servicesService';

export const useServices = (producerId: string | undefined, locationId: string | undefined) => {
  return useQuery({
    queryKey: ['services', producerId, locationId],
    queryFn: () => fetchServices(producerId!, locationId!),
    enabled: !!producerId && !!locationId,
  });
};
