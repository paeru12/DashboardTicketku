import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { useAuth } from '@/contexts/AuthContext';

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // If the navigation clearly came from inside the app (menu click or
    // a login redirect), send to `/login` so the user can authenticate.
    // For manual typed URLs (no `location.state`), render NotFound instead
    // to avoid revealing protected routes.
    // Also allow a reload to count as an in-app navigation.
    let isReload = false;
    try {
      const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')?.[0];
      if (nav && nav.type === 'reload') isReload = true;
      if (!isReload && performance?.navigation && performance.navigation.type === 1) isReload = true;
    } catch (e) {
      // ignore
    }

    let lastInternalMatch = false;
    try { lastInternalMatch = typeof window !== 'undefined' && sessionStorage.getItem('lastInternalPath') === location.pathname; } catch (e) { lastInternalMatch = false; }
    const cameFromApp = location.state?.fromMenu === true || location.state?.fromLogin === true || isReload || lastInternalMatch;
    if (cameFromApp) return <Navigate to="/login" state={{ from: location }} replace />;
    return <NotFound />;
  }

  return children;
}
