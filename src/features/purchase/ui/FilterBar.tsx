/**
 * FilterBar – gom 4 filter (QuickSearch, Requester, Status, DateRange) + nút "Xóa lọc"
 * Tách ra từ PurchasePage để giảm kích thước component.
 */
import { X } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { QuickSearch } from './QuickSearch';
import { RequesterFilter } from './RequesterFilter';
import { StatusFilter } from './StatusFilter';
import { DateRangeFilter } from './DateRangeFilter';

interface FilterBarProps {
    quickSearch: string;
    selectedRequesters: string[];
    selectedStatus: string;
    dateFrom: string;
    dateTo: string;
    requesterOptions: string[];
    statusOptions: string[];
    hasAnyFilter: boolean;
    onQuickSearchChange: (value: string) => void;
    onRequestersChange: (value: string[]) => void;
    onStatusChange: (value: string) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    onClearAll: () => void;
}

/**
 * Horizontal stack of 4 filter components + "clear all" button.
 * Rendered above DataTable when there is data.
 */
export function FilterBar({
    quickSearch,
    selectedRequesters,
    selectedStatus,
    dateFrom,
    dateTo,
    requesterOptions,
    statusOptions,
    hasAnyFilter,
    onQuickSearchChange,
    onRequestersChange,
    onStatusChange,
    onDateFromChange,
    onDateToChange,
    onClearAll,
}: FilterBarProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col bg-white overflow-x-auto">
            <QuickSearch value={quickSearch} onChange={onQuickSearchChange} />
            <RequesterFilter
                options={requesterOptions}
                value={selectedRequesters}
                onChange={onRequestersChange}
            />
            <StatusFilter
                options={statusOptions}
                value={selectedStatus}
                onChange={onStatusChange}
            />
            <DateRangeFilter
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={onDateFromChange}
                onDateToChange={onDateToChange}
            />
            {hasAnyFilter && (
                <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold text-white bg-red rounded-md hover:brightness-110 transition-[filter] shadow-sm"
                    >
                        <X size={13} strokeWidth={2.5} />
                        {t('filter.clearAll')}
                    </button>
                </div>
            )}
        </div>
    );
}