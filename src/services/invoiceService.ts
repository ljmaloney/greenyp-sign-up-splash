
import { API_CONFIG, getApiUrl } from '@/config/api';
import { APIResponse } from '@/types/responseBody';

export interface Invoice {
  invoiceId: string;
  producerId: string;
  createDate: string;
  subscriptionId: string;
  subscriptionName: string;
  paidDate: string;
  invoiceNumber: string;
  invoiceTotal: number;
}

export interface InvoiceSearchParams {
  producerId: string;
  startDate: string;
  endDate: string;
}

export const fetchInvoiceHistory = async ({ producerId, startDate, endDate }: InvoiceSearchParams): Promise<Invoice[]> => {
  const url = getApiUrl(`/invoice/producer/${producerId}/search?startDate=${startDate}&endDate=${endDate}`);
  
  console.log('Fetching invoice history from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch invoice history: ${response.statusText}`);
  }

  const data: APIResponse<Invoice[]> = await response.json();
  
  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi.displayMessage || 'Failed to fetch invoice history');
  }

  return data.response || [];
};
