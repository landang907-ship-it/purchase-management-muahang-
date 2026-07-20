/**
 * App – root component with Routing.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/ui/LoginPage';
import { PurchasePage } from '@/features/purchase/ui/PurchasePage';
import { HomePage } from '@/features/purchase/ui/HomePage';
import { ProcessedOrdersPage } from '@/features/purchase/ui/ProcessedOrdersPage';
import { UrgentOrdersPage } from '@/features/purchase/ui/UrgentOrdersPage';
import { MaterialCodePage } from '@/features/purchase/ui/MaterialCodePage';
import { ProfilePage } from '@/features/auth/ui/ProfilePage';
import { AdminUserManagement } from '@/features/auth/ui/AdminUserManagement';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { useAuth } from '@/features/auth/hooks/useAuth';

function AuthRedirect() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public / Login Route */}
                <Route path="/login" element={<AuthRedirect />} />

                {/* Protected Routes (Require Login) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<HomePage />} />
                    <Route path="/system-orders" element={<PurchasePage />} />
                    <Route path="/urgent-orders" element={<UrgentOrdersPage />} />
                    <Route path="/processed-orders" element={<ProcessedOrdersPage />} />
                    <Route path="/materials" element={<MaterialCodePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>

                {/* Admin Routes (Require Admin Role) */}
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                    <Route path="/admin/users" element={<AdminUserManagement />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
