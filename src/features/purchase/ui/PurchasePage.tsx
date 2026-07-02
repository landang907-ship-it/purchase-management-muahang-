/**
 * PurchasePage – quản lý mua hàng (Excel import, tab filtering, table).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable } from '@/features/purchase/ui/DataTable';
import { EmptyState } from '@/features/purchase/ui/EmptyState';
import { Header } from '@/features/purchase/ui/Header';
import { LoadingOverlay } from '@/features/purchase/ui/LoadingOverlay';
import { NoResults } from '@/features/purchase/ui/NoResults';
import { QuickSearch } from '@/features/purchase/ui/QuickSearch';
import { RequesterFilter } from '@/features/purchase/ui/RequesterFilter';
import { StatusFilter } from '@/features/purchase/ui/StatusFilter';
import { DateRangeFilter } from '@/features/purchase/ui/DateRangeFilter';
import { TabNav } from '@/features/purchase/ui/TabNav';
import { Toast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { parseExcel, type PurchaseRow } from '@/features/purchase/services/excel';
import { parseDateSafe } from '@/features/purchase/lib/date';
import { savePurchaseData, loadPurchaseData } from '@/features/purchase/services/purchaseService';
import { X } from 'lucide-react';
import type { TabKey, ToastMessage } from '@/features/purchase/model/purchase';

const ACCEPTED_EXT = ['xlsx', 'xls', 'csv'] as const;

export function PurchasePage() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [rows, setRows] = useState<PurchaseRow[]>([]);
    const [_fileName, setFileName] = useState('');
    const [activeTab, setActiveTab] = useState<TabKey>('system');
    const [selectedRequesters, setSelectedRequesters] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [quickSearch, setQuickSearch] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toastIdRef = useRef(0);

    const showToast = useCallback(
        (text: string, variant: ToastMessage['variant'] = 'info', duration = 3000) => {
            const id = ++toastIdRef.current;
            setToasts((prev) => [...prev, { id, text, variant, duration }]);
            window.setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, duration);
        },
        [],
    );

    const counts = useMemo(() => {
        return {
            system: rows.length,
        } satisfies Record<TabKey, number>;
    }, [rows]);

    // Unique non-empty values of the "Ng.yêu cầu" column, used to populate
    // the requester filter dropdown. Sorted alphabetically (Vietnamese-aware).
    const requesterOptions = useMemo(() => {
        const set = new Set<string>();
        for (const r of rows) {
            const v = (r['Ng.yêu cầu'] ?? '').trim();
            if (v) set.add(v);
        }
        return Array.from(set).sort((a, b) =>
            a.localeCompare(b, 'vi', { sensitivity: 'base' }),
        );
    }, [rows]);

    // Unique non-empty values of the "T.trg xử lý" column, used to populate
    // the status filter dropdown. Sorted alphabetically.
    const statusOptions = useMemo(() => {
        const set = new Set<string>();
        for (const r of rows) {
            const v = (r['T.trg xử lý'] ?? '').trim();
            if (v) set.add(v);
        }
        return Array.from(set).sort((a, b) =>
            a.localeCompare(b, 'vi', { sensitivity: 'base' }),
        );
    }, [rows]);

    const visibleRows = useMemo(() => {
        let result: PurchaseRow[];
        switch (activeTab) {
            case 'system':
            default:
                result = rows;
        }
        if (selectedRequesters.length > 0) {
            const selectedSet = new Set(selectedRequesters);
            result = result.filter((r) => selectedSet.has((r['Ng.yêu cầu'] ?? '').trim()));
        }
        if (selectedStatus) {
            result = result.filter((r) => ((r['T.trg xử lý'] ?? '').trim()) === selectedStatus);
        }
        if (dateFrom || dateTo) {
            result = result.filter((r) => {
                const dateVal = parseDateSafe(r['Ngày YC'] ?? '');
                if (!dateVal) return false;
                const fromDate = dateFrom ? new Date(dateFrom) : null;
                const toDate = dateTo ? new Date(dateTo) : null;
                if (fromDate && dateVal < fromDate) return false;
                if (toDate && dateVal > toDate) return false;
                return true;
            });
        }
        // Quick search in "Văn bản ngắn" column
        if (quickSearch.trim()) {
            const searchLower = quickSearch.toLowerCase().trim();
            result = result.filter((r) => {
                const text = (r['Văn bản ngắn'] ?? '').toLowerCase();
                return text.includes(searchLower);
            });
        }
        return result;
    }, [rows, activeTab, selectedRequesters, selectedStatus, dateFrom, dateTo, quickSearch]);

    const handleFile = useCallback(
        async (file: File) => {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
            if (!ACCEPTED_EXT.includes(ext as (typeof ACCEPTED_EXT)[number])) {
                showToast(t('import.extError'), 'error');
                return;
            }
            setIsLoading(true);
            try {
                const result = await parseExcel(file);
                setRows(result.filtered);
                setFileName(file.name);
                setSelectedRequesters([]);
                setQuickSearch('');

                if (result.tagColIdx === -1) {
                    const headerList = result.headers.filter(Boolean).slice(0, 15).join(' | ');
                    showToast(
                        `${t('import.tagMissing')}. Các cột: ${headerList}`,
                        'warning',
                        6000,
                    );
                } else if (result.filtered.length === 0) {
                    showToast(t('import.noRows'), 'warning', 4000);
                } else {
                    showToast(
                        t('import.success', { count: result.filtered.length }),
                        'success',
                    );
                }

                // Save to Supabase to prevent data loss
                if (result.filtered.length > 0 && user?.user) {
                    try {
                        await savePurchaseData(user.user, result.filtered, file.name);
                    } catch (saveErr) {
                        const msg = saveErr instanceof Error ? saveErr.message : 'Lỗi kết nối';
                        showToast(`Không thể tự động lưu lên Supabase: ${msg}`, 'warning', 5000);
                        // eslint-disable-next-line no-console
                        console.error('[Supabase Save]', saveErr);
                    }
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
                showToast(t('import.error', { msg }), 'error', 5000);
                // eslint-disable-next-line no-console
                console.error('[ParseExcel]', err);
            } finally {
                setIsLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        },
        [showToast, t, user?.user],
    );

    const handleImportClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
        },
        [handleFile],
    );

    // Load purchase data from Supabase on mount
    useEffect(() => {
        if (!user?.user) return;
        let isMounted = true;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const savedRows = await loadPurchaseData(user.user);
                if (isMounted && savedRows.length > 0) {
                    setRows(savedRows);
                    showToast(t('import.success', { count: savedRows.length }), 'success');
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('[Supabase Load]', err);
                showToast('Không thể tải dữ liệu đã lưu từ Supabase', 'error', 4000);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        void loadData();

        return () => {
            isMounted = false;
        };
    }, [user?.user, showToast, t]);

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

    const handleLogout = useCallback(() => {
        logout();
        showToast(t('app.logoutSuccess'), 'info', 2200);
    }, [logout, showToast, t]);

    const showEmpty = rows.length === 0;
    const showNoResults = !showEmpty && visibleRows.length === 0;

    // Check if any filter is active
    const hasAnyFilter = selectedRequesters.length > 0 || selectedStatus !== '' || dateFrom !== '' || dateTo !== '' || quickSearch !== '';

    // Helper to clear all filters at once
    const clearAllFilters = () => {
        setSelectedRequesters([]);
        setSelectedStatus('');
        setDateFrom('');
        setDateTo('');
        setQuickSearch('');
    };

    return (
        <div className="relative h-full w-full overflow-hidden bg-blue-dark">
            <Header onImport={handleImportClick} onLogout={handleLogout} userLabel={user?.user} />
            <TabNav active={activeTab} onChange={setActiveTab} counts={counts} />

            {/* Layout: TaskBar (left) + Main content (right) */}
            <div className="absolute inset-x-0 bottom-0 flex" style={{
                top: 'calc(env(safe-area-inset-top, 0px) + 64px + 48px)',
            }}>
                {/* Main content area */}
                <main
                    className="flex-1 flex flex-col overflow-hidden bg-[#f4f7ff]"
                    style={{
                        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                    }}
                >
                    {!showEmpty && (
                        <div className="flex flex-col bg-white overflow-x-auto">
                            <QuickSearch
                                value={quickSearch}
                                onChange={setQuickSearch}
                            />
                            <RequesterFilter
                                options={requesterOptions}
                                value={selectedRequesters}
                                onChange={setSelectedRequesters}
                            />
                            <StatusFilter
                                options={statusOptions}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                            />
                            <DateRangeFilter
                                dateFrom={dateFrom}
                                dateTo={dateTo}
                                onDateFromChange={setDateFrom}
                                onDateToChange={setDateTo}
                            />
                            {hasAnyFilter && (
                                <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200">
                                    <button
                                        onClick={clearAllFilters}
                                        className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold text-white bg-red rounded-md hover:brightness-110 transition-[filter] shadow-sm"
                                    >
                                        <X size={13} strokeWidth={2.5} />
                                        {t('filter.clearAll')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {showEmpty && <EmptyState onImport={handleImportClick} />}
                    {showNoResults && (
                        <NoResults
                            message={
                                selectedRequesters.length > 0
                                    ? t('noresults.filtered', { count: selectedRequesters.length })
                                    : t('noresults.tab')
                            }
                        />
                    )}
                    {!showEmpty && !showNoResults && <DataTable rows={visibleRows} />}
                    {isLoading && <LoadingOverlay />}
                </main>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-hidden
                />
                <Toast toasts={toasts} />
            </div>
        </div>
    );
}
