import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollRestoration component that handles positioning the page at the top
 * immediately when navigating between routes.
 */
export function ScrollRestoration() {
  const [location] = useLocation();

  useEffect(() => {
    // Position the page at the top immediately when the location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Using 'auto' instead of 'smooth' for immediate positioning without animation
    });
  }, [location]);

  return null;
}