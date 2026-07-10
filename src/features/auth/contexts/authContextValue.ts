/**
 * authContextValue – Context + types cho Auth module.
 * Tách riêng khỏi AuthProvider component để tránh react-refresh warning.
 */
import { createContext } from 'react';

export interface AuthUser {
    user: string;
    language: string;
    loggedInAt: number;
    role?: 'admin' | 'user';
}

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (next: { user: string; language: string; role?: 'admin' | 'user' }) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);