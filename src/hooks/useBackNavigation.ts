
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const useBackNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [backUrl, setBackUrl] = useState('/');
  const [backLabel, setBackLabel] = useState('Back to Home');

  useEffect(() => {
    // Check navigation state first (most reliable)
    const state = location.state as { from?: string } | null;
    
    if (state?.from) {
      console.log('Back navigation: Found state.from:', state.from);
      
      if (state.from.includes('/search')) {
        // Restore search parameters from sessionStorage if available
        const lastSearchParams = sessionStorage.getItem('lastSearchParams');
        if (lastSearchParams) {
          setBackUrl(`/search?${lastSearchParams}`);
        } else {
          setBackUrl('/search');
        }
        setBackLabel('Back to Search Results');
        return;
      }
      
      if (state.from.match(/^\/categories\/[^/]+$/)) {
        setBackUrl(state.from);
        setBackLabel('Back to Category');
        return;
      }
    }

    // Fallback to referrer check
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;
    
    if (referrer && referrer.startsWith(currentOrigin)) {
      const referrerPath = new URL(referrer).pathname + new URL(referrer).search;
      console.log('Back navigation: Found referrer path:', referrerPath);
      
      if (referrerPath.includes('/search')) {
        // Check for stored search params
        const lastSearchParams = sessionStorage.getItem('lastSearchParams');
        if (lastSearchParams) {
          setBackUrl(`/search?${lastSearchParams}`);
        } else {
          setBackUrl('/search');
        }
        setBackLabel('Back to Search Results');
        return;
      }
      
      if (referrerPath.match(/^\/categories\/[^/]+/)) {
        // Extract the category path
        const categoryMatch = referrerPath.match(/^(\/categories\/[^/?]+)/);
        if (categoryMatch) {
          setBackUrl(categoryMatch[1]);
          setBackLabel('Back to Category');
          return;
        }
      }
    }

    // Final fallback: check sessionStorage for last visited pages
    const lastVisitedCategory = sessionStorage.getItem('lastVisitedCategory');
    const lastSearchParams = sessionStorage.getItem('lastSearchParams');
    
    if (lastSearchParams) {
      setBackUrl(`/search?${lastSearchParams}`);
      setBackLabel('Back to Search Results');
    } else if (lastVisitedCategory) {
      setBackUrl(`/categories/${lastVisitedCategory}`);
      setBackLabel('Back to Category');
    } else {
      setBackUrl('/');
      setBackLabel('Back to Home');
    }
  }, [location]);

  const handleBack = () => {
    console.log('Back navigation: Navigating to:', backUrl);
    navigate(backUrl);
  };

  return {
    handleBack,
    backLabel,
    backUrl
  };
};
