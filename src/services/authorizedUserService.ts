
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

export const createAuthorizedUser = async (userData: CreateUserData, password: string) => {
  console.log('Adding authorized user:', userData);
  
  // Mock producer ID - in real app this would come from user context
  const producerId = 'mock-producer-id';
  
  const response = await fetch(`https://services.greenyp.com/producer/${producerId}/authorize/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      producerContactId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
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

export const updateAuthorizedUser = async (user: AuthorizedUser, password: string) => {
  console.log('Updating authorized user:', user);
  
  // Mock producer ID and credentials ID - in real app these would come from user context
  const producerId = 'mock-producer-id';
  const credentialsId = user.id;
  
  const response = await fetch(`https://services.greenyp.com/producer/${producerId}/authorize/user/${credentialsId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      producerContactId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
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
