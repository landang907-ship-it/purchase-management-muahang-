/**
 * PurchasePage – quản lý mua hàng (Excel import, filter, table).
 * Tối ưu layout: Header full-width ở trên cùng, TaskBar & FilterBar hiển thị chuẩn.
 */
import { useCallback, useState } from 'react';
import { DataTable } from '@/features/purchase/ui/DataTable';
import { EmptyState } from '@/features/purchase/ui/EmptyState';
import { Header } from '@/features/purchase/ui/Header';
import { LoadingOverlay } from '@/features/purchase/ui/LoadingOverlay';
import { NoResults } from '@/features/purchase/ui/NoResults';
import { FilterBar } from '@/features/purchase/ui/FilterBar';
import { WorkshopPanel } from '@/features/purchase/ui/WorkshopPanel';
import { Toast } from '@/shared/ui/Toast';
import { useToastQueue } from '@/shared/hooks/useToastQueue';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { usePurchaseData } from '@/features/purchase/hooks/usePurchaseData';
import { usePurchaseFilters } from '@/features/purchase/hooks/usePurchaseFilters';
import { useExcelUpload } from '@/features/purchase/hooks/useExcelUpload';
import { useWorkshopConfig } from '@/features/purchase/hooks/useWorkshopConfig';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';

export function PurchasePage() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const userId = user?.user;

    // Toast queue (shared)
    const { toasts, showToast } = useToastQueue(3000);

    // Purchase data: rows + Supabase sync
    const {
        rows,
        isLoading: dataLoading,
        setRows,
        setFileName,
        save,
    } = usePurchaseData({ userId, onMessage: showToast, t });

    // Workshop configuration & filtering
    const {
        workshops,
        selectedWorkshops,
        workshopOptions,
        uniqueTags,
        tagRowCounts,
        orphanedTags,
        setSelectedWorkshops,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        assignTagsToWorkshop,
        registerNewTags,
    } = useWorkshopConfig(rows);

    // Filters: filter state + computed visible rows
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
    } = usePurchaseFilters(rows, selectedWorkshops, workshops);

    // Excel upload handler
    const { fileInputRef, openFilePicker, handleFileChange, isLoading: uploadLoading } =
        useExcelUpload({
            userId,
            onDataLoaded: (parsedRows, fileName) => {
                setRows(parsedRows);
                setFileName(fileName);
                save(parsedRows);
            },
            onMessage: showToast,
            t,
        });

    const isLoading = dataLoading || uploadLoading;

    // Handle logout safely
    const handleLogout = useCallback(() => {
        logout();
        showToast(t('toast.logoutSuccess'), 'info');
    }, [logout, showToast, t]);

    const showEmpty = rows.length === 0;
    const showNoResults = !showEmpty && visibleRows.length === 0;

    // Workshop panel state
    const [showWorkshopPanel, setShowWorkshopPanel] = useState(false);

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-blue-dark">
            {/* Header: Full Width fixed at top */}
            <Header
                onImport={openFilePicker}
                onLogout={handleLogout}
                onSettings={() => setShowWorkshopPanel(true)}
                userLabel={userId}
            />

            {/* Layout: Main content area under Header */}
            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                {/* Left Sidebar Navigation */}
                <RightTaskBar />

                {/* Main Content Area */}
                <main
                    className="flex-1 flex flex-col overflow-hidden bg-[#f4f7ff]"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                >
                    {/* FilterBar always visible at top of main area */}
                    <FilterBar
                        quickSearch={quickSearch}
                        selectedRequesters={selectedRequesters}
                        selectedStatus={selectedStatus}
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        requesterOptions={requesterOptions}
                        statusOptions={statusOptions}
                        selectedWorkshops={selectedWorkshops}
                        workshopOptions={workshopOptions}
                        onQuickSearchChange={setQuickSearch}
                        onRequestersChange={setSelectedRequesters}
                        onStatusChange={setSelectedStatus}
                        onDateFromChange={setDateFrom}
                        onDateToChange={setDateTo}
                        onWorkshopsChange={setSelectedWorkshops}
                    />

                    {/* View States */}
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

            {/* Workshop Management Modal */}
            <WorkshopPanel
                isOpen={showWorkshopPanel}
                onClose={() => setShowWorkshopPanel(false)}
                allTagsFromFile={uniqueTags}
                tagRowCounts={tagRowCounts}
                workshops={workshops}
                orphanedTags={orphanedTags}
                onAddWorkshop={addWorkshop}
                onUpdateWorkshop={updateWorkshop}
                onDeleteWorkshop={deleteWorkshop}
                onAssignTags={assignTagsToWorkshop}
                onRegisterTags={registerNewTags}
            />
        </div>
    );
}
