
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationDebuggerProps {
  enableLogging?: boolean;
}

export const useNavigationDebugger = ({ enableLogging = true }: NavigationDebuggerProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousLocation = useRef(location);
  const navigationHistory = useRef<Array<{ from: string; to: string; timestamp: number }>>([]);

  useEffect(() => {
    if (!enableLogging) return;

    const currentPath = location.pathname + location.search;
    const previousPath = previousLocation.current.pathname + previousLocation.current.search;

    if (currentPath !== previousPath) {
      const navigationEvent = {
        from: previousPath,
        to: currentPath,
        timestamp: Date.now()
      };

      navigationHistory.current.push(navigationEvent);
      
      console.log('🧭 Navigation Debug:', {
        event: navigationEvent,
        state: location.state,
        searchParams: Object.fromEntries(new URLSearchParams(location.search)),
        history: navigationHistory.current.slice(-5) // Last 5 navigations
      });

      previousLocation.current = location;
    }
  }, [location, enableLogging]);

  const safeNavigate = (path: string, options?: any) => {
    try {
      console.log('🚀 Safe navigation attempt:', { path, options });
      navigate(path, options);
    } catch (error) {
      console.error('❌ Navigation failed:', error);
      // Fallback to window.location
      try {
        window.location.href = path;
      } catch (windowError) {
        console.error('❌ Window navigation also failed:', windowError);
      }
    }
  };

  return {
    currentLocation: location,
    navigationHistory: navigationHistory.current,
    safeNavigate
  };
};
