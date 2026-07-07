/**
 * Type definitions for the SAP login module.
 */

// Re-export shared toast types so existing imports keep working.
export type { ToastVariant, ToastMessage } from '@/shared/model/toast';

export interface SapFormState {
    user: string;
    password: string;
    language: string;
}

export type SapFormErrors = Partial<Record<keyof SapFormState, string>>;
