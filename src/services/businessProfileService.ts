
import { getApiUrl } from '@/config/api';

interface ProducerRequest {
  producerId: string;
  businessName: string;
  lineOfBusinessId: string;
  subscriptionId: string;
  subscriptionType: string;
  invoiceCycleType: string;
  websiteUrl: string;
  narrative: string;
}

interface PrimaryContact {
  contactId: string;
  producerLocationId: string;
  producerContactType: string;
  displayContactType: string;
  genericContactName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailAddress: string;
}

interface UpdateBusinessInfoRequest {
  producerId: string;
  producerRequest: ProducerRequest;
}

interface UpdateContactInfoRequest {
  producerId: string;
  producerRequest: ProducerRequest;
  primaryContact: PrimaryContact;
}

export const updateBusinessInformation = async (data: UpdateBusinessInfoRequest): Promise<void> => {
  const response = await fetch(getApiUrl('/account'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update business information: ${response.status}`);
  }
};

export const updateContactInformation = async (data: UpdateContactInfoRequest): Promise<void> => {
  const response = await fetch(getApiUrl('/account'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update contact information: ${response.status}`);
  }
};
