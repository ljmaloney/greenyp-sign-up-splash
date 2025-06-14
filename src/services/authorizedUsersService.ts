
import { getApiUrl } from '@/config/api';

export interface AuthorizedUserResponse {
  credentialsId: string;
  createDate: string;
  lastUpdateDate: string;
  userName: string;
  firstName: string;
  lastName: string;
  producerId: string;
  producerContactId: string;
  lastChangeDate: string;
  adminUser: boolean;
  enabled: boolean;
  externalAuthorizationServiceRef: string;
  emailAddress: string;
}

export interface AuthorizedUsersApiResponse {
  response: AuthorizedUserResponse[];
  errorMessageApi: string | null;
}

export const fetchAuthorizedUsers = async (producerId: string): Promise<AuthorizedUserResponse[]> => {
  const response = await fetch(getApiUrl(`/producer/${producerId}/search/users`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch authorized users: ${response.status}`);
  }
  
  const data: AuthorizedUsersApiResponse = await response.json();
  
  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi);
  }
  
  return data.response || [];
};
