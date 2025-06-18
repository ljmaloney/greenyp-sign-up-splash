
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PhotoGalleryContent from '@/components/dashboard/PhotoGalleryContent';

const PhotoGallery = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
        </div>
        <PhotoGalleryContent />
      </div>
    </DashboardLayout>
  );
};

export default PhotoGallery;
