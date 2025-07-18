
import { getApiUrl } from '@/config/api';

interface AuthorizedUser {
  id: string;
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

export const updateAuthorizedUser = async (user: AuthorizedUser, password: string, producerId: string) => {
  console.log('Updating authorized user:', user);
  
  const credentialsId = user.id;
  
  const response = await fetch(getApiUrl(`/producer/${producerId}/authorize/user/${credentialsId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      producerContactId: null,
      firstName: user.firstName,
      lastName: user.lastName,
      businessPhone: user.businessPhone,
      cellPhone: user.cellPhone,
      emailAddress: user.emailAddress,
      userName: user.userName,
      credentials: password
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update authorized user: ${response.status}`);
  }

  return await response.json();
};
