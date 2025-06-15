
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

// Check if we're in prototyping mode
const isPrototyping = () => 
  window.location.hostname.includes('lovable') || 
  window.location.hostname === 'localhost';

// Dummy data for prototyping
const getDummyAuthorizedUsers = (): AuthorizedUserResponse[] => [
  {
    credentialsId: "CRED-001",
    createDate: "2024-01-15T10:30:00Z",
    lastUpdateDate: "2024-06-01T14:20:00Z",
    userName: "sarah.johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    producerId: "PROD-12345",
    producerContactId: "CONTACT-001",
    lastChangeDate: "2024-06-01T14:20:00Z",
    adminUser: true,
    enabled: true,
    externalAuthorizationServiceRef: "EXT-001",
    emailAddress: "sarah@greenvalleyorganic.com"
  },
  {
    credentialsId: "CRED-002", 
    createDate: "2024-02-10T09:15:00Z",
    lastUpdateDate: "2024-05-15T16:45:00Z",
    userName: "mike.chen",
    firstName: "Mike",
    lastName: "Chen",
    producerId: "PROD-12345",
    producerContactId: "CONTACT-002",
    lastChangeDate: "2024-05-15T16:45:00Z",
    adminUser: false,
    enabled: true,
    externalAuthorizationServiceRef: "EXT-002",
    emailAddress: "mike@greenvalleyorganic.com"
  },
  {
    credentialsId: "CRED-003",
    createDate: "2024-03-05T11:20:00Z",
    lastUpdateDate: "2024-04-20T13:30:00Z",
    userName: "emma.davis",
    firstName: "Emma",
    lastName: "Davis",
    producerId: "PROD-12345",
    producerContactId: "CONTACT-003",
    lastChangeDate: "2024-04-20T13:30:00Z",
    adminUser: false,
    enabled: false,
    externalAuthorizationServiceRef: "EXT-003",
    emailAddress: "emma@greenvalleyorganic.com"
  }
];

export const fetchAuthorizedUsers = async (producerId: string): Promise<AuthorizedUserResponse[]> => {
  // Return dummy data in prototyping mode
  if (isPrototyping()) {
    console.log('🔧 Using dummy authorized users data for prototyping');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return getDummyAuthorizedUsers();
  }

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
