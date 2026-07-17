import React from 'react';
import { Link } from 'react-router-dom';
import CategoryNavigationBar from './CategoryNavigationBar';
import greenpagesBanner from '@/assets/greenpages-banner.png';

const PublicHeader = () => {
  return (
    <>
      <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
        <Link to="/" aria-label="GreenPages home" className="inline-block">
          <img
            src={greenpagesBanner}
            alt="GreenPages - Your go-to directory for landscapers, gardeners, nurseries, and green industry professionals"
            className="h-16 md:h-20 w-auto"
          />
        </Link>
      </header>

      <CategoryNavigationBar />
    </>
  );
};

export default PublicHeader;
