
import { useLocation } from 'react-router-dom';

export const useHeaderText = (companyName?: string) => {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname.startsWith('/classifieds')) {
    return 'GreenYP - Classifieds';
  }
  
  if (pathname.startsWith('/subscribers') || pathname.startsWith('/subscriber')) {
    return 'GreenYP - Subscribers';
  }
  
  if (pathname.startsWith('/dashboard')) {
    return companyName ? `GreenYP - ${companyName} Dashboard` : 'GreenYP - Dashboard';
  }
  
  if (pathname.startsWith('/admin')) {
    return 'GreenYP - Admin Dashboard';
  }
  
  return 'GreenYP';
};
