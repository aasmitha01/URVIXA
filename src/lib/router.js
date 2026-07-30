import { useState, useEffect } from 'react';

export function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
}

export function useRoute() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocation = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  return route;
}
