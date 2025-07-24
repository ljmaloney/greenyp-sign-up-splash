
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignUpHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
      <div className="flex items-center">
        <Link to="/subscribers" className="text-2xl font-bold text-greenyp-700 flex items-center">
          <Leaf className="mr-2 h-8 w-8" />
          <span>GreenYP - Professional Sign Up</span>
        </Link>
      </div>

      {!isMobile && (
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/subscribers/subscription-features" className="text-gray-700 hover:text-greenyp-600 transition-colors">Features</Link>
          <Link to="/subscribers/subscribe" className="text-gray-700 hover:text-greenyp-600 transition-colors">Pricing</Link>
          <Link to="/subscribers/contact" className="text-gray-700 hover:text-greenyp-600 transition-colors">Contact</Link>
        </nav>
      )}
    </header>
  );
};

export default SignUpHeader;
