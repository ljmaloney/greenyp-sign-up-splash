
import { apiRequest, API_CONFIG } from '@/config/api';

export interface UserData {
  externalUserRef: string;
  producerId: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

// Fallback data for development when API is not accessible
const FALLBACK_USER_DATA: UserData = {
  externalUserRef: 'PROD-12345',
  producerId: 'PROD-12345',
  userId: 'USER-001',
  email: 'demo@example.com',
  firstName: 'John',
  lastName: 'Doe',
  isActive: true
};

export const fetchUserData = async (externalUserRef: string): Promise<UserData> => {
  console.log('Fetching user data for:', externalUserRef);
  console.log('API URL:', `${API_CONFIG.baseUrl}/account/user/${externalUserRef}`);
  
  try {
    const data = await apiRequest(`/account/user/${externalUserRef}`);
    console.log('✅ User data fetched successfully:', data);
    return data;
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    // In development mode, provide fallback data
    if (API_CONFIG.isDevelopment) {
      console.log('🔧 Using fallback user data for development mode');
      return FALLBACK_USER_DATA;
    }
    
    // In production, re-throw the error
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};
