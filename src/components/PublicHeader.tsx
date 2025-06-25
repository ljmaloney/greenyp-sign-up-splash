
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Leaf } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const PublicHeader = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isClassifiedsPage = location.pathname.startsWith('/classifieds');
  
  // Determine the appropriate home link based on current page
  const homeLink = isClassifiedsPage ? '/classifieds' : '/';
  
  return (
    <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
      <div className="flex flex-col">
        <Link to={homeLink} className="text-2xl font-bold text-greenyp-700 flex items-center">
          <Leaf className="mr-2 h-8 w-8" />
          <span>{isClassifiedsPage ? 'GreenYP - Classifieds' : 'GreenYP'}</span>
        </Link>
        <p className="text-xs text-gray-600 mt-1">
          {isClassifiedsPage 
            ? 'Buy and sell lawn, garden, and agricultural equipment and services.'
            : 'Your go-to directory for landscapers, gardeners, nurseries, and green industry professionals near you.'
          }
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {isClassifiedsPage ? (
          <Link to="/">
            <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
              Back to the Market
            </Button>
          </Link>
        ) : (
          <>
            <Link to="/subscribers">
              <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                Subscribers
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">Login</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;
