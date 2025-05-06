
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Leaf } from 'lucide-react';

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
      <div className="flex items-center">
        <div className="text-2xl font-bold text-greenyp-700 flex items-center">
          <Leaf className="mr-2 h-8 w-8" />
          <span>GreenYP</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6 mr-4">
            <a href="#features" className="text-gray-700 hover:text-greenyp-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-greenyp-600 transition-colors">Pricing</a>
            <a href="#contact" className="text-gray-700 hover:text-greenyp-600 transition-colors">Contact</a>
          </nav>
        )}
        <Button variant="outline" className="border-greenyp-500 text-greenyp-700 hover:bg-greenyp-50">Log In</Button>
        <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">Sign Up</Button>
      </div>
    </header>
  );
};

export default Header;
