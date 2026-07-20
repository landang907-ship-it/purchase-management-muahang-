import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { loadPurchaseOrdersV2, savePurchaseDataV2 } from '@/features/purchase/services/purchaseServiceV2';
import type { PurchaseRow } from '@/features/purchase/services/excel';
import type { ToastVariant } from '@/shared/hooks/useToastQueue';

interface UsePurchaseDataV2Options {
    userId: string | undefined;
    onMessage?: (text: string, variant: ToastVariant, duration?: number) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

export function usePurchaseDataV2({ userId, onMessage, t: _t }: UsePurchaseDataV2Options) {
    const queryClient = useQueryClient();
    const [fileName, setFileName] = useState('');
    const [localRows, setLocalRows] = useState<PurchaseRow[]>([]);

    // Query to fetch orders
    const { data: rows = [], isLoading, error } = useQuery({
        queryKey: ['purchaseOrders', userId],
        queryFn: async () => {
            if (!userId) return [];
            const orders = await loadPurchaseOrdersV2(userId);
            
            // Map the normalized PurchaseOrder back to PurchaseRow for UI compatibility
            return orders.map(order => ({
                'Yc.m.hàng': order.pr_number,
                'Vật tư': order.item_no,
                'Văn bản ngắn': order.description,
                'Ng.yêu cầu': order.requester,
                'Số lượng': String(order.quantity),
                'Ngày YC': order.request_date || new Date(order.created_at).toLocaleDateString('vi-VN'),
                'Đơn vị': order.unit,
                'T.trg xử lý': order.status,
                'TAG-NAME': order.tag_name,
                _rawDate: order.created_at,
                _rawStatus: order.status,
                is_urgent: order.is_urgent,
                urgent_reason: order.urgent_reason,
                urgent_image_url: order.urgent_image_url,
            })) as PurchaseRow[];
        },
        enabled: !!userId,
    });

    // Sync query data to local state for immediate UI updates when fetching completes
    useEffect(() => {
        if (rows.length > 0) {
            setLocalRows(rows);
            // Optionally, show a toast on successful load, simulating old behavior
            // onMessage?.(t('import.success', { count: rows.length }), 'success');
        }
    }, [rows]);

    // Mutation to save orders
    const saveMutation = useMutation({
        mutationFn: async ({ rowsToSave, name }: { rowsToSave: PurchaseRow[], name: string }) => {
            if (!userId) throw new Error('User not found');
            await savePurchaseDataV2(userId, rowsToSave, name);
        },
        onSuccess: () => {
            // Invalidate the query to refetch the new data
            queryClient.invalidateQueries({ queryKey: ['purchaseOrders', userId] });
        },
        onError: (err: any) => {
            const msg = err?.message || (err instanceof Error ? err.message : 'Lỗi kết nối');
            onMessage?.(`Lỗi Supabase: ${msg}`, 'warning', 5000);
            console.error('[Supabase Save V2]', err);
        }
    });

    // Provide a shim interface to maintain compatibility with the old hook
    const save = async (_uid: string, rowsToSave: PurchaseRow[], name: string) => {
        // We can optionally await this if the caller expects it
        await saveMutation.mutateAsync({ rowsToSave, name });
    };

    return {
        rows: localRows.length > 0 ? localRows : rows, // Prefer local rows if updated by parsing
        fileName,
        isLoading: isLoading || saveMutation.isPending,
        error,
        setRows: setLocalRows,
        setFileName,
        save,
    };
}
