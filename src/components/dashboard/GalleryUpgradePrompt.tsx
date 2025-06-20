
import React from 'react';

const GalleryUpgradePrompt = () => {
  return (
    <p className="text-sm text-gray-500">
      Photo gallery is not available with your current subscription. 
      <a href="/dashboard/upgrade" className="text-blue-600 hover:underline ml-1">
        Upgrade your plan
      </a> to enable this feature.
    </p>
  );
};

export default GalleryUpgradePrompt;
