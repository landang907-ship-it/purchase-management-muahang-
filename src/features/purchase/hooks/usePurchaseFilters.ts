/**
 * usePurchaseFilters – quản lý 4 filter state (requester, status, date, search, workshop)
 * + computed `requesterOptions`, `statusOptions`, `visibleRows`, `hasAnyFilter`.
 * Tách ra từ PurchasePage để giảm kích thước component.
 */
import { useCallback, useMemo, useState } from 'react';

// removed localStorage persistence for selectedWorkshops
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
    workshopOptions: string[];
    selectedWorkshops: string[];
    uniqueTags: string[];
    tagRowCounts: Record<string, number>;
    urgentCountsPerWorkshop: Record<string, number>;
    visibleRows: PurchaseRow[];
    hasAnyFilter: boolean;
    setSelectedRequesters: (v: string[]) => void;
    setSelectedStatus: (v: string) => void;
    setDateFrom: (v: string) => void;
    setDateTo: (v: string) => void;
    setQuickSearch: (v: string) => void;
    setSelectedWorkshops: (v: string[]) => void;
    setUrgentOnly: (v: boolean) => void;
    urgentOnly: boolean;
    clearAll: () => void;
    resetForNewImport: () => void;
}

interface UsePurchaseFiltersOptions {
    rows: PurchaseRow[];
    workshops?: Array<{ name: string; tagValues: string[] }>;
}

/**
 * Manages filter state + computes filtered rows.
 * Pure logic – no side effects, no Supabase, no DOM.
 */
export function usePurchaseFilters({ rows, workshops = [] }: UsePurchaseFiltersOptions): UsePurchaseFiltersResult {
    const [selectedRequesters, setSelectedRequesters] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [quickSearch, setQuickSearch] = useState<string>('');
    const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
    const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);

    // Workshop options: Workshop NAMES (not TAG-NAME values)
    const workshopOptions = useMemo(() => {
        return workshops.map((w) => w.name);
    }, [workshops]);

    // Build mapping: workshop name → TAG-NAME values
    const workshopToTagsMap = useMemo(() => {
        const map: Record<string, string[]> = {};
        for (const w of workshops) {
            map[w.name] = w.tagValues;
        }
        return map;
    }, [workshops]);

    // Requester options: phu thuoc vao workshop da chon
    const requesterOptions = useMemo(() => {
        // Neu chua chon workshop nao thi khong co requester
        if (selectedWorkshops.length === 0) {
            return [];
        }

        // Lay tag set tu cac workshop da chon
        const tagSet = new Set<string>();
        for (const wsName of selectedWorkshops) {
            const tags = workshopToTagsMap[wsName] || [];
            for (const tag of tags) {
                tagSet.add(tag);
            }
        }

        // Chi lay requesters thuoc cac tag da chon
        const set = new Set<string>();
        for (const r of rows) {
            const tag = (r['TAG-NAME'] ?? '').trim();
            if (tagSet.has(tag)) {
                const v = (r['Ng.yêu cầu'] ?? '').trim();
                if (v) set.add(v);
            }
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));
    }, [rows, selectedWorkshops, workshopToTagsMap]);

    const statusOptions = useMemo(() => {
        const set = new Set<string>();
        for (const r of rows) {
            const v = (r['T.trg xử lý'] ?? '').trim();
            if (v) set.add(v);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));
    }, [rows]);

    // Unique tags from all rows
    const uniqueTags = useMemo(() => {
        const set = new Set<string>();
        for (const r of rows) {
            const v = (r['TAG-NAME'] ?? '').trim();
            if (v) set.add(v);
        }
        return Array.from(set).sort();
    }, [rows]);

    // Row counts per tag
    const tagRowCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const r of rows) {
            const v = (r['TAG-NAME'] ?? '').trim();
            if (v) counts[v] = (counts[v] || 0) + 1;
        }
        return counts;
    }, [rows]);

    // Urgent counts per workshop (pending only)
    const urgentCountsPerWorkshop = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const w of workshops) {
            const tags = new Set(w.tagValues);
            let urgentCount = 0;
            for (const r of rows) {
                if (r.is_urgent && r.urgent_status === 'approved' && tags.has((r['TAG-NAME'] ?? '').trim())) {
                    urgentCount++;
                }
            }
            counts[w.name] = urgentCount;
        }
        return counts;
    }, [rows, workshops]);



    const visibleRows = useMemo(() => {
        // Nếu chưa chọn workshop nào thì không hiển thị gì
        if (selectedWorkshops.length === 0) {
            return [];
        }

        // Translate workshop names → TAG-NAME values
        const tagSet = new Set<string>();
        for (const wsName of selectedWorkshops) {
            const tags = workshopToTagsMap[wsName] || [];
            for (const tag of tags) {
                tagSet.add(tag);
            }
        }

        let result = rows;
        if (tagSet.size > 0) {
            result = result.filter((r) => tagSet.has((r['TAG-NAME'] ?? '').trim()));
        }

        // HIDE ALL items that are currently in 'processing' status (they belong in ProcessedOrdersPage)
        result = result.filter((r) => r.urgent_status !== 'processing');

        if (urgentOnly) {
            result = result.filter((r) => r.is_urgent && r.urgent_status === 'approved');
        }

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
                const prNo = (r['Yc.m.hàng'] ?? '').toLowerCase();
                const matNo = (r['Vật tư'] ?? '').toLowerCase();
                const reqName = (r['Ng.yêu cầu'] ?? '').toLowerCase();
                
                return (
                    text.includes(searchLower) ||
                    prNo.includes(searchLower) ||
                    matNo.includes(searchLower) ||
                    reqName.includes(searchLower)
                );
            });
        }

        return result;
    }, [rows, selectedRequesters, selectedStatus, dateFrom, dateTo, quickSearch, selectedWorkshops, urgentOnly]);

    const hasAnyFilter =
        selectedRequesters.length > 0 ||
        selectedStatus !== '' ||
        dateFrom !== '' ||
        dateTo !== '' ||
        quickSearch !== '' ||
        urgentOnly ||
        selectedWorkshops.length > 0;

    const clearAll = useCallback(() => {
        setSelectedRequesters([]);
        setSelectedStatus('');
        setDateFrom('');
        setDateTo('');
        setQuickSearch('');
        setUrgentOnly(false);
        setSelectedWorkshops([]);
    }, []);

    // Reset search + requester when user imports a new file
    const resetForNewImport = useCallback(() => {
        setSelectedRequesters([]);
        setQuickSearch('');
        setUrgentOnly(false);
        setSelectedWorkshops([]);
    }, []);

    return {
        selectedRequesters,
        selectedStatus,
        dateFrom,
        dateTo,
        quickSearch,
        requesterOptions,
        statusOptions,
        workshopOptions,
        selectedWorkshops,
        uniqueTags,
        tagRowCounts,
        urgentCountsPerWorkshop,
        visibleRows,
        hasAnyFilter,
        setSelectedRequesters,
        setSelectedStatus,
        setDateFrom,
        setDateTo,
        setQuickSearch,
        setSelectedWorkshops,
        urgentOnly,
        setUrgentOnly,
        clearAll,
        resetForNewImport,
    };
}
