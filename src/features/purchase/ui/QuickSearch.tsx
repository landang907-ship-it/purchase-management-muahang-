/**
 * QuickSearch – search input to filter rows by text in the "Văn bản ngắn" column.
 */
import { Search, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

interface QuickSearchProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function QuickSearch({ value, onChange, disabled }: QuickSearchProps) {
    const { t } = useTranslation();
    const hasValue = value.length > 0;

    return (
        <div className="flex items-center gap-1 px-1.5 py-1 bg-white border-b border-border min-h-[32px]">
            <Search size={12} strokeWidth={2.5} className="shrink-0 text-blue-mid" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t('quickSearch.placeholder')}
                disabled={disabled}
                className={cn(
                    'flex-1 min-w-0',
                    'bg-row-even border border-border rounded',
                    'px-2 py-1 text-[11px] sm:text-[12px]',
                    'text-text-dark placeholder:text-neutral-400',
                    'focus:outline-none focus:ring-1 focus:ring-blue-mid/40 focus:border-blue-mid',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    hasValue && 'border-blue-mid bg-blue-mid/10 font-semibold',
                )}
            />
            {hasValue ? (
                <button
                    type="button"
                    aria-label={t('quickSearch.clear')}
                    onClick={() => onChange('')}
                    className={cn(
                        'shrink-0 flex items-center justify-center',
                        'w-5 h-5 rounded-full',
                        'bg-red text-white shadow-sm',
                        'hover:brightness-110 transition-[filter]',
                    )}
                >
                    <X size={9} strokeWidth={2.5} />
                </button>
            ) : null}
        </div>
    );
}
