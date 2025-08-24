
import { getApiUrl } from '@/config/api';

// Import the type returned by useApiClient hook
type ApiClient = ReturnType<typeof import('@/hooks/useApiClient').useApiClient>;

interface AuthorizedUser {
  credentialsId: string;
  firstName: string;
  lastName: string;
  businessPhone: string;
  cellPhone: string;
  emailAddress: string;
  userName: string;
}

interface CreateUserData {
  firstName: string;
  lastName: string;
  businessPhone: string;
  cellPhone: string;
  emailAddress: string;
  userName: string;
}

export const createAuthorizedUser = async (userData: CreateUserData, password: string, producerId: string) => {
  console.log('Adding authorized user:', userData);
  
  const response = await fetch(getApiUrl(`/producer/${producerId}/authorize/user`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      producerContactId: null,
      firstName: userData.firstName,
      lastName: userData.lastName,
      businessPhone: userData.businessPhone,
      cellPhone: userData.cellPhone,
      emailAddress: userData.emailAddress,
      userName: userData.userName,
      credentials: password
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add authorized user: ${response.status}`);
  }

  return await response.json();
};

export const updateAuthorizedUser = async (apiClient: ApiClient, user: AuthorizedUser, password: string, producerId: string) => {
  console.log('Updating authorized user:', user);

  const credentialsId = user.credentialsId;

  const userData = {
    producerContactId: null,
    firstName: user.firstName,
    lastName: user.lastName,
    businessPhone: user.businessPhone,
    cellPhone: user.cellPhone,
    emailAddress: user.emailAddress,
    userName: user.userName,
    credentials: password
  };

  const response = await apiClient.put(`/producer/${producerId}/authorize/user/${credentialsId}`, userData, { 
    requireAuth: true 
  });

  if (response.error) {
    throw new Error(`Failed to update authorized user: ${response.error}`);
  }

  return response.response;
};
