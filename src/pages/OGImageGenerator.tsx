
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import OGImageGenerator from '@/components/OGImageGenerator';

const OGImageGeneratorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="py-8">
        <OGImageGenerator />
      </main>
    </div>
  );
};

export default OGImageGeneratorPage;
