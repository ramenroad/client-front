import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    
    window.gtag('event', 'page_performance', {
      page_load_time: pageLoadTime,
      page_path: location.pathname
    });
  }, [location]);

  useEffect(() => {
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const scrollPercentage = (currentScroll / scrollHeight) * 100;
      
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        window.gtag('event', 'scroll_depth', {
          depth_percentage: Math.round(maxScroll),
          page_path: location.pathname
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      window.gtag('event', 'time_on_page', {
        time_seconds: timeSpent,
        page_path: location.pathname
      });
    };
  }, [location]);
};