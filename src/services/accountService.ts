import { getApiUrl } from '@/config/api';

export interface Subscription {
  subscriptionId: string;
  producerSubscriptionId: string;
  displayName: string;
  shortDescription: string;
  subscriptionAmount: number;
  invoiceCycleType: string;
  subscriptionType: string;
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

export interface LocationHours {
  locationHoursId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

export interface Contact {
  contactId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
  producerContactType: string;
  displayContactType: string;
  genericContactName?: string;
  firstName: string;
  lastName: string;
  title?: string;
  phoneNumber: string;
  cellPhoneNumber?: string;
  emailConfirmed: boolean;
  emailAddress: string;
}

export interface PrimaryLocation {
  locationId: string;
  producerId: string;
  createDate: string;
  lastUpdateDate: string;
  locationName: string;
  locationType: string;
  locationDisplayType: string;
  active: boolean;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  websiteUrl?: string;
  locationHours: LocationHours[];
}

export interface Producer {
  producerId: string;
  createDate: string;
  lastUpdateDate: string;
  businessName: string;
  lineOfBusinessId: string;
  subscriptionType: string;
  websiteUrl?: string;
  narrative?: string;
  logoUrl?: string;
  subscriptions: Subscription[];
  invoiceCycleType?: string;
  lastBillDate?: string;
  lastBillPaidDate?: string;
  iconLink?: string;
}

export interface AccountDataResponse {
  producer: Producer;
  primaryLocation: PrimaryLocation;
  contacts: Contact[];
  // Legacy properties for backward compatibility
  producerId: string;
  businessName: string;
  lineOfBusinessId: string;
  subscriptionType: string;
  subscriptions: Subscription[];
  invoiceHistory: InvoiceHistoryItem[];
}

// Create a function that accepts an API client for dependency injection
export const createAccountService = (apiClient: any) => ({
  async fetchAccountData(externalUserRef: string): Promise<AccountDataResponse> {
    console.log('🔍 Fetching account data for external user ref:', externalUserRef);
    console.log('🌐 Using API client with base URL:', apiClient.getBaseUrl?.() || 'No base URL method');
    
    // Use the external user reference endpoint which returns all the data we need
    const response = await apiClient.get(`/account/user/${externalUserRef}`, { requireAuth: true });
    
    console.log('📦 Account API response:', response);
    
    // The API returns { response: {...}, errorMessageApi: null }
    if (response.response) {
      const { producer, primaryLocation, contacts } = response.response;
      
      // Create the flattened response for backward compatibility
      return {
        ...response.response,
        // Legacy flattened properties
        producerId: producer.producerId,
        businessName: producer.businessName,
        lineOfBusinessId: producer.lineOfBusinessId,
        subscriptionType: producer.subscriptionType,
        subscriptions: producer.subscriptions,
        invoiceHistory: [], // This might come from a separate endpoint
      };
    }
    
    throw new Error('Invalid response format from account API');
  }
});

// Legacy function for backward compatibility - will be deprecated
export const fetchAccountData = async (externalUserRef: string): Promise<AccountDataResponse> => {
  console.log('⚠️ Using legacy fetchAccountData - consider using authenticated version');
  
  // Use the external user reference endpoint directly
  const response = await fetch(getApiUrl(`/account/user/${externalUserRef}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch account data: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.response) {
    const { producer, primaryLocation, contacts } = data.response;
    
    return {
      ...data.response,
      // Legacy flattened properties
      producerId: producer.producerId,
      businessName: producer.businessName,
      lineOfBusinessId: producer.lineOfBusinessId,
      subscriptionType: producer.subscriptionType,
      subscriptions: producer.subscriptions,
      invoiceHistory: [],
    };
  }
  
  throw new Error('Invalid response format from account API');
};
