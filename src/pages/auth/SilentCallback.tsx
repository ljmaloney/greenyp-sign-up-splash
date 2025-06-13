
import React, { useEffect } from 'react';
import { oidcService } from '@/services/oidcService';

const SilentCallback = () => {
  useEffect(() => {
    const handleSilentCallback = async () => {
      try {
        await oidcService.userManager.signinSilentCallback();
        console.log('Silent callback completed successfully');
      } catch (error) {
        console.error('Silent callback failed:', error);
      }
    };

    handleSilentCallback();
  }, []);

  return (
    <div style={{ display: 'none' }}>
      Silent callback processing...
    </div>
  );
};

export default SilentCallback;
