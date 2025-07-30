
import { apiClient } from '@/utils/apiClient';

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

// Create a function that accepts an API client for dependency injection
export const createContactService = (authenticatedApiClient: any) => ({
  async fetchContacts(producerId: string): Promise<Contact[]> {
    console.log('👥 Fetching contacts for producer:', producerId);
    
    const endpoint = `/producer/${producerId}/contacts?activeOnly=false`;
    
    try {
      const data: ContactsResponse = await authenticatedApiClient.get(endpoint, { requireAuth: true });
      
      console.log('👥 Contacts response:', data);
      
      if (data.errorMessageApi) {
        throw new Error(data.errorMessageApi);
      }
      
      return data.response || [];
    } catch (error) {
      console.error('❌ Failed to fetch contacts:', error);
      throw error;
    }
  },

  async fetchLocationContacts(producerId: string, locationId: string): Promise<Contact[]> {
    console.log('👥 Fetching location contacts for producer:', producerId, 'location:', locationId);
    
    const endpoint = `/producer/${producerId}/contacts?locationId=${locationId}&activeOnly=false`;
    
    try {
      const data: ContactsResponse = await authenticatedApiClient.get(endpoint, { requireAuth: true });
      
      console.log('👥 Location contacts response:', data);
      
      if (data.errorMessageApi) {
        throw new Error(data.errorMessageApi);
      }
      
      return data.response || [];
    } catch (error) {
      console.error('❌ Failed to fetch location contacts:', error);
      throw error;
    }
  },

  async deleteContact(contactId: string): Promise<void> {
    console.log('🗑️ Deleting contact:', contactId);
    
    const endpoint = `/producer/contact/${contactId}`;
    
    try {
      const response = await authenticatedApiClient.delete(endpoint, { requireAuth: true });
      
      if (response.error) {
        throw new Error(`Failed to delete contact: ${response.error}`);
      }
      
      console.log('✅ Contact deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete contact:', error);
      throw error;
    }
  }
});

// Legacy functions - will be deprecated in favor of authenticated versions
export const fetchContacts = async (producerId: string): Promise<Contact[]> => {
  console.log('⚠️ Using legacy fetchContacts - should use authenticated version');
  
  const endpoint = `/producer/${producerId}/contacts?activeOnly=false`;
  
  try {
    const data: ContactsResponse = await apiClient.get(endpoint);
    
    console.log('👥 Contacts response:', data);
    
    if (data.errorMessageApi) {
      throw new Error(data.errorMessageApi);
    }
    
    return data.response;
  } catch (error) {
    console.error('❌ Failed to fetch contacts:', error);
    throw error;
  }
};

export const fetchLocationContacts = async (producerId: string, locationId: string): Promise<Contact[]> => {
  console.log('⚠️ Using legacy fetchLocationContacts - should use authenticated version');
  
  const endpoint = `/producer/${producerId}/contacts?locationId=${locationId}&activeOnly=false`;
  
  try {
    const data: ContactsResponse = await apiClient.get(endpoint);
    
    console.log('👥 Location contacts response:', data);
    
    if (data.errorMessageApi) {
      throw new Error(data.errorMessageApi);
    }
    
    return data.response;
  } catch (error) {
    console.error('❌ Failed to fetch location contacts:', error);
    throw error;
  }
};
