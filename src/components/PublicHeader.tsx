
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHeaderText } from "@/hooks/useHeaderText";
import { useClassifiedsNavigation } from "@/hooks/useClassifiedsNavigation";
import { Leaf, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PublicHeader = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const isClassifiedsPage = location.pathname.startsWith('/classifieds');
  const headerText = useHeaderText();
  const { getBackNavigation, shouldShowBackButton } = useClassifiedsNavigation();
  
  // Determine the appropriate home link based on current page
  const homeLink = isClassifiedsPage ? '/classifieds' : '/';
  
  const handleBackClick = () => {
    const backNav = getBackNavigation();
    if (backNav) {
      navigate(backNav.backUrl);
    }
  };

  const backNavigation = getBackNavigation();
  
  return (
    <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
      <div className="flex flex-col">
        <Link to={homeLink} className="text-2xl font-bold text-greenyp-700 flex items-center">
          <Leaf className="mr-2 h-8 w-8" />
          <span>{headerText}</span>
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
          <>
            {shouldShowBackButton() && backNavigation && (
              <Button 
                variant="outline" 
                className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
                onClick={handleBackClick}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backNavigation.backLabel}
              </Button>
            )}
            <Link to="/">
              <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                Back to the Market
              </Button>
            </Link>
          </>
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
