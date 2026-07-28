import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

export function ProtectedRoute({ requireAdmin }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
