import { getApiUrl } from '@/config/api';

export interface Producer {
  producerId: string;
  createDate: string;
  lastUpdateDate: string;
  businessName: string;
  lineOfBusinessId: string;
  subscriptionType: string;
  websiteUrl: string;
  subscriptions: Subscription[];
  narrative: string;
  iconLink?: string;  // Added iconLink property
  lastBillDate?: string;
  lastBillPaidDate?: string;
  invoiceCycleType?: string;
}

export interface Subscription {
  subscriptionId: string;
  producerSubscriptionId: string;
  displayName: string;
  shortDescription: string;
  invoiceCycleType: string;
  subscriptionType: string;
  nextInvoiceDate: string;
  startDate: string;
  endDate: string;
  subscriptionAmount: number;
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
  websiteUrl: string;
  locationHours: any[];
}

export interface Contact {
  contactId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
  producerContactType: string;
  displayContactType: string;
  firstName: string;
  lastName: string;
  title?: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailConfirmed: boolean;
  emailAddress: string;
  genericContactName?: string;
}

export interface AccountData {
  producer: Producer;
  primaryLocation: PrimaryLocation;
  contacts: Contact[];
}

export interface AccountResponse {
  response: AccountData;
  errorMessageApi: null | string;
}

export const fetchAccountData = async (externalUserRef: string): Promise<AccountData> => {
  console.log(`🔍 Fetching account data for user: ${externalUserRef}`);
  
  const url = getApiUrl(`/account/user/${externalUserRef}`);
  console.log(`📡 API URL: ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`❌ Account API failed: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch account data: ${response.statusText}`);
  }

  const data: AccountResponse = await response.json();
  console.log('✅ Account data received:', data);

  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi);
  }

  return data.response;
};
