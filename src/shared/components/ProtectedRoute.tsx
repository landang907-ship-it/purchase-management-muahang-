import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

export function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated || !user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        // Redirect to home or forbidden page if user is not an admin
        // For now, redirect to the dashboard
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
