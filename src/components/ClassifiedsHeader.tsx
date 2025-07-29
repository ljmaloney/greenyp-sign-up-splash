
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useClassifiedsNavigation } from "@/hooks/useClassifiedsNavigation";
import {Leaf, ArrowLeft, Eye, Plus} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ClassifiedsHeader = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { getBackNavigation, shouldShowBackButton } = useClassifiedsNavigation();
  
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
        <Link to="/classifieds" className="text-2xl font-bold text-greenyp-700 flex items-center">
          <Leaf className="mr-2 h-8 w-8" />
          <span>GreenYP - Classifieds</span>
        </Link>
        <p className="text-xs text-gray-600 mt-1">
          Buy and sell lawn, garden, and agricultural equipment and services.
        </p>
      </div>

      <div className="flex items-center space-x-4">
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
        <Link to="/classifieds/samples">
          <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
            <Eye className="w-4 h-4 mr-2" />
            View Ad Types
          </Button>
        </Link>
        <Link to="/classifieds/create">
          <Button className="bg-greenyp-600 hover:bg-greenyp-700">
            <Plus className="w-4 h-4 mr-2" />
            Post an Ad
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default ClassifiedsHeader;
