
import React from 'react';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import CreateAdContainer from '@/components/classifieds/CreateAdContainer';
import { mdEditorStyles } from "@/services/mdEditorStyles";

const CreateAd = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <style>{mdEditorStyles}</style>
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Classified Ad</h1>
            <p className="text-gray-600">Create your classified ad in just a few simple steps</p>
          </div>

          <CreateAdContainer />
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default CreateAd;
