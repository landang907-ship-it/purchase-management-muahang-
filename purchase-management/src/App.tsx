/**
 * App – root component. Renders Login or Purchase based on auth state.
 * Wrapped in ErrorBoundary to prevent white screen crashes.
 */
import { LoginPage } from '@/features/auth/ui/LoginPage';
import { PurchasePage } from '@/features/purchase/ui/PurchasePage';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

export default function App() {
    const { isAuthenticated } = useAuth();

    return (
        <ErrorBoundary>
            {isAuthenticated ? <PurchasePage /> : <LoginPage />}
        </ErrorBoundary>
    );
}
