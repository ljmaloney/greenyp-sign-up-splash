
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
      <div className="flex items-center">
        <div className="text-2xl font-bold text-greenyp-700 flex items-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-2 h-8 w-8"
          >
            <path d="M17.6,11.48 L19.44,8.3 C19.6,8.05 19.45,7.74 19.15,7.74 L14.82,7.75 C13.19,7.75 12.12,6.7 12.12,5.1 L12.12,4.97 C12.12,3.38 13.23,2.32 14.84,2.32 L20.15,2.33 C20.45,2.33 20.59,2.01 20.43,1.77 L18.6,0 L12.01,0 C8.3,0 6.09,2.1 6.09,5.1 L6.09,5.1 C6.09,7.67 7.63,9.16 9.67,9.89 L9.67,18.76 C9.67,19.42 9.14,20 8.51,20 L8.51,20 C7.87,20 7.35,19.43 7.35,18.76 L7.35,14.17 L3.87,14.17 C3.24,14.17 2.71,14.74 2.71,15.4 L2.71,15.4 C2.71,16.07 3.24,16.64 3.87,16.64 L5.04,16.64 L5.04,18.76 C5.04,20.78 6.55,22.38 8.51,22.38 L8.51,22.38 C10.46,22.38 11.98,20.78 11.98,18.76 L11.98,9.89 C14.02,9.16 15.56,7.67 15.56,5.1 L15.56,5.1 C15.56,5.07 15.56,5.04 15.56,5.01 L21.52,5.01 C21.82,5.01 21.98,4.7 21.81,4.45 L16.58,0 L16.58,0 L17.6,11.48 Z"/>
          </svg>
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
