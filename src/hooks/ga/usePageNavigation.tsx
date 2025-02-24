import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface TrackingParams {
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

export const useNavigationTracking = () => {
  const location = useLocation();

  const trackEvent = useCallback((eventName: string, params: TrackingParams) => {
    window.gtag('event', eventName, {
      ...params,
      page_path: location.pathname
    });
  }, [location]);



  const trackPageNavigation = useCallback((destination: string, params: TrackingParams = {}) => {
    trackEvent('page_navigation', {
      ...params,
      event_category: 'navigation',
      destination,
    });
  }, [trackEvent]);


  return {
    trackPageNavigation,
  };
};