
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { createInvoiceService, InvoiceSearchParams } from '@/services/invoiceService';

export const useInvoiceHistory = (params: InvoiceSearchParams) => {
  const apiClient = useApiClient();
  const invoiceService = createInvoiceService(apiClient);
  
  return useQuery({
    queryKey: ['invoice-history', params.producerId, params.startDate, params.endDate],
    queryFn: () => {
      console.log('💰 Fetching authenticated invoice history with params:', params);
      return invoiceService.fetchInvoiceHistory(params);
    },
    enabled: !!params.producerId && !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
