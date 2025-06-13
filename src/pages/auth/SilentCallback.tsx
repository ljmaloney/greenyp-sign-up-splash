
import React, { useEffect } from 'react';
import { oidcService } from '@/services/oidcService';

const SilentCallback = () => {
  useEffect(() => {
    const handleSilentCallback = async () => {
      try {
        await oidcService.handleSilentCallback();
      } catch (error) {
        console.error('Silent callback processing failed:', error);
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
