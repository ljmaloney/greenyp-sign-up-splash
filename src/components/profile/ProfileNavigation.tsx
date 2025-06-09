
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackNavigation = () => {
    const referrer = document.referrer;
    
    // Check if we have referrer information to determine where to go back
    if (referrer.includes('/search')) {
      // If came from search results, go back to search with current params
      const searchParams = new URLSearchParams(location.search);
      const backUrl = `/search?${searchParams.toString()}`;
      navigate(backUrl);
    } else if (referrer.includes('/categories/')) {
      // Extract category slug from referrer and navigate back to category page
      const categoryMatch = referrer.match(/\/categories\/([^/?]+)/);
      if (categoryMatch) {
        navigate(`/categories/${categoryMatch[1]}`);
      } else {
        navigate('/categories');
      }
    } else {
      // Default fallback - go back in history or to categories
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/categories');
      }
    }
  };

  const getBackText = () => {
    const referrer = document.referrer;
    
    if (referrer.includes('/search')) {
      return 'Back to Search Results';
    } else if (referrer.includes('/categories/')) {
      return 'Back to Categories';
    } else {
      return 'Back to Categories';
    }
  };

  return (
    <section className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost"
          onClick={handleBackNavigation}
          className="text-greenyp-600 hover:text-greenyp-700 hover:bg-greenyp-50 p-0 h-auto font-normal"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {getBackText()}
        </Button>
      </div>
    </section>
  );
};

export default ProfileNavigation;
