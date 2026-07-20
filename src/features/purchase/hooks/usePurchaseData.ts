/**
 * usePurchaseData – quản lý rows state + load từ Supabase khi mount.
 * Tách ra từ PurchasePage để giảm kích thước component.
 */
import { useCallback, useEffect, useState } from 'react';
import { loadPurchaseData, savePurchaseData } from '@/features/purchase/services/purchaseService';
import { supabase } from '@/features/purchase/services/supabaseClient';
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
                    // Fetch urgent metadata from purchase_orders
                    const { data: urgentData } = await supabase
                        .from('purchase_orders')
                        .select('unique_order_key, is_urgent, urgent_status, urgent_reason, urgent_image_url')
                        .eq('user_id', userId)
                        .eq('is_urgent', true);

                    const urgentMap = new Map();
                    if (urgentData) {
                        for (const item of urgentData) {
                            urgentMap.set(item.unique_order_key, item);
                        }
                    }

                    // Merge urgent metadata into the raw excel rows
                    const merged = saved.map(row => {
                        const prNumber = row['Yc.m.hàng'] || '';
                        const itemNo = row['Vật tư'] || '';
                        const key = `${prNumber}_${itemNo}`;
                        
                        if (urgentMap.has(key)) {
                            const meta = urgentMap.get(key);
                            return {
                                ...row,
                                is_urgent: meta.is_urgent,
                                urgent_status: meta.urgent_status || 'pending',
                                urgent_reason: meta.urgent_reason,
                                urgent_image_url: meta.urgent_image_url
                            };
                        }
                        return row;
                    });

                    setRows(merged);
                    onMessage?.(t('import.success', { count: merged.length }), 'success');
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('[Supabase Load]', err);
                onMessage?.('Không thể tải dữ liệu đã lưu từ Supabase', 'error', 4000);
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
                const msg = saveErr instanceof Error ? saveErr.message : 'Lỗi kết nối';
                onMessage?.(`Không thể tự động lưu lên Supabase: ${msg}`, 'warning', 5000);
                // eslint-disable-next-line no-console
                console.error('[Supabase Save]', saveErr);
            }
        },
        [onMessage],
    );

    return { rows, fileName, isLoading, setRows, setFileName, save };
}