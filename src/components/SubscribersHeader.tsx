
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscribersHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
      <div className="flex items-center">
        <Link to="/subscribers" className="text-2xl font-bold text-greenyp-700 flex items-center">
          <Leaf className="mr-2 h-8 w-8" />
          <span>GreenYP - Professionals</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6 mr-4">
            <Link to="/subscribers/subscription-features" className="text-gray-700 hover:text-greenyp-600 transition-colors">Features</Link>
            <Link to="/subscribers/subscribe" className="text-gray-700 hover:text-greenyp-600 transition-colors">Pricing</Link>
            <Link to="/subscribers/contact" className="text-gray-700 hover:text-greenyp-600 transition-colors">Contact</Link>
          </nav>
        )}
          <Link to="/">
              <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                  Back to the Market
              </Button>
          </Link>
        <Link to="/dashboard">
          <Button variant="outline" className="border-greenyp-500 text-greenyp-700 hover:bg-greenyp-50">Pro Login</Button>
        </Link>
        <Link to="/subscribers/signup">
          <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">Sign Up</Button>
        </Link>
      </div>
    </header>
  );
};

export default SubscribersHeader;
