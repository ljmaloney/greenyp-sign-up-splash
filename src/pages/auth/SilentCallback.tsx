
import { useEffect } from 'react';
import { oidcService } from '@/services/oidcService';

const SilentCallback = () => {
  useEffect(() => {
    const handleSilentCallback = async () => {
      try {
        await oidcService.handleCallback();
      } catch (error) {
        console.error('Silent callback error:', error);
      }
    };

    handleSilentCallback();
  }, []);

  return <div>Processing...</div>;
};

export default SilentCallback;
