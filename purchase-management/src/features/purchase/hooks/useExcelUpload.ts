/**
 * useExcelUpload – quản lý file input ref + drag-drop + handleFile logic.
 * Tách ra từ PurchasePage để giảm kích thước component.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { parseExcel, type PurchaseRow } from '@/features/purchase/services/excel';
import type { ToastVariant } from '@/shared/hooks/useToastQueue';

const ACCEPTED_EXT = ['xlsx', 'xls', 'csv'] as const;
type AcceptedExt = (typeof ACCEPTED_EXT)[number];

export interface UseExcelUploadResult {
    isLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    openFilePicker: () => void;
    handleFile: (file: File) => Promise<{ rows: PurchaseRow[]; fileName: string; uniqueTags: string[]; tagRowCounts: Record<string, number> } | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface UseExcelUploadOptions {
    onMessage: (text: string, variant: ToastVariant, duration?: number) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    userId: string | undefined;
    onAfterParse: (rows: PurchaseRow[], fileName: string, uniqueTags: string[], tagRowCounts: Record<string, number>) => void;
    onSave: (userId: string, rows: PurchaseRow[], fileName: string) => void;
}

/**
 * Manages Excel file upload via file input + drag-drop on window.
 * Returns parsed rows; lets parent decide what to do with them.
 */
export function useExcelUpload({
    onMessage,
    t,
    userId,
    onAfterParse,
    onSave,
}: UseExcelUploadOptions): UseExcelUploadResult {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = useCallback(
        async (file: File) => {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
            if (!ACCEPTED_EXT.includes(ext as AcceptedExt)) {
                onMessage(t('import.extError'), 'error');
                return null;
            }

            setIsLoading(true);
            try {
                const result = await parseExcel(file);

                if (result.tagColIdx === -1) {
                    const headerList = result.headers.filter(Boolean).slice(0, 15).join(' | ');
                    onMessage(
                        `${t('import.tagMissing')}. Các cột: ${headerList}`,
                        'warning',
                        6000,
                    );
                } else if (result.allRows.length === 0) {
                    onMessage(t('import.noRows'), 'warning', 4000);
                } else {
                    onMessage(
                        t('import.success', { count: result.allRows.length }),
                        'success',
                    );
                }

                // Pass all data to parent
                onAfterParse(result.allRows, file.name, result.uniqueTags, result.tagRowCounts);

                // Persist to Supabase (errors already handled inside onSave)
                if (result.allRows.length > 0 && userId) {
                    onSave(userId, result.allRows, file.name);
                }

                return {
                    rows: result.allRows,
                    fileName: file.name,
                    uniqueTags: result.uniqueTags,
                    tagRowCounts: result.tagRowCounts,
                };
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
                onMessage(t('import.error', { msg }), 'error', 5000);
                // eslint-disable-next-line no-console
                console.error('[ParseExcel]', err);
                return null;
            } finally {
                setIsLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        },
        [onMessage, t, userId, onAfterParse, onSave],
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
        },
        [handleFile],
    );

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // Drag & drop on window
    useEffect(() => {
        const onDragOver = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        };
        const onDrop = (e: DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer?.files?.[0];
            if (file) void handleFile(file);
        };
        window.addEventListener('dragover', onDragOver);
        window.addEventListener('drop', onDrop);
        return () => {
            window.removeEventListener('dragover', onDragOver);
            window.removeEventListener('drop', onDrop);
        };
    }, [handleFile]);

    return { isLoading, fileInputRef, openFilePicker, handleFile, handleFileChange };
}
