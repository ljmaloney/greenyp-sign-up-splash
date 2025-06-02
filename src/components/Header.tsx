
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
      <div className="flex items-center">
        <Link to="/subscriber" className="text-2xl font-bold text-greenyp-700 flex items-center">
          <Leaf className="mr-2 h-8 w-8" />
          <span>GreenYP</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6 mr-4">
            <Link to="/subscriber/subscription-features" className="text-gray-700 hover:text-greenyp-600 transition-colors">Features</Link>
            <Link to="/subscriber/subscribe" className="text-gray-700 hover:text-greenyp-600 transition-colors">Pricing</Link>
            <Link to="/subscriber/contact" className="text-gray-700 hover:text-greenyp-600 transition-colors">Contact</Link>
          </nav>
        )}
        <Button variant="outline" className="border-greenyp-500 text-greenyp-700 hover:bg-greenyp-50">Log In</Button>
        <Link to="/subscriber/signup">
          <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">Sign Up</Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
