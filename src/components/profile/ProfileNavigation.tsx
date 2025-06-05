
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ProfileNavigation = () => {
  const getBackNavigation = () => {
    const referrer = document.referrer;
    
    if (referrer.includes('/search')) {
      return {
        url: referrer,
        text: 'Back to Search Results'
      };
    } else if (referrer.includes('/categories/')) {
      return {
        url: referrer,
        text: 'Back to Categories'
      };
    } else {
      // Default fallback
      return {
        url: '/categories',
        text: 'Back to Categories'
      };
    }
  };

  const backNavigation = getBackNavigation();

  return (
    <section className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <a 
          href={backNavigation.url} 
          className="inline-flex items-center text-greenyp-600 hover:text-greenyp-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backNavigation.text}
        </a>
      </div>
    </section>
  );
};

export default ProfileNavigation;
