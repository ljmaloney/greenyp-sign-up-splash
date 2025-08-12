import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Star, Grid3X3, Mail, LogIn, UserPlus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubscriberNavigationBar = () => {
  return (
    <div className="bg-gray-100 border-b border-gray-200 w-full overflow-hidden">
      <div className="flex items-center w-full">
        {/* Static Home button - Left - Always visible */}
        <div className="flex-shrink-0 bg-gray-100 px-4 py-1 border-r border-gray-200">
          <Link
            to="/"
            className="flex items-center text-sm font-medium text-gray-700 hover:text-greenyp-600 transition-colors duration-200 py-1 px-3 rounded hover:bg-white/50 whitespace-nowrap"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </div>

        {/* Spacer to push right-aligned content to the right */}
        <div className="flex-1 min-w-0"></div>

        {/* Right-aligned navigation links and buttons */}
        <div className="flex-shrink-0 bg-gray-100 flex items-center space-x-1 px-3 py-1 border-l border-gray-200">
          <Link
            to="/subscribers/subscription-features"
            className="text-sm font-medium text-gray-700 hover:text-greenyp-600 transition-colors duration-200 whitespace-nowrap py-1 px-2 rounded hover:bg-white/50"
          >
            Features
          </Link>
          <Link
            to="/subscribers/pricing"
            className="text-sm font-medium text-gray-700 hover:text-greenyp-600 transition-colors duration-200 whitespace-nowrap py-1 px-2 rounded hover:bg-white/50"
          >
            Pricing
          </Link>
          <Link
            to="/subscribers/categories"
            className="text-sm font-medium text-gray-700 hover:text-greenyp-600 transition-colors duration-200 whitespace-nowrap py-1 px-2 rounded hover:bg-white/50"
          >
            Categories
          </Link>
          <Link
            to="/subscribers/contact"
            className="text-sm font-medium text-gray-700 hover:text-greenyp-600 transition-colors duration-200 whitespace-nowrap py-1 px-2 rounded hover:bg-white/50"
          >
            Contact
          </Link>
          <Link to="/subscribers/signup">
            <Button 
              variant="outline" 
              size="sm"
              className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 text-xs whitespace-nowrap h-7 px-2"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Sign Up
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button 
              size="sm"
              className="bg-greenyp-600 hover:bg-greenyp-700 text-white text-xs whitespace-nowrap h-7 px-2"
            >
              <LogIn className="w-3 h-3 mr-1" />
              Pro Login
            </Button>
          </Link>
        </div>
      </div>
      
      <style>{`
        .flex::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SubscriberNavigationBar;
