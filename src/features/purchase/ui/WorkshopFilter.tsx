import { Factory, Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

interface WorkshopFilterProps {
    options: string[];
    value: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
}

export function WorkshopFilter({ options, value, onChange, disabled }: WorkshopFilterProps) {
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
        <div className="flex flex-col gap-3 w-full py-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base px-1">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <Factory size={16} strokeWidth={2.5} />
                </div>
                <span>{t('filter.workshop')}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 ml-1">
                    {value.length}/{options.length}
                </span>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={handleToggleAll}
                    className={cn(
                        "shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2",
                        isAllSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isAllSelected && <Check size={16} strokeWidth={3} />}
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
                                "shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2",
                                isSelected
                                    ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isSelected && <Check size={16} strokeWidth={3} className="text-blue-600" />}
                            <span>{opt}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
