
import { getApiUrl } from '@/config/api';

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

// Check if we're in prototyping mode
const isPrototyping = () => 
  window.location.hostname.includes('lovable') || 
  window.location.hostname === 'localhost';

// Dummy data for prototyping
const getDummyAccountData = (): AccountData => ({
  producer: {
    producerId: "PROD-12345",
    businessName: "Green Valley Organic Farm",
    businessType: "Agriculture",
    businessDescription: "Sustainable organic farming producing fresh vegetables, fruits, and herbs. We pride ourselves on environmentally friendly practices and supporting our local community.",
    websiteUrl: "https://greenvalleyorganic.com",
    primaryCategoryIds: ["organic-farming", "fresh-produce"],
    narrative: "Green Valley Organic Farm has been a cornerstone of sustainable agriculture in our community for over a decade.",
    lineOfBusinessId: "agriculture-001",
    createDate: "2024-01-01T00:00:00Z",
    lastUpdateDate: "2024-06-01T00:00:00Z",
    subscriptions: [
      {
        subscriptionId: "SUB-001",
        displayName: "Premium Business Listing",
        shortDescription: "Enhanced visibility with photo gallery and priority placement",
        subscriptionType: "LIVE_PAID",
        subscriptionAmount: 29.99,
        invoiceCycleType: "MONTHLY",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2025-01-01T00:00:00Z",
        nextInvoiceDate: "2024-07-01T00:00:00Z"
      },
      {
        subscriptionId: "SUB-002",
        displayName: "Featured Placement",
        shortDescription: "Top placement in search results",
        subscriptionType: "LIVE_PAID",
        subscriptionAmount: 49.99,
        invoiceCycleType: "MONTHLY",
        startDate: "2024-03-01T00:00:00Z",
        endDate: "2024-12-01T00:00:00Z",
        nextInvoiceDate: "2024-07-01T00:00:00Z"
      }
    ]
  },
  primaryLocation: {
    locationId: "LOC-001",
    businessName: "Green Valley Organic Farm",
    streetAddress: "1234 Farm Road",
    city: "Greenville",
    state: "California",
    zipCode: "95123",
    country: "USA",
    phoneNumber: "(555) 123-4567",
    locationName: "Green Valley Organic Farm - Main Farm",
    addressLine1: "1234 Farm Road",
    addressLine2: "",
    postalCode: "95123"
  },
  contacts: [
    {
      contactId: "CONTACT-001",
      firstName: "Sarah",
      lastName: "Johnson",
      emailAddress: "sarah@greenvalleyorganic.com",
      phoneNumber: "(555) 123-4567",
      producerContactType: "PRIMARY"
    },
    {
      contactId: "CONTACT-002",
      firstName: "Mike",
      lastName: "Chen",
      emailAddress: "mike@greenvalleyorganic.com",
      phoneNumber: "(555) 123-4568",
      producerContactType: "ADMIN"
    }
  ]
});

export const fetchAccountData = async (externalUserRef: string): Promise<AccountData> => {
  // Return dummy data in prototyping mode
  if (isPrototyping()) {
    console.log('🔧 Using dummy account data for prototyping');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getDummyAccountData();
  }

  const response = await fetch(getApiUrl(`/producer/${externalUserRef}/account`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch account data: ${response.status}`);
  }
  
  return response.json();
};
