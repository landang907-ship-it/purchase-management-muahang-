/**
 * AuthContext – React Context providing global auth state for the entire app.
 * Uses useContext + useState instead of useReducer (per PROJECT_STACK.md §6).
 *
 * State is shared between App.tsx, LoginPage.tsx, PurchasePage.tsx via the Provider
 * in main.tsx → fixes the "login success but still redirected to LoginPage" bug.
 */
import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

export interface AuthUser {
    user: string;
    language: string;
    loggedInAt: number;
}

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (next: { user: string; language: string }) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

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
