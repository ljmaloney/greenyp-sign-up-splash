
import { getApiUrl } from '@/config/api';

export interface LineOfBusiness {
  lineOfBusinessId: string;
  displayName: string;
  description?: string;
}

export interface LineOfBusinessResponse {
  response: LineOfBusiness[];
  errorMessageApi: string | null;
}

export const fetchLineOfBusiness = async (): Promise<LineOfBusiness[]> => {
  console.log('🔍 Fetching line of business data');
  
  const url = getApiUrl('/reference/lob');
  console.log(`📡 API URL: ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`❌ Line of Business API failed: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch line of business data: ${response.statusText}`);
  }

  const data: LineOfBusinessResponse = await response.json();
  console.log('✅ Line of business data received:', data);

  if (data.errorMessageApi) {
    throw new Error(data.errorMessageApi);
  }

  return data.response;
};
