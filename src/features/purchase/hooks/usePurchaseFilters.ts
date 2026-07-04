/**
 * usePurchaseFilters – quản lý 4 filter state (requester, status, date, search)
 * + computed `requesterOptions`, `statusOptions`, `visibleRows`, `hasAnyFilter`.
 * Tách ra từ PurchasePage để giảm kích thước component.
 */
import { useCallback, useMemo, useState } from 'react';
import { parseDateSafe } from '@/features/purchase/lib/date';
import type { PurchaseRow } from '@/features/purchase/services/excel';

export interface UsePurchaseFiltersResult {
    selectedRequesters: string[];
    selectedStatus: string;
    dateFrom: string;
    dateTo: string;
    quickSearch: string;
    requesterOptions: string[];
    statusOptions: string[];
    visibleRows: PurchaseRow[];
    hasAnyFilter: boolean;
    setSelectedRequesters: (v: string[]) => void;
    setSelectedStatus: (v: string) => void;
    setDateFrom: (v: string) => void;
    setDateTo: (v: string) => void;
    setQuickSearch: (v: string) => void;
    clearAll: () => void;
    resetForNewImport: () => void;
}

interface UsePurchaseFiltersOptions {
    rows: PurchaseRow[];
}

/**
 * Manages filter state + computes filtered rows.
 * Pure logic – no side effects, no Supabase, no DOM.
 */
export function usePurchaseFilters({ rows }: UsePurchaseFiltersOptions): UsePurchaseFiltersResult {
    const [selectedRequesters, setSelectedRequesters] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [quickSearch, setQuickSearch] = useState<string>('');

    const requesterOptions = useMemo(() => {
        const set = new Set<string>();
        for (const r of rows) {
            const v = (r['Ng.yêu cầu'] ?? '').trim();
            if (v) set.add(v);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));
    }, [rows]);

    const statusOptions = useMemo(() => {
        const set = new Set<string>();
        for (const r of rows) {
            const v = (r['T.trg xử lý'] ?? '').trim();
            if (v) set.add(v);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));
    }, [rows]);

    const visibleRows = useMemo(() => {
        let result = rows;

        if (selectedRequesters.length > 0) {
            const selectedSet = new Set(selectedRequesters);
            result = result.filter((r) => selectedSet.has((r['Ng.yêu cầu'] ?? '').trim()));
        }

        if (selectedStatus) {
            result = result.filter((r) => ((r['T.trg xử lý'] ?? '').trim()) === selectedStatus);
        }

        if (dateFrom || dateTo) {
            const fromDate = dateFrom ? new Date(dateFrom) : null;
            const toDate = dateTo ? new Date(dateTo) : null;
            result = result.filter((r) => {
                const dateVal = parseDateSafe(r['Ngày YC'] ?? '');
                if (!dateVal) return false;
                if (fromDate && dateVal < fromDate) return false;
                if (toDate && dateVal > toDate) return false;
                return true;
            });
        }

        if (quickSearch.trim()) {
            const searchLower = quickSearch.toLowerCase().trim();
            result = result.filter((r) => {
                const text = (r['Văn bản ngắn'] ?? '').toLowerCase();
                return text.includes(searchLower);
            });
        }

        return result;
    }, [rows, selectedRequesters, selectedStatus, dateFrom, dateTo, quickSearch]);

    const hasAnyFilter =
        selectedRequesters.length > 0 ||
        selectedStatus !== '' ||
        dateFrom !== '' ||
        dateTo !== '' ||
        quickSearch !== '';

    const clearAll = useCallback(() => {
        setSelectedRequesters([]);
        setSelectedStatus('');
        setDateFrom('');
        setDateTo('');
        setQuickSearch('');
    }, []);

    // Reset search + requester when user imports a new file
    const resetForNewImport = useCallback(() => {
        setSelectedRequesters([]);
        setQuickSearch('');
    }, []);

    return {
        selectedRequesters,
        selectedStatus,
        dateFrom,
        dateTo,
        quickSearch,
        requesterOptions,
        statusOptions,
        visibleRows,
        hasAnyFilter,
        setSelectedRequesters,
        setSelectedStatus,
        setDateFrom,
        setDateTo,
        setQuickSearch,
        clearAll,
        resetForNewImport,
    };
}