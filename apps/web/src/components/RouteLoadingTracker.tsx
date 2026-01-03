import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalLoading } from '@/contexts/LoadingContext';

/**
 * Triggers the global loader briefly on every route change so navigation feels consistent.
 */
export function RouteLoadingTracker() {
  const location = useLocation();
  const { startLoading, stopLoading } = useGlobalLoading();

  useEffect(() => {
    startLoading();
    const timeout = setTimeout(() => {
      stopLoading();
    }, 400);

    return () => clearTimeout(timeout);
  }, [location.pathname, startLoading, stopLoading]);

  return null;
}
