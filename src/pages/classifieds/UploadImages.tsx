
import React from 'react';
import { useLocation } from 'react-router-dom';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ImageUploadHeader from '@/components/classifieds/ImageUploadHeader';
import ImageUploadForm from '@/components/classifieds/ImageUploadForm';

const UploadImages = () => {
  const location = useLocation();
  
  const classifiedData = location.state?.classifiedData;
  const packageData = location.state?.packageData;
  const maxImages = packageData?.features?.maxImages || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <ImageUploadHeader maxImages={maxImages} />
          <ImageUploadForm 
            classifiedData={classifiedData}
            packageData={packageData}
            maxImages={maxImages}
          />
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default UploadImages;
