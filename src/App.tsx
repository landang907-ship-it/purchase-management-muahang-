/**
 * App – root component. Renders Login or Purchase based on auth state.
 */
import { LoginPage } from '@/features/auth/ui/LoginPage';
import { PurchasePage } from '@/features/purchase/ui/PurchasePage';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function App() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <PurchasePage /> : <LoginPage />;
}
