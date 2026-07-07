/**
 * FilterBar – gom các filter (QuickSearch, Requester, Status, DateRange, Workshop)
 * Tách ra từ PurchasePage để giảm kích thước component.
 * Thu gọn thành nút "Sử dụng bộ lọc" và mở rộng khi cần.
 */
import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { QuickSearch } from './QuickSearch';
import { RequesterFilter } from './RequesterFilter';
import { StatusFilter } from './StatusFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { WorkshopFilter } from './WorkshopFilter';
import { cn } from '@/shared/lib/cn';

interface FilterBarProps {
    quickSearch: string;
    selectedRequesters: string[];
    selectedStatus: string;
    dateFrom: string;
    dateTo: string;
    requesterOptions: string[];
    statusOptions: string[];
    selectedWorkshops: string[];
    workshopOptions: string[];
    onQuickSearchChange: (value: string) => void;
    onRequestersChange: (value: string[]) => void;
    onStatusChange: (value: string) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    onWorkshopsChange: (value: string[]) => void;
}

/**
 * Horizontal stack of filter components.
 * Rendered above DataTable when there is data.
 * Collapsible - shows "Sử dụng bộ lọc" button by default.
 */
export function FilterBar({
    quickSearch,
    selectedRequesters,
    selectedStatus,
    dateFrom,
    dateTo,
    requesterOptions,
    statusOptions,
    selectedWorkshops,
    workshopOptions,
    onQuickSearchChange,
    onRequestersChange,
    onStatusChange,
    onDateFromChange,
    onDateToChange,
    onWorkshopsChange,
}: FilterBarProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white px-2 py-2 space-y-2">
            <WorkshopFilter
                options={workshopOptions}
                value={selectedWorkshops}
                onChange={onWorkshopsChange}
            />

            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded',
                    'bg-blue-mid text-white text-[11px] font-semibold',
                    'hover:brightness-110 transition-[filter]',
                )}
            >
                <Filter size={12} strokeWidth={2.5} />
                <span>Sử dụng bộ lọc</span>
                <ChevronDown
                    size={12}
                    strokeWidth={2.5}
                    className={cn('transition-transform', expanded && 'rotate-180')}
                />
            </button>

            {expanded && (
                <>
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
                </>
            )}
        </div>
    );
}
