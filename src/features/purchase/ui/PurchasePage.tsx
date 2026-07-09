/**
 * PurchasePage – quản lý mua hàng (Excel import, filter, table).
 * Đã được refactor: tách logic sang các custom hooks (useExcelUpload, usePurchaseData,
 * usePurchaseFilters) + FilterBar. Component này chỉ chịu trách nhiệm layout + kết nối.
 */
import { useCallback, useEffect, useState } from 'react';
import { EmptyState } from '@/features/purchase/ui/EmptyState';
import { Header } from '@/features/purchase/ui/Header';
import { LoadingOverlay } from '@/features/purchase/ui/LoadingOverlay';
import { NoResults } from '@/features/purchase/ui/NoResults';
import { FilterBar } from '@/features/purchase/ui/FilterBar';
import { WorkshopPanel } from '@/features/purchase/ui/WorkshopPanel';
import { MobilePurchaseList } from '@/features/purchase/ui/MobilePurchaseList';
import { Toast } from '@/shared/ui/Toast';
import { useToastQueue } from '@/shared/hooks/useToastQueue';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { usePurchaseData } from '@/features/purchase/hooks/usePurchaseData';
import { usePurchaseFilters } from '@/features/purchase/hooks/usePurchaseFilters';
import { useExcelUpload } from '@/features/purchase/hooks/useExcelUpload';
import { useWorkshopConfig } from '@/features/purchase/hooks/useWorkshopConfig';

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

    // Workshop config - shared state between WorkshopPanel and Filter
    const {
        workshops,
        orphanedTags,
        workshopOptions,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        assignTagsToWorkshop,
        registerNewTags,
    } = useWorkshopConfig();

    // Filters: 4 filter state + computed visible rows
    const {
        selectedRequesters,
        selectedStatus,
        dateFrom,
        dateTo,
        quickSearch,
        requesterOptions,
        statusOptions,
        selectedWorkshops,
        uniqueTags,
        tagRowCounts,
        visibleRows,
        setSelectedRequesters,
        setSelectedStatus,
        setDateFrom,
        setDateTo,
        setQuickSearch,
        setSelectedWorkshops,
        resetForNewImport,
    } = usePurchaseFilters({ rows, workshops });

    // Register tags when file is imported
    useEffect(() => {
        if (uniqueTags.length > 0) {
            registerNewTags(uniqueTags);
        }
    }, [uniqueTags, registerNewTags]);

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

    const handleLogout = useCallback(() => {
        logout();
        showToast(t('app.logoutSuccess'), 'info', 2200);
    }, [logout, showToast, t]);

    const showEmpty = rows.length === 0;
    const showNoResults = !showEmpty && visibleRows.length === 0;

    // Workshop panel state
    const [showWorkshopPanel, setShowWorkshopPanel] = useState(false);

    return (
        <div className="relative h-full w-full overflow-hidden bg-blue-dark">
            <Header
                onImport={openFilePicker}
                onLogout={handleLogout}
                onSettings={() => setShowWorkshopPanel(true)}
                userLabel={userId}
            />

            {/* Layout: Main content (TaskBar from layout/ overlays the left side) */}
            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                <main
                    className="flex-1 flex flex-col overflow-hidden bg-[#f4f7ff]"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                >
                    {/* Shared FilterBar */}
                    {!showEmpty && (
                        <div className="shrink-0 z-10 relative">
                            <FilterBar
                                quickSearch={quickSearch}
                                selectedRequesters={selectedRequesters}
                                selectedStatus={selectedStatus}
                                dateFrom={dateFrom}
                                dateTo={dateTo}
                                requesterOptions={requesterOptions}
                                statusOptions={statusOptions}
                                onQuickSearchChange={setQuickSearch}
                                onRequestersChange={setSelectedRequesters}
                                onStatusChange={setSelectedStatus}
                                onDateFromChange={setDateFrom}
                                onDateToChange={setDateTo}
                                onWorkshopsChange={setSelectedWorkshops}
                                workshopOptions={workshopOptions}
                                selectedWorkshops={selectedWorkshops}
                            />
                        </div>
                    )}

                    <div className="flex-1 overflow-hidden relative">
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
                        
                        {!showEmpty && !showNoResults && (
                            <div className="h-full">
                                <MobilePurchaseList 
                                    rows={visibleRows}
                                    totalLoaded={rows.length}
                                />
                            </div>
                        )}
                    </div>

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

            <WorkshopPanel
                open={showWorkshopPanel}
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
