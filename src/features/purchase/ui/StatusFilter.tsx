/**
 * StatusFilter – single-select dropdown to filter rows by the "T.trg xử lý" column.
 * Uses Portal to render dropdown outside DOM hierarchy, ensuring it floats above all content.
 */
import { ChevronDown, Filter, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';
import { formatStatusText } from '@/features/purchase/lib/status';

interface StatusFilterProps {
    options: string[];
    value: string;
    onChange: (next: string) => void;
    disabled?: boolean;
}

export function StatusFilter({ options, value, onChange, disabled }: StatusFilterProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const labelId = useId();

    const isActive = value !== '';

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    };

    const handleToggle = () => {
        if (disabled) return;
        if (open) {
            setOpen(false);
        } else {
            updatePosition();
            setOpen(true);
        }
    };

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent | TouchEvent) => {
            const target = e.target as Node | null;
            if (target) {
                const insideContainer = containerRef.current?.contains(target);
                const insideDropdown = dropdownRef.current?.contains(target);
                if (!insideContainer && !insideDropdown) {
                    setOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('touchstart', onDown);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('touchstart', onDown);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleUpdate = () => updatePosition();
        window.addEventListener('scroll', handleUpdate, true);
        window.addEventListener('resize', handleUpdate);
        return () => {
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate);
        };
    }, [open]);

    const clearFilter = () => onChange('');

    const triggerLabel = isActive ? formatStatusText(value) : t('filter.allCount') + ` (${options.length})`;

    const dropdownContent = (
        <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-labelledby={labelId}
            style={{
                position: 'fixed',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
            }}
            className={cn(
                'z-[9999]',
                'bg-white border border-border rounded-lg shadow-xl',
                'overflow-hidden',
                'max-h-[50vh]',
            )}
        >
            <div className="flex-1 overflow-y-auto overscroll-contain">
                {options.length === 0 ? (
                    <p className="px-3 py-3 text-center text-[12px] text-neutral-500">
                        {t('filter.noOptions')}
                    </p>
                ) : (
                    <>
                        <button
                            type="button"
                            role="option"
                            aria-selected={value === ''}
                            onClick={() => {
                                onChange('');
                                setOpen(false);
                            }}
                            className={cn(
                                'w-full flex items-center gap-2 text-left',
                                'px-3 py-1.5',
                                'text-[12px] sm:text-[13px]',
                                'border-b border-border/50',
                                'transition-colors',
                                value === ''
                                    ? 'bg-blue-mid/15 text-text-dark font-semibold'
                                    : 'bg-white text-text-dark hover:bg-row-even active:bg-row-even',
                            )}
                        >
                            <span
                                className={cn(
                                    'shrink-0 flex items-center justify-center',
                                    'w-4 h-4 rounded border-2',
                                    value === ''
                                        ? 'bg-blue-mid border-blue-mid text-white'
                                        : 'border-neutral-400 bg-white',
                                )}
                            >
                                {value === '' ? '✓' : ''}
                            </span>
                            <span>{t('filter.allCount')} ({options.length})</span>
                        </button>
                        {options.map((opt) => {
                            const isSelected = value === opt;
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                        onChange(opt);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        'w-full flex items-center gap-2 text-left',
                                        'px-3 py-1.5',
                                        'text-[12px] sm:text-[13px]',
                                        'border-b border-border/50 last:border-b-0',
                                        'transition-colors',
                                        isSelected
                                            ? 'bg-blue-mid/15 text-text-dark font-semibold'
                                            : 'bg-white text-text-dark hover:bg-row-even active:bg-row-even',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'shrink-0 flex items-center justify-center',
                                            'w-4 h-4 rounded border-2',
                                            isSelected
                                                ? 'bg-blue-mid border-blue-mid text-white'
                                                : 'border-neutral-400 bg-white',
                                        )}
                                    >
                                        {isSelected ? '✓' : ''}
                                    </span>
                                    <span className="truncate flex-1">{formatStatusText(opt)}</span>
                                </button>
                            );
                        })}
                    </>
                )}
            </div>

            <div className="flex items-center justify-end px-2 py-1.5 border-t border-border bg-row-even">
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className={cn(
                        'px-3 py-1 rounded',
                        'bg-red text-white text-[12px] font-semibold',
                        'hover:brightness-110 transition-[filter]',
                    )}
                >
                    {t('filter.close')}
                </button>
            </div>
        </motion.div>
    );

    return (
        <>
            <div
                ref={containerRef}
                className={cn(
                    'relative shrink-0',
                    'bg-white border-b border-border',
                )}
            >
                <div className="flex items-center gap-1 px-1.5 py-0.5 min-h-[26px]">
                    <label
                        id={labelId}
                        className={cn(
                            'flex items-center gap-0.5 shrink-0',
                            'text-[9px] sm:text-[10px] font-semibold',
                            'text-text-dark whitespace-nowrap',
                        )}
                    >
                        <Filter size={9} strokeWidth={2.5} className="text-blue-mid" />
                        {t('filter.status')}
                    </label>

                    <motion.button
                        ref={triggerRef}
                        type="button"
                        aria-labelledby={labelId}
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        disabled={disabled}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleToggle}
                        className={cn(
                            'flex-1 min-w-0',
                            'flex items-center justify-between gap-1',
                            'bg-row-even border border-border rounded',
                            'px-1 py-0.5 text-[10px] sm:text-[11px]',
                            'text-text-dark text-left',
                            'focus:outline-none focus:ring-1 focus:ring-blue-mid/40 focus:border-blue-mid',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'transition-shadow',
                            isActive && 'border-blue-mid bg-blue-mid/10 font-semibold',
                        )}
                    >
                        <span className="truncate">{triggerLabel}</span>
                        <ChevronDown
                            size={10}
                            strokeWidth={2.5}
                            className={cn(
                                'shrink-0 text-blue-mid transition-transform',
                                open && 'rotate-180',
                            )}
                        />
                    </motion.button>

                    {isActive ? (
                        <motion.button
                            type="button"
                            aria-label={t('filter.clear')}
                            title={t('filter.clear')}
                            whileTap={{ scale: 0.92 }}
                            onClick={clearFilter}
                            className={cn(
                                'shrink-0 flex items-center justify-center',
                                'w-5 h-5 rounded-full',
                                'bg-red text-white shadow-sm',
                                'hover:brightness-110 transition-[filter]',
                            )}
                        >
                            <X size={9} strokeWidth={2.5} />
                        </motion.button>
                    ) : (
                        <div className="w-5 h-5 shrink-0" aria-hidden />
                    )}
                </div>
            </div>

            {open && createPortal(
                <>
                    <div 
                        className="fixed inset-0 z-[9998]" 
                        onClick={(e) => { e.stopPropagation(); setOpen(false); }} 
                        onTouchStart={(e) => { e.stopPropagation(); setOpen(false); }}
                    />
                    {dropdownContent}
                </>, 
                document.body
            )}
        </>
    );
}
