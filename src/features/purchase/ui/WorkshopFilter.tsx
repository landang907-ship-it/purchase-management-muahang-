import { Factory, Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

import type { ReactNode } from 'react';

interface WorkshopFilterProps {
    options: string[];
    value: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
    filterButton?: ReactNode;
}

export function WorkshopFilter({ options, value, onChange, disabled, filterButton }: WorkshopFilterProps) {
    const { t } = useTranslation();
    const isAllSelected = value.length === options.length && options.length > 0;

    const handleToggleAll = () => {
        if (disabled) return;
        if (isAllSelected) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    };

    const handleToggle = (opt: string) => {
        if (disabled) return;
        const next = new Set(value);
        if (next.has(opt)) {
            next.delete(opt);
        } else {
            next.add(opt);
        }
        onChange(Array.from(next));
    };

    return (
        <div className="flex flex-col gap-1.5 w-full py-1">
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-[13px] sm:text-sm px-1">
                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                    <Factory size={14} strokeWidth={2.5} />
                </div>
                <span>{t('filter.workshop')}</span>
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 ml-1">
                    {value.length}/{options.length}
                </span>
            </div>
            
            <div className="flex items-center w-full gap-2 px-1">
                {filterButton && (
                    <div className="shrink-0 relative z-50">
                        {filterButton}
                    </div>
                )}
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={handleToggleAll}
                        className={cn(
                            "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 border-2",
                            isAllSelected
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isAllSelected && <Check size={14} strokeWidth={3} />}
                        Tất cả
                    </button>

                {options.map((opt) => {
                    const isSelected = value.includes(opt);
                    return (
                        <button
                            key={opt}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleToggle(opt)}
                            className={cn(
                                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 border-2",
                                isSelected
                                    ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isSelected && <Check size={14} strokeWidth={3} className="text-blue-600" />}
                            <span>{opt}</span>
                        </button>
                    );
                })}
                </div>
            </div>
        </div>
    );
}
