
import { useQuery } from '@tanstack/react-query';
import { fetchSubscriptions } from '../services/subscriptionService';

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: fetchSubscriptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
