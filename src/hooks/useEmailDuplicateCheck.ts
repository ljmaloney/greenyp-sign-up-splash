import { useState } from 'react';
import { getApiUrl } from '@/config/api';

export const useEmailDuplicateCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    setIsChecking(true);
    setCheckError(null);
    
    try {
      console.log('🔍 Checking if email exists:', email);
      const response = await fetch(getApiUrl(`/account/check-email/${encodeURIComponent(email)}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📡 Email check response status:', response.status);
      
      if (response.status === 200) {
        // Email exists
        setIsDuplicate(true);
        console.log('❌ Email already exists');
        return true;
      } else if (response.status === 404) {
        // Email doesn't exist - good to proceed
        setIsDuplicate(false);
        console.log('✅ Email is available');
        return false;
      } else {
        // Other error
        const errorData = await response.text();
        console.error('❌ Email check failed:', response.status, errorData);
        setCheckError(`Failed to verify email availability (${response.status})`);
        return false;
      }
    } catch (error) {
      console.error('🌐 Network error during email check:', error);
      setCheckError('Network error while checking email availability');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const resetCheck = () => {
    setIsDuplicate(false);
    setCheckError(null);
    setIsChecking(false);
  };

  return {
    isChecking,
    isDuplicate,
    checkError,
    checkEmailExists,
    resetCheck
  };
};
