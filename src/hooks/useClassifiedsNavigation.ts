
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
    
    return null;
  };

  const shouldShowBackButton = () => {
    // Only show on detail pages
    return location.pathname.startsWith('/classifieds/detail/');
  };

  return {
    getBackNavigation,
    shouldShowBackButton
  };
};
