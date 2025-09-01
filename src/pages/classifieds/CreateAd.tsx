
import React from 'react';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import CreateAdContainer from '@/components/classifieds/CreateAdContainer';

// Custom styles for MDEditor toolbar - matching EditBusinessProfileDialog
const mdEditorStyles = `
  .w-md-editor .w-md-editor-toolbar {
    height: 48px !important;
    background: #f3f4f6 !important;
    border-bottom: 1px solid #cbd5e0 !important;
    padding: 8px 12px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li button {
    height: 32px !important;
    width: 32px !important;
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 6px !important;
    margin: 0 2px !important;
    color: #4a5568 !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s ease !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li button:hover {
    background: #22c55e !important;
    color: white !important;
    border-color: #16a34a !important;
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2) !important;
    transform: translateY(-1px) !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li button.active {
    background: #16a34a !important;
    color: white !important;
    border-color: #15803d !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li.divider {
    height: 24px !important;
    margin: 4px 6px !important;
    border-left: 1px solid #cbd5e0 !important;
  }
`;

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
