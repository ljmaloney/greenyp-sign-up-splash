
import React from 'react';

interface FeatureStatusGridProps {
  hasProductsFeature: boolean;
  hasServicesFeature: boolean;
  hasPhotoGalleryFeature: boolean;
}

const FeatureStatusGrid = ({ 
  hasProductsFeature, 
  hasServicesFeature, 
  hasPhotoGalleryFeature 
}: FeatureStatusGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-sm font-medium">Products</div>
        <div className={`text-xs ${hasProductsFeature ? 'text-green-600' : 'text-gray-400'}`}>
          {hasProductsFeature ? 'Enabled' : 'Disabled'}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium">Services</div>
        <div className={`text-xs ${hasServicesFeature ? 'text-green-600' : 'text-gray-400'}`}>
          {hasServicesFeature ? 'Enabled' : 'Disabled'}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium">Photo Gallery</div>
        <div className={`text-xs ${hasPhotoGalleryFeature ? 'text-green-600' : 'text-gray-400'}`}>
          {hasPhotoGalleryFeature ? 'Enabled' : 'Disabled'}
        </div>
      </div>
    </div>
  );
};

export default FeatureStatusGrid;
