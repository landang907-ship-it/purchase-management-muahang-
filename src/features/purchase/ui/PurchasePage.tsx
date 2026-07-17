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
import { WelcomeGuide } from '@/features/purchase/ui/WelcomeGuide';
import { FilterBar } from '@/features/purchase/ui/FilterBar';
import { WorkshopPanel } from '@/features/purchase/ui/WorkshopPanel';
import { MobilePurchaseList } from '@/features/purchase/ui/MobilePurchaseList';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Toast } from '@/shared/ui/Toast';
import { useToastQueue } from '@/shared/hooks/useToastQueue';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { usePurchaseData } from '@/features/purchase/hooks/usePurchaseData';
import { usePurchaseFilters } from '@/features/purchase/hooks/usePurchaseFilters';
import { useExcelUpload } from '@/features/purchase/hooks/useExcelUpload';
import { useWorkshopConfig } from '@/features/purchase/hooks/useWorkshopConfig';
import { useMaterialImages } from '@/features/purchase/hooks/useMaterialImages';
import { Upload, Settings } from 'lucide-react';
import { WorkshopFilter } from '@/features/purchase/ui/WorkshopFilter';

export function PurchasePage() {
    const { user } = useAuth();
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
    } = useWorkshopConfig(userId);

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

    // Material images
    const { images: materialImages, setImages: setMaterialImages } = useMaterialImages(rows);

    const handleImageUploaded = useCallback((materialCode: string, thumbUrl: string, origUrl: string) => {
        setMaterialImages(prev => ({
            ...prev,
            [materialCode]: { material_code: materialCode, thumb_url: thumbUrl, orig_url: origUrl }
        }));
    }, [setMaterialImages]);

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


    const showEmpty = rows.length === 0;
    const showNoResults = !showEmpty && visibleRows.length === 0;

    // Workshop panel state
    const [showWorkshopPanel, setShowWorkshopPanel] = useState(false);

    return (
        <div className="relative h-full w-full overflow-hidden bg-blue-dark">
            <Header
                userLabel={userId}
                actions={
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0 overflow-x-auto scrollbar-hide">
                        <button onClick={openFilePicker} className="flex items-center gap-1.5 px-2 py-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0">
                            <Upload size={15} strokeWidth={2.5} />
                            <span className="hidden sm:block text-[12px] font-semibold whitespace-nowrap">{t('header.import')}</span>
                        </button>
                        <button onClick={() => setShowWorkshopPanel(true)} className="flex items-center gap-1.5 px-2 py-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0">
                            <Settings size={15} strokeWidth={2.5} />
                            <span className="hidden sm:block text-[12px] font-semibold whitespace-nowrap">{t('action.settings')}</span>
                        </button>
                    </div>
                }
            />

            {/* Layout: Main content (TaskBar from layout/ overlays the left side) */}
            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                <RightTaskBar />
                <main
                    className="flex-1 flex flex-col overflow-hidden bg-[#f4f7ff]"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                >
                    {/* Action Bar (Always visible) */}
                    <div className="bg-white px-3 py-2 flex items-center justify-between gap-4 border-b border-gray-100 shrink-0 shadow-sm z-20 overflow-x-auto scrollbar-hide">
                        <div className="shrink-0 min-w-[120px]">
                            <WorkshopFilter
                                options={workshopOptions}
                                value={selectedWorkshops}
                                onChange={setSelectedWorkshops}
                            />
                        </div>
                    </div>

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
                            />
                        </div>
                    )}

                    <div className="flex-1 flex flex-col overflow-hidden relative">
                        {showEmpty && <EmptyState onImport={openFilePicker} />}
                        
                        {showNoResults && (
                            selectedWorkshops.length === 0 ? (
                                <WelcomeGuide />
                            ) : (
                                <NoResults
                                    message={
                                        selectedRequesters.length > 0
                                            ? t('noresults.filtered', { count: selectedRequesters.length })
                                            : t('noresults.tab')
                                    }
                                />
                            )
                        )}
                        
                        {!showEmpty && !showNoResults && (
                            <div className="flex-1 relative overflow-hidden">
                                <MobilePurchaseList 
                                    rows={visibleRows}
                                    materialImages={materialImages}
                                    onImageUploaded={handleImageUploaded}
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
