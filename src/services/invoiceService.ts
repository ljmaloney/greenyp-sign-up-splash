
import { API_CONFIG, getApiUrl } from '@/config/api';
import { APIResponse } from '@/types/responseBody';

export interface LineItem {
  lineItemId: string;
  externalRef1: string;
  externalRef2?: string;
  lineNumber: number;
  quantity: number;
  description: string;
  amount: number;
}

export interface Invoice {
  invoiceId: string;
  paymentTransactionId: string;
  externalRef: string;
  invoiceType: string;
  createDate: string;
  paidDate: string;
  description: string;
  invoiceTotal: number;
  paymentReceiptNumber: string;
  invoiceNumber: string;
  paymentReceiptUrl?: string;
  lineItems: LineItem[];
  
  // Legacy fields - keeping for backward compatibility
  producerId?: string;
  subscriptionId?: string;
  subscriptionName?: string;
}

export interface InvoiceSearchParams {
  producerId: string;
  startDate: string;
  endDate: string;
}

// Create a function that accepts an API client for dependency injection
export const createInvoiceService = (authenticatedApiClient: any) => ({
  async fetchInvoiceHistory({ producerId, startDate, endDate }: InvoiceSearchParams): Promise<Invoice[]> {
    console.log('💰 Fetching invoice history for producer:', producerId);
    
    const endpoint = `/invoice/producer/${producerId}/search?startDate=${startDate}&endDate=${endDate}`;
    
    try {
      const data: APIResponse<Invoice[]> = await authenticatedApiClient.get(endpoint, { requireAuth: true });
      
      console.log('💰 Invoice history response:', data);
      
      if (data.errorMessageApi) {
        throw new Error(data.errorMessageApi.displayMessage || 'Failed to fetch invoice history');
      }
      
      return data.response || [];
    } catch (error) {
      console.error('❌ Failed to fetch invoice history:', error);
      throw error;
    }
  }
});

// Legacy function - will be deprecated in favor of authenticated version
export const fetchInvoiceHistory = async ({ producerId, startDate, endDate }: InvoiceSearchParams): Promise<Invoice[]> => {
  console.log('⚠️ Using legacy fetchInvoiceHistory - should use authenticated version');
  
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
