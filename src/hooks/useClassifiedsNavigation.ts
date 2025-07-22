
import { useLocation } from 'react-router-dom';

export const useClassifiedsNavigation = () => {
  const location = useLocation();
  
  const getBackNavigation = () => {
    // Check if we're on a classified detail page
    if (location.pathname.startsWith('/classifieds/detail/')) {
      // Check if we came from search via state
      if (location.state?.fromSearch) {
        const storedSearchParams = sessionStorage?.getItem('lastSearchParams');
        if (storedSearchParams) {
          return {
            backUrl: `/classifieds/search?${storedSearchParams}`,
            backLabel: 'Back to Search Results'
          };
        }
        return {
          backUrl: '/classifieds/search',
          backLabel: 'Back to Search Results'
        };
      }
      
      // Default back to main classifieds page
      return {
        backUrl: '/classifieds',
        backLabel: 'Back to Classifieds'
      };
    }
    
    // For search results page
    if (location.pathname === '/classifieds/search') {
      return {
        backUrl: '/classifieds',
        backLabel: 'Back to Classifieds'
      };
    }
    
    return null;
  };

  const shouldShowBackButton = () => {
    // Don't show on main classifieds page
    if (location.pathname === '/classifieds') {
      return false;
    }
    
    // Show on detail pages and search pages
    return location.pathname.startsWith('/classifieds/detail/') || 
           location.pathname === '/classifieds/search';
  };

  return {
    getBackNavigation,
    shouldShowBackButton
  };
};
