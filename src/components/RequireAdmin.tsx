import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import type { ReactNode } from 'react';

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[color:var(--color-grove-100)]">
        Loading...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
