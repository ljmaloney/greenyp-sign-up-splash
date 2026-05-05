
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from 'react-router-dom';
import CategoryNavigationBar from './CategoryNavigationBar';
import greenypLogo from '@/assets/greenyp-logo.png';

const PublicHeader = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
        <div className="flex flex-col">
          <Link to="/" className="flex items-center">
            <img src={greenypLogo} alt="GreenYP" className="h-12 w-auto" />
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
