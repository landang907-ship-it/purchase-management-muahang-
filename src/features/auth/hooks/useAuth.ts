/**
 * useAuth – thin wrapper around AuthContext.
 *
 * API stays the same: `const { user, isAuthenticated, login, logout } = useAuth();`
 * State is now shared globally via React Context instead of local useState
 * → App.tsx + LoginPage.tsx + PurchasePage.tsx share 1 state → after login
 * App re-renders to PurchasePage automatically.
 */
import { useContext } from 'react';
import { AuthContext, type AuthUser } from '@/features/auth/contexts/AuthContext';

export type { AuthUser };

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error(
            'useAuth() must be used within <AuthProvider>. ' +
            'Check that main.tsx wraps <App /> in <AuthProvider>.',
        );
    }
    return ctx;
}
