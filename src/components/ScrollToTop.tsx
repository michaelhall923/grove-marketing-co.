import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll to top when navigating between routes (SPA does not do this by default). */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
