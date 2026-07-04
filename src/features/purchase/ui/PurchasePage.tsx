/**
 * PurchasePage – quản lý mua hàng (Excel import, tab filtering, table).
 * Đã được refactor: tách logic sang các custom hooks (useExcelUpload, usePurchaseData,
 * usePurchaseFilters) + FilterBar. Component này chỉ chịu trách nhiệm layout + kết nối.
 */
import { useCallback, useMemo, useState } from 'react';
import { DataTable } from '@/features/purchase/ui/DataTable';
import { EmptyState } from '@/features/purchase/ui/EmptyState';
import { Header } from '@/features/purchase/ui/Header';
import { LoadingOverlay } from '@/features/purchase/ui/LoadingOverlay';
import { NoResults } from '@/features/purchase/ui/NoResults';
import { FilterBar } from '@/features/purchase/ui/FilterBar';
import { TabNav } from '@/features/purchase/ui/TabNav';
import { Toast } from '@/shared/ui/Toast';
import { useToastQueue } from '@/shared/hooks/useToastQueue';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { usePurchaseData } from '@/features/purchase/hooks/usePurchaseData';
import { usePurchaseFilters } from '@/features/purchase/hooks/usePurchaseFilters';
import { useExcelUpload } from '@/features/purchase/hooks/useExcelUpload';
import type { TabKey } from '@/features/purchase/model/purchase';

export function PurchasePage() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const userId = user?.user;

    // Toast queue (shared)
    const { toasts, showToast } = useToastQueue(3000);

    // Purchase data: rows + Supabase sync
    const {
        rows,
        fileName: _fileName,
        isLoading: dataLoading,
        setRows,
        setFileName,
        save,
    } = usePurchaseData({ userId, onMessage: showToast, t });

    // Filters: 4 filter state + computed visible rows
    const {
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
    } = usePurchaseFilters({ rows });

    // Tab state
    const [activeTab, setActiveTab] = useState<TabKey>('system');

    // Excel upload: file ref + drag-drop + handleFile
    const {
        isLoading: uploadLoading,
        fileInputRef,
        openFilePicker,
        handleFileChange,
    } = useExcelUpload({
        onMessage: showToast,
        t,
        userId,
        onAfterParse: (parsedRows, name) => {
            setRows(parsedRows);
            setFileName(name);
            resetForNewImport();
        },
        onSave: save,
    });

    const isLoading = dataLoading || uploadLoading;
    const counts = useMemo(() => ({ system: rows.length }) satisfies Record<TabKey, number>, [rows]);

    const handleLogout = useCallback(() => {
        logout();
        showToast(t('app.logoutSuccess'), 'info', 2200);
    }, [logout, showToast, t]);

    const showEmpty = rows.length === 0;
    const showNoResults = !showEmpty && visibleRows.length === 0;

    return (
        <div className="relative h-full w-full overflow-hidden bg-blue-dark">
            <Header onImport={openFilePicker} onLogout={handleLogout} userLabel={userId} />
            <TabNav active={activeTab} onChange={setActiveTab} counts={counts} />

            {/* Layout: Main content (TaskBar from layout/ overlays the left side) */}
            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 64px + 48px)' }}
            >
                <main
                    className="flex-1 flex flex-col overflow-hidden bg-[#f4f7ff]"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                >
                    {!showEmpty && (
                        <FilterBar
                            quickSearch={quickSearch}
                            selectedRequesters={selectedRequesters}
                            selectedStatus={selectedStatus}
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            requesterOptions={requesterOptions}
                            statusOptions={statusOptions}
                            hasAnyFilter={hasAnyFilter}
                            onQuickSearchChange={setQuickSearch}
                            onRequestersChange={setSelectedRequesters}
                            onStatusChange={setSelectedStatus}
                            onDateFromChange={setDateFrom}
                            onDateToChange={setDateTo}
                            onClearAll={clearAll}
                        />
                    )}
                    {showEmpty && <EmptyState onImport={openFilePicker} />}
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