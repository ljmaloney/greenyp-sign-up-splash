
import { apiRequest, API_CONFIG } from '@/config/api';

export interface Producer {
  producerId: string;
  businessName: string;
  businessType: string;
  businessDescription: string;
  websiteUrl?: string;
  primaryCategoryIds: string[];
  subscriptions: Subscription[];
  narrative?: string;
  lineOfBusinessId?: string;
  createDate?: string;
  lastUpdateDate?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessWebsite?: string;
  businessEstablished?: string;
  businessEmployeeCount?: number;
  isActive?: boolean;
  businessLogo?: string | null;
}

export interface Subscription {
  subscriptionId: string;
  displayName: string;
  shortDescription: string;
  subscriptionType: string;
  subscriptionAmount: number;
  invoiceCycleType: string;
  startDate: string;
  endDate: string;
  nextInvoiceDate?: string;
}

export interface PrimaryLocation {
  locationId: string;
  businessName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
  locationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  locationType?: string;
  locationDisplayType?: string;
}

export interface Contact {
  contactId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  producerContactType: string;
  title?: string;
  cellPhoneNumber?: string;
  emailConfirmed?: boolean;
  genericContactName?: string;
  displayContactType?: string;
}

export interface AccountData {
  producer: Producer;
  primaryLocation: PrimaryLocation;
  contacts: Contact[];
}

// Fallback data for development when API is not accessible
const FALLBACK_ACCOUNT_DATA: AccountData = {
  producer: {
    producerId: 'PROD-12345',
    businessName: 'Demo Green Services',
    businessDescription: 'A demonstration landscaping company for development purposes',
    businessType: 'LLC',
    businessPhone: '(555) 123-4567',
    businessEmail: 'demo@example.com',
    businessWebsite: 'https://demo.example.com',
    businessEstablished: '2020-01-01',
    businessEmployeeCount: 15,
    isActive: true,
    businessLogo: null,
    primaryCategoryIds: ['landscaping'],
    subscriptions: [
      {
        subscriptionId: 'SUB-001',
        subscriptionType: 'LIVE_PAID',
        displayName: 'Premium Business Listing',
        shortDescription: 'Full business listing with all features',
        subscriptionAmount: 99.99,
        invoiceCycleType: 'MONTHLY',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        nextInvoiceDate: '2024-07-01'
      }
    ]
  },
  primaryLocation: {
    locationId: 'LOC-001',
    businessName: 'Demo Green Services',
    streetAddress: '123 Demo Street',
    city: 'Demo City',
    state: 'CA',
    zipCode: '90210',
    country: 'USA',
    locationName: 'Main Office',
    addressLine1: '123 Demo Street',
    addressLine2: 'Suite 100',
    postalCode: '90210',
    locationType: 'HOME_OFFICE_PRIMARY',
    locationDisplayType: 'CITY_STATE_ZIP'
  },
  contacts: [
    {
      contactId: 'CONTACT-001',
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@demo.com',
      phoneNumber: '(555) 123-4567',
      producerContactType: 'PRIMARY',
      title: 'Owner',
      genericContactName: 'John Doe',
      displayContactType: 'FULL_NAME_PHONE_EMAIL'
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
