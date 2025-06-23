
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/services/servicesService';

export const useServices = (producerId: string | undefined, locationId: string | undefined) => {
  console.log('useServices called with:', { producerId, locationId });
  
  return useQuery({
    queryKey: ['services', producerId, locationId],
    queryFn: () => {
      console.log('Executing fetchServices with:', { producerId, locationId });
      return fetchServices(producerId!, locationId!);
    },
    enabled: !!producerId && !!locationId,
  });
};
