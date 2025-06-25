
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import CreateAdForm from '@/components/classifieds/CreateAdForm';

const CreateAd = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Classified Ad</h1>
            <p className="text-gray-600">Choose your pricing tier and create your ad</p>
          </div>

          <CreateAdForm />
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default CreateAd;
