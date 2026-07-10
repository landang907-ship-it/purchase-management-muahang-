/**
 * AuthProvider – React Provider cho auth state. Tách context sang file riêng
 * để tránh react-refresh warning.
 */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue, type AuthUser } from './authContextValue';

const STORAGE_KEY = 'sap_auth_user';

function readUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as AuthUser;
        if (!parsed || typeof parsed.user !== 'string') return null;
        return parsed;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => readUser());

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) setUser(readUser());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const login = useCallback((next: { user: string; language: string; role?: 'admin' | 'user' }) => {
        const payload: AuthUser = {
            user: next.user,
            language: next.language,
            loggedInAt: Date.now(),
            role: next.role || 'user',
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setUser(payload);
    }, []);

    const logout = useCallback(() => {
        window.localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: !!user,
            login,
            logout,
        }),
        [user, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}