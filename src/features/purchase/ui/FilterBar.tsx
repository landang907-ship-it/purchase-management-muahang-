/**
 * FilterBar – gom các filter (QuickSearch, Requester, Status, DateRange, Workshop)
 * Tách ra từ PurchasePage để giảm kích thước component.
 * Thu gọn thành nút "Sử dụng bộ lọc" và mở rộng khi cần.
 */
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Filter } from 'lucide-react';
import { QuickSearch } from './QuickSearch';
import { RequesterFilter } from './RequesterFilter';
import { StatusFilter } from './StatusFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

interface FilterBarProps {
    quickSearch: string;
    selectedRequesters: string[];
    selectedStatus: string;
    dateFrom: string;
    dateTo: string;
    requesterOptions: string[];
    statusOptions: string[];
    onQuickSearchChange: (value: string) => void;
    onRequestersChange: (value: string[]) => void;
    onStatusChange: (value: string) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
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
    onQuickSearchChange,
    onRequestersChange,
    onStatusChange,
    onDateFromChange,
    onDateToChange,
}: FilterBarProps) {
    const [expanded, setExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!expanded) return;
        const onDown = (e: MouseEvent | TouchEvent) => {
            const target = e.target as HTMLElement;
            // Ignore clicks inside dropdown portals or backdrops
            if (target.closest('[role="listbox"]') || target.closest('.fixed.inset-0')) {
                return;
            }
            if (containerRef.current && !containerRef.current.contains(target)) {
                setExpanded(false);
            }
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('touchstart', onDown);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('touchstart', onDown);
        };
    }, [expanded]);

    return (
        <div ref={containerRef} className="bg-white px-2 py-2 border-t border-gray-100">

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
                <span>{t('filter.use')}</span>
                <ChevronDown
                    size={12}
                    strokeWidth={2.5}
                    className={cn('transition-transform', expanded && 'rotate-180')}
                />
            </button>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2 pt-2">
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
