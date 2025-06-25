
import { useQuery } from '@tanstack/react-query';
import { fetchInvoiceHistory, InvoiceSearchParams } from '@/services/invoiceService';

export const useInvoiceHistory = (params: InvoiceSearchParams) => {
  return useQuery({
    queryKey: ['invoice-history', params.producerId, params.startDate, params.endDate],
    queryFn: () => fetchInvoiceHistory(params),
    enabled: !!params.producerId && !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
