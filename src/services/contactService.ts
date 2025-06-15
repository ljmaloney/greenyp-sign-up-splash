
import { getApiUrl } from '@/config/api';

export interface Contact {
  contactId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
  producerContactType: 'PRIMARY' | 'ADMIN' | 'SALES' | 'ACCOUNTS_PAYABLE' | 'DISABLED';
  displayContactType: 'NO_DISPLAY' | 'FULL_NAME_PHONE_EMAIL' | 'GENERIC_NAME_PHONE_EMAIL' | 'PHONE_EMAIL_ONLY';
  firstName: string;
  lastName: string;
  title?: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailConfirmed: boolean;
  emailAddress: string;
  genericContactName?: string;
}

export interface ContactsResponse {
  response: Contact[];
  errorMessageApi: string | null;
}

export const fetchContacts = async (producerId: string): Promise<Contact[]> => {
  const url = getApiUrl(`/producer/${producerId}/contacts?activeOnly=false`);
  
  console.log('👥 Fetching contacts from:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.status} ${response.statusText}`);
  }
  
  const data: ContactsResponse = await response.json();
  
  console.log('👥 Contacts response:', data);
  
  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi);
  }
  
  return data.response;
};

export const fetchLocationContacts = async (producerId: string, locationId: string): Promise<Contact[]> => {
  const url = getApiUrl(`/producer/${producerId}/contacts?locationId=${locationId}&activeOnly=false`);
  
  console.log('👥 Fetching location contacts from:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch location contacts: ${response.status} ${response.statusText}`);
  }
  
  const data: ContactsResponse = await response.json();
  
  console.log('👥 Location contacts response:', data);
  
  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi);
  }
  
  return data.response;
};
