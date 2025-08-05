
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryNavigationBar from './CategoryNavigationBar';

const PublicHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
        <div className="flex flex-col">
          <Link to="/" className="text-2xl font-bold text-greenyp-700 flex items-center">
            <Leaf className="mr-2 h-8 w-8" />
            <span>GreenYP</span>
          </Link>
          <p className="text-xs text-gray-600 mt-1">
            Your go-to directory for landscapers, gardeners, nurseries, and green industry professionals near you.
          </p>
        </div>
      </header>
      
      {/* Amazon-style scrollable category navigation */}
      <CategoryNavigationBar />
    </>
  );
};

export default PublicHeader;
