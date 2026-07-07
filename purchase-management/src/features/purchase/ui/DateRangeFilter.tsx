/**
 * DateRangeFilter – inline date range inputs for the "Ngày YC" column.
 * Styled to match RequesterFilter v1 design: white background, border-bottom, single row.
 */
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

interface DateRangeFilterProps {
    dateFrom: string;
    dateTo: string;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    disabled?: boolean;
}

export function DateRangeFilter({
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    disabled = false,
}: DateRangeFilterProps) {
    const { t } = useTranslation();
    const hasFilter = dateFrom || dateTo;

    const clearFilter = () => {
        onDateFromChange('');
        onDateToChange('');
    };

    return (
        <div className={cn('relative shrink-0', 'bg-white border-b border-border')}>
            <div className="flex items-center gap-1 px-1.5 py-0.5 min-h-[26px]">
                <span className="flex items-center gap-0.5 shrink-0 text-[9px] sm:text-[10px] font-semibold text-text-dark whitespace-nowrap">
                    <span className="w-3 h-3 flex items-center justify-center text-blue-mid font-bold">📅</span>
                    {t('date.label')}
                </span>

                <div className="flex items-center gap-0.5">
                    <span className="text-[9px] text-neutral-500 shrink-0">{t('date.from')}</span>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => onDateFromChange(e.target.value)}
                        disabled={disabled}
                        className={cn(
                            'px-1 py-0.5 text-[10px] sm:text-[11px]',
                            'border border-border rounded',
                            'bg-row-even text-text-dark',
                            'focus:outline-none focus:ring-1 focus:ring-blue-mid/40 focus:border-blue-mid',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'transition-shadow',
                            dateFrom && 'border-blue-mid bg-blue-mid/10 font-semibold',
                            '[color-scheme:light] min-w-[90px]',
                        )}
                    />
                </div>

                <div className="flex items-center gap-0.5">
                    <span className="text-[9px] text-neutral-500 shrink-0">{t('date.to')}</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => onDateToChange(e.target.value)}
                        disabled={disabled}
                        className={cn(
                            'px-1 py-0.5 text-[10px] sm:text-[11px]',
                            'border border-border rounded',
                            'bg-row-even text-text-dark',
                            'focus:outline-none focus:ring-1 focus:ring-blue-mid/40 focus:border-blue-mid',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'transition-shadow',
                            dateTo && 'border-blue-mid bg-blue-mid/10 font-semibold',
                            '[color-scheme:light] min-w-[90px]',
                        )}
                    />
                </div>

                {hasFilter && !disabled && (
                    <button
                        type="button"
                        aria-label={t('date.clear')}
                        title={t('date.clear')}
                        onClick={clearFilter}
                        className={cn(
                            'shrink-0 flex items-center justify-center',
                            'w-5 h-5 rounded-full',
                            'bg-red text-white shadow-sm',
                            'hover:brightness-110 transition-[filter]',
                        )}
                    >
                        <X size={9} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </div>
    );
}
