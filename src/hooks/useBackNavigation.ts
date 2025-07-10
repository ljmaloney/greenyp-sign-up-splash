
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const useBackNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [backUrl, setBackUrl] = useState('/');
  const [backLabel, setBackLabel] = useState('Back to Home');

  useEffect(() => {
    // Check if we came from search results
    const referrer = document.referrer;
    const hasSearchParams = sessionStorage.getItem('lastSearchParams');
    
    // Check if referrer contains search path or if we have stored search params
    if (referrer.includes('/search') || hasSearchParams) {
      if (hasSearchParams) {
        setBackUrl(`/search?${hasSearchParams}`);
      } else {
        setBackUrl('/search');
      }
      setBackLabel('Back to Search Results');
    } else {
      setBackUrl('/');
      setBackLabel('Back to Home');
    }
  }, [location]);

  const handleBack = () => {
    navigate(backUrl);
  };

  return {
    handleBack,
    backLabel,
    backUrl
  };
};
