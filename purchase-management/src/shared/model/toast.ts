/**
 * Shared toast type definitions used across the app (login + purchase).
 * The shared `<Toast />` component renders all five variants.
 */
export type ToastVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
    id: number;
    text: string;
    variant: ToastVariant;
    duration: number;
}
