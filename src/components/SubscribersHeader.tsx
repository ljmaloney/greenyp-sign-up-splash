
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubscriberNavigationBar from './SubscriberNavigationBar';

const SubscribersHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
        <div className="flex flex-col">
          <Link to="/subscribers" className="text-2xl font-bold text-greenyp-700 flex items-center">
            <Leaf className="mr-2 h-8 w-8" />
            <span>GreenYP - Professionals</span>
          </Link>
          <p className="text-xs text-gray-600 mt-1">
            Join the leading directory for green industry professionals and grow your business.
          </p>
        </div>

        {/*<div className="flex items-center space-x-4">*/}
        {/*  <Link to="/">*/}
        {/*    <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">*/}
        {/*      Back to the Market*/}
        {/*    </Button>*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </header>
      
      {/* Subscriber-specific navigation bar */}
      <SubscriberNavigationBar />
    </>
  );
};

export default SubscribersHeader;
