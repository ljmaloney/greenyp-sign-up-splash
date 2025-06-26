
import { getApiUrl } from '@/config/api';

export interface Subscription {
  subscriptionId: string;
  displayName: string;
  shortDescription: string;
  subscriptionAmount: number;
  invoiceCycleType: string;
  startDate: string;
  endDate: string;
  nextInvoiceDate?: string;
}

export interface InvoiceHistoryItem {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: string;
  description: string;
}

export interface Contact {
  contactId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  contactType: string;
}

export interface PrimaryLocation {
  locationId: string;
  businessName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  websiteUrl?: string;
  emailAddress?: string;
}

export interface Producer {
  producerId: string;
  businessName: string;
  lineOfBusinessId: string;
  subscriptionType: string;
  websiteUrl?: string;
  narrative?: string;
  logoUrl?: string;
  primaryLocation?: PrimaryLocation;
  contacts?: Contact[];
}

export interface AccountDataResponse {
  producerId: string;
  businessName: string;
  lineOfBusinessId: string;
  subscriptionType: string;
  subscriptions: Subscription[];
  invoiceHistory: InvoiceHistoryItem[];
  producer: Producer;
}

// Create a function that accepts an API client for dependency injection
export const createAccountService = (apiClient: any) => ({
  async fetchAccountData(externalUserRef: string): Promise<AccountDataResponse> {
    console.log('🔍 Fetching account data for user:', externalUserRef);
    
    return apiClient.get(`/account/${externalUserRef}`, { requireAuth: true });
  }
});

// Legacy function for backward compatibility - will be deprecated
export const fetchAccountData = async (externalUserRef: string): Promise<AccountDataResponse> => {
  console.log('⚠️ Using legacy fetchAccountData - consider using authenticated version');
  const response = await fetch(getApiUrl(`/account/${externalUserRef}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch account data: ${response.status}`);
  }
  
  return response.json();
};
