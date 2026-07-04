/**
 * useToastQueue – shared hook quản lý toast queue + auto-dismiss.
 * Tách ra từ PurchasePage / LoginPage để dùng chung.
 */
import { useCallback, useRef, useState } from 'react';
import type { ToastMessage } from '@/shared/model/toast';

export type ToastVariant = ToastMessage['variant'];

export interface UseToastQueueResult {
    toasts: ToastMessage[];
    showToast: (text: string, variant?: ToastVariant, duration?: number) => void;
    dismiss: (id: number) => void;
    clear: () => void;
}

const DEFAULT_DURATION = 3000;

/**
 * Manages a queue of toast messages. Each toast auto-dismisses after `duration` ms.
 */
export function useToastQueue(defaultDuration: number = DEFAULT_DURATION): UseToastQueueResult {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const idRef = useRef(0);

    const showToast = useCallback(
        (text: string, variant: ToastVariant = 'default', duration: number = defaultDuration) => {
            const id = ++idRef.current;
            setToasts((prev) => [...prev, { id, text, variant, duration }]);
            window.setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        },
        [defaultDuration],
    );

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const clear = useCallback(() => setToasts([]), []);

    return { toasts, showToast, dismiss, clear };
}