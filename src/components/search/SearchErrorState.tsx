
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';

interface SearchErrorStateProps {
  error: string;
}

const SearchErrorState = ({ error }: SearchErrorStateProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/">
            <Button className="bg-greenyp-600 hover:bg-greenyp-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchErrorState;
