
import { apiRequest, API_CONFIG } from '@/config/api';

export interface Contact {
  contactId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  title?: string;
  producerContactType: 'PRIMARY' | 'SECONDARY' | 'BILLING';
}

export interface Location {
  locationId: string;
  locationName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber?: string;
  isPrimary: boolean;
}

export interface Subscription {
  subscriptionId: string;
  displayName: string;
  shortDescription: string;
  subscriptionAmount: number;
  subscriptionType: string;
  invoiceCycleType: string;
  startDate: string;
  endDate: string;
  nextInvoiceDate?: string;
}

export interface Producer {
  producerId: string;
  businessName: string;
  narrative?: string;
  websiteUrl?: string;
  subscriptions: Subscription[];
}

export interface AccountData {
  producer: Producer;
  contacts: Contact[];
  primaryLocation: Location;
  locations: Location[];
}

// Fallback data for development when API is not accessible
const FALLBACK_ACCOUNT_DATA: AccountData = {
  producer: {
    producerId: 'PROD-12345',
    businessName: 'Green Thumb Landscaping',
    narrative: 'Professional landscaping services for residential and commercial properties.',
    websiteUrl: 'https://greenthumb.example.com',
    subscriptions: [
      {
        subscriptionId: 'sub-001',
        displayName: 'Premium Listing',
        shortDescription: 'Enhanced visibility with featured placement',
        subscriptionAmount: 99.99,
        subscriptionType: 'LIVE_PAID',
        invoiceCycleType: 'MONTHLY',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        nextInvoiceDate: '2024-07-01'
      }
    ]
  },
  contacts: [
    {
      contactId: 'contact-001',
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@greenthumb.example.com',
      phoneNumber: '(555) 123-4567',
      title: 'Owner',
      producerContactType: 'PRIMARY'
    },
    {
      contactId: 'contact-002',
      firstName: 'Jane',
      lastName: 'Smith',
      emailAddress: 'jane@greenthumb.example.com',
      phoneNumber: '(555) 987-6543',
      title: 'Operations Manager',
      producerContactType: 'SECONDARY'
    }
  ],
  primaryLocation: {
    locationId: 'loc-001',
    locationName: 'Main Office',
    addressLine1: '123 Garden Street',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    phoneNumber: '(555) 123-4567',
    isPrimary: true
  },
  locations: [
    {
      locationId: 'loc-001',
      locationName: 'Main Office',
      addressLine1: '123 Garden Street',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      phoneNumber: '(555) 123-4567',
      isPrimary: true
    }
  ]
};

export const fetchAccountData = async (externalUserRef: string): Promise<AccountData> => {
  console.log('Fetching account data for:', externalUserRef);
  console.log('API URL:', `${API_CONFIG.baseUrl}/account/${externalUserRef}`);
  
  try {
    const data = await apiRequest(`/account/${externalUserRef}`);
    console.log('✅ Account data fetched successfully:', data);
    return data;
    
  } catch (error) {
    console.error('Error fetching account data:', error);
    
    // In development mode, provide fallback data
    if (API_CONFIG.isDevelopment) {
      console.log('🔧 Using fallback account data for development mode');
      return FALLBACK_ACCOUNT_DATA;
    }
    
    // In production, re-throw the error
    throw new Error(`Failed to fetch account data: ${error.message}`);
  }
};
