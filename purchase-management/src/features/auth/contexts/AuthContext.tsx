/**
 * AuthProvider – React Provider cho auth state. Tách context sang file riêng
 * để tránh react-refresh warning.
 */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue, type AuthUser } from './authContextValue';

const STORAGE_KEY = 'sap_auth_user';

const DEFAULT_USER: AuthUser = {
    user: 'admin123',
    language: 'VI',
    loggedInAt: Date.now(),
};

function readUser(): AuthUser | null {
    if (typeof window === 'undefined') return DEFAULT_USER;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_USER;
        const parsed = JSON.parse(raw) as AuthUser;
        if (!parsed || typeof parsed.user !== 'string') return DEFAULT_USER;
        return parsed;
    } catch {
        return DEFAULT_USER;
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

    const login = useCallback((next: { user: string; language: string }) => {
        const payload: AuthUser = {
            user: next.user,
            language: next.language,
            loggedInAt: Date.now(),
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