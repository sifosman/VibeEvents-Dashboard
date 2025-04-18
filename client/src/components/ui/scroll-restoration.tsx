import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollRestoration component that handles scrolling the page to the top
 * when navigating between routes.
 */
export function ScrollRestoration() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to the top of the page when the location changes
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}