import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface TrackingParams {
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

export const useInteractionTracking = () => {
  const location = useLocation();

  const trackEvent = useCallback((eventName: string, params: TrackingParams) => {
    window.gtag('event', eventName, {
      ...params,
      page_path: location.pathname
    });
  }, [location]);

  const trackImageClick = useCallback((imageId: string, imageName: string, params: TrackingParams = {}) => {
    trackEvent('image_click', {
      ...params,
      event_category: 'interaction',
      event_action: 'click',
      image_id: imageId,
      image_name: imageName,
    });
  }, [trackEvent]);

  return {
    trackImageClick,
  };
};
