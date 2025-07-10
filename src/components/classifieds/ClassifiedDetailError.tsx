
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';

const ClassifiedDetailError = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ad Not Found</h2>
            <p className="text-gray-600 mb-6">The classified ad you're looking for doesn't exist or has been removed.</p>
            <Link to="/classifieds">
              <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Classifieds
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default ClassifiedDetailError;
