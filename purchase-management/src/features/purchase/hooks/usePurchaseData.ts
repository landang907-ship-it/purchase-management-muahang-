/**
 * usePurchaseData ΓÇô quß║ún l├╜ rows state + load tß╗½ Supabase khi mount.
 * T├ích ra tß╗½ PurchasePage ─æß╗â giß║úm k├¡ch th╞░ß╗¢c component.
 */
import { useCallback, useEffect, useState } from 'react';
import { loadPurchaseData, savePurchaseData } from '@/features/purchase/services/purchaseService';
import type { PurchaseRow } from '@/features/purchase/services/excel';
import type { ToastVariant } from '@/shared/hooks/useToastQueue';

export interface UsePurchaseDataResult {
    rows: PurchaseRow[];
    fileName: string;
    isLoading: boolean;
    setRows: (rows: PurchaseRow[]) => void;
    setFileName: (name: string) => void;
    save: (userId: string, rows: PurchaseRow[], fileName: string) => Promise<void>;
}

interface UsePurchaseDataOptions {
    userId: string | undefined;
    onMessage?: (text: string, variant: ToastVariant, duration?: number) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

/**
 * Manages purchase rows + handles Supabase sync (load on mount, save on demand).
 */
export function usePurchaseData({ userId, onMessage, t }: UsePurchaseDataOptions): UsePurchaseDataResult {
    const [rows, setRows] = useState<PurchaseRow[]>([]);
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Load saved data from Supabase on mount / user change
    useEffect(() => {
        if (!userId) return;
        let isMounted = true;

        const load = async () => {
            setIsLoading(true);
            try {
                const saved = await loadPurchaseData(userId);
                if (isMounted && saved.length > 0) {
                    setRows(saved);
                    onMessage?.(t('import.success', { count: saved.length }), 'success');
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('[Supabase Load]', err);
                onMessage?.('Kh├┤ng thß╗â tß║úi dß╗» liß╗çu ─æ├ú l╞░u tß╗½ Supabase', 'error', 4000);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        void load();

        return () => {
            isMounted = false;
        };
    }, [userId, onMessage, t]);

    const save = useCallback(
        async (uid: string, rowsToSave: PurchaseRow[], name: string) => {
            try {
                await savePurchaseData(uid, rowsToSave, name);
            } catch (saveErr) {
                const msg = saveErr instanceof Error ? saveErr.message : 'Lß╗ùi kß║┐t nß╗æi';
                onMessage?.(`Kh├┤ng thß╗â tß╗▒ ─æß╗Öng l╞░u l├¬n Supabase: ${msg}`, 'warning', 5000);
                // eslint-disable-next-line no-console
                console.error('[Supabase Save]', saveErr);
            }
        },
        [onMessage],
    );

    return { rows, fileName, isLoading, setRows, setFileName, save };
}
