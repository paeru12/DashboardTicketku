import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NotFound from '@/pages/NotFound';

export default function RequireRole({ children, allowed = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowed.length > 0 && !allowed.includes(user?.role)) {
    // Authenticated but not allowed -> show NotFound to hide existence of route
    return <NotFound />;
  }

  return children;
}
