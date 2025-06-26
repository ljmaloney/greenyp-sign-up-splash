
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

// Create a function that accepts an API client for dependency injection
export const createAuthorizedUsersService = (apiClient: any) => ({
  async fetchAuthorizedUsers(producerId: string): Promise<AuthorizedUserResponse[]> {
    const data: AuthorizedUsersApiResponse = await apiClient.get(`/producer/${producerId}/search/users`, { requireAuth: true });
    
    if (data.errorMessageApi) {
      throw new Error(data.errorMessageApi);
    }
    
    return data.response || [];
  }
});

// Legacy function for backward compatibility - will be deprecated
export const fetchAuthorizedUsers = async (producerId: string): Promise<AuthorizedUserResponse[]> => {
  console.log('⚠️ Using legacy fetchAuthorizedUsers - consider using authenticated version');
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
